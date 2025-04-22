import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Alert, TextInput, ActivityIndicator } from "react-native";
import { Pencil } from "lucide-react-native";
import { useRouter } from "expo-router";
import { db, auth } from "@/firebaseConfig";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

interface MealItem {
  id: string;
  name: string;
  calories: number;
  mealType: string;
  date: string;
}

interface MealsLogProps {
  logTitle: string;
  totalKcal: number;
  mealItem: MealItem[];
  onRefresh?: () => void;
}

export default function MealsLog({
  logTitle,
  totalKcal,
  mealItem,
  onRefresh,
}: MealsLogProps) {
  const router = useRouter();
  const user = auth.currentUser;
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelectedMeal, setCurrentSelectedMeal] = useState<MealItem | null>(null);
  const [newMealName, setNewMealName] = useState<string>("");
  const [newCalories, setNewCalories] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = (meal: MealItem) => {
    setCurrentSelectedMeal(meal);
    setNewMealName(meal.name);
    setNewCalories(meal.calories);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentSelectedMeal(null);
    setNewMealName("");
    setNewCalories(null);
    setError(null);
  };

  // Handle save (update) meal
  const handleModalSaveMeal = async () => {
    setError('');
    if (!newMealName) {
      setError("Meal name cannot be empty.");
      return;
    }
  
    if (newCalories === null || newCalories <= 0) {
      setError("Calories must be a positive number.");
      return;
    }
    setIsLoading(true);
    
    if (!user) {
      setError("User is not logged in.");
      setIsLoading(false);
      return;
    }

    if (currentSelectedMeal) {
      try {
        const mealRef = doc(db, "users", user.uid, "meals", currentSelectedMeal.id);
        await updateDoc(mealRef, {
          name: newMealName.trim(),
          calories: newCalories,
        });
        closeModal();
        onRefresh?.();
      } catch (error) {
        console.error("Error updating meal:", error);
        setError("Could not update meal.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle delete meal
  const handleDelete = async () => {
    if (!user) {
      setError("User is not logged in.");
      return;
    }
    if (currentSelectedMeal) {
      setIsLoading(true);
      try {
        const mealRef = doc(db, "users", user.uid, "meals", currentSelectedMeal.id);
        await deleteDoc(mealRef);
        closeModal();
        onRefresh?.();
      } catch (error) {
        console.error("Error deleting meal:", error);
        setError("Could not delete meal.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View className="bg-white rounded-3xl shadow-sm p-6 mb-5 mx-4">
      {/* Header with meal type and total calories */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <View className="w-1.5 h-8 bg-primary rounded-full mr-2" />
          <Text className="text-xl font-bold text-gray-800 ml-1">{logTitle}</Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-0.5 bg-gray-100 mb-4" />

      {/* Meal Items List */}
      {mealItem.length > 0 ? (
        <View className="space-y-3">
          {mealItem.map((item) => (
            <View key={item.id} className="mb-1">
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-lg font-medium text-gray-800 flex-1 ml-1">
                  {item.name}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-base text-gray-600 mr-3">
                    {item.calories} kcal
                  </Text>
                  <TouchableOpacity
                    onPress={() => openModal(item)}
                    className="p-2"
                  >
                    <Pencil color="#1EAFB3" size={18} />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Subtle divider between items */}
              {mealItem.indexOf(item) !== mealItem.length - 1 && (
                <View className="h-0.5 bg-gray-50 mt-2" />
              )}
            </View>
          ))}
        </View>
      ) : (
        <View className="py-6 items-center">
          <Text className="text-gray-400 text-center">No meals added yet</Text>
        </View>
      )}

      {/* Add Meal Button */}
      <TouchableOpacity
        onPress={() => {
          const category = logTitle.toLowerCase();
          router.push(`/addmeals/${category}`);
        }}
        className="bg-primary mt-6 p-3.5 rounded-xl w-full"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Add {logTitle}
        </Text>
      </TouchableOpacity>

      {/* Modal for Editing or Deleting meal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-center items-center bg-gray-700 bg-opacity-50">
          <View className="bg-white p-6 rounded-2xl w-4/5 shadow-xl">
            <Text className="text-2xl font-semibold mb-6 text-gray-800">Edit Meal</Text>

            <View className="mb-5">
              <Text className="text-base font-medium mb-2 text-gray-700 ml-1">
                Meal Name
              </Text>
              <TextInput
                value={newMealName}
                onChangeText={setNewMealName}
                placeholder="Meal Name"
                className="border-b border-gray-200 mb-1 p-2 text-lg text-gray-800"
              />
            </View>

            <View className="mb-5">
              <Text className="text-base font-medium mb-2 text-gray-700 ml-1">
                Calories
              </Text>
              <View className="flex-row items-center border-b border-gray-200 mb-1 pb-1">
                <TextInput
                  value={newCalories?.toString() || ''}
                  onChangeText={(text) => {
                    const newCaloriesNum = parseInt(text);
                    if (text === "") {
                      setNewCalories(null);
                      setError("");
                    } else if (isNaN(newCaloriesNum)) {
                      setError("Please enter a valid number for calories.");
                      setNewCalories(null);
                    } else {
                      setNewCalories(newCaloriesNum);
                      setError("");
                    }
                  }}
                  keyboardType="numeric"
                  placeholder="0"
                  className="p-2 text-lg text-gray-800 flex-1"
                />
                <Text className="text-primary font-semibold text-lg mr-2">
                  Kcal
                </Text>
              </View>
            </View>

            {/* Error Text */}
            {error ? (
              <View className="mb-5 bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                <Text className="text-red-500 font-medium">{error}</Text>
              </View>
            ) : null}

            {/* Delete - Save Buttons */}
            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Delete Meal",
                    "Are you sure you want to delete this meal?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", onPress: handleDelete, style: "destructive" },
                    ]
                  );
                }}
                className="bg-red-500 p-3 rounded-xl w-24"
                disabled={isLoading}
              >
                <Text className="text-white text-center font-semibold">
                  Delete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={isLoading}
                onPress={handleModalSaveMeal}
                className="bg-primary p-3 rounded-xl w-24"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white text-center font-semibold">
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={closeModal}
              className="mt-4 bg-gray-200 p-3 rounded-xl w-full"
              disabled={isLoading}
            >
              <Text className="text-center font-semibold text-gray-700">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}