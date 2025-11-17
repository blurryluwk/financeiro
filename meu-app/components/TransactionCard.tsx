import React, { useMemo } from 'react'; // Adicionado useMemo para otimizar
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; 

type TransactionCardProps = {
  description: string;
  amount: number;
  date: string; // Continua sendo a string ISO do backend
  type: 'income' | 'expense';
  category: string;
  
  onPress: () => void;
  onDelete?: () => void;   
  showDelete?: boolean;    
};

const TransactionCard: React.FC<TransactionCardProps> = ({
  description,
  amount,
  date,
  type,
  category,
  onPress,
  onDelete,
  showDelete = false,
}) => {
  const amountColor = type === "income" ? "#10ac84" : "#ff4757";

  // Função para formatar a data (DD/MM/YYYY)
  const formattedDate = useMemo(() => {
    try {
      // Cria um objeto Date a partir da string ISO
      const dateObj = new Date(date);

      // Garante que a data é válida antes de formatar
      if (isNaN(dateObj.getTime())) {
        return "Data inválida";
      }

      // Usa toLocaleDateString para o formato DD/MM/YYYY (ajusta conforme a localidade)
      // Forçando o formato 'pt-BR' para garantir DD/MM/YYYY
      return dateObj.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      
    } catch (e) {
      console.error("Erro ao formatar data:", e);
      return date; // Retorna a string original em caso de erro
    }
  }, [date]); // Recalcula apenas se a prop 'date' mudar


  return (
    <View style={styles.outerContainer}>
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.info}>
                <Text style={styles.description}>{String(description)}</Text>
                <Text style={styles.category}>{String(category)}</Text>
                {/* USA A DATA FORMATADA */}
                <Text style={styles.date}>{formattedDate}</Text> 
            </View>
            <View style={styles.amountContainer}>
                <Text style={[styles.amount, { color: amountColor }]}>
                    R$ {Number(amount).toFixed(2)}
                </Text>
            </View>
        </TouchableOpacity>

        {/* Botão de exclusão opcional */}
        {showDelete && onDelete && (
          <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={onDelete}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
              <Feather name="trash-2" size={20} color="#ff3b30" />
          </TouchableOpacity>
        )}
    </View>
  );
};


const styles = StyleSheet.create({
// ... (Seus estilos permanecem os mesmos)
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
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    paddingRight: 5,
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