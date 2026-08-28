import { Ionicons } from '@expo/vector-icons';
import {
  Archivo_400Regular,
  Archivo_600SemiBold,
  Archivo_700Bold,
  Archivo_800ExtraBold,
} from '@expo-google-fonts/archivo';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { C, S, T } from './src/theme';
import { StoreProvider, useStore } from './src/store';
import Dashboard from './src/screens/Dashboard';
import Login from './src/screens/Login';
import Tables from './src/screens/Tables';
import Booking from './src/screens/Booking';
import Members from './src/screens/Members';
import Tournaments from './src/screens/Tournaments';

const TABS = [
  { key: 'home', label: 'Home', icon: 'home-outline' as const },
  { key: 'tables', label: 'Tables', icon: 'grid-outline' as const },
  { key: 'book', label: 'Book', icon: 'calendar-outline' as const },
  { key: 'members', label: 'Members', icon: 'people-outline' as const },
  { key: 'tourney', label: 'Tourney', icon: 'trophy-outline' as const },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function Main() {
  const { state, loaded } = useStore();
  const [tab, setTab] = useState<TabKey>('home');
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_600SemiBold,
    Archivo_700Bold,
    Archivo_800ExtraBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  if (!loaded || !fontsLoaded) {
    return (
      <View style={[st.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: C.inkDim }}>Loading…</Text>
      </View>
    );
  }

  if (!state.currentUser) {
    return (
      <View style={st.root}>
        <StatusBar style="dark" />
        <Login />
      </View>
    );
  }

  return (
    <View style={st.root}>
      <StatusBar style="dark" />

      <View style={{ flex: 1 }}>
        {tab === 'home' && <Dashboard />}
        {tab === 'tables' && <Tables />}
        {tab === 'book' && <Booking />}
        {tab === 'members' && <Members />}
        {tab === 'tourney' && <Tournaments />}
      </View>

      <View style={st.tabbar}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable key={t.key} onPress={() => setTab(t.key)} style={st.tabCell}>
              {({ pressed }) => {
                const dim = pressed && !active;
                const color = active ? C.brass : C.inkFaint;
                return (
                  <>
                    <View style={[st.tabMark, active && { backgroundColor: C.brass }]} />
                    <Ionicons name={t.icon} size={24} color={color} style={dim ? { opacity: 0.6 } : undefined} />
                    <Text style={[T.micro, { color }, dim && { opacity: 0.6 }]}>{t.label}</Text>
                  </>
                );
              }}
            </Pressable>
          );
        })}
      </View>
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
  root: { flex: 1, backgroundColor: C.ground },
  tabbar: {
    flexDirection: 'row',
    height: S.tabBar,
    backgroundColor: C.ground,
    borderTopWidth: S.rule,
    borderTopColor: C.rule,
  },
  tabCell: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    gap: 5,
  },
  tabMark: {
    width: 24,
    height: 3,
    backgroundColor: 'transparent',
  },
});
