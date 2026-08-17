export const savingsData = {
  summary: {
    totalSavedThisMonth: 30800,
    savingsRate: 36.2,
    lastMonthSaved: 26400,
    monthlyChange: 16.7,
    income: 85000,
    expenses: 54200,
  },
  
  growthData: {
    '7D': [
      { name: 'Mon', saved: 1000 },
      { name: 'Tue', saved: 2500 },
      { name: 'Wed', saved: 3200 },
      { name: 'Thu', saved: 4800 },
      { name: 'Fri', saved: 6000 },
      { name: 'Sat', saved: 7500 },
      { name: 'Sun', saved: 8200 },
    ],
    '1M': [
      { name: 'Week 1', saved: 5000 },
      { name: 'Week 2', saved: 12000 },
      { name: 'Week 3', saved: 21000 },
      { name: 'Week 4', saved: 30800 },
    ],
    '3M': [
      { name: 'Jul', saved: 74500 },
      { name: 'Aug', saved: 86000 },
      { name: 'Sep', saved: 94500 },
      { name: 'Oct', saved: 103000 },
    ],
    '6M': [
      { name: 'May', saved: 51500 },
      { name: 'Jun', saved: 63000 },
      { name: 'Jul', saved: 74500 },
      { name: 'Aug', saved: 86000 },
      { name: 'Sep', saved: 94500 },
      { name: 'Oct', saved: 103000 },
    ],
    '1Y': [
      { name: 'JAN', saved: 18000, rate: 30 },
      { name: 'FEB', saved: 24500, rate: 32 },
      { name: 'MAR', saved: 31200, rate: 31 },
      { name: 'APR', saved: 42000, rate: 33 },
      { name: 'MAY', saved: 51500, rate: 34 },
      { name: 'JUN', saved: 63000, rate: 35 },
      { name: 'JUL', saved: 74500, rate: 35.5 },
      { name: 'AUG', saved: 86000, rate: 36.2 },
      { name: 'SEP', saved: 94500, rate: 36 },
      { name: 'OCT', saved: 103000, rate: 36.5 },
      { name: 'NOV', saved: 113500, rate: 37 },
      { name: 'DEC', saved: 124000, rate: 38 },
    ]
  },
  
  forecast: {
    historical: [
      { month: 'APR', current: 42000, projected: null },
      { month: 'MAY', current: 51500, projected: null },
      { month: 'JUN', current: 63000, projected: null },
      { month: 'JUL', current: 74500, projected: null },
      { month: 'AUG', current: 86000, projected: 86000 },
    ],
    future: [
      { month: 'AUG', current: null, projected: 86000 },
      { month: 'SEP', current: null, projected: 92000 },
      { month: 'OCT', current: null, projected: 98000 },
      { month: 'NOV', current: null, projected: 104000 }, // 3 months
      { month: 'DEC', current: null, projected: 111000 },
      { month: 'JAN', current: null, projected: 119000 },
      { month: 'FEB', current: null, projected: 128000 }, // 6 months
      { month: 'MAR', current: null, projected: 135000 },
      { month: 'APR', current: null, projected: 142000 },
      { month: 'MAY', current: null, projected: 149000 },
      { month: 'JUN', current: null, projected: 156000 },
      { month: 'JUL', current: null, projected: 164000 },
      { month: 'AUG', current: null, projected: 172000 }, // 12 months
    ]
  },

  aiForecast: {
    targetReachedText: "At your current savings pace, you're on track to reach ₹1,00,000 in approximately 3 months.",
    currentRate: 36.2,
    recommendedRate: 41,
    potentialExtraSaving: 4100
  },

  factors: [
    { label: 'INCOME', change: '+12%', isPositive: true },
    { label: 'EXPENSES', change: '−8%', isPositive: true }, // decrease in expenses is positive for savings
    { label: 'SAVINGS RATE', change: '+6%', isPositive: true },
    { label: 'INVESTMENTS', change: '+4%', isPositive: true },
  ],

  breakdown: [
    { label: 'Reduced dining', impact: 2400 },
    { label: 'Reduced subscriptions', impact: 768 },
    { label: 'Lower transport', impact: 1200 },
    { label: 'Automatic saving', impact: 5000 },
  ],
  
  goals: [
    { id: '1', title: 'EMERGENCY FUND', current: 72000, target: 150000, date: 'DEC 2026' },
    { id: '2', title: 'NEW LAPTOP', current: 72000, target: 120000, date: 'JUN 2027' },
    { id: '3', title: 'TRAVEL', current: 32000, target: 80000, date: 'MAR 2027' },
  ],

  streak: {
    months: 7,
    timeline: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'],
    currentMonth: 'JUL'
  },

  recommendations: [
    {
      title: 'SAVE FIRST',
      description: 'Move ₹10,000 to savings immediately after income.',
      icon: 'PiggyBank'
    },
    {
      title: 'REDUCE LEAKAGE',
      description: 'Dining is currently 18% above your average.',
      icon: 'Utensils'
    },
    {
      title: 'AUTOMATE',
      description: 'Set aside ₹5,000 monthly toward your emergency fund.',
      icon: 'RefreshCw'
    }
  ]
};
