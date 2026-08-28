import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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
import { useStore } from './store';
import { C, S, T } from './theme';

export const Screen = ({ children, title, subtitle, headerAction }: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}) => (
  <View style={{ flex: 1 }}>
    <View style={st.header}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[T.h1, { color: C.ink }]}>{title}</Text>
        {subtitle ? (
          <Text style={[T.micro, { color: C.inkFaint, marginTop: 3 }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={{ flexShrink: 0, paddingTop: 4, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {headerAction}
        <StaffControl />
      </View>
    </View>
    <ScrollView contentContainerStyle={{ paddingTop: S.s5, paddingBottom: S.tabBar + S.s5 }}>
      {children}
    </ScrollView>
  </View>
);

type BtnKind = 'primary' | 'secondary' | 'danger' | 'ghost';
type BtnSize = 'default' | 'sheet';

const BTN_HEIGHT: Record<BtnKind, number> = {
  primary: S.tapPrimary,
  secondary: S.tapMin,
  danger: S.tapMin,
  ghost: 36,
};
const BTN_LABEL_SIZE: Record<BtnKind, number> = { primary: 13, secondary: 12, danger: 11, ghost: 11 };
// light theme: all button labels blue except destructive (red)
const BTN_LABEL_COLOR: Record<BtnKind, string> = {
  primary: C.brass,
  secondary: C.brass,
  danger: C.live,
  ghost: C.brass,
};

export const Btn = ({ label, onPress, kind = 'primary', size = 'default', disabled, style, icon }: {
  label: string;
  onPress: () => void;
  kind?: BtnKind;
  size?: BtnSize;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}) => {
  const height = size === 'sheet' ? 52 : BTN_HEIGHT[kind];
  const color = BTN_LABEL_COLOR[kind];
  const hPad = kind === 'primary' ? 16 : 14;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        st.btn,
        { height },
        kind === 'primary' && { backgroundColor: C.accentSoft },
        kind === 'secondary' && { backgroundColor: 'transparent', borderWidth: S.rule, borderColor: C.rule },
        kind === 'danger' && { backgroundColor: 'transparent', borderWidth: S.rule, borderColor: C.live },
        kind === 'ghost' && { backgroundColor: 'transparent', borderWidth: S.rule, borderColor: C.brass },
        disabled && { opacity: 0.45 },
        pressed && !disabled && { opacity: 0.82 },
        style,
      ]}
    >
      {icon ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: hPad }}>
          <Ionicons name={icon} size={16} color={color} />
          <Text style={[T.label, { fontSize: BTN_LABEL_SIZE[kind], textAlign: 'left', color }]}>{label}</Text>
        </View>
      ) : (
        <Text
          style={[
            T.label,
            { fontSize: BTN_LABEL_SIZE[kind], textAlign: 'left', paddingHorizontal: hPad, color },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export const Chip = ({ label, active, onPress, style }: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}) => (
  <Pressable
    onPress={onPress}
    style={[st.chip, active && { backgroundColor: C.brass, borderColor: C.brass }, style]}
  >
    <Text style={[T.bodySm, { color: active ? C.brassInk : C.inkDim }]}>{label}</Text>
  </Pressable>
);

export const SegmentedControl = <V extends string | number>({ options, value, onChange, compact }: {
  options: { label: string; value: V }[];
  value: V;
  onChange: (v: V) => void;
  compact?: boolean;
}) => (
  <View style={[st.segmented, { height: compact ? 40 : S.tapMin }]}>
    {options.map((opt, i) => (
      <Pressable
        key={String(opt.value)}
        onPress={() => onChange(opt.value)}
        style={[
          st.segmentedCell,
          i < options.length - 1 && { borderRightWidth: S.rule, borderRightColor: C.rule },
          value === opt.value && { backgroundColor: C.brass },
        ]}
      >
        <Text style={[T.micro, { color: value === opt.value ? C.brassInk : C.inkDim }]}>{opt.label}</Text>
      </Pressable>
    ))}
  </View>
);

export const StaffControl = () => {
  const { staffMode, setStaffMode, state } = useStore();
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState('');

  // customers never see a staff entry point; only staff-role logins get the toggle
  if (state.currentUser?.role !== 'staff') return null;

  const close = () => {
    setOpen(false);
    setPin('');
  };

  const submit = (candidate: string) => {
    if (candidate === state.staffPin) {
      setStaffMode(true);
      setOpen(false);
      setPin('');
    } else {
      setPin('');
    }
  };

  const press = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) submit(next);
  };

  const backspace = () => setPin((p) => p.slice(0, -1));

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'];

  return (
    <>
      <Pressable
        onPress={() => (staffMode ? setStaffMode(false) : setOpen(true))}
        style={[st.staffPill, { borderColor: staffMode ? C.brass : C.rule }]}
      >
        <Ionicons
          name={staffMode ? 'shield-checkmark' : 'lock-closed-outline'}
          size={16}
          color={staffMode ? C.brass : C.inkDim}
        />
        <Text style={[T.micro, { color: staffMode ? C.brass : C.inkDim }]}>
          {staffMode ? 'STAFF ON' : 'STAFF'}
        </Text>
      </Pressable>

      <Sheet visible={open} onClose={close} title="STAFF LOGIN">
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[st.pinCell, i === pin.length && { borderColor: C.brass }]}>
              {i < pin.length ? (
                <Text style={{ ...T.monoLg, fontSize: 24, color: C.ink }}>•</Text>
              ) : null}
            </View>
          ))}
        </View>
        <View style={st.pad}>
          {keys.map((k) => (
            <Pressable
              key={k}
              onPress={() => {
                if (k === '⌫') backspace();
                else if (k === 'OK') submit(pin);
                else press(k);
              }}
              style={st.padKey}
            >
              <Text style={{ ...T.monoLg, fontSize: 22, color: C.ink }}>{k}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={[T.micro, { color: C.inkFaint, marginTop: 4 }]}>DEMO PIN 1234</Text>
      </Sheet>
    </>
  );
};

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
        <View style={st.sheetTitleRow}>
          <Text style={[T.label, { flex: 1, color: C.ink }]}>{title}</Text>
          <Pressable onPress={onClose} style={st.sheetClose}>
            <Ionicons name="chevron-down-outline" size={18} color={C.inkDim} />
          </Pressable>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={st.sheetBody}>
          {children}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

export const Input = ({ mono, style, onFocus, onBlur, ...props }: React.ComponentProps<typeof TextInput> & {
  mono?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      placeholderTextColor={C.inkFaint}
      selectionColor={C.brass}
      {...props}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      style={[
        st.input,
        mono ? { ...T.monoMd, fontSize: 16 } : { ...T.body, fontSize: 16 },
        { color: C.ink, borderColor: focused ? C.brass : C.rule },
        style,
      ]}
    />
  );
};

export const Label = ({ children }: { children: React.ReactNode }) => (
  <Text style={[T.micro, { color: C.inkFaint, marginBottom: 7 }]}>{children}</Text>
);

export const Row = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }, style]}>
    {children}
  </View>
);

