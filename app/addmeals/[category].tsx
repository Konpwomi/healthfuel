import { useLocalSearchParams, useNavigation } from "expo-router";
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Platform, 
  ScrollView, 
  Pressable,
  StatusBar
} from "react-native";
import { useLayoutEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function AddMeals() {
  const { category } = useLocalSearchParams();
  const navigation = useNavigation();

  // Header Style
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerShown: true,
      headerStyle: {
        backgroundColor: "#ffffff",
        shadowColor: "#f0f0f0",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        borderBottomWidth: 0,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
          className="p-2 my-4 rounded-full bg-gray-100"
        >
          <Ionicons name="arrow-back" size={22} color="#555" />
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
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1 bg-white pt-20"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Top decorative element */}            
            <View className="flex-1 px-6">
              {/* Category Header */}
              <View className="items-center mt-8 mb-10">
                <Text className="text-3xl font-bold text-gray-800">
                  Add {category?.toString().charAt(0).toUpperCase() + category?.toString().slice(1).toLowerCase()}
                </Text>
                <View className="flex-row items-center mt-2">
                  <View className="h-1 w-48 bg-primary rounded-full mx-1" />
                </View>
              </View>

              {/* Main Form */}
              <View className="bg-white rounded-3xl p-6 pt-10 shadow-md border border-gray-100">
                {/* Meal Name Input */}
                <View className="mb-8">
                  <Text className="text-lg font-semibold mb-3 text-gray-700 ml-1">
                    Meal Name
                  </Text>
                  <View className="border-b border-gray-200 pb-2">
                    <TextInput
                      className="bg-white text-gray-800 px-3 py-3 text-lg"
                      placeholder="What did you eat?"
                      placeholderTextColor="#bdbdbd"
                      value={mealName}
                      onChangeText={setMealName}
                    />
                  </View>
                </View>

                {/* Kcal Input */}
                <View className="mb-1">
                  <Text className="text-lg font-semibold mb-3 text-gray-700 ml-1">
                    Calories
                  </Text>
                  <View className="flex-row items-center border-b border-gray-200 pb-2">
                    <TextInput
                      className="bg-white text-gray-800 px-3 py-3 text-lg flex-1"
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#bdbdbd"
                      value={mealCalories?.toString() || ""}
                      onChangeText={(text) => {
                        const mealCaloriesNum = parseInt(text);
                        if (text === "") {
                          setMealCalories(null);
                          setError("");
                        } else if (isNaN(mealCaloriesNum)) {
                          setError("Please enter a valid number for calories.");
                          setMealCalories(null);
                        } else {
                          setMealCalories(mealCaloriesNum);
                          setError("");
                        }
                      }}
                    />
                    <Text className="text-primary font-semibold text-lg mr-2">
                      Kcal
                    </Text>
                  </View>
                </View>

                {/* Error Message */}
                {error ? (
                  <View className="mb-6 bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                    <Text className="text-red-500 font-medium">
                      {error}
                    </Text>
                  </View>
                ) : null}

                {/* Action Buttons */}
                <View className="flex-row justify-between mt-10">
                  <TouchableOpacity
                    className="bg-gray-100 rounded-xl px-6 py-4 flex-1 mr-3"
                    onPress={() => {
                      setMealName("");
                      setMealCalories(null);
                      setError("");
                    }}
                  >
                    <Text className="text-gray-600 text-center font-semibold text-lg">
                      Clear
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={isLoading}
                    className="bg-primary rounded-xl px-6 py-4 flex-1 ml-3"
                    onPress={handleAddMeal}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text className="text-white text-center font-semibold text-lg">
                        Add Meal
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Tip/Help section */}
              <View className="mt-8 mb-10 bg-gray-50 p-4 rounded-lg">
                <Text className="text-gray-500 text-center text-sm">
                  Track your daily intake by adding all meals and snacks
                </Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}