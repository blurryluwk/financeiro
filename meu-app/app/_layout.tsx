// app/_layout.tsx
import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { getUser } from "@/services/auth";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await getUser(); // 🔹 pega do SecureStore
        setIsLoggedIn(!!user?.id);
      } catch (error) {
        console.error("Erro ao verificar login:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLogin();
  }, []);

  useEffect(() => {
    if (isLoading || isLoggedIn === null) return;

    const inAuthGroup = segments[0] === "auth";

    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/auth/login");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace("/"); // Dashboard
    }
  }, [isLoading, isLoggedIn, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#4695a0" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
