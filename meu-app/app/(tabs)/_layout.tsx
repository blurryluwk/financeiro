import React from "react";
import { Tabs } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// Tipo genérico para aceitar ambas famílias de ícones
type IconFamily = typeof FontAwesome6 | typeof MaterialCommunityIcons;

// 🔹 Componente utilitário para ícones da TabBar
function TabBarIcon({
  family: IconComponent,
  name,
  color,
  size = 24,
}: {
  family: IconFamily;
  name: string;
  color: string;
  size?: number;
}) {
  return <IconComponent name={name as any} size={size} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  return (
    <Tabs
      screenOptions={{
        headerShown: useClientOnlyValue(false, true), // evita erro no SSR
        tabBarActiveTintColor: tintColor,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#e0e0e0",
          height: 60,
          paddingBottom: 6,
        },
      }}
    >
      {/* Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              family={FontAwesome6}
              name="chart-line"
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* Transações */}
      <Tabs.Screen
        name="transacoes"
        options={{
          title: "Transações",
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              family={MaterialCommunityIcons}
              name="swap-horizontal"
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* Carteira */}
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Carteira",
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              family={FontAwesome6}
              name="coins"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
