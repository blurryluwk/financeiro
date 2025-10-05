// app/(tabs)/index.tsx
import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';

import TransactionCard from '@/components/TransactionCard';
import { transactions } from '@/constants/transactions'; 

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transações</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TransactionCard
            description={item.description}
            amount={item.amount}
            date={item.date}
            type={item.type}
            category={item.category}
          />
        )}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
});
