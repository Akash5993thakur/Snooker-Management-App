import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { C } from '../theme';
import { Card, Empty, Row, Screen } from '../ui';
import { fmtHour, fmtMoney, todayISO, useStore } from '../store';

const Stat = ({ label, value, accent }: { label: string; value: string; accent?: string }) => (
  <Card style={{ flex: 1, marginBottom: 0 }}>
    <Text style={{ color: accent || C.green, fontSize: 22, fontWeight: '800' }}>{value}</Text>
    <Text style={{ color: C.textDim, fontSize: 12, marginTop: 4 }}>{label}</Text>
  </Card>
);

export default function Dashboard() {
  const { state, staffMode } = useStore();
  const today = todayISO();

  const activeTables = state.tables.filter((t) => t.sessionStart != null);
  const todaySales = state.sales.filter((s) => new Date(s.endedAt).toDateString() === new Date().toDateString());
  const todayEarnings = todaySales.reduce((a, s) => a + s.amount, 0);
  const todayBookings = state.bookings
    .filter((b) => b.dateISO === today)
    .sort((a, b) => a.hour - b.hour);
  const upcomingTournaments = state.tournaments.filter((t) => t.status !== 'finished');

  return (
    <Screen title={state.clubName} subtitle={`Open ${fmtHour(state.openHour)} – ${fmtHour(state.closeHour)} · Today ${today}`}>
      <Row style={{ marginBottom: 12 }}>
        <Stat label="Tables in play" value={`${activeTables.length}/${state.tables.length}`} />
        <Stat label="Bookings today" value={`${todayBookings.length}`} accent={C.blue} />
      </Row>
      {staffMode && (
        <Row style={{ marginBottom: 12 }}>
          <Stat label="Earnings today" value={fmtMoney(todayEarnings)} accent={C.gold} />
          <Stat label="Members" value={`${state.members.length}`} accent={C.text} />
        </Row>
      )}

      <Text style={st.section}>Today's bookings</Text>
      {todayBookings.length === 0 ? (
        <Empty text="No bookings yet today. Book a table from the Book tab." />
      ) : (
        todayBookings.map((b) => {
          const table = state.tables.find((t) => t.id === b.tableId);
          return (
            <Card key={b.id}>
              <Row>
                <Text style={{ color: C.gold, fontWeight: '800', width: 64 }}>{fmtHour(b.hour)}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.text, fontWeight: '700' }}>{b.customerName}</Text>
                  <Text style={{ color: C.textDim, fontSize: 12 }}>{table?.name ?? 'Table'}</Text>
                </View>
              </Row>
            </Card>
          );
        })
      )}

      <Text style={st.section}>Tournaments</Text>
      {upcomingTournaments.length === 0 ? (
        <Empty text="No tournament coming up. Create one in the Tourney tab." />
      ) : (
        upcomingTournaments.map((t) => (
          <Card key={t.id}>
            <Text style={{ color: C.text, fontWeight: '700' }}>{t.name}</Text>
            <Text style={{ color: C.textDim, fontSize: 12, marginTop: 2 }}>
              {t.dateISO} · {t.players.length} players · entry {fmtMoney(t.entryFee)} ·{' '}
              {t.status === 'signup' ? 'sign-ups open' : 'in progress'}
            </Text>
          </Card>
        ))
      )}

      {staffMode && (
        <>
          <Text style={st.section}>Recent billing</Text>
          {todaySales.length === 0 ? (
            <Empty text="No sessions billed yet today." />
          ) : (
            todaySales.slice(0, 6).map((s) => (
              <Card key={s.id}>
                <Row>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: C.text, fontWeight: '700' }}>{s.customer}</Text>
                    <Text style={{ color: C.textDim, fontSize: 12 }}>
                      {s.tableName} · {s.minutes} min
                    </Text>
                  </View>
                  <Text style={{ color: C.gold, fontWeight: '800' }}>{fmtMoney(s.amount)}</Text>
                </Row>
              </Card>
            ))
          )}
        </>
      )}
    </Screen>
  );
}

const st = StyleSheet.create({
  section: {
    color: C.textDim,
    fontWeight: '800',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 14,
    marginBottom: 8,
  },
});
