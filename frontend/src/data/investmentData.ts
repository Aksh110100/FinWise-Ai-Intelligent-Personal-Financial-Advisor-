export const investmentData = {
  summary: {
    totalInvested: 680000,
    currentValue: 842500,
    totalReturns: 162500,
    returnPercentage: 23.89,
    thisMonthReturn: 24800,
    thisMonthPercentage: 3.04,
  },
  
  performanceData: {
    '1M': [
      { month: 'W1', value: 820000, invested: 670000 },
      { month: 'W2', value: 828000, invested: 675000 },
      { month: 'W3', value: 835000, invested: 680000 },
      { month: 'W4', value: 842500, invested: 680000 },
    ],
    '3M': [
      { month: 'OCT', value: 821000, invested: 660000 },
      { month: 'NOV', value: 831500, invested: 670000 },
      { month: 'DEC', value: 842500, invested: 680000 },
    ],
    '6M': [
      { month: 'JUL', value: 781000, invested: 630000 },
      { month: 'AUG', value: 802000, invested: 640000 },
      { month: 'SEP', value: 812500, invested: 650000 },
      { month: 'OCT', value: 821000, invested: 660000 },
      { month: 'NOV', value: 831500, invested: 670000 },
      { month: 'DEC', value: 842500, invested: 680000 },
    ],
    '1Y': [
      { month: 'JAN', value: 692000, invested: 570000 },
      { month: 'FEB', value: 705000, invested: 580000 },
      { month: 'MAR', value: 718500, invested: 590000 },
      { month: 'APR', value: 726000, invested: 600000 },
      { month: 'MAY', value: 744000, invested: 610000 },
      { month: 'JUN', value: 762500, invested: 620000 },
      { month: 'JUL', value: 781000, invested: 630000 },
      { month: 'AUG', value: 802000, invested: 640000 },
      { month: 'SEP', value: 812500, invested: 650000 },
      { month: 'OCT', value: 821000, invested: 660000 },
      { month: 'NOV', value: 831500, invested: 670000 },
      { month: 'DEC', value: 842500, invested: 680000 },
    ],
    'ALL': [
      { month: '2021', value: 340000, invested: 300000 },
      { month: '2022', value: 480000, invested: 420000 },
      { month: '2023', value: 650000, invested: 540000 },
      { month: '2024', value: 842500, invested: 680000 },
    ],
  },

  allocationData: [
    { name: 'EQUITY', value: 45, amount: 378000, color: '#C9A46C' },
    { name: 'MUTUAL FUNDS', value: 25, amount: 210625, color: '#8b724b' },
    { name: 'FIXED INCOME', value: 20, amount: 168500, color: '#5a4930' },
    { name: 'GOLD', value: 10, amount: 84250, color: '#e8cd9c' },
  ],

  returnsData: {
    total: 162500,
    today: 2450,
    thisMonth: 24800,
    thisYear: 108500,
  },

  investmentList: [
    { name: 'NIFTY 50 INDEX FUND', category: 'EQUITY', value: 180000, returnPct: 14.8, history: [120, 125, 122, 130, 138, 142, 148] },
    { name: 'S&P 500 INDEX FUND', category: 'EQUITY', value: 125000, returnPct: 18.2, history: [100, 105, 110, 108, 115, 120, 118] },
    { name: 'FLEXI CAP FUND', category: 'MUTUAL FUNDS', value: 95000, returnPct: 11.4, history: [90, 92, 95, 94, 98, 105, 111] },
    { name: 'GOLD ETF', category: 'GOLD', value: 84250, returnPct: 8.6, history: [75, 76, 78, 80, 81, 82, 84] },
  ],

  goals: [
    { name: 'HOME', current: 240000, target: 1000000, percentage: 24 },
    { name: 'RETIREMENT', current: 380000, target: 5000000, percentage: 7.6 },
    { name: 'TRAVEL', current: 82000, target: 150000, percentage: 55 },
  ],

  riskProfile: {
    level: 'MODERATE',
    score: 6.2,
  },

  plannerDefaults: {
    monthlyInvestment: 10000,
    expectedReturn: 10,
    timePeriod: 5,
  },

  watchlist: [
    { name: 'INDEX FUNDS', tags: ['LOW COST', 'STABLE'], value: 'MODERATE' },
    { name: 'GOLD', tags: ['DIVERSIFICATION'], value: 'MODERATE' },
    { name: 'BONDS', tags: ['LOW VOLATILITY'], value: 'LOW RISK' },
  ],

  aiInsight: {
    title: 'FINWISE AI NOTICED',
    message: 'Your portfolio is heavily concentrated in equity. A more balanced allocation could reduce portfolio volatility.',
    currentEquity: 45,
    suggestedRange: '35–40%',
    potentialBalance: '+₹15,000',
  }
};
