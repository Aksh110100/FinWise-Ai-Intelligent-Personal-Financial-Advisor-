export const processStatement = (file: File): Promise<any[]> => {
  return new Promise((resolve) => {
    // Simulate OCR delay
    setTimeout(() => {
      resolve([
        {
          id: `stm-${Date.now()}-1`,
          date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
          merchant: 'SWIGGY',
          amount: 820,
          type: 'expense',
          category: 'Food',
          paymentMethod: 'UPI',
          source: 'statement'
        },
        {
          id: `stm-${Date.now()}-2`,
          date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
          merchant: 'UBER',
          amount: 420,
          type: 'expense',
          category: 'Transport',
          paymentMethod: 'Card',
          source: 'statement'
        },
        {
          id: `stm-${Date.now()}-3`,
          date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
          merchant: 'AMAZON',
          amount: 2400,
          type: 'expense',
          category: 'Shopping',
          paymentMethod: 'UPI',
          source: 'statement'
        },
        {
          id: `stm-${Date.now()}-4`,
          date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
          merchant: 'TECH CORP SALARY',
          amount: 85000,
          type: 'income',
          category: 'Income',
          paymentMethod: 'Bank Transfer',
          source: 'statement'
        }
      ]);
    }, 4000); // 4 seconds total processing simulation
  });
};

export const processReceipt = (file: File): Promise<any> => {
  return new Promise((resolve) => {
    // Simulate OCR delay
    setTimeout(() => {
      resolve({
        merchant: 'DMART',
        items: [
          { name: 'Rice 5kg', price: 850 },
          { name: 'Milk 1L x2', price: 420 },
          { name: 'Household cleaning', price: 650 }
        ],
        amount: 1920,
        category: 'Shopping', // Should ideally be Groceries, but mapping to existing categories
        date: new Date().toISOString()
      });
    }, 3000);
  });
};
