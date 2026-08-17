export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  date: string; // ISO string
  paymentMethod: string;
  amount: number;
  type: 'income' | 'expense';
  note?: string;
  source?: string;
}

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);
const twoWeeksAgo = new Date(today);
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

const formatDate = (date: Date) => date.toISOString();

export const mockTransactions: Transaction[] = [
  { id: 'tx-1', merchant: 'Netflix', category: 'Subscriptions', date: formatDate(today), paymentMethod: 'Card', amount: 649, type: 'expense', note: 'Monthly subscription' },
  { id: 'tx-2', merchant: 'Swiggy', category: 'Food', date: formatDate(today), paymentMethod: 'UPI', amount: 820, type: 'expense', note: 'Dinner' },
  { id: 'tx-3', merchant: 'Uber', category: 'Transport', date: formatDate(yesterday), paymentMethod: 'UPI', amount: 420, type: 'expense' },
  { id: 'tx-4', merchant: 'Amazon', category: 'Shopping', date: formatDate(yesterday), paymentMethod: 'Card', amount: 2400, type: 'expense', note: 'Office supplies' },
  { id: 'tx-5', merchant: 'Salary', category: 'Income', date: formatDate(twoDaysAgo), paymentMethod: 'Bank Transfer', amount: 85000, type: 'income', note: 'August Salary' },
  { id: 'tx-6', merchant: 'Starbucks', category: 'Food', date: formatDate(twoDaysAgo), paymentMethod: 'UPI', amount: 350, type: 'expense' },
  { id: 'tx-7', merchant: 'Jio', category: 'Subscriptions', date: formatDate(twoDaysAgo), paymentMethod: 'UPI', amount: 299, type: 'expense', note: 'Mobile recharge' },
  { id: 'tx-8', merchant: 'Zomato', category: 'Food', date: formatDate(lastWeek), paymentMethod: 'UPI', amount: 560, type: 'expense' },
  { id: 'tx-9', merchant: 'HDFC RentPay', category: 'Housing', date: formatDate(lastWeek), paymentMethod: 'Card', amount: 18000, type: 'expense', note: 'August Rent' },
  { id: 'tx-10', merchant: 'Blinkit', category: 'Food', date: formatDate(lastWeek), paymentMethod: 'UPI', amount: 1100, type: 'expense', note: 'Groceries' },
  { id: 'tx-11', merchant: 'Shell', category: 'Transport', date: formatDate(lastWeek), paymentMethod: 'Card', amount: 2500, type: 'expense', note: 'Fuel' },
  { id: 'tx-12', merchant: 'Apollo Pharmacy', category: 'Health', date: formatDate(twoWeeksAgo), paymentMethod: 'UPI', amount: 850, type: 'expense' },
  { id: 'tx-13', merchant: 'Myntra', category: 'Shopping', date: formatDate(twoWeeksAgo), paymentMethod: 'Card', amount: 3200, type: 'expense', note: 'Clothes' },
  { id: 'tx-14', merchant: 'Spotify', category: 'Subscriptions', date: formatDate(twoWeeksAgo), paymentMethod: 'UPI', amount: 119, type: 'expense' },
  { id: 'tx-15', merchant: 'Uber', category: 'Transport', date: formatDate(twoWeeksAgo), paymentMethod: 'UPI', amount: 380, type: 'expense' },
  { id: 'tx-16', merchant: 'Freelance Client', category: 'Income', date: formatDate(twoWeeksAgo), paymentMethod: 'Bank Transfer', amount: 12000, type: 'income', note: 'Design project' },
  { id: 'tx-17', merchant: 'BookMyShow', category: 'Entertainment', date: formatDate(twoWeeksAgo), paymentMethod: 'UPI', amount: 900, type: 'expense', note: 'Movie tickets' },
  { id: 'tx-18', merchant: 'Coursera', category: 'Education', date: formatDate(twoWeeksAgo), paymentMethod: 'Card', amount: 4500, type: 'expense' },
  { id: 'tx-19', merchant: 'Swiggy', category: 'Food', date: formatDate(twoWeeksAgo), paymentMethod: 'UPI', amount: 650, type: 'expense' },
  { id: 'tx-20', merchant: 'Gym', category: 'Health', date: formatDate(twoWeeksAgo), paymentMethod: 'Card', amount: 1500, type: 'expense', note: 'Monthly membership' },
  { id: 'tx-21', merchant: 'Amazon', category: 'Shopping', date: new Date(new Date().setDate(today.getDate() - 18)).toISOString(), paymentMethod: 'Card', amount: 1200, type: 'expense' },
  { id: 'tx-22', merchant: 'Blinkit', category: 'Food', date: new Date(new Date().setDate(today.getDate() - 19)).toISOString(), paymentMethod: 'UPI', amount: 890, type: 'expense' },
  { id: 'tx-23', merchant: 'Uber', category: 'Transport', date: new Date(new Date().setDate(today.getDate() - 20)).toISOString(), paymentMethod: 'UPI', amount: 550, type: 'expense' },
  { id: 'tx-24', merchant: 'Zepto', category: 'Food', date: new Date(new Date().setDate(today.getDate() - 22)).toISOString(), paymentMethod: 'UPI', amount: 420, type: 'expense' },
  { id: 'tx-25', merchant: 'Electricity Bill', category: 'Housing', date: new Date(new Date().setDate(today.getDate() - 25)).toISOString(), paymentMethod: 'Bank Transfer', amount: 2100, type: 'expense' },
  { id: 'tx-26', merchant: 'Internet', category: 'Housing', date: new Date(new Date().setDate(today.getDate() - 26)).toISOString(), paymentMethod: 'Card', amount: 999, type: 'expense' },
  { id: 'tx-27', merchant: 'Zomato', category: 'Food', date: new Date(new Date().setDate(today.getDate() - 27)).toISOString(), paymentMethod: 'UPI', amount: 450, type: 'expense' },
  { id: 'tx-28', merchant: 'Croma', category: 'Shopping', date: new Date(new Date().setDate(today.getDate() - 30)).toISOString(), paymentMethod: 'Card', amount: 8500, type: 'expense', note: 'Headphones' },
];
