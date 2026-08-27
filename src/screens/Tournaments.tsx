import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { C } from '../theme';
import { Btn, Card, Chip, Empty, Input, Label, Row, Screen, Sheet } from '../ui';
import { fmtMoney, todayISO, useStore } from '../store';
import { Tournament } from '../types';

const MatchRow = ({ t, matchId }: { t: Tournament; matchId: string }) => {
  const { staffMode, recordWinner } = useStore();
  const m = t.matches.find((x) => x.id === matchId);
  if (!m) return null;
  return (
    <View style={{ marginBottom: 8 }}>
      <Row>
        <Text style={{ color: C.text, flex: 1 }} numberOfLines={1}>
          {m.p1} vs {m.p2 ?? '(bye)'}
        </Text>
        {m.winner ? (
          <Text style={{ color: C.gold, fontWeight: '800', fontSize: 13 }}>🏆 {m.winner}</Text>
        ) : staffMode && m.p2 ? (
          <Row>
            <Btn label={m.p1} small kind="ghost" onPress={() => recordWinner(t.id, m.id, m.p1)} />
            <Btn label={m.p2} small kind="ghost" onPress={() => recordWinner(t.id, m.id, m.p2 as string)} />
          </Row>
        ) : (
          <Text style={{ color: C.textFaint, fontSize: 12 }}>waiting</Text>
        )}
      </Row>
    </View>
  );
};

export default function Tournaments() {
  const { state, staffMode, addTournament, addPlayer, startTournament } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState(todayISO(7));
  const [fee, setFee] = useState('100');
  const [playerText, setPlayerText] = useState<Record<string, string>>({});

  const save = () => {
    if (!name.trim()) return;
    addTournament(name.trim(), date, parseInt(fee, 10) || 0);
    setOpen(false);
    setName('');
  };

  return (
    <Screen
      title="Tournaments"
      subtitle="Knockout events at the club"
      right={staffMode ? <Btn label="+ New" small onPress={() => setOpen(true)} /> : undefined}
    >
      {state.tournaments.length === 0 ? (
        <Empty text="No tournaments yet. Staff can create one with + New." />
      ) : (
        state.tournaments.map((t) => {
          const rounds = [...new Set(t.matches.map((m) => m.round))].sort((a, b) => a - b);
          return (
            <Card key={t.id}>
              <Row>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.text, fontWeight: '800', fontSize: 16 }}>{t.name}</Text>
                  <Text style={{ color: C.textDim, fontSize: 12, marginTop: 2 }}>
                    {t.dateISO} · entry {fmtMoney(t.entryFee)} · {t.players.length} players
                  </Text>
                </View>
                <Text style={{ color: t.status === 'finished' ? C.gold : C.green, fontWeight: '800', fontSize: 12 }}>
                  {t.status === 'signup' ? 'SIGN-UPS OPEN' : t.status === 'running' ? 'LIVE' : 'FINISHED'}
                </Text>
              </Row>

              {t.champion && (
                <Text style={{ color: C.gold, fontWeight: '800', marginTop: 10, fontSize: 15 }}>
                  🏆 Champion: {t.champion}
                </Text>
              )}

              {t.status === 'signup' && (
                <View style={{ marginTop: 10 }}>
                  {t.players.length > 0 && (
                    <Text style={{ color: C.textDim, fontSize: 13, marginBottom: 8 }}>
                      Players: {t.players.join(', ')}
                    </Text>
                  )}
                  <Row>
                    <Input
                      value={playerText[t.id] ?? ''}
                      onChangeText={(v) => setPlayerText((p) => ({ ...p, [t.id]: v }))}
                      placeholder="Player name"
                      style={{ flex: 1, marginBottom: 0 }}
                    />
                    <Btn
                      label="Join"
                      small
                      onPress={() => {
                        const v = (playerText[t.id] ?? '').trim();
                        if (v) {
                          addPlayer(t.id, v);
                          setPlayerText((p) => ({ ...p, [t.id]: '' }));
                        }
                      }}
                    />
                  </Row>
                  {staffMode && (
                    <View style={{ marginTop: 10 }}>
                      <Btn
                        label={`Start bracket (${t.players.length} players)`}
                        kind="gold"
                        disabled={t.players.length < 2}
                        onPress={() => startTournament(t.id)}
                      />
                    </View>
                  )}
                </View>
              )}

              {rounds.map((r) => (
                <View key={r} style={{ marginTop: 12 }}>
                  <Text style={{ color: C.textFaint, fontWeight: '800', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                    Round {r}
                  </Text>
                  {t.matches.filter((m) => m.round === r).map((m) => (
                    <MatchRow key={m.id} t={t} matchId={m.id} />
                  ))}
                </View>
              ))}
            </Card>
          );
        })
      )}

      <Sheet visible={open} onClose={() => setOpen(false)} title="New tournament">
        <Label>Name</Label>
        <Input value={name} onChangeText={setName} placeholder="e.g. Monsoon Cup" />
        <Label>Date (YYYY-MM-DD)</Label>
        <Input value={date} onChangeText={setDate} />
        <Label>Entry fee (₹)</Label>
        <Input value={fee} onChangeText={setFee} keyboardType="number-pad" />
        <Btn label="Create tournament" onPress={save} />
      </Sheet>
    </Screen>
  );
}
