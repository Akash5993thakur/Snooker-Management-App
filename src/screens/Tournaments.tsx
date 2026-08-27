import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View, ViewStyle } from 'react-native';
import { C, S, T } from '../theme';
import { Badge, Btn, Chip, Empty, Input, Label, Row, Screen, SegmentedControl, Sheet } from '../ui';
import { fmtMoney, todayISO, useStore } from '../store';
import { Match, Tournament } from '../types';

const roundRowStyle = (won: boolean, divider: boolean): ViewStyle => ({
  height: 46,
  paddingHorizontal: 14,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: won ? C.brass : 'transparent',
  borderBottomWidth: divider ? S.rule : 0,
  borderBottomColor: C.rule,
});

const MatchCard = ({ t, m }: { t: Tournament; m: Match }) => {
  const { staffMode, recordWinner } = useStore();
  const isBye = m.p2 === null;
  const decided = m.winner != null;
  const p1Won = m.winner === m.p1;
  const p2Won = decided && m.winner === m.p2;

  const row1 = (
    <View style={roundRowStyle(p1Won, true)}>
      <Text style={{ ...T.body, fontSize: 15, color: p1Won ? C.brassInk : decided ? C.inkFaint : C.ink }}>
        {m.p1}
      </Text>
      {p1Won ? <Text style={[T.nano, { color: C.brassInk }]}>WON</Text> : null}
    </View>
  );
  const row2 = isBye ? (
    <View style={roundRowStyle(false, false)}>
      <Text style={{ ...T.body, fontSize: 15, color: C.inkMute }}>Bye</Text>
      <Text style={[T.nano, { color: C.inkFaint }]}>AUTO</Text>
    </View>
  ) : (
    <View style={roundRowStyle(p2Won, false)}>
      <Text style={{ ...T.body, fontSize: 15, color: p2Won ? C.brassInk : decided ? C.inkFaint : C.ink }}>
        {m.p2}
      </Text>
      {p2Won ? <Text style={[T.nano, { color: C.brassInk }]}>WON</Text> : null}
    </View>
  );

  return (
    <View style={{ borderWidth: S.rule, borderColor: C.rule }}>
      {!decided && staffMode ? (
        <Pressable onPress={() => recordWinner(t.id, m.id, m.p1)}>{row1}</Pressable>
      ) : (
        row1
      )}
      {!decided && staffMode && !isBye ? (
        <Pressable onPress={() => recordWinner(t.id, m.id, m.p2 as string)}>{row2}</Pressable>
      ) : (
        row2
      )}
    </View>
  );
};

const BracketRow = ({ label, won, decided, divider }: {
  label: string;
  won: boolean;
  decided: boolean;
  divider?: boolean;
}) => (
  <View
    style={{
      height: 34,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: won ? C.brass : 'transparent',
      borderTopWidth: divider ? S.rule : 0,
      borderTopColor: C.rule,
    }}
  >
    <Text style={{ ...T.body, fontSize: 13, color: won ? C.brassInk : decided ? C.inkFaint : C.ink }}>
      {label}
    </Text>
  </View>
);

