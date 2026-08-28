import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { C, S, T } from '../theme';
import { Btn, Input, Label, SegmentedControl } from '../ui';
import { useStore } from '../store';

type Mode = 'customer' | 'staff';

export default function Login() {
  const { state, login } = useStore();
  const [mode, setMode] = useState<Mode>('customer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');

  const canContinue = name.trim().length > 0 && phone.trim().length >= 10;

  const enterCustomer = () => {
    if (!canContinue) return;
    login({ name: name.trim(), phone: phone.trim(), role: 'customer' });
  };

  const tryStaffPin = (candidate: string) => {
    if (candidate === state.staffPin) {
      login({ name: 'Staff', phone: '', role: 'staff' });
    } else {
      setPin(''); // wrong PIN clears silently, same as the staff PIN sheet
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.ground, paddingTop: S.statusBar + S.s7, paddingHorizontal: S.s5 }}>
      <Text style={[T.display, { color: C.ink }]}>Kakul</Text>
      <Text style={[T.micro, { color: C.inkFaint, marginTop: 6 }]}>SNOOKER & POOL CLUB</Text>

      <View
        style={{
          borderTopWidth: S.rule,
          borderTopColor: C.rule,
          marginTop: S.s6,
          paddingTop: S.s6,
          gap: S.s5,
        }}
      >
        <Text style={[T.label, { color: C.ink }]}>SIGN IN</Text>

        <SegmentedControl<Mode>
          options={[
            { label: 'Customer', value: 'customer' },
            { label: 'Staff', value: 'staff' },
          ]}
          value={mode}
          onChange={(m) => {
            setMode(m);
            setPin('');
          }}
        />

        {mode === 'customer' ? (
          <>
            <View>
              <Label>Your name</Label>
              <Input value={name} onChangeText={setName} placeholder="Name" />
            </View>
            <View>
              <Label>Phone</Label>
              <Input
                value={phone}
                onChangeText={setPhone}
                placeholder="10-digit number"
                keyboardType="phone-pad"
                maxLength={10}
                mono
              />
            </View>
            <Btn kind="primary" label="Continue" onPress={enterCustomer} disabled={!canContinue} />
            <Text style={[T.micro, { color: C.inkFaint }]}>
              YOUR PHONE NUMBER IDENTIFIES YOUR BOOKINGS ON THIS DEVICE
            </Text>
          </>
        ) : (
          <>
            <View>
              <Label>Staff PIN</Label>
              <Input
                value={pin}
                onChangeText={(v) => {
                  setPin(v);
                  if (v.length === 4) tryStaffPin(v);
                }}
                placeholder="PIN"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                mono
              />
            </View>
            <Btn kind="primary" label="Enter staff mode" onPress={() => tryStaffPin(pin)} />
            <Text style={[T.micro, { color: C.inkFaint }]}>DEMO PIN 1234</Text>
          </>
        )}
      </View>
    </View>
  );
}
