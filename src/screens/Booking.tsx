import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { C, S, T } from '../theme';
import { Btn, Chip, Empty, Input, Label, ListRow, Row, Screen, SegmentedControl, Sheet } from '../ui';
import { fmtHour, todayISO, useStore } from '../store';

const SLOT_SIZE = 84;
const SLOT_GAP = 8;
const SLOT_STRIDE = SLOT_SIZE + SLOT_GAP;

const noSpaceHour = (h: number) => fmtHour(h).replace(' ', '');

type Confirmed = { table: string; dateISO: string; hour: number; name: string };

const SectionHeader = ({ title }: { title: string }) => (
  <View
    style={{
      paddingVertical: 13,
      paddingHorizontal: S.s5,
      borderTopWidth: S.rule,
      borderTopColor: C.rule,
      marginTop: S.s6,
    }}
  >
    <Text style={[T.label, { color: C.ink }]}>{title}</Text>
  </View>
);

export default function Booking() {
  const { state, staffMode, addBooking, cancelBooking } = useStore();
  const [dayOffset, setDayOffset] = useState(0);
  const [tableId, setTableId] = useState(state.tables[0]?.id ?? '');
  const [hour, setHour] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const dateISO = todayISO(dayOffset);
  const thirdDayLabel = new Date(Date.now() + 2 * 86400000).toLocaleDateString('en-US', { weekday: 'short' });
  const dayOptions = [
    { label: 'Today', value: 0 },
    { label: 'Tomorrow', value: 1 },
    { label: thirdDayLabel, value: 2 },
  ];

  const hours = useMemo(() => {
    const out: number[] = [];
    for (let h = state.openHour; h < state.closeHour; h++) out.push(h);
    return out;
  }, [state.openHour, state.closeHour]);

  const takenHours = state.bookings
    .filter((b) => b.tableId === tableId && b.dateISO === dateISO)
    .map((b) => b.hour);

  useEffect(() => {
    const firstFreeIndex = hours.findIndex((h) => !takenHours.includes(h));
    if (firstFreeIndex > 0) {
      scrollRef.current?.scrollTo({ x: firstFreeIndex * SLOT_STRIDE, animated: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateISO, tableId]);

  const upcoming = state.bookings
    .filter((b) => b.dateISO >= todayISO())
    .sort((a, b) => (a.dateISO === b.dateISO ? a.hour - b.hour : a.dateISO < b.dateISO ? -1 : 1));

  const selectedTable = state.tables.find((t) => t.id === tableId);

  const book = () => {
    if (hour == null) return Alert.alert('Pick a time slot');
    if (!name.trim()) return Alert.alert('Please enter your name');
    const err = addBooking({ tableId, dateISO, hour, customerName: name.trim(), phone: phone.trim() });
    if (err) return Alert.alert('Slot taken', err);
    setConfirmed({ table: selectedTable?.name ?? '', dateISO, hour, name: name.trim() });
    setHour(null);
    setName('');
    setPhone('');
  };

  const confirmLabel =
    hour != null && selectedTable ? `Confirm booking · ${selectedTable.name} · ${fmtHour(hour)}` : 'Confirm booking';

  return (
    <Screen
      title="Book a slot"
      subtitle={`ONE-HOUR SLOTS · ${fmtHour(state.openHour)} – ${fmtHour(state.closeHour - 1)}`}
    >
      <View style={{ paddingHorizontal: S.s5, gap: S.s6 }}>
        <View>
          <Label>Day</Label>
          <SegmentedControl
            options={dayOptions}
            value={dayOffset}
            onChange={(v) => {
              setDayOffset(v);
              setHour(null);
            }}
          />
        </View>

        <View>
          <Label>Table</Label>
          <Row>
            {state.tables.map((t) => (
              <Chip
                key={t.id}
                label={t.name}
                active={tableId === t.id}
                onPress={() => {
                  setTableId(t.id);
                  setHour(null);
                }}
              />
            ))}
          </Row>
        </View>
      </View>

      <View style={{ marginTop: S.s6 }}>
        <Row style={{ paddingHorizontal: S.s5, justifyContent: 'space-between' }}>
          <Label>Time slot</Label>
          <Text style={[T.micro, { color: C.inkFaint }]}>SWIPE →</Text>
        </Row>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: S.s5, gap: SLOT_GAP }}
        >
          {hours.map((h) => {
            const taken = takenHours.includes(h);
            const selected = hour === h;
            const textColor = selected ? C.brassInk : taken ? C.inkMute : C.inkDim;
            return (
              <Pressable
                key={h}
                disabled={taken}
                onPress={() => setHour(h)}
                style={{
                  width: SLOT_SIZE,
                  height: SLOT_SIZE,
                  borderWidth: S.rule,
                  borderColor: selected ? C.brass : taken ? C.ruleFaint : C.rule,
                  backgroundColor: selected ? C.brass : taken ? C.surface : 'transparent',
                  padding: 10,
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ ...T.monoMd, fontSize: 18, color: textColor, textAlign: 'left' }}>
                  {noSpaceHour(h)}
                </Text>
                <Text style={[T.nano, { color: textColor, textAlign: 'left' }]}>
                  {selected ? 'SELECTED' : taken ? 'TAKEN' : 'FREE'}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ paddingHorizontal: S.s5, gap: S.s6, marginTop: S.s6 }}>
        <View>
          <Label>Your name</Label>
          <Input value={name} onChangeText={setName} placeholder="Name" />
        </View>
        <View>
          <Label>Phone</Label>
          <Input value={phone} onChangeText={setPhone} placeholder="10-digit number" keyboardType="phone-pad" mono />
        </View>
        <Btn kind="primary" label={confirmLabel} onPress={book} />
      </View>

      <SectionHeader title="Upcoming bookings" />
      {upcoming.length === 0 ? (
        <View style={{ paddingHorizontal: S.s5, paddingTop: S.s4 }}>
          <Empty heading="NO UPCOMING BOOKINGS" body="Pick a day, table and slot above." />
        </View>
      ) : (
        upcoming.map((b) => {
          const table = state.tables.find((t) => t.id === b.tableId);
          return (
            <ListRow
              key={b.id}
              title={`${b.customerName} · ${table?.name ?? ''}`}
              meta={`${b.dateISO} AT ${fmtHour(b.hour)}${staffMode && b.phone ? ' · ' + b.phone : ''}`}
              trailing={
                staffMode ? <Btn kind="danger" label="Cancel" onPress={() => cancelBooking(b.id)} /> : undefined
              }
            />
          );
        })
      )}

      <Sheet visible={confirmed != null} onClose={() => setConfirmed(null)} title="BOOKING CONFIRMED">
        {confirmed && (
          <>
            <View style={{ backgroundColor: C.felt, padding: S.s5, gap: 6 }}>
              <Text style={[T.micro, { color: C.ink }]}>CONFIRMED</Text>
              <Text style={{ ...T.h3, fontSize: 20, color: C.ink }}>
                {confirmed.table} · {fmtHour(confirmed.hour)}
              </Text>
            </View>
            <Text style={[T.bodySm, { color: C.inkDim }]}>
              {confirmed.dateISO === todayISO()
                ? 'Today'
                : confirmed.dateISO === todayISO(1)
                ? 'Tomorrow'
                : confirmed.dateISO}{' '}
              · one hour · {confirmed.name}.
            </Text>
            <Btn kind="primary" size="sheet" label="Done" onPress={() => setConfirmed(null)} />
          </>
        )}
      </Sheet>
    </Screen>
  );
}
