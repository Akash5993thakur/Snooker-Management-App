import React, { useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { C } from '../theme';
import { Btn, Card, Chip, Empty, Input, Label, Row, Screen } from '../ui';
import { fmtHour, todayISO, useStore } from '../store';

export default function Booking() {
  const { state, staffMode, addBooking, cancelBooking } = useStore();
  const [dayOffset, setDayOffset] = useState(0);
  const [tableId, setTableId] = useState(state.tables[0]?.id ?? '');
  const [hour, setHour] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const dateISO = todayISO(dayOffset);
  const dayLabels = ['Today', 'Tomorrow', todayISO(2).slice(5)];

  const hours = useMemo(() => {
    const out: number[] = [];
    for (let h = state.openHour; h < state.closeHour; h++) out.push(h);
    return out;
  }, [state.openHour, state.closeHour]);

  const takenHours = state.bookings
    .filter((b) => b.tableId === tableId && b.dateISO === dateISO)
    .map((b) => b.hour);

  const upcoming = state.bookings
    .filter((b) => b.dateISO >= todayISO())
    .sort((a, b) => (a.dateISO === b.dateISO ? a.hour - b.hour : a.dateISO < b.dateISO ? -1 : 1));

  const book = () => {
    if (hour == null) return Alert.alert('Pick a time slot');
    if (!name.trim()) return Alert.alert('Please enter your name');
    const err = addBooking({ tableId, dateISO, hour, customerName: name.trim(), phone: phone.trim() });
    if (err) return Alert.alert('Slot taken', err);
    const table = state.tables.find((t) => t.id === tableId);
    Alert.alert('Booked!', `${table?.name} on ${dateISO} at ${fmtHour(hour)} for ${name.trim()}.`);
    setHour(null);
    setName('');
    setPhone('');
  };

  return (
    <Screen title="Book a table" subtitle="Reserve a 1-hour slot">
      <Label>Day</Label>
      <Row style={{ marginBottom: 6 }}>
        {dayLabels.map((d, i) => (
          <Chip key={d} label={d} active={dayOffset === i} onPress={() => { setDayOffset(i); setHour(null); }} />
        ))}
      </Row>

      <Label>Table</Label>
      <Row style={{ marginBottom: 6 }}>
        {state.tables.map((t) => (
          <Chip key={t.id} label={t.name} active={tableId === t.id} onPress={() => { setTableId(t.id); setHour(null); }} />
        ))}
      </Row>

      <Label>Time slot</Label>
      <Row style={{ marginBottom: 6 }}>
        {hours.map((h) => {
          const taken = takenHours.includes(h);
          return (
            <View key={h} style={{ opacity: taken ? 0.35 : 1 }}>
              <Chip
                label={fmtHour(h)}
                active={hour === h}
                onPress={taken ? undefined : () => setHour(h)}
              />
            </View>
          );
        })}
      </Row>

      <Label>Your name</Label>
      <Input value={name} onChangeText={setName} placeholder="Name" />
      <Label>Phone</Label>
      <Input value={phone} onChangeText={setPhone} placeholder="Mobile number" keyboardType="phone-pad" />
      <Btn label="Confirm booking" onPress={book} />

      <Text style={{ color: C.textDim, fontWeight: '800', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginTop: 22, marginBottom: 8 }}>
        Upcoming bookings
      </Text>
      {upcoming.length === 0 ? (
        <Empty text="No upcoming bookings." />
      ) : (
        upcoming.map((b) => {
          const table = state.tables.find((t) => t.id === b.tableId);
          return (
            <Card key={b.id}>
              <Row>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.text, fontWeight: '700' }}>
                    {b.customerName} · {table?.name}
                  </Text>
                  <Text style={{ color: C.textDim, fontSize: 12, marginTop: 2 }}>
                    {b.dateISO} at {fmtHour(b.hour)}
                    {staffMode && b.phone ? ` · ${b.phone}` : ''}
                  </Text>
                </View>
                {staffMode && (
                  <Btn label="Cancel" small kind="danger" onPress={() => cancelBooking(b.id)} />
                )}
              </Row>
            </Card>
          );
        })
      )}
    </Screen>
  );
}
