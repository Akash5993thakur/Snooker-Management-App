import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { C, S } from './theme';

export const Screen = ({ children, title, subtitle, right }: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) => (
  <View style={{ flex: 1 }}>
    <View style={st.header}>
      <View style={{ flex: 1 }}>
        <Text style={st.title}>{title}</Text>
        {subtitle ? <Text style={st.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
    <ScrollView contentContainerStyle={{ padding: S.pad, paddingBottom: 120 }}>
      {children}
    </ScrollView>
  </View>
);

export const Card = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[st.card, style]}>{children}</View>
);

export const Btn = ({ label, onPress, kind = 'primary', small, disabled }: {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'danger' | 'ghost' | 'gold';
  small?: boolean;
  disabled?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [
      st.btn,
      small && st.btnSmall,
      kind === 'primary' && { backgroundColor: C.green },
      kind === 'gold' && { backgroundColor: C.gold },
      kind === 'danger' && { backgroundColor: C.red },
      kind === 'ghost' && { backgroundColor: 'transparent', borderWidth: 1, borderColor: C.border },
      (pressed || disabled) && { opacity: 0.6 },
    ]}
  >
    <Text
      style={[
        st.btnText,
        small && { fontSize: 13 },
        kind === 'ghost' ? { color: C.text } : { color: '#08130d' },
      ]}
    >
      {label}
    </Text>
  </Pressable>
);

export const Chip = ({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) => (
  <Pressable
    onPress={onPress}
    style={[st.chip, active && { backgroundColor: C.green, borderColor: C.green }]}
  >
    <Text style={{ color: active ? '#08130d' : C.textDim, fontWeight: '600', fontSize: 13 }}>
      {label}
    </Text>
  </Pressable>
);

export const Input = (props: React.ComponentProps<typeof TextInput>) => (
  <TextInput
    placeholderTextColor={C.textFaint}
    {...props}
    style={[st.input, props.style]}
  />
);

export const Label = ({ children }: { children: React.ReactNode }) => (
  <Text style={st.label}>{children}</Text>
);

export const Row = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }, style]}>
    {children}
  </View>
);

export const Empty = ({ text }: { text: string }) => (
  <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
    <Text style={{ color: C.textFaint, textAlign: 'center' }}>{text}</Text>
  </Card>
);

export const Sheet = ({ visible, onClose, title, children }: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: 'flex-end' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable style={st.backdrop} onPress={onClose} />
      <View style={st.sheet}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Text style={[st.title, { flex: 1, fontSize: 20 }]}>{title}</Text>
          <Pressable onPress={onClose} hitSlop={10}>
            <Text style={{ color: C.textDim, fontSize: 22 }}>✕</Text>
          </Pressable>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
          {children}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

const st = StyleSheet.create({
  header: {
    paddingHorizontal: S.pad,
    paddingRight: 118, // leave room for the staff-mode badge
    paddingTop: 60,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: { color: C.text, fontSize: 26, fontWeight: '800' },
  subtitle: { color: C.textDim, fontSize: 13, marginTop: 2 },
  card: {
    backgroundColor: C.surface,
    borderRadius: S.radius,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginBottom: 12,
  },
  btn: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSmall: { paddingVertical: 8, paddingHorizontal: 12 },
  btnText: { fontWeight: '800', fontSize: 15 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface2,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  input: {
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    color: C.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
  },
  label: { color: C.textDim, fontSize: 13, fontWeight: '700', marginBottom: 6, marginTop: 4 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: S.pad,
    maxHeight: '85%',
  },
});
