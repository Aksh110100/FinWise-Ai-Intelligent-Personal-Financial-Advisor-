export interface Budget {
  id: string;
  category: string;
  limit: number;
  month: string; // e.g., "August 2026"
  note?: string;
  createdAt: string;
}

export const mockBudgets: Budget[] = [
  {
    id: "b-1",
    category: "Housing",
    limit: 20000,
    month: "August 2026",
    createdAt: new Date(2026, 7, 1).toISOString(),
  },
  {
    id: "b-2",
    category: "Food",
    limit: 12000,
    month: "August 2026",
    createdAt: new Date(2026, 7, 1).toISOString(),
  },
  {
    id: "b-3",
    category: "Transport",
    limit: 7000,
    month: "August 2026",
    createdAt: new Date(2026, 7, 1).toISOString(),
  },
  {
    id: "b-4",
    category: "Shopping",
    limit: 6000,
    month: "August 2026",
    createdAt: new Date(2026, 7, 1).toISOString(),
  },
  {
    id: "b-5",
    category: "Entertainment",
    limit: 4000,
    month: "August 2026",
    createdAt: new Date(2026, 7, 1).toISOString(),
  },
  {
    id: "b-6",
    category: "Subscriptions",
    limit: 3000,
    month: "August 2026",
    createdAt: new Date(2026, 7, 1).toISOString(),
  }
];

export const AVAILABLE_CATEGORIES = [
  "Housing",
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Subscriptions",
  "Health",
  "Education",
  "Other"
];

export const generateMonthString = (date: Date) => {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};
