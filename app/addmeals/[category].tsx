import { useLocalSearchParams, useNavigation } from "expo-router";
import { View, Text, TextInput,TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, ScrollView, Pressable } from "react-native";
import { useLayoutEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";



export default function AddMeals() {
  const { category } = useLocalSearchParams();
  const navigation = useNavigation();

  // Header Style
  useLayoutEffect(() => {
    navigation.setOptions({
      //title: `${category?.toString().toUpperCase()}`,
      title: "",
      headerShown: true,
      headerStyle: {
        backgroundColor: "#b6fdff",
        shadowColor: "transparent",
        elevation: 0,
        borderBottomWidth: 0,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, category]);

  //Sending Meal and Kcal
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState<number | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddMeal = async () => {
    setError("");
    if (!mealName || !mealCalories) {
      setError("Please enter both name and calories.");
      return;
    }

    const user = auth.currentUser;

    setLoading(true);

    const mealToAdd = {
      name: mealName,
      calories: Number(mealCalories),
      mealType: category?.toString().toLowerCase(),
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    };

    if (!user) {
      setError("User is not logged in.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "users", user.uid, "meals"), mealToAdd);
      setMealName("");
      setMealCalories(null);
      console.log("Added Meal", mealToAdd);
      setError(null);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding meal: ", error);
      setError("Could not add meal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Pressable className="flex-1" onPress={Keyboard.dismiss}>
        <View className="bg-secondary flex-1">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1">
              <Text className="text-3xl ml-10 mr-10 mt-20 mb-5 font-semibold self-center">
                {category?.toString().charAt(0).toUpperCase() +
                  category?.toString().slice(1).toLowerCase()}
              </Text>

              <View className="m-10">
                {/* Meal Name Input */}
                <Text className="text-xl font-semibold">Meals</Text>
                <TextInput
                  className="text-xl font-semibold rounded-lg bg-gray-50 p-4 mt-5"
                  keyboardType="default"
                  value={mealName}
                  onChangeText={setMealName}
                />

                {/* Kcal Input */}
                <Text className="font-semibold text-xl mt-10">Kcal</Text>
                <View className="flex-row">
                  <TextInput
                    className="font-semibold text-xl rounded-lg bg-gray-50 mt-5 w-32 p-4"
                    keyboardType="numeric"
                    value={mealCalories?.toString() || ""}
                    onChangeText={(text) => {
                      const mealCaloriesNum = parseInt(text);
                      if (isNaN(mealCaloriesNum)) {
                        setError("Please enter a valid number for calories.");
                        setMealCalories(null);
                      } else {
                        setMealCalories(mealCaloriesNum);
                        setError("");
                      }
                    }}
                  />
                  <Text className="font-semibold text-xl text-primary self-center mt-5 ml-3">
                    Kcal
                  </Text>
                </View>

                {/* Error Text */}
                {error ? (
                  <Text className="text-red-500 mt-10 font-semibold">
                    {error}
                  </Text>
                ) : null}

                {/* Buttons */}
                <View className="flex-row justify-between mt-10">
                  <TouchableOpacity
                    className="bg-white rounded-xl w-40 p-4 items-center justify-center"
                    onPress={() => {
                      setMealName("");
                      setMealCalories(null);
                      setError("");
                    }}
                  >
                    <Text className="text-primary text-center text-xl font-semibold">
                      Clear
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={isLoading}
                    className="bg-primary rounded-xl w-40 p-4 items-center justify-center"
                    onPress={handleAddMeal}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="large" color="#fff" />
                    ) : (
                      <Text className="text-white text-center text-xl font-semibold">
                        Add Meal
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}




