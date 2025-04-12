import React from "react";
import { Tabs } from "expo-router";
import { useAuth } from "../../context/authContext";
import { View, ActivityIndicator } from "react-native";
import { Home, UtensilsCrossed, LineChart, Target, User } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#1EAFB3" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#1EAFB3",
          tabBarInactiveTintColor: "#94A3B8",
          tabBarStyle: {
            paddingVertical: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 3,
          },
          tabBarItemStyle: {
            paddingVertical: 5,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="meals"
          options={{
            title: "Meals",
            tabBarIcon: ({ color, size }) => <UtensilsCrossed size={size} color={color} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="metric"
          options={{
            title: "Metrics",
            tabBarIcon: ({ color, size }) => <LineChart size={size} color={color} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: "Goals",
            tabBarIcon: ({ color, size }) => <Target size={size} color={color} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => <User size={size} color={color} strokeWidth={2.5} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}