export type BadgeKind = 'inPlay' | 'free' | 'live' | 'signup' | 'finished' | 'monthlyPass' | 'regular';

export const Badge = ({ kind, label }: { kind: BadgeKind; label: string }) => {
  const textColor: Record<BadgeKind, string> = {
    inPlay: C.liveInk,
    live: C.liveInk,
    free: C.feltText,
    signup: C.brass,
    finished: C.inkDim,
    monthlyPass: C.brassInk,
    regular: C.inkDim,
  };
  const fillStyle: Record<BadgeKind, ViewStyle> = {
    inPlay: { backgroundColor: C.live },
    live: { backgroundColor: C.live },
    free: { borderWidth: S.rule, borderColor: C.felt },
    signup: { borderWidth: S.rule, borderColor: C.brass },
    finished: { backgroundColor: C.rule },
    monthlyPass: { backgroundColor: C.brass },
    regular: { borderWidth: S.rule, borderColor: C.rule },
  };
  return (
    <View style={[st.badge, fillStyle[kind]]}>
      {kind === 'inPlay' ? <View style={st.liveDot} /> : null}
      <Text style={[T.nano, { color: textColor[kind] }]}>{label}</Text>
    </View>
  );
};

export const Empty = ({ heading, body }: { heading: string; body: string }) => (
  <View style={st.empty}>
    <Text style={[T.label, { color: C.inkDim }]}>{heading}</Text>
    <Text style={[T.bodySm, { fontSize: 13, color: C.inkFaint }]}>{body}</Text>
  </View>
);

