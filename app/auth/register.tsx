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
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const Register = () => {
  // Authentication fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // User profile fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    // Validate required fields
    if (!email || !password || !name || !age || !weight || !height) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    // Validate numeric fields
    if (isNaN(Number(age)) || isNaN(Number(weight)) || isNaN(Number(height))) {
      Alert.alert("Error", "Age, weight, and height must be numbers");
      return;
    }

    setIsSubmitting(true);
    try {
      // Pass user data to register function
      await register(email, password, {
        name,
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        gender,
      });
    } catch (error: any) {
      console.error("Registration error in component:", error);
      Alert.alert(
        "Registration Failed",
        error.message || "An unknown error occurred during registration"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white pb-20"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 py-10 justify-center items-center">
          <View className="items-center mb-10 w-full">
            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-3">
              <Ionicons name="fitness-outline" size={40} color="#1EAFB3" />
            </View>
            <Text className="text-3xl font-bold text-primary text-center">
              HealthFuel
            </Text>
            <Text className="text-lg text-gray-600 mt-2 text-center">
              Create an account
            </Text>
          </View>

          <View className="space-y-6 w-full max-w-sm">
            {/* Personal Information */}
            <Text className="text-lg mb-3 font-medium text-gray-700 text-center">
              Personal Information
            </Text>

            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              className="bg-gray-100 p-4 pl-4 text-base text-gray-800 rounded-xl border border-gray-200"
              placeholderTextColor="#9CA3AF"
            />

            <View className="flex-row space-x-4">
              <TextInput
                placeholder="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                className="flex-1 bg-gray-100 p-4 pl-4 text-base text-gray-800 rounded-xl border border-gray-200"
                placeholderTextColor="#9CA3AF"
              />

              <View className="flex-1 bg-gray-100 rounded-xl border border-gray-200">
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) => setGender(itemValue)}
                  style={{ height: 50 }}
                  dropdownIconColor="#9CA3AF"
                >
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>
            </View>

            <View className="flex-row space-x-4">
              <TextInput
                placeholder="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                className="flex-1 bg-gray-100 p-4 pl-4 text-base text-gray-800 rounded-xl border border-gray-200"
                placeholderTextColor="#9CA3AF"
              />

              <TextInput
                placeholder="Height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="decimal-pad"
                className="flex-1 bg-gray-100 p-4 pl-4 text-base text-gray-800 rounded-xl border border-gray-200"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Account Information */}
            <Text className="text-lg mb-3  font-medium text-gray-700 text-center mt-5">
              Account Information
            </Text>

            <View className="flex-row items-center bg-gray-100 rounded-xl border border-gray-200">
              <View className="pl-4 pr-2">
                <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
              </View>
              <TextInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 p-4 text-base text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="flex-row items-center bg-gray-100 rounded-xl border border-gray-200">
              <View className="pl-4 pr-2">
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
              </View>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="flex-1 p-4 text-base text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="pr-4">
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              disabled={isSubmitting}
              className={`py-4 rounded-xl items-center mt-6 ${
                isSubmitting ? "bg-primary/60" : "bg-primary"
              }`}
              style={{ elevation: 3 }}
            >
              {isSubmitting ? (
                <View className="flex-row items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white text-base font-bold ml-2">
                    Creating Account...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-base font-bold">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-10">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="./login" className="text-primary font-semibold">
              Sign In
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default Register;