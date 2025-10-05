// /components/NewTransactionModal.tsx

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView, // Importar ScrollView
} from 'react-native';

// Importe o tipo restrito de categorias
import { TransactionCategory } from '@/constants/transactions'; // Ajuste o caminho conforme necessário

// Define os tipos restritos para o formulário
export type NewTransactionData = {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: TransactionCategory; // Usa o tipo restrito
  date: string; 
};

// As categorias disponíveis para exibição nos botões
const DEFAULT_CATEGORIES: TransactionCategory[] = [
    'Alimentação',
    'Mobilidade',
    'Salário',
    'Lazer',
    'Outros',
    // Adicione a categoria 'Outros' se for uma opção válida para o usuário
];

interface NewTransactionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: NewTransactionData) => void; 
  // O array de categorias pode ser usado para customização, mas usaremos um padrão
  availableCategories?: string[]; 
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isVisible,
  onClose,
  onSave,
}) => {
  
  // 1. Estados locais do formulário
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  // CORREÇÃO: Inicializa o estado com um valor garantido do tipo restrito
  const [category, setCategory] = useState<TransactionCategory>(DEFAULT_CATEGORIES[0]); 
  
  const currentDate = new Date().toISOString().split('T')[0];

  // 2. Funções de Estilo para os Botões
  
  // Estilos para os botões de Tipo (income/expense)
  const getTypeButtonStyle = (t: 'income' | 'expense') => ({
    ...styles.typeButton,
    backgroundColor: type === t ? (t === 'income' ? '#8fccb6ff' : '#de1d6aff') : '#eee',
  });
  const getTypeButtonTextStyle = (t: 'income' | 'expense') => ({
    color: type === t ? '#fff' : '#333',
    fontWeight: 'bold',
  });
  
  // Estilos para os botões de Categoria
  const getCategoryButtonStyle = (cat: TransactionCategory) => ({
    ...styles.categoryButton,
    backgroundColor: category === cat ? '#4695a0ff' : '#f0f0f0',
  });
  const getCategoryButtonTextStyle = (cat: TransactionCategory) => ({
    color: category === cat ? '#fff' : '#333',
    fontWeight: 'bold',
  });


  const handleSave = () => {
    const parsedAmount = parseFloat(amount.replace(',', '.'));

    if (!description || parsedAmount <= 0 || isNaN(parsedAmount)) {
      Alert.alert('Erro', 'Preencha a descrição e um valor válido.');
      return;
    }

    const newTransaction: NewTransactionData = {
      description,
      amount: parsedAmount,
      type,
      category,
      date: currentDate,
    };

    onSave(newTransaction);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Nova Transação</Text>

          {/* Tipo (Receita/Despesa) */}
          <Text style={styles.label}>Tipo:</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity onPress={() => setType('expense')} style={getTypeButtonStyle('expense')}>
              <Text>Despesa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setType('income')} style={getTypeButtonStyle('income')}>
              <Text>Receita</Text>
            </TouchableOpacity>
          </View>
          
          {/* Categoria (AGORA COM BOTÕES ESTILO POPUP/SLIDER) */}
          <Text style={styles.label}>Categoria:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoryScrollContainer}
          >
            {DEFAULT_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                // Garante que o tipo é o restrito
                onPress={() => setCategory(cat)} 
                style={getCategoryButtonStyle(cat)}
              >
                <Text>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>


          {/* Descrição */}
          <Text style={styles.label}>Descrição:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Aluguel, Salário, Café"
            value={description}
            onChangeText={setDescription}
          />

          {/* Valor */}
          <Text style={styles.label}>Valor (R$):</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          
          {/* Data */}
          <Text style={styles.dateText}>Data: {currentDate}</Text>

          {/* Botões de Ação */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        height: 45,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    // Estilos de Tipo (Expense/Income)
    typeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    typeButton: {
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 8,
        width: '45%',
        alignItems: 'center',
    },
    // Estilos de Categoria (Botões)
    categoryScrollContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    categoryButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateText: {
        textAlign: 'right',
        fontSize: 12,
        color: '#666',
        marginBottom: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    cancelButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        borderRadius: 8,
        backgroundColor: '#ddd',
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
    saveButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#4695a0ff',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default NewTransactionModal;