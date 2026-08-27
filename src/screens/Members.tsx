import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { C, S, T } from '../theme';
import { Badge, Btn, Empty, Input, Label, Screen, SegmentedControl, Sheet } from '../ui';
import { useStore } from '../store';
import { Member, MemberPlan } from '../types';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const MemberRow = ({ m, staffMode }: { m: Member; staffMode: boolean }) => {
  const d = new Date(m.joinedISO);
  const joined = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  return (
    <View
      style={{
        paddingVertical: 16,
        paddingLeft: S.s5 + 3,
        paddingRight: S.s5,
        borderBottomWidth: S.rule,
        borderBottomColor: C.rule,
      }}
    >
      <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: C.brass }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text style={[T.h4, { color: C.ink }]}>{m.name}</Text>
        <Badge
          kind={m.plan === 'Monthly Pass' ? 'monthlyPass' : 'regular'}
          label={m.plan === 'Monthly Pass' ? 'MONTHLY PASS' : 'REGULAR'}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 6 }}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[T.micro, { color: C.inkFaint }]}>
            JOINED {joined} · {m.visits} VISITS
          </Text>
          {staffMode && m.phone ? (
            <Text style={[T.monoSm, { color: C.inkDim, marginTop: 4 }]}>{m.phone}</Text>
          ) : null}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ ...T.monoLg, fontSize: 26, color: C.brass }}>{m.points}</Text>
          <Text style={[T.nano, { color: C.inkFaint }]}>POINTS</Text>
        </View>
      </View>
    </View>
  );
};

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
      subtitle={`${state.members.length} MEMBERS · 10 PTS PER ₹100`}
      headerAction={
        staffMode ? <Btn kind="ghost" icon="add-outline" label="Member" onPress={() => setOpen(true)} /> : undefined
      }
    >
      <View
        style={{
          backgroundColor: C.surface2,
          paddingVertical: S.s4,
          paddingHorizontal: S.s5,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={[T.monoMd, { color: C.brass }]}>10 PTS</Text>
        <Text style={[T.micro, { color: C.inkDim }]}>PER ₹100 PLAYED</Text>
      </View>

      {state.members.length === 0 ? (
        <View style={{ paddingHorizontal: S.s5, paddingTop: S.s4 }}>
          {staffMode ? (
            <Empty heading="NO MEMBERS YET" body="Add the first one with + Member." />
          ) : (
            <Empty heading="NO MEMBERS YET" body="Ask at the counter to join." />
          )}
        </View>
      ) : (
        state.members.map((m) => <MemberRow key={m.id} m={m} staffMode={staffMode} />)
      )}

      <Sheet visible={open} onClose={() => setOpen(false)} title="ADD MEMBER">
        <View>
          <Label>Name</Label>
          <Input value={name} onChangeText={setName} placeholder="Full name" />
        </View>
        <View>
          <Label>Phone</Label>
          <Input value={phone} onChangeText={setPhone} placeholder="Mobile number" keyboardType="phone-pad" mono />
        </View>
        <View>
          <Label>Plan</Label>
          <SegmentedControl
            options={[
              { label: 'Regular', value: 'Regular' as MemberPlan },
              { label: 'Monthly Pass', value: 'Monthly Pass' as MemberPlan },
            ]}
            value={plan}
            onChange={setPlan}
          />
        </View>
        <Btn kind="primary" size="sheet" label="Add member" onPress={save} />
      </Sheet>
    </Screen>
  );
}
