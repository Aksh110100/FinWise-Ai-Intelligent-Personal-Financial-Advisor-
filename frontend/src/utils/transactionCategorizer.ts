export const categorizeTransaction = (merchant: string = '', description: string = ''): string => {
  const text = (merchant + ' ' + description).toLowerCase();

  const rules: { [category: string]: string[] } = {
    'Food': ['swiggy', 'zomato', 'restaurant', 'cafe', 'mcdonalds', 'kfc', 'starbucks', 'dominos', 'pizza'],
    'Transport': ['uber', 'ola', 'rapido', 'metro', 'irctc', 'railway', 'flight', 'indigo', 'makemytrip'],
    'Shopping': ['amazon', 'flipkart', 'myntra', 'ajio', 'nykaa', 'dmart', 'reliance', 'croma'],
    'Subscriptions': ['netflix', 'spotify', 'prime', 'hotstar', 'apple', 'youtube', 'gym', 'cult'],
    'Utilities': ['electricity', 'water', 'gas', 'bill', 'recharge', 'jio', 'airtel', 'vi', 'bescom', 'bses'],
    'Income': ['salary', 'payroll', 'neft', 'rtgs', 'dividend', 'interest'],
    'Healthcare': ['pharmacy', 'hospital', 'clinic', 'apollo', 'medplus'],
  };

  for (const [category, keywords] of Object.entries(rules)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }

  return 'Other';
};