const TournamentCard = ({ t }: { t: Tournament }) => {
  const { staffMode, addPlayer, startTournament } = useStore();
  const [playerText, setPlayerText] = useState('');
  const [view, setView] = useState<'rounds' | 'bracket'>('rounds');
  const rounds = [...new Set(t.matches.map((m) => m.round))].sort((a, b) => a - b);

  return (
    <View style={{ borderBottomWidth: S.rule, borderBottomColor: C.rule }}>
      <View style={{ paddingVertical: 16, paddingHorizontal: S.s5 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text style={{ ...T.h3, fontSize: 20, color: C.ink }}>{t.name}</Text>
          {t.status === 'signup' && <Badge kind="signup" label="SIGN-UPS OPEN" />}
          {t.status === 'running' && <Badge kind="live" label="LIVE" />}
          {t.status === 'finished' && <Badge kind="finished" label="FINISHED" />}
        </Row>
        <Row style={{ marginTop: 8, gap: 16 }}>
          <Text style={[T.micro, { color: C.inkFaint }]}>{t.dateISO}</Text>
          <Text style={[T.micro, { color: C.inkFaint }]}>{t.players.length} PLAYERS</Text>
          <Text style={[T.micro, { color: C.inkFaint }]}>{fmtMoney(t.entryFee)} ENTRY</Text>
        </Row>
      </View>

      {t.status === 'finished' && t.champion && (
        <View style={{ backgroundColor: C.brass, paddingVertical: S.s5, paddingHorizontal: S.s5, gap: 4 }}>
          <Text style={[T.micro, { color: C.brassInk }]}>CHAMPION</Text>
          <Text style={{ ...T.display, fontSize: 24, color: C.brassInk }}>{t.champion}</Text>
        </View>
      )}

      {t.status === 'signup' && (
        <View style={{ paddingHorizontal: S.s5, paddingBottom: S.s5, gap: S.s4 }}>
          {t.players.length > 0 && (
            <Row>
              {t.players.map((p) => (
                <Chip key={p} label={p} style={{ paddingVertical: 7, paddingHorizontal: 10 }} />
              ))}
            </Row>
          )}
          <Row>
            <Input value={playerText} onChangeText={setPlayerText} placeholder="Player name" style={{ flex: 1 }} />
            <Btn
              kind="secondary"
              label="Add"
              onPress={() => {
                const v = playerText.trim();
                if (v) {
                  addPlayer(t.id, v);
                  setPlayerText('');
                }
              }}
            />
          </Row>
          {staffMode && (
            <Btn
              kind="primary"
              label="Start bracket"
              disabled={t.players.length < 2}
              onPress={() => startTournament(t.id)}
            />
          )}
        </View>
      )}

      {t.status === 'running' && (
        <View style={{ paddingHorizontal: S.s5, paddingBottom: S.s5 }}>
          <SegmentedControl
            compact
            options={[
              { label: 'Rounds', value: 'rounds' as const },
              { label: 'Bracket', value: 'bracket' as const },
            ]}
            value={view}
            onChange={setView}
          />
          {view === 'rounds' ? (
            <View style={{ marginTop: S.s4, gap: S.s4 }}>
              {rounds.map((r) => (
                <View key={r}>
                  <Text
                    style={[
                      T.micro,
                      { color: C.inkFaint, paddingBottom: 8, borderBottomWidth: S.rule, borderBottomColor: C.rule },
                    ]}
                  >
                    ROUND {r}
                  </Text>
                  <View style={{ gap: S.s3, marginTop: S.s3 }}>
                    {t.matches.filter((m) => m.round === r).map((m) => (
                      <MatchCard key={m.id} t={t} m={m} />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 14, marginTop: S.s4 }}
            >
              {rounds.map((r) => (
                <View key={r} style={{ width: 168 }}>
                  <Text style={[T.micro, { color: C.inkFaint }]}>ROUND {r}</Text>
                  <View style={{ marginTop: 8, gap: 8 }}>
                    {t.matches
                      .filter((m) => m.round === r)
                      .map((m) => (
                        <View key={m.id} style={{ borderWidth: S.rule, borderColor: C.rule }}>
                          <BracketRow label={m.p1} won={m.winner === m.p1} decided={m.winner != null} />
                          <BracketRow
                            label={m.p2 ?? 'Bye'}
                            won={m.winner != null && m.winner === m.p2}
                            decided={m.winner != null}
                            divider
                          />
                        </View>
                      ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

export default function Tournaments() {
  const { state, staffMode, addTournament } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState(todayISO(7));
  const [fee, setFee] = useState('100');

  const save = () => {
    if (!name.trim()) return;
    addTournament(name.trim(), date, parseInt(fee, 10) || 0);
    setOpen(false);
    setName('');
  };

  const statusOrder: Record<Tournament['status'], number> = { running: 0, signup: 1, finished: 2 };
  const sorted = [...state.tournaments].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  return (
    <Screen
      title="Tourney"
      subtitle="KNOCKOUT · SINGLE ELIMINATION"
      headerAction={staffMode ? <Btn kind="ghost" label="+ New" onPress={() => setOpen(true)} /> : undefined}
    >
      {state.tournaments.length === 0 ? (
        <View style={{ paddingHorizontal: S.s5 }}>
          <Empty heading="NO TOURNAMENTS" body="Staff can add one from this screen." />
        </View>
      ) : (
        sorted.map((t) => <TournamentCard key={t.id} t={t} />)
      )}

      <Sheet visible={open} onClose={() => setOpen(false)} title="NEW TOURNAMENT">
        <View>
          <Label>Name</Label>
          <Input value={name} onChangeText={setName} placeholder="e.g. Monsoon Cup" />
        </View>
        <View>
          <Label>Date (YYYY-MM-DD)</Label>
          <Input value={date} onChangeText={setDate} mono />
        </View>
        <View>
          <Label>Entry fee (₹)</Label>
          <Input value={fee} onChangeText={setFee} keyboardType="number-pad" mono />
        </View>
        <Btn kind="primary" size="sheet" label="Create tournament" onPress={save} />
      </Sheet>
    </Screen>
  );
}
