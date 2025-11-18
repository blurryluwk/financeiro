import React, { useEffect, useState } from "react";
import { Tabs, useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { getUser, logout } from "@/services/auth";
import UserEditModal from "@/components/UserEditModal";
import { getProfilePicture } from "@/services/photo";
import { SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

type IconFamily = typeof FontAwesome6 | typeof MaterialCommunityIcons;

interface User {
  id: string;
  name: string;
  email: string;
}

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

function ProfileCircle({
  uri,
  onPress,
}: {
  uri: string | null;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginLeft: 15 }}>
      <Image
        source={
          uri
            ? { uri }
            : require("@/assets/images/default-profile.jpg")
        }
        style={{
          width: 35,
          height: 35,
          borderRadius: 18,
          backgroundColor: "#ddd",
        }}
      />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  useEffect(() => {
    const loadUser = async () => {
      console.log("🔵 Carregando dados do usuário...");

      try {
        // -----------------------------
        // 1. Buscar usuário
        // -----------------------------
        const u = await getUser();
        console.log("🟣 getUser() retornou:", u);

        if (u) {
          setUser(u);
          setUserName(u.name);
        }

        // -----------------------------
        // 2. Buscar foto do usuário
        // -----------------------------
        const base64Image = await getProfilePicture();

        if (base64Image) {
          console.log("🟢 Foto carregada BASE64");
          setProfileImage(base64Image);
        } else {
          console.log("⚪ Nenhuma foto encontrada.");
        }
      } catch (error) {
        console.error("🔴 Erro ao carregar usuário ou foto:", error);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  const handleUserSave = (name: string) => {
    setUserName(name);
    closeModal();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Tabs
        screenOptions={{
          headerShown: useClientOnlyValue(false, true),
          tabBarActiveTintColor: "#2f95dc",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopColor: "#e0e0e0",
            height: 60,
            paddingBottom: 6,
          },
          headerLeft: () => (
            <ProfileCircle uri={profileImage} onPress={openModal} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
              <FontAwesome6 name="right-from-bracket" size={22} color="#d33" />
            </TouchableOpacity>
          ),
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: userName ?? "Dashboard",
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

        <Tabs.Screen
          name="transacoes"
          options={{
            title: userName ?? "Transações",
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

        <Tabs.Screen
          name="notificacoes"
          options={{
            title: userName ?? "Notificações",
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon
                family={FontAwesome6}
                name="bell"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>

      {user && (
        <UserEditModal
          visible={isModalVisible}
          onClose={closeModal}
          setUserName={handleUserSave}
          user={user}
          setProfileImage={setProfileImage}
        />
      )}
    </SafeAreaView>
  );
}
