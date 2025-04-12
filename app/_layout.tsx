import { Stack } from "expo-router";
import "./global.css";
import { ProfileProvider } from "../context/profileContext";
import { AuthProvider } from "../context/authContext";
import { useAuth } from "../context/authContext";
import { View, ActivityIndicator, Text } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { Slot } from "expo-router";

function RootLayoutNav() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/auth/login");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#1EAFB3" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <RootLayoutNav />
      </ProfileProvider>
    </AuthProvider>
  );
}