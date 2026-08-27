import React from 'react';
import { Text, View } from 'react-native';
import { C, S, T } from '../theme';
import { Empty, ListRow, Screen, StatTile } from '../ui';
import { fmtHour, fmtMoney, todayISO, useStore } from '../store';

const SectionHeader = ({ title, count }: { title: string; count?: string }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 13,
      paddingHorizontal: S.s5,
      borderTopWidth: S.rule,
      borderTopColor: C.rule,
      marginTop: S.s6,
    }}
  >
    <Text style={[T.label, { color: C.ink }]}>{title}</Text>
    {count ? <Text style={[T.bodySm, { color: C.inkFaint }]}>{count}</Text> : null}
  </View>
);

export default function Dashboard() {
  const { state, staffMode } = useStore();
  const today = todayISO();

  const activeTables = state.tables.filter((t) => t.sessionStart != null);
  const todaySales = state.sales.filter(
    (s) => new Date(s.endedAt).toDateString() === new Date().toDateString()
  );
  const todayEarnings = todaySales.reduce((a, s) => a + s.amount, 0);
  const todayBookings = state.bookings
    .filter((b) => b.dateISO === today)
    .sort((a, b) => a.hour - b.hour);
  const upcomingTournaments = state.tournaments.filter((t) => t.status !== 'finished');

  const weekday = new Date()
    .toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
    .replace(',', '');

  return (
    <Screen
      title="Kakul"
      subtitle={`OPEN ${fmtHour(state.openHour)} – ${fmtHour(state.closeHour)} · ${weekday}`}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <StatTile
          label="In play"
          value={`${activeTables.length}/${state.tables.length}`}
          tone={activeTables.length > 0 ? 'live' : 'ink'}
        />
        <StatTile label="Bookings today" value={`${todayBookings.length}`} tone="ink" />
        {staffMode && (
          <>
            <StatTile label="Earnings today" value={fmtMoney(todayEarnings)} tone="brass" />
            <StatTile label="Members" value={`${state.members.length}`} tone="ink" />
          </>
        )}
      </View>

      <SectionHeader title="Today's bookings" count={`${todayBookings.length} today`} />
      {todayBookings.length === 0 ? (
        <View style={{ paddingHorizontal: S.s5, paddingTop: S.s4 }}>
          <Empty heading="NO BOOKINGS YET" body="Slots open from 10 AM. Book one from the Book tab." />
        </View>
      ) : (
        todayBookings.map((b) => {
          const table = state.tables.find((t) => t.id === b.tableId);
          return <ListRow key={b.id} leading={fmtHour(b.hour)} title={b.customerName} meta={table?.name} />;
        })
      )}

      <SectionHeader title="Tournaments" />
      {upcomingTournaments.length === 0 ? (
        <View style={{ paddingHorizontal: S.s5, paddingTop: S.s4 }}>
          <Empty heading="NO TOURNAMENTS" body="Staff can add one from this screen." />
        </View>
      ) : (
        upcomingTournaments.map((t) => (
          <ListRow
            key={t.id}
            title={t.name}
            meta={`${t.dateISO} · ${t.players.length} PLAYERS · ${fmtMoney(t.entryFee)} · ${
              t.status === 'signup' ? 'SIGN-UPS OPEN' : 'LIVE'
            }`}
          />
        ))
      )}

      {staffMode && (
        <>
          <SectionHeader title="Recent billing" />
          {todaySales.length === 0 ? (
            <View style={{ paddingHorizontal: S.s5, paddingTop: S.s4 }}>
              <Empty heading="NOTHING BILLED TODAY" body="Sessions you stop will show up here." />
            </View>
          ) : (
            todaySales.slice(0, 6).map((s) => (
              <ListRow
                key={s.id}
                title={s.customer}
                meta={`${s.tableName} · ${s.minutes} MIN`}
                trailing={<Text style={[T.monoMd, { color: C.brass }]}>{fmtMoney(s.amount)}</Text>}
              />
            ))
          )}
        </>
      )}
    </Screen>
  );
}
