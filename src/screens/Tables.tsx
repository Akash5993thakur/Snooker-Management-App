import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { C } from '../theme';
import { Btn, Card, Chip, Input, Label, Row, Screen, Sheet } from '../ui';
import { fmtDuration, fmtMoney, useStore } from '../store';
import { ClubTable } from '../types';

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

  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 15000);
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
    if (sale) {
      Alert.alert(
        'Session ended',
        `${t.name} — ${sale.customer}\nTime: ${sale.minutes} min\nBill: ${fmtMoney(sale.amount)}`
      );
    }
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

  return (
    <Screen
      title="Tables"
      subtitle={staffMode ? 'Tap a table to start or stop a session' : 'Live table availability'}
      right={staffMode ? <Btn label="+ Table" small kind="ghost" onPress={() => setAddOpen(true)} /> : undefined}
    >
      {state.tables.map((t) => {
        const busy = t.sessionStart != null;
        const elapsed = busy ? Date.now() - (t.sessionStart as number) : 0;
        const runningBill = busy ? (elapsed / 3600000) * t.hourlyRate : 0;
        return (
          <Card key={t.id} style={{ borderColor: busy ? C.gold : C.border }}>
            <Row>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.text, fontSize: 17, fontWeight: '800' }}>{t.name}</Text>
                <Text style={{ color: C.textDim, fontSize: 12, marginTop: 2 }}>
                  {t.type === 'snooker' ? 'Snooker' : 'Pool'} · {fmtMoney(t.hourlyRate)}/hr
                </Text>
                {busy && (
                  <Text style={{ color: C.gold, fontSize: 13, marginTop: 6, fontWeight: '700' }}>
                    {t.sessionCustomer} · {fmtDuration(elapsed)}
                    {staffMode ? ` · ~${fmtMoney(runningBill)}` : ''}
                  </Text>
                )}
              </View>
              <View style={{ alignItems: 'flex-end', gap: 8 }}>
                <Text style={{ color: busy ? C.gold : C.green, fontWeight: '800', fontSize: 13 }}>
                  {busy ? '● IN PLAY' : '● FREE'}
                </Text>
                {staffMode &&
                  (busy ? (
                    <Btn label="Stop & bill" small kind="danger" onPress={() => doStop(t)} />
                  ) : (
                    <Row>
                      <Btn label="Rate" small kind="ghost" onPress={() => { setRateFor(t); setRateText(String(t.hourlyRate)); }} />
                      <Btn label="Start" small onPress={() => openStart(t)} />
                    </Row>
                  ))}
              </View>
            </Row>
          </Card>
        );
      })}

      <Sheet visible={startFor != null} onClose={() => setStartFor(null)} title={`Start ${startFor?.name ?? ''}`}>
        <Label>Customer name (optional)</Label>
        <Input value={customer} onChangeText={setCustomer} placeholder="Walk-in" />
        {state.members.length > 0 && (
          <>
            <Label>Or pick a member</Label>
            <Row style={{ marginBottom: 12 }}>
              {state.members.slice(0, 12).map((m) => (
                <Chip
                  key={m.id}
                  label={m.name}
                  active={memberId === m.id}
                  onPress={() => {
                    setMemberId(memberId === m.id ? null : m.id);
                    setCustomer(memberId === m.id ? '' : m.name);
                  }}
                />
              ))}
            </Row>
          </>
        )}
        <Btn label="Start session" onPress={confirmStart} />
      </Sheet>

      <Sheet visible={rateFor != null} onClose={() => setRateFor(null)} title={`Rate for ${rateFor?.name ?? ''}`}>
        <Label>Hourly rate (₹)</Label>
        <Input value={rateText} onChangeText={setRateText} keyboardType="number-pad" />
        <Btn label="Save rate" onPress={saveRate} />
      </Sheet>

      <Sheet visible={addOpen} onClose={() => setAddOpen(false)} title="Add a table">
        <Label>Name</Label>
        <Input value={newName} onChangeText={setNewName} placeholder="e.g. Snooker 4" />
        <Label>Type</Label>
        <Row style={{ marginBottom: 10 }}>
          <Chip label="Snooker" active={newType === 'snooker'} onPress={() => setNewType('snooker')} />
          <Chip label="Pool" active={newType === 'pool'} onPress={() => setNewType('pool')} />
        </Row>
        <Label>Hourly rate (₹)</Label>
        <Input value={newRate} onChangeText={setNewRate} keyboardType="number-pad" />
        <Btn label="Add table" onPress={saveNewTable} />
      </Sheet>
    </Screen>
  );
}
