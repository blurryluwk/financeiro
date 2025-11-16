import React, { useEffect, useState } from "react";
import { Tabs, useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, TouchableOpacity, Alert } from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { getUser, logout } from "@/services/auth";

// Tipo genérico para aceitar ambas famílias de ícones
type IconFamily = typeof FontAwesome6 | typeof MaterialCommunityIcons;

// Ícone genérico da TabBar
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

// Foto do usuário no header
function ProfileCircle({ uri }: { uri: string | null }) {
  return (
    <TouchableOpacity style={{ marginLeft: 15 }}>
      <Image
        source={uri ? { uri } : require("@/assets/images/default-profile.jpg")}
        style={{
          width: 30,
          height: 30,
          borderRadius: 25,
          backgroundColor: "#ccc",
        }}
      />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // Carrega nome + foto
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getUser();
        setProfileImage(user?.profileImage || null);
        setUserName(user?.name || null);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    };
    loadUser();
  }, []);

  // Logout funcional (com redirect)
  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };


  return (
    <Tabs
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
        tabBarActiveTintColor: tintColor,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#e0e0e0",
          height: 60,
          paddingBottom: 6,
        },

        headerLeft: () => <ProfileCircle uri={profileImage} />,

        // Botão de logout no canto direito
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
            <FontAwesome6 name="right-from-bracket" size={20} color="#d33" />
          </TouchableOpacity>
        ),

        headerStyle: { backgroundColor: "#fff" },
        headerTitleStyle: {
          paddingLeft: 10,
          fontSize: 18,
          fontWeight: "600",
        },
      }}
    >
      {/* Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: userName ? `${userName}` : "Dashboard",
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
