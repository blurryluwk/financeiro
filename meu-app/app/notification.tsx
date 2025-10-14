import React, { useEffect } from "react";
import { View, Button, Text, Alert } from "react-native";
import * as Notifications from "expo-notifications";

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
  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Ative as notificações nas configurações."
        );
      }
    }

    requestPermissions();
  }, []);

  async function scheduleDailyReminder() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📊 Atualize suas transações!",
        body: "Lembre-se de registrar as transações realizadas hoje.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    });

    Alert.alert(
      "Lembrete diário ativado!",
      "Você será lembrado todos os dias às 20h."
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Ativar lembrete diário</Text>
      <Button
        title="Agendar notificação diária"
        onPress={scheduleDailyReminder}
      />
    </View>
  );
}
