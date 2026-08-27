import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { C } from './src/theme';
import { StoreProvider, useStore } from './src/store';
import { Btn, Input, Label, Sheet } from './src/ui';
import Dashboard from './src/screens/Dashboard';
import Tables from './src/screens/Tables';
import Booking from './src/screens/Booking';
import Members from './src/screens/Members';
import Tournaments from './src/screens/Tournaments';

const TABS = [
  { key: 'home', label: 'Home', icon: '⌂' },
  { key: 'tables', label: 'Tables', icon: '🎱' },
  { key: 'book', label: 'Book', icon: '📅' },
  { key: 'members', label: 'Members', icon: '👥' },
  { key: 'tourney', label: 'Tourney', icon: '🏆' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function Main() {
  const { state, loaded, staffMode, setStaffMode } = useStore();
  const [tab, setTab] = useState<TabKey>('home');
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState('');

  if (!loaded) {
    return (
      <View style={[st.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: C.textDim }}>Loading…</Text>
      </View>
    );
  }

  const toggleStaff = () => {
    if (staffMode) {
      setStaffMode(false);
    } else {
      setPin('');
      setPinOpen(true);
    }
  };

  const submitPin = () => {
    if (pin === state.staffPin) {
      setStaffMode(true);
      setPinOpen(false);
    } else {
      Alert.alert('Wrong PIN', 'Default PIN is 1234.');
    }
  };

  return (
    <View style={st.root}>
      <StatusBar style="light" />
      <Pressable onPress={toggleStaff} style={[st.staffBadge, staffMode && { backgroundColor: C.green, borderColor: C.green }]}>
        <Text style={{ color: staffMode ? '#08130d' : C.textDim, fontWeight: '800', fontSize: 12 }}>
          {staffMode ? 'STAFF MODE ✓' : 'Staff login'}
        </Text>
      </Pressable>

      <View style={{ flex: 1 }}>
        {tab === 'home' && <Dashboard />}
        {tab === 'tables' && <Tables />}
        {tab === 'book' && <Booking />}
        {tab === 'members' && <Members />}
        {tab === 'tourney' && <Tournaments />}
      </View>

      <View style={st.tabbar}>
        {TABS.map((t) => (
          <Pressable key={t.key} onPress={() => setTab(t.key)} style={st.tabBtn}>
            <Text style={{ fontSize: 18, color: tab === t.key ? C.green : C.textFaint }}>{t.icon}</Text>
            <Text style={[st.tabLabel, tab === t.key && { color: C.green }]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <Sheet visible={pinOpen} onClose={() => setPinOpen(false)} title="Staff login">
        <Label>Enter staff PIN</Label>
        <Input value={pin} onChangeText={setPin} keyboardType="number-pad" secureTextEntry placeholder="PIN" />
        <Btn label="Unlock staff mode" onPress={submitPin} />
      </Sheet>
    </View>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Main />
    </StoreProvider>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  staffBadge: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 10,
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tabbar: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingBottom: 28,
    paddingTop: 10,
  },
  tabBtn: { flex: 1, alignItems: 'center', gap: 2 },
  tabLabel: { color: C.textFaint, fontSize: 11, fontWeight: '700' },
});
