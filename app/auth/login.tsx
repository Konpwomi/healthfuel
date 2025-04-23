import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../../context/authContext";
import { Ionicons } from "@expo/vector-icons"; // Add this import
import { HeartPulse } from "lucide-react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 pt-20 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-8 py-12 justify-center">
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
              <HeartPulse size={40} color="#1EAFB3" />
            </View>
            <Text className="text-3xl font-bold text-primary">
              Health Fuel
            </Text>
            <Text className="text-gray-500 mt-2 text-center">
              Sign in to access your health fuel
            </Text>
          </View>

          <View className="space-y-6">
            <View className="mb-5">
              <Text className="text-gray-700 mb-3 font-medium ml-1">Email</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 overflow-hidden border border-gray-200">
                <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 p-4 pl-2 text-base text-gray-800"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View className="mb-12">
              <Text className="text-gray-700 mb-3 font-medium ml-1">Password</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 overflow-hidden border border-gray-200">
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  className="flex-1 p-4 pl-2 text-base text-gray-800"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isSubmitting}
              className="bg-primary py-4 rounded-xl items-center shadow-sm"
              style={{ elevation: 2 }}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-bold">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-10">
            <Text className="text-gray-600">Don't have an account? </Text>
            <Link href="./register" className="text-primary font-semibold">
              Register Now
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default Login;