export const StatTile = ({ label, value, tone = 'ink' }: {
  label: string;
  value: string;
  tone?: 'brass' | 'live' | 'ink';
}) => (
  <View style={st.statTile}>
    <Text style={[T.micro, { color: C.inkFaint }]}>{label}</Text>
    <Text
      style={{
        ...T.monoLg,
        fontSize: 30,
        marginTop: 6,
        color: tone === 'brass' ? C.brass : tone === 'live' ? C.live : C.ink,
      }}
    >
      {value}
    </Text>
  </View>
);

export const ListRow = ({ leading, title, meta, trailing }: {
  leading?: string;
  title: string;
  meta?: string;
  trailing?: React.ReactNode;
}) => (
  <View style={st.listRow}>
    {leading ? <Text style={[T.monoMd, { width: 62, color: C.brass }]}>{leading}</Text> : null}
    <View style={{ flex: 1, minWidth: 0 }}>
      <Text style={[T.body, { color: C.ink }]} numberOfLines={1}>
        {title}
      </Text>
      {meta ? (
        <Text style={[T.micro, { color: C.inkFaint, marginTop: 3 }]} numberOfLines={1}>
          {meta}
        </Text>
      ) : null}
    </View>
    {trailing}
  </View>
);

const st = StyleSheet.create({
  header: {
    height: S.statusBar + S.header,
    paddingTop: S.statusBar + 8,
    paddingHorizontal: S.s5,
    paddingBottom: 14,
    borderBottomWidth: S.rule,
    borderBottomColor: C.rule,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  btn: {
    justifyContent: 'center',
  },
  chip: {
    minHeight: S.tapMin,
    borderWidth: S.rule,
    borderColor: C.rule,
    backgroundColor: 'transparent',
    paddingHorizontal: 13,
    justifyContent: 'center',
  },
  segmented: {
    flexDirection: 'row',
    borderWidth: S.rule,
    borderColor: C.rule,
  },
  segmentedCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffPill: {
    height: 36,
    paddingHorizontal: 10,
    borderWidth: S.rule,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pinCell: {
    flex: 1,
    height: 56,
    borderWidth: S.rule,
    borderColor: C.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  padKey: {
    width: 56,
    height: 56,
    borderWidth: S.rule,
    borderColor: C.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: { flex: 1, backgroundColor: C.scrim },
  sheet: {
    backgroundColor: C.surface,
    borderTopWidth: S.ruleAccent,
    borderTopColor: C.brass,
    borderRadius: 0,
    maxHeight: '85%',
  },
  sheetTitleRow: {
    height: 72,
    paddingHorizontal: S.s5,
    paddingVertical: 16,
    borderBottomWidth: S.rule,
    borderBottomColor: C.rule,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetClose: {
    height: 36,
    paddingHorizontal: 10,
    borderWidth: S.rule,
    borderColor: C.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBody: {
    paddingTop: 18,
    paddingBottom: 26,
    paddingHorizontal: S.s5,
    gap: 16,
  },
  input: {
    height: 48,
    backgroundColor: C.surface,
    borderWidth: S.rule,
    paddingHorizontal: 14,
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 7,
    height: 7,
    backgroundColor: C.liveInk,
    marginRight: 6,
  },
  empty: {
    borderWidth: S.rule,
    borderStyle: 'dashed',
    borderColor: C.rule,
    paddingVertical: 22,
    paddingHorizontal: 18,
    gap: 6,
  },
  statTile: {
    width: '50%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRightWidth: S.rule,
    borderBottomWidth: S.rule,
    borderColor: C.rule,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 13,
    paddingHorizontal: S.s5,
    borderTopWidth: S.rule,
    borderTopColor: C.rule,
  },
});
