import React, { useEffect, useState, useRef } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator, SafeAreaView } from "react-native";
import { getUser } from "@/services/auth";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();

  // Evita múltiplos redirecionamentos
  const hasRedirected = useRef(false);

  // Verifica login no SecureStore
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await getUser();
        console.log("👤 Usuário carregado do SecureStore:", user);
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

  // Controla navegação inicial com segurança
  useEffect(() => {
    if (isLoading || isLoggedIn === null) return;
    if (hasRedirected.current) return; // Evita loops infinitos

    const inAuthGroup = segments[0] === "auth";

    if (!isLoggedIn && !inAuthGroup) {
      console.log("🔁 Redirecionando para login");
      hasRedirected.current = true;
      router.replace("/auth/login");
    } else if (isLoggedIn && inAuthGroup) {
      console.log("🔁 Redirecionando para abas principais");
      hasRedirected.current = true;
      router.replace("/(tabs)");
    }
  }, [isLoading, isLoggedIn]);


if (isLoading) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <ActivityIndicator size="large" color="#4695a0" />
    </SafeAreaView>
  );
}

  return <Stack screenOptions={{ headerShown: false }} />;
}
