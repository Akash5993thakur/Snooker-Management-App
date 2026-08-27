import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Booking,
  ClubState,
  ClubTable,
  Match,
  Member,
  MemberPlan,
  SaleRecord,
  Tournament,
} from './types';

const STORAGE_KEY = 'kakul-club-state-v1';

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const todayISO = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

export const fmtHour = (h: number) => {
  const suffix = h >= 12 ? 'PM' : 'AM';
  let hh = h % 12;
  if (hh === 0) hh = 12;
  return `${hh} ${suffix}`;
};

export const fmtMoney = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export const fmtDuration = (ms: number) => {
  const mins = Math.floor(ms / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const defaultState = (): ClubState => ({
  clubName: 'Kakul Snooker & Pool Club',
  openHour: 10,
  closeHour: 23,
  staffPin: '1234',
  tables: [
    { id: 't1', name: 'Snooker 1', type: 'snooker', hourlyRate: 200, sessionStart: null, sessionCustomer: '', sessionMemberId: null },
    { id: 't2', name: 'Snooker 2', type: 'snooker', hourlyRate: 200, sessionStart: null, sessionCustomer: '', sessionMemberId: null },
    { id: 't3', name: 'Snooker 3', type: 'snooker', hourlyRate: 200, sessionStart: null, sessionCustomer: '', sessionMemberId: null },
    { id: 't4', name: 'Pool 1', type: 'pool', hourlyRate: 150, sessionStart: null, sessionCustomer: '', sessionMemberId: null },
    { id: 't5', name: 'Pool 2', type: 'pool', hourlyRate: 150, sessionStart: null, sessionCustomer: '', sessionMemberId: null },
  ],
  bookings: [],
  members: [],
  sales: [],
  tournaments: [],
});

interface Store {
  state: ClubState;
  loaded: boolean;
  staffMode: boolean;
  setStaffMode: (on: boolean) => void;
  // tables
  startSession: (tableId: string, customer: string, memberId: string | null) => void;
  stopSession: (tableId: string) => SaleRecord | null;
  setTableRate: (tableId: string, rate: number) => void;
  addTable: (name: string, type: 'snooker' | 'pool', rate: number) => void;
  // bookings
  addBooking: (b: Omit<Booking, 'id' | 'createdAt'>) => string | null;
  cancelBooking: (id: string) => void;
  // members
  addMember: (name: string, phone: string, plan: MemberPlan) => void;
  // tournaments
  addTournament: (name: string, dateISO: string, entryFee: number) => void;
  addPlayer: (tid: string, player: string) => void;
  startTournament: (tid: string) => void;
  recordWinner: (tid: string, matchId: string, winner: string) => void;
}

const Ctx = createContext<Store | null>(null);

const pairRound = (players: string[], round: number): Match[] => {
  const matches: Match[] = [];
  for (let i = 0; i < players.length; i += 2) {
    matches.push({
      id: uid(),
      round,
      p1: players[i],
      p2: i + 1 < players.length ? players[i + 1] : null,
      winner: i + 1 < players.length ? null : players[i], // bye auto-advances
    });
  }
  return matches;
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ClubState>(defaultState);
  const [loaded, setLoaded] = useState(false);
  const [staffMode, setStaffMode] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<ClubState>;
          setState({ ...defaultState(), ...saved });
        }
      } catch {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, loaded]);

  const startSession = useCallback((tableId: string, customer: string, memberId: string | null) => {
    setState((s) => ({
      ...s,
      tables: s.tables.map((t) =>
        t.id === tableId
          ? { ...t, sessionStart: Date.now(), sessionCustomer: customer || 'Walk-in', sessionMemberId: memberId }
          : t
      ),
    }));
  }, []);

  const stopSession = useCallback((tableId: string): SaleRecord | null => {
    const s = stateRef.current;
    const table = s.tables.find((t) => t.id === tableId);
    if (!table || table.sessionStart == null) return null;
    const endedAt = Date.now();
    const minutes = Math.max(1, Math.round((endedAt - table.sessionStart) / 60000));
    const amount = Math.round((minutes * table.hourlyRate) / 60);
    const sale: SaleRecord = {
      id: uid(),
      tableId,
      tableName: table.name,
      customer: table.sessionCustomer,
      memberId: table.sessionMemberId,
      startedAt: table.sessionStart,
      endedAt,
      minutes,
      amount,
    };
    setState((prev) => ({
      ...prev,
      sales: [sale, ...prev.sales],
      tables: prev.tables.map((t) =>
        t.id === tableId
          ? { ...t, sessionStart: null, sessionCustomer: '', sessionMemberId: null }
          : t
      ),
      members: prev.members.map((m) =>
        m.id === table.sessionMemberId
          ? { ...m, visits: m.visits + 1, points: m.points + Math.floor(amount / 100) * 10 }
          : m
      ),
    }));
    return sale;
  }, []);

  const setTableRate = useCallback((tableId: string, rate: number) => {
    setState((s) => ({
      ...s,
      tables: s.tables.map((t) => (t.id === tableId ? { ...t, hourlyRate: rate } : t)),
    }));
  }, []);

  const addTable = useCallback((name: string, type: 'snooker' | 'pool', rate: number) => {
    setState((s) => ({
      ...s,
      tables: [
        ...s.tables,
        { id: uid(), name, type, hourlyRate: rate, sessionStart: null, sessionCustomer: '', sessionMemberId: null },
      ],
    }));
  }, []);

  const addBooking = useCallback((b: Omit<Booking, 'id' | 'createdAt'>): string | null => {
    const s = stateRef.current;
    const clash = s.bookings.some(
      (x) => x.tableId === b.tableId && x.dateISO === b.dateISO && x.hour === b.hour
    );
    if (clash) return 'That slot is already booked. Please pick another.';
    setState((prev) => ({
      ...prev,
      bookings: [...prev.bookings, { ...b, id: uid(), createdAt: Date.now() }],
    }));
    return null;
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setState((s) => ({ ...s, bookings: s.bookings.filter((b) => b.id !== id) }));
  }, []);

  const addMember = useCallback((name: string, phone: string, plan: MemberPlan) => {
    const m: Member = {
      id: uid(),
      name,
      phone,
      plan,
      joinedISO: todayISO(),
      visits: 0,
      points: 0,
    };
    setState((s) => ({ ...s, members: [m, ...s.members] }));
  }, []);

  const addTournament = useCallback((name: string, dateISO: string, entryFee: number) => {
    const t: Tournament = {
      id: uid(),
      name,
      dateISO,
      entryFee,
      players: [],
      matches: [],
      status: 'signup',
      champion: null,
    };
    setState((s) => ({ ...s, tournaments: [t, ...s.tournaments] }));
  }, []);

  const addPlayer = useCallback((tid: string, player: string) => {
    setState((s) => ({
      ...s,
      tournaments: s.tournaments.map((t) =>
        t.id === tid && t.status === 'signup' && !t.players.includes(player)
          ? { ...t, players: [...t.players, player] }
          : t
      ),
    }));
  }, []);

  const startTournament = useCallback((tid: string) => {
    setState((s) => ({
      ...s,
      tournaments: s.tournaments.map((t) => {
        if (t.id !== tid || t.players.length < 2) return t;
        return { ...t, status: 'running', matches: pairRound(t.players, 1) };
      }),
    }));
  }, []);

  const recordWinner = useCallback((tid: string, matchId: string, winner: string) => {
    setState((s) => ({
      ...s,
      tournaments: s.tournaments.map((t) => {
        if (t.id !== tid) return t;
        let matches = t.matches.map((m) => (m.id === matchId ? { ...m, winner } : m));
        const maxRound = Math.max(...matches.map((m) => m.round));
        const current = matches.filter((m) => m.round === maxRound);
        if (current.every((m) => m.winner != null)) {
          const winners = current.map((m) => m.winner as string);
          if (winners.length === 1) {
            return { ...t, matches, status: 'finished', champion: winners[0] };
          }
          matches = [...matches, ...pairRound(winners, maxRound + 1)];
        }
        return { ...t, matches };
      }),
    }));
  }, []);

  const value = useMemo<Store>(
    () => ({
      state,
      loaded,
      staffMode,
      setStaffMode,
      startSession,
      stopSession,
      setTableRate,
      addTable,
      addBooking,
      cancelBooking,
      addMember,
      addTournament,
      addPlayer,
      startTournament,
      recordWinner,
    }),
    [state, loaded, staffMode, startSession, stopSession, setTableRate, addTable, addBooking, cancelBooking, addMember, addTournament, addPlayer, startTournament, recordWinner]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
};
