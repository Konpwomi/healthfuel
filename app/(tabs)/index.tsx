import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { db, auth } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import MealsLog from "../components/MealsLog";

const Meals = () => {
  const user = auth.currentUser;
  const [breakfastMeals, setBreakfastMeals] = useState<any[]>([]);
  const [lunchMeals, setLunchMeals] = useState<any[]>([]);
  const [dinnerMeals, setDinnerMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMealData = useCallback(async () => {
    if (!user) {
      setError("User is not logged in.");
      setLoading(false);
      return;
    }

    try {
      const mealDataCol = collection(db, "users", user.uid, "meals");
      const mealDataSnapshot = await getDocs(mealDataCol);
      const allMeals = mealDataSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          calories: data.calories,
          mealType: data.mealType,
          date: data.date,
        };
      });

      // Filter Today's Meal
      const today = new Date().toISOString().split("T")[0];
      const todayMeals = allMeals.filter((meal) => meal.date === today);
      
      // Filter Today's Meal Category
      const todaysBreakfastMeals = todayMeals.filter((meal) => meal.mealType === "breakfast");
      const todaysLunchMeals = todayMeals.filter((meal) => meal.mealType === "lunch");
      const todaysDinnerMeals = todayMeals.filter((meal) => meal.mealType === "dinner");

      setBreakfastMeals(todaysBreakfastMeals);
      setLunchMeals(todaysLunchMeals);
      setDinnerMeals(todaysDinnerMeals);
      setError(null);
    } catch (err) {
      console.error("Error fetching meals:", err);
      setError("Failed to fetch meals data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMealData();
  }, [fetchMealData]);

  useFocusEffect(
    useCallback(() => {
      fetchMealData();
    }, [fetchMealData])
  ); 

  const calculateTotalKcal = (meals: { calories?: number }[]): number => {
    return meals.reduce((total, meal) => total + (meal.calories || 0), 0);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Enhanced Header Section */}
        <View className="pt-10 pb-6 mb-8">
          <Text className="text-3xl font-bold text-primary">
            Today's Meals
          </Text>
          <View className="h-1.5 w-20 bg-primary rounded-full mt-2" />
        </View>
        
        {error && (
          <View className="mb-4 p-3 bg-red-100 rounded-lg">
            <Text className="text-red-700">{error}</Text>
          </View>
        )}
        
        {/* Meals Log Components */}
        <MealsLog 
          logTitle="Breakfast"
          totalKcal={calculateTotalKcal(breakfastMeals)}
          mealItem={breakfastMeals}
          onRefresh={fetchMealData}
        />

        <MealsLog 
          logTitle="Lunch" 
          totalKcal={calculateTotalKcal(lunchMeals)}
          mealItem={lunchMeals}
          onRefresh={fetchMealData}
        />

        <MealsLog 
          logTitle="Dinner"
          totalKcal={calculateTotalKcal(dinnerMeals)}
          mealItem={dinnerMeals}
          onRefresh={fetchMealData}
        />
      </ScrollView>
    </View>
  );
};

export default Meals;