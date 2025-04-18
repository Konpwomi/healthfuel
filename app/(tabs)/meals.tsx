import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MealsLog from "../components/MealsLog";
import { useState, useEffect, useCallback } from "react";
import { db, auth } from "@/firebaseConfig";
import { collection } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { useFocusEffect } from "expo-router";

const meals = () => {
  const user = auth.currentUser;
  console.log("Current user:", auth.currentUser?.uid);
  const [breakfastMeals, setBreakfastMeals] = useState<any[]>([]);
  const [lunchMeals, setLunchMeals] = useState<any[]>([]);
  const [dinnerMeals, setDinnerMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
        const today = new Date().toISOString().split("T")[0]; // "2025-04-13"
        const todayMeals = allMeals.filter((meal) => meal.date === today);
        
        // Filter Today's Meal Category
        const todaysBreakfastMeals = todayMeals.filter((meal) => meal.mealType === "breakfast");
        const todaysLunchMeals = todayMeals.filter((meal) => meal.mealType === "lunch");
        const todaysDinnerMeals = todayMeals.filter((meal) => meal.mealType === "dinner");
        console.log("todaysBreakfastMeals", todaysBreakfastMeals);
        console.log("todaysLunchMeals", todaysLunchMeals);
        console.log("todaysDinnerMeals", todaysDinnerMeals);

        setBreakfastMeals(todaysBreakfastMeals);
        setLunchMeals(todaysLunchMeals);
        setDinnerMeals(todaysDinnerMeals);

      } catch (err) {
        console.error("Error fetching meals:", err);
        setError("Failed to fetch meals data.");
      } finally {
        setLoading(false);
      }
    }, [user]);
    
    useFocusEffect(
      useCallback(() => {
        fetchMealData();
      }, [fetchMealData])
    ); 

  const calculateTotalKcal = (meals: { calories?: number }[]): number => {
    return meals.reduce((total, meal) => total + (meal.calories || 0), 0);
  };

  return (
    <View className="flex-1">
      {/* Linear Gradient Background */}
      <LinearGradient className="flex-1"
        colors={["#b6fdff", "#e1f7f7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header*/}
          <Text className="text-3xl ml-10 mr-10 mt-20 mb-5 font-semibold">Today's Meal</Text>
          {/* Meals Log Breakfast*/}
          <MealsLog 
            logTitle={"Breakfast"}
            totalKcal={calculateTotalKcal(breakfastMeals)}
            mealItem={breakfastMeals}
            onRefresh = {fetchMealData}
            />

          {/* Meals Log Lunch*/}
          <MealsLog 
            logTitle={"Lunch"} 
            totalKcal={calculateTotalKcal(lunchMeals)}
            mealItem={lunchMeals}
            onRefresh = {fetchMealData}
            />

          {/* Meals Log Dinner*/}
          <MealsLog 
            logTitle={"Dinner"}
            totalKcal={calculateTotalKcal(dinnerMeals)}
            mealItem={dinnerMeals}
            onRefresh = {fetchMealData}
            />
            
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default meals;

const styles = StyleSheet.create({
});
