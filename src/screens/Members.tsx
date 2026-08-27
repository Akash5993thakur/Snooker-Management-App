import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { C } from '../theme';
import { Btn, Card, Chip, Empty, Input, Label, Row, Screen, Sheet } from '../ui';
import { useStore } from '../store';
import { MemberPlan } from '../types';

export default function Members() {
  const { state, staffMode, addMember } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState<MemberPlan>('Regular');

  const save = () => {
    if (!name.trim()) return;
    addMember(name.trim(), phone.trim(), plan);
    setOpen(false);
    setName('');
    setPhone('');
    setPlan('Regular');
  };

  return (
    <Screen
      title="Members"
      subtitle={`${state.members.length} registered · earn 10 points per ₹100 played`}
      right={staffMode ? <Btn label="+ Member" small onPress={() => setOpen(true)} /> : undefined}
    >
      {state.members.length === 0 ? (
        <Empty text={staffMode ? 'No members yet. Tap + Member to add the first one.' : 'No members yet — ask at the counter to join!'} />
      ) : (
        state.members.map((m) => (
          <Card key={m.id}>
            <Row>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.text, fontWeight: '800', fontSize: 16 }}>{m.name}</Text>
                <Text style={{ color: C.textDim, fontSize: 12, marginTop: 2 }}>
                  {m.plan} · joined {m.joinedISO}
                  {staffMode && m.phone ? ` · ${m.phone}` : ''}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: C.gold, fontWeight: '800', fontSize: 16 }}>{m.points} pts</Text>
                <Text style={{ color: C.textFaint, fontSize: 12 }}>{m.visits} visits</Text>
              </View>
            </Row>
          </Card>
        ))
      )}

      <Sheet visible={open} onClose={() => setOpen(false)} title="New member">
        <Label>Name</Label>
        <Input value={name} onChangeText={setName} placeholder="Full name" />
        <Label>Phone</Label>
        <Input value={phone} onChangeText={setPhone} placeholder="Mobile number" keyboardType="phone-pad" />
        <Label>Plan</Label>
        <Row style={{ marginBottom: 12 }}>
          {(['Regular', 'Monthly Pass'] as MemberPlan[]).map((p) => (
            <Chip key={p} label={p} active={plan === p} onPress={() => setPlan(p)} />
          ))}
        </Row>
        <Btn label="Add member" onPress={save} />
      </Sheet>
    </Screen>
  );
}
