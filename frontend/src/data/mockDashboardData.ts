export const mockDashboardData = {
  user: {
    firstName: "Aksh",
  },
  overview: {
    monthlyIncome: "₹85,000",
    monthlyExpenses: "₹54,200",
    monthlySaved: "₹30,800",
    monthlyInvested: "₹10,000",
    currentBalance: "₹45,200",
    balanceTrend: "+2.4%",
  },
  safeToSpend: {
    amount: "₹7,850",
    description: "Available for discretionary spending until the end of this month.",
    nextIncomeAmount: "₹85,000",
    nextIncomeDays: "12 days",
    upcomingCommitments: "₹23,299"
  },
  health: {
    score: 82,
    status: "ON TRACK ↑",
    summary: "Your score improved 6 points this month, mainly because your savings rate increased.",
    breakdown: {
      spending: 86,
      savings: 72,
      investments: 81,
      emergencyFund: 68,
      debt: 94
    }
  },
  spending: [
    { category: "Housing", amount: "₹18,000", percentage: 28 },
    { category: "Food", amount: "₹12,400", percentage: 20 },
    { category: "Transport", amount: "₹7,200", percentage: 11 },
    { category: "Shopping", amount: "₹5,800", percentage: 9 },
    { category: "Subscriptions", amount: "₹2,100", percentage: 3 },
    { category: "Other", amount: "₹8,700", percentage: 14 }
  ],
  insights: [
    {
      type: "SAVE",
      title: "You spent ₹2,400 more on dining this month.",
      impactLabel: "Potential monthly saving:",
      impactValue: "₹2,400",
      impactYearly: "₹28,800",
      color: "var(--accent-gold)"
    }
  ],
  savingOpportunities: [
    { category: "Dining", amount: "₹2,400/month" },
    { category: "Subscriptions", amount: "₹768/month" },
    { category: "Shopping", amount: "₹1,200/month" }
  ],
  savingOpportunitiesTotal: "₹4,368",
  upcomingMoney: [
    { date: "18 AUG", label: "Insurance", amount: "− ₹2,500", type: "expense" },
    { date: "20 AUG", label: "Rent", amount: "− ₹15,000", type: "expense" },
    { date: "24 AUG", label: "Investment", amount: "− ₹5,000", type: "expense" },
    { date: "31 AUG", label: "Salary", amount: "+ ₹85,000", type: "income" }
  ],
  goals: [
    { name: "MACBOOK", current: "₹72,000", target: "₹1,20,000", progress: 60, date: "June 2027" },
    { name: "EMERGENCY FUND", current: "₹72,000", target: "₹1,50,000", progress: 48, date: "Ongoing" },
  ],
  investments: {
    currentValue: "₹2,84,500",
    contributed: "₹2,40,000",
    growth: "+₹44,500",
    growthPercentage: "+18.5%"
  },
  simulator: {
    monthlySavingsIncrement: 2000,
    maxIncrement: 5000,
    currentGoalMonths: 18,
    simulatedGoalMonths: 13
  },
  monthlySummary: {
    income: "₹85,000",
    expenses: "₹54,200",
    saved: "₹30,800",
    invested: "₹10,000",
    text: "August was stronger than July. Your expenses decreased 8.2% while your savings rate increased."
  },
  futureForecast: {
    current: "₹45,200",
    months3: "₹61,500",
    months6: "₹78,400",
    months12: "₹1,24,000"
  },
  advisorSuggestions: [
    "How much can I invest this month?",
    "Can I afford a new laptop?",
    "Where am I overspending?",
    "How can I reach my goal faster?"
  ],
  futureProjection: {
    current: "₹2.4L",
    fiveYear: "₹12L",
    tenYear: "₹28L",
    currentPathValue: "₹12L",
    optimizedPathValue: "₹16.8L"
  },
  investmentOutlook: {
    monthlyInvestable: "₹10,000",
    riskProfile: "Moderate",
    allocation: [
      { name: "Equity", percentage: 60 },
      { name: "Debt", percentage: 30 },
      { name: "Emergency Fund", percentage: 10 }
    ]
  }
};
