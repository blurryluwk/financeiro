import React from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

type IconFamily = typeof FontAwesome6 | typeof MaterialCommunityIcons;

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

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: false, // remove texto do tab bar
      }}
    >
      {/* Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard", // aparece no header
          tabBarIcon: ({ color }) => (
            <TabBarIcon family={FontAwesome6} name="chart-line" color={color} />
          ),
        }}
      />

      {/* Transações */}
      <Tabs.Screen
        name="transacoes"
        options={{
          title: "Transações",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              family={MaterialCommunityIcons}
              name="swap-horizontal" 
              color={color}
            />
          ),
        }}
      />

      {/* Carteira / Finanças */}
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Carteira",
          tabBarIcon: ({ color }) => (
            <TabBarIcon family={FontAwesome6} name="coins" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
