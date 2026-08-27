export type TableType = 'snooker' | 'pool';

export interface ClubTable {
  id: string;
  name: string;
  type: TableType;
  hourlyRate: number; // ₹ per hour
  sessionStart: number | null; // epoch ms when current session started
  sessionCustomer: string; // walk-in name or member name
  sessionMemberId: string | null;
}

export interface Booking {
  id: string;
  tableId: string;
  dateISO: string; // YYYY-MM-DD
  hour: number; // 24h start hour, 1-hour slot
  customerName: string;
  phone: string;
  createdAt: number;
}

export type MemberPlan = 'Regular' | 'Monthly Pass';

export interface Member {
  id: string;
  name: string;
  phone: string;
  plan: MemberPlan;
  joinedISO: string;
  visits: number;
  points: number;
}

export interface SaleRecord {
  id: string;
  tableId: string;
  tableName: string;
  customer: string;
  memberId: string | null;
  startedAt: number;
  endedAt: number;
  minutes: number;
  amount: number; // ₹
}

export interface Match {
  id: string;
  round: number;
  p1: string;
  p2: string | null; // null = bye
  winner: string | null;
}

export type TournamentStatus = 'signup' | 'running' | 'finished';

export interface Tournament {
  id: string;
  name: string;
  dateISO: string;
  entryFee: number;
  players: string[];
  matches: Match[];
  status: TournamentStatus;
  champion: string | null;
}

export interface ClubState {
  tables: ClubTable[];
  bookings: Booking[];
  members: Member[];
  sales: SaleRecord[];
  tournaments: Tournament[];
  clubName: string;
  openHour: number;
  closeHour: number;
  staffPin: string;
}
