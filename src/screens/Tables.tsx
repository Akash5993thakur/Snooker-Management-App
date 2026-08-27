import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Badge, Btn, Chip, Input, Label, Row, Screen, SegmentedControl, Sheet } from '../ui';
import { C, S, T } from '../theme';
import { fmtDuration, fmtMoney, useStore } from '../store';
import { ClubTable, SaleRecord } from '../types';

export default function Tables() {
  const { state, staffMode, startSession, stopSession, setTableRate, addTable } = useStore();
  const [, setTick] = useState(0);
  const [startFor, setStartFor] = useState<ClubTable | null>(null);
  const [customer, setCustomer] = useState('');
  const [memberId, setMemberId] = useState<string | null>(null);
  const [rateFor, setRateFor] = useState<ClubTable | null>(null);
  const [rateText, setRateText] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'snooker' | 'pool'>('snooker');
  const [newRate, setNewRate] = useState('200');
  const [billSale, setBillSale] = useState<SaleRecord | null>(null);

  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const openStart = (t: ClubTable) => {
    setCustomer('');
    setMemberId(null);
    setStartFor(t);
  };

  const confirmStart = () => {
    if (!startFor) return;
    startSession(startFor.id, customer.trim(), memberId);
    setStartFor(null);
  };

  const doStop = (t: ClubTable) => {
    const sale = stopSession(t.id);
    if (sale) setBillSale(sale);
  };

  const saveRate = () => {
    const r = parseInt(rateText, 10);
    if (rateFor && r > 0) setTableRate(rateFor.id, r);
    setRateFor(null);
  };

  const saveNewTable = () => {
    const r = parseInt(newRate, 10);
    if (newName.trim() && r > 0) {
      addTable(newName.trim(), newType, r);
      setAddOpen(false);
      setNewName('');
    }
  };

  const activeTables = state.tables.filter((t) => t.sessionStart != null);
  const sortedTables = [...state.tables].sort(
    (a, b) => (b.sessionStart != null ? 1 : 0) - (a.sessionStart != null ? 1 : 0)
  );
  const billRate = billSale ? state.tables.find((x) => x.id === billSale.tableId)?.hourlyRate ?? 0 : 0;

  return (
    <Screen
      title="Tables"
      subtitle={`${activeTables.length} OF ${state.tables.length} IN PLAY`}
      headerAction={
        staffMode ? (
          <Btn kind="ghost" icon="add-outline" label="Table" onPress={() => setAddOpen(true)} />
        ) : undefined
      }
    >
      {sortedTables.map((t) => {
        const busy = t.sessionStart != null;
        const elapsed = busy ? Date.now() - (t.sessionStart as number) : 0;
        const runningBill = busy ? (elapsed / 3600000) * t.hourlyRate : 0;
        const typeLabel = t.type === 'snooker' ? 'Snooker' : 'Pool';

        if (!busy) {
          return (
            <View
              key={t.id}
              style={{
                paddingVertical: 16,
                paddingHorizontal: S.s5,
                borderBottomWidth: S.rule,
                borderBottomColor: C.rule,
                backgroundColor: C.ground,
              }}
            >
              <Row style={{ alignItems: 'flex-start' }}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[T.h3, { color: C.ink }]}>{t.name}</Text>
                  <Text style={[T.micro, { color: C.inkFaint, marginTop: 3 }]}>
                    {typeLabel} · {fmtMoney(t.hourlyRate)}/HR
                  </Text>
                </View>
                <Badge kind="free" label="FREE" />
              </Row>
              {staffMode && (
                <Row style={{ marginTop: 12 }}>
                  <Btn kind="primary" label="Start" style={{ flex: 1 }} onPress={() => openStart(t)} />
                  <Btn
                    kind="secondary"
                    label="Rate"
                    onPress={() => {
                      setRateFor(t);
                      setRateText(String(t.hourlyRate));
                    }}
                  />
                </Row>
              )}
            </View>
          );
        }

        return (
          <View key={t.id} style={{ backgroundColor: C.surface2 }}>
            <View style={{ height: S.ruleAccent, backgroundColor: C.live }} />
            <View style={{ paddingTop: 16, paddingBottom: 18, paddingHorizontal: S.s5, gap: 14 }}>
              <Row style={{ alignItems: 'flex-start' }}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[T.h2, { color: C.ink }]}>{t.name}</Text>
                  <Text style={[T.micro, { color: C.inkFaint, marginTop: 3 }]}>
                    {typeLabel} · {fmtMoney(t.hourlyRate)}/HR
                  </Text>
                </View>
                <Badge kind="inPlay" label="IN PLAY" />
              </Row>
              <View
                style={{
                  flexDirection: 'row',
                  borderTopWidth: S.rule,
                  borderTopColor: C.rule,
                  paddingTop: 14,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[T.micro, { color: C.inkFaint }]}>ELAPSED</Text>
                  <Text style={[T.monoXl, { color: C.ink, marginTop: 2 }]}>{fmtDuration(elapsed)}</Text>
                  <Text style={{ ...T.body, fontSize: 14, color: C.inkDim, marginTop: 4 }}>
                    {t.sessionCustomer}
                  </Text>
                </View>
                {staffMode && (
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[T.micro, { color: C.inkFaint }]}>RUNNING BILL</Text>
                    <Text style={[T.monoXl, { color: C.brass, marginTop: 2 }]}>{fmtMoney(runningBill)}</Text>
                  </View>
                )}
              </View>
              {staffMode && <Btn kind="primary" label="Stop & bill" onPress={() => doStop(t)} />}
            </View>
          </View>
        );
      })}

      <Sheet visible={startFor != null} onClose={() => setStartFor(null)} title="START SESSION">
        <View>
          <Label>Customer</Label>
          <Input value={customer} onChangeText={setCustomer} placeholder="Walk-in" />
        </View>
        {state.members.length > 0 && (
          <View>
            <Label>Members</Label>
            <Row>
              {state.members.slice(0, 12).map((m) => (
                <Chip
                  key={m.id}
                  label={m.name.split(' ')[0]}
                  active={memberId === m.id}
                  onPress={() => {
                    setMemberId(memberId === m.id ? null : m.id);
                    setCustomer(memberId === m.id ? '' : m.name);
                  }}
                />
              ))}
            </Row>
          </View>
        )}
        {startFor && (
          <Row
            style={{
              justifyContent: 'space-between',
              borderTopWidth: S.rule,
              borderTopColor: C.rule,
              paddingTop: 13,
            }}
          >
            <Text style={[T.micro, { color: C.inkFaint }]}>
              {startFor.name} · {startFor.type === 'snooker' ? 'SNOOKER' : 'POOL'}
            </Text>
            <Text style={[T.monoMd, { color: C.brass }]}>{fmtMoney(startFor.hourlyRate)}/HR</Text>
          </Row>
        )}
        <Btn kind="primary" size="sheet" label="Start session" onPress={confirmStart} />
      </Sheet>

      <Sheet visible={rateFor != null} onClose={() => setRateFor(null)} title="EDIT RATE">
        <View>
          <Label>Hourly rate (₹)</Label>
          <Input value={rateText} onChangeText={setRateText} keyboardType="number-pad" mono />
        </View>
        <Btn kind="primary" size="sheet" label="Save rate" onPress={saveRate} />
      </Sheet>

      <Sheet visible={addOpen} onClose={() => setAddOpen(false)} title="ADD TABLE">
        <View>
          <Label>Table name</Label>
          <Input value={newName} onChangeText={setNewName} placeholder="e.g. Snooker 4" />
        </View>
        <View>
          <Label>Hourly rate (₹)</Label>
          <Input value={newRate} onChangeText={setNewRate} keyboardType="number-pad" mono />
        </View>
        <View>
          <Label>Type</Label>
          <SegmentedControl
            options={[
              { label: 'Snooker', value: 'snooker' as const },
              { label: 'Pool', value: 'pool' as const },
            ]}
            value={newType}
            onChange={setNewType}
          />
        </View>
        <Btn kind="primary" size="sheet" label="Add table" onPress={saveNewTable} />
      </Sheet>

      <Sheet visible={billSale != null} onClose={() => setBillSale(null)} title="BILL SUMMARY">
        {billSale && (
          <>
            <Row
              style={{
                justifyContent: 'space-between',
                paddingVertical: 13,
                borderBottomWidth: S.rule,
                borderBottomColor: C.rule,
              }}
            >
              <Text style={[T.micro, { color: C.inkFaint }]}>TABLE</Text>
              <Text style={[T.monoMd, { color: C.ink }]}>{billSale.tableName}</Text>
            </Row>
            <Row
              style={{
                justifyContent: 'space-between',
                paddingVertical: 13,
                borderBottomWidth: S.rule,
                borderBottomColor: C.rule,
              }}
            >
              <Text style={[T.micro, { color: C.inkFaint }]}>CUSTOMER</Text>
              <Text style={[T.monoMd, { color: C.ink }]}>{billSale.customer}</Text>
            </Row>
            <Row
              style={{
                justifyContent: 'space-between',
                paddingVertical: 13,
                borderBottomWidth: S.rule,
                borderBottomColor: C.rule,
              }}
            >
              <Text style={[T.micro, { color: C.inkFaint }]}>MINUTES</Text>
              <Text style={[T.monoMd, { color: C.ink }]}>{billSale.minutes}</Text>
            </Row>
            <Row
              style={{
                justifyContent: 'space-between',
                paddingVertical: 13,
                borderBottomWidth: S.rule,
                borderBottomColor: C.rule,
              }}
            >
              <Text style={[T.micro, { color: C.inkFaint }]}>RATE</Text>
              <Text style={[T.monoMd, { color: C.ink }]}>{fmtMoney(billRate)}/hr</Text>
            </Row>
            <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 20, paddingBottom: 22 }}>
              <Text style={{ ...T.label, fontSize: 12, color: C.ink }}>TOTAL</Text>
              <Text style={[T.monoDisplay, { color: C.brass }]}>{fmtMoney(billSale.amount)}</Text>
            </Row>
            <Btn kind="primary" size="sheet" label="Mark paid" onPress={() => setBillSale(null)} />
          </>
        )}
      </Sheet>
    </Screen>
  );
}
