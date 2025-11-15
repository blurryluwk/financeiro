import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Certifique-se de instalar este pacote: expo install @expo/vector-icons
import { Feather } from '@expo/vector-icons'; 

// 1. ATUALIZAÇÃO DA INTERFACE DE PROPS
type TransactionCardProps = {
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
  
  // NOVAS PROPS para interação:
  onPress: () => void;
  onDelete: () => void;
};

const TransactionCard: React.FC<TransactionCardProps> = ({
  description,
  amount,
  date,
  type,
  category,
  onPress,    // Recebe o callback para edição
  onDelete,   // Recebe o callback para exclusão
}) => {
  const amountColor = type === "income" ? "#10ac84" : "#ff4757"; // Cores mais vibrantes
  

  return (
    // 2. ENCAPSULA O CONTEÚDO PRINCIPAL PARA HABILITAR EDIÇÃO (onPress)
    <View style={styles.outerContainer}>
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.info}>
                <Text style={styles.description}>{String(description)}</Text>
                <Text style={styles.category}>{String(category)}</Text>
                <Text style={styles.date}>{String(date)}</Text>
            </View>
            <View style={styles.amountContainer}>
                <Text style={[styles.amount, { color: amountColor }]}>
                    R$ {Number(amount).toFixed(2)}
                </Text>
            </View>
        </TouchableOpacity>

        {/* 3. BOTÃO DE EXCLUSÃO SEPARADO COM ÍCONE */}
        <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={onDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Aumenta a área de clique
        >
            <Feather name="trash-2" size={20} color="#ff3b30" />
        </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  card: {
    // Ocupa a maior parte do espaço e mantém os detalhes e o valor
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    paddingRight: 5, // Espaço ajustado para o botão de lixeira
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
  amountContainer: {
    justifyContent: 'center',
    paddingRight: 5,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#f0f0f0',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  }
});

export default TransactionCard;