import React, { useEffect, useState } from "react";
import { View, Button, Text, Alert, StyleSheet, Platform, TouchableOpacity } from "react-native";
import * as Notifications from "expo-notifications";
import { Feather } from '@expo/vector-icons'; 
import DateTimePicker from '@react-native-community/datetimepicker';

// Configuração do handler (mantida)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Notificacoes() {
  const [isScheduled, setIsScheduled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  
  // 🎯 NOVO ESTADO: Hora atual, começando com 20:00 hoje
  const [selectedTime, setSelectedTime] = useState(new Date(new Date().setHours(20, 0, 0, 0)));
  const [showTimePicker, setShowTimePicker] = useState(false);


  // --- Funções de Lógica ---
  
  // Função para formatar a hora (ex: 20:00)
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Lógica do TimePicker
  const onChangeTime = (event: any, date: Date | undefined) => {
    // Isso é necessário para lidar com a diferença de comportamento entre iOS e Android
    setShowTimePicker(Platform.OS === 'ios'); 
    if (date) {
      setSelectedTime(date);
    }
  };


  // ... (checkScheduledNotification, requestPermissions, useEffect - SEM ALTERAÇÃO) ...
  
  async function scheduleDailyReminder() {
    if (permissionStatus !== 'granted') {
        Alert.alert("Permissão Ausente", "Você precisa permitir as notificações primeiro.");
        return;
    }

    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        
        // 🎯 Lógica para extrair hora e minuto da data selecionada
        const hour = selectedTime.getHours();
        const minute = selectedTime.getMinutes();

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "📊 Atualize suas transações!",
                body: "Lembre-se de registrar as transações realizadas hoje.",
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                // 🎯 USANDO A HORA ESCOLHIDA
                hour: hour, 
                minute: minute,
            },
        });
        
        setIsScheduled(true);
        Alert.alert(
            "Lembrete Diário Ativado! ⏰",
            `Você será lembrado todos os dias às ${formatTime(selectedTime)} para registrar suas transações.`
        );
    } catch (e) {
        Alert.alert("Erro ao Agendar", "Não foi possível agendar o lembrete. Tente novamente.");
        console.error(e);
    }
  }
  
  async function cancelDailyReminder() {
    // ... (Lógica de cancelamento - SEM ALTERAÇÃO) ...
    await Notifications.cancelAllScheduledNotificationsAsync();
    setIsScheduled(false);
    Alert.alert("Lembrete Cancelado", "O lembrete diário foi desativado.");
  }


  // --- Renderização (Alterada) ---
  
  // ... (Renderização se permissão negada - SEM ALTERAÇÃO) ...

  return (
    <View style={styles.container}>
      {/* 🎯 SELETOR DE HORÁRIO */}
      <View style={styles.timePickerRow}>
          <Text style={styles.scheduleText}>Lembrar-me diariamente às:</Text>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timeButton}>
              <Text style={styles.timeButtonText}>{formatTime(selectedTime)}</Text>
              <Feather name="clock" size={20} color="#0066cc" />
          </TouchableOpacity>
      </View>

      {/* DateTimePicker (Visível no Android ou como Modal no iOS) */}
      {showTimePicker && (
          <DateTimePicker
              testID="dateTimePicker"
              value={selectedTime}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeTime}
          />
      )}
      
      {/* BOTOÕES DE STATUS */}
      {isScheduled ? (
        <View style={styles.statusContainer}>
          <Feather name="bell" size={24} color="#10ac84" />
          <Text style={styles.statusText}>Lembrete Ativo: Diariamente às {formatTime(selectedTime)}</Text>
          <Button
            title="Desativar Lembrete Diário"
            onPress={cancelDailyReminder}
            color="#ff4757"
          />
        </View>
      ) : (
        <View style={styles.statusContainer}>
          <Button
            title={`Agendar Notificação para ${formatTime(selectedTime)}`}
            onPress={scheduleDailyReminder}
            color="#0066cc"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    // ... (Seus estilos anteriores) ...
    container: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        padding: 20,
    },
    // 🎯 NOVOS ESTILOS
    timePickerRow: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 30,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 1,
    },
    timeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#0066cc'
    },
    timeButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0066cc',
        marginRight: 10,
    },
    // ... (Restante dos estilos) ...
    statusContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 15,
        color: '#10ac84',
    },
    scheduleText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
    permissionText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 15,
    }
});