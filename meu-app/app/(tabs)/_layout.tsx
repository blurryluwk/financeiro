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
    <TouchableOpacity style={{ marginLeft: 15 }} onPress={onPress}>
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

  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const u = await getUser();
        if (u) {
          setUser({
            id: u.id,
            name: u.name,
            email: u.email,
          });
          setUserName(u.name);
          setProfileImage(u.profileImage || null);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
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
    <>
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
          headerLeft: () => (
            <ProfileCircle uri={profileImage} onPress={openModal} />
          ),
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
        <Tabs.Screen
          name="index"
          options={{
            title: userName ? userName : "Dashboard",
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
            title: userName ? userName : "Transações",
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
            title: userName ? userName : "Notificações",
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

      {/* Modal de edição do usuário */}
      {user && (
        <UserEditModal
          visible={isModalVisible}
          onClose={closeModal}
          setUserName={handleUserSave}
          user={user} // Passando o 'user' inteiro aqui
          setProfileImage={setProfileImage}
        />
      )}
    </>
  );
}
