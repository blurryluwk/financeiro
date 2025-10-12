import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type TransactionCardProps = {
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
};

const TransactionCard: React.FC<TransactionCardProps> = ({ description, amount, date, type, category }) => {
  const amountColor = type === 'income' ? 'green' : 'red';

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        R$ {amount.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  info: {
    flexDirection: 'column',
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 14,
    color: '#505050ff', 
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionCard;
