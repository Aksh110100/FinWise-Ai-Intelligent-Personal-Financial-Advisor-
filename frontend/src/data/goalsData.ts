export interface Goal {
  id: string;
  name: string;
  category: 'Safety' | 'Personal' | 'Lifestyle' | 'Major Purchase' | 'Education' | 'Other';
  currentAmount: number;
  targetAmount: number;
  monthlyContribution: number;
  targetDate: string; // YYYY-MM
  priority: 'High' | 'Medium' | 'Low';
  status: 'ON TRACK' | 'AT RISK' | 'COMPLETED';
}

export const initialGoals: Goal[] = [
  {
    id: 'g1',
    name: 'EMERGENCY FUND',
    category: 'Safety',
    currentAmount: 72000,
    targetAmount: 150000,
    monthlyContribution: 12000,
    targetDate: '2026-12',
    priority: 'High',
    status: 'ON TRACK'
  },
  {
    id: 'g2',
    name: 'NEW LAPTOP',
    category: 'Personal',
    currentAmount: 72000,
    targetAmount: 120000,
    monthlyContribution: 8000,
    targetDate: '2027-06',
    priority: 'Medium',
    status: 'ON TRACK'
  },
  {
    id: 'g3',
    name: 'TRAVEL',
    category: 'Lifestyle',
    currentAmount: 32000,
    targetAmount: 80000,
    monthlyContribution: 5000,
    targetDate: '2027-03',
    priority: 'Medium',
    status: 'AT RISK'
  },
  {
    id: 'g4',
    name: 'HOME DOWN PAYMENT',
    category: 'Major Purchase',
    currentAmount: 240000,
    targetAmount: 1000000,
    monthlyContribution: 20000,
    targetDate: '2028-12',
    priority: 'High',
    status: 'ON TRACK'
  },
  {
    id: 'g5',
    name: 'NEW CAR',
    category: 'Major Purchase',
    currentAmount: 450000,
    targetAmount: 800000,
    monthlyContribution: 18000,
    targetDate: '2027-09',
    priority: 'Medium',
    status: 'ON TRACK'
  },
  {
    id: 'g6',
    name: 'VACATION',
    category: 'Lifestyle',
    currentAmount: 60000,
    targetAmount: 60000,
    monthlyContribution: 0,
    targetDate: '2026-07',
    priority: 'Low',
    status: 'COMPLETED'
  }
];

export const goalAnalytics = [
  { month: 'Jan', planned: 300000, actual: 305000 },
  { month: 'Feb', planned: 350000, actual: 360000 },
  { month: 'Mar', planned: 400000, actual: 410000 },
  { month: 'Apr', planned: 450000, actual: 440000 },
  { month: 'May', planned: 500000, actual: 490000 },
  { month: 'Jun', planned: 550000, actual: 526000 } // Current month approx sum
];

export const aiInsight = {
  title: "FINWISE AI NOTICED",
  message: "Your emergency fund is on track, but your travel goal may need an additional ₹2,000 per month to stay on schedule.",
  recommendedExtra: 2000
};
