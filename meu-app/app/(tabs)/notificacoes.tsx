// notificacoes.tsx

import { View, Text, StyleSheet } from 'react-native';

export default function NotificacoesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Notificações</Text>
      {/* Aqui você listará as notificações salvas no banco de dados. */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});