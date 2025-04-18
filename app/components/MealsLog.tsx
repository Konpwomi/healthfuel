import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator } from "react-native";
import { Pencil } from "lucide-react-native";
import { db,auth } from "@/firebaseConfig";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelectedMeal, setCurrentSelectedMeal] = useState<MealItem | null>(null);
  const [newMealName, setNewMealName] = useState<string>("");
  const [newCalories, setNewCalories] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const user = auth.currentUser;

  const router = useRouter();

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
  };

  // Handle save (update) meal
  const handleModalSaveMeal = async () => {
    setError('');
    if (!newMealName) {
        setError("Meal name cannot be empty.");
        return;
    }
  
    if (newCalories === null || newCalories <= 0) {
      Alert.alert("Invalid Input", "Calories must be a positive number.");
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
        const mealRef = doc(db, "users", user.uid, "meals", currentSelectedMeal.id); // Replace with dynamic userId
        await updateDoc(mealRef, {
          name: newMealName.trim(),
          calories: newCalories,
        });
        closeModal();
        onRefresh?.();
      } catch (error) {
        console.error("Error updating meal:", error);
        setError("Could Not Update Meal");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle delete meal
  const handleDelete = async () => {
    if (!user) {
      setError("User is not logged in.");
      setIsLoading(false);
      return;
    }
    if (currentSelectedMeal) {
      try {
        const mealRef = doc(db, "users", user.uid, "meals", currentSelectedMeal.id);
        await deleteDoc(mealRef);
        closeModal();
        onRefresh?.();
      } catch (error) {
        console.error("Error deleting meal:", error);
      }
    }
  };

  return ( //Meals Log Boxes
    <View className="bg-white rounded-2xl p-5 ml-10 mr-10 mt-7">
      <View className="flex-row justify-between">
        <Text className="text-xl font-semibold text-primary">{logTitle}</Text>
        <Text className="text-xl font-semibold text-primary">{totalKcal} Kcal</Text>
      </View>

      {/*Horizon Line*/}
      <View className="h-0.5 bg-primary mt-3"></View>

      {mealItem.map((item) => (
        <View key={item.id}>
          <View className="flex-row justify-between m-1">
            <Text className="text-xl font-semibold">{item.name}</Text>
            <View className="flex-row items-center space-x-2">
              <Text className="text-xl font-semibold">{item.calories} Kcal</Text>
              
              {/*Pencil to Popup Modal --> Edit / Delete Meal*/}
              <TouchableOpacity
                onPress={() => openModal(item)} // Open modal for Editing or Deleting
                className="p-2"
              >
                <Pencil color="#1EAFB3" size={15} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider Line below each meal */}   
          <View className="h-0.5 bg-gray-300 my-3" />
        </View>
      ))}

      {/* Add More Meal Button & Route to AddMeals Screen*/}
      <TouchableOpacity
        onPress={() => {
          const category = logTitle.toLowerCase();
          router.push(`/addmeals/${category}`);
        }}
        className="bg-primary p-2 rounded-xl w-full mt-5"
      >
        <Text className="text-white text-center text-xl font-semibold">
          Add More Meal
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
          <View className="bg-white p-6 rounded-xl w-4/5">
            <Text className="text-2xl font-semibold mb-4">Edit Meal</Text>

            <TextInput
              value={newMealName}
              onChangeText={setNewMealName}
              placeholder="Meal Name"
              className="border-b-2 border-gray-400 mb-4 p-2 text-xl"
            />
            <TextInput
              value={newCalories?.toString() || ''}
              onChangeText={(text) => {
                const newCaloriesNum = parseInt(text);
                if(isNaN(newCaloriesNum)){
                    setError("Please enter a valid number for calories.");
                    setNewCalories(null)
                }else{
                    setNewCalories(newCaloriesNum);
                    setError('');
                }
              }}
              keyboardType="numeric"
              placeholder="Calories"
              className="border-b-2 border-gray-400 mb-4 p-2 text-xl"
            />

            {/* Error Text */}
            {error ? (
              <Text className="text-red-500 mt-10 font-semibold">{error}</Text>) : null}

            {/* Delete - Cancel - Save Button in Modal*/}
            <View className="flex-row justify-between">
            <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Delete Meal",
                    "Are you sure you want to delete this meal?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", onPress: handleDelete, style: "destructive" }, //Delete Meal
                    ]
                  );
                }}
                className="bg-red-500 p-2 rounded-xl w-24"
              >
                <Text className="text-white text-center text-xl font-semibold">
                    Delete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={isLoading}
                onPress={() => handleModalSaveMeal()} //Update to Firestore
                className="bg-primary p-2 rounded-xl w-24"
              >
                { isLoading?
                (
                    <ActivityIndicator size="large" color="#fff" />
                ) : ( 
                    <Text className="text-white text-center text-xl font-semibold">
                        Save
                    </Text>
                )
                }
              </TouchableOpacity>

              
            </View>

            <TouchableOpacity
              onPress={closeModal} //Close Modal
              className="mt-4 bg-gray-300 p-2 rounded-xl w-full"
            >
              <Text className="text-center text-xl font-semibold">
                Cancel
            </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
