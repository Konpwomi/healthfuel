import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useProfile } from "../../context/profileContext";

const Metric = () => {
  const { profileData } = useProfile();

  const [activeTab, setActiveTab] = useState("BMI Check");

  // Initialize with profile data or empty strings
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("male");

  const [bmi, setBmi] = useState<string | null>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [totalCalories, setTotalCalories] = useState<number | null>(null);

  // Use effect to update the values when profileData changes
  useEffect(() => {
    if (profileData) {
      if (profileData.weight) setWeight(profileData.weight.toString());
      if (profileData.height) setHeight(profileData.height.toString());
      if (profileData.age) setAge(profileData.age.toString());
      if (profileData.gender)
        setSex(profileData.gender.toLowerCase() === "male" ? "male" : "female");
    }
  }, [profileData]);

  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = parseFloat(height) / 100;
      const bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(2));
    }
  };

  const getBMIStatus = (bmiValue: number) => {
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue >= 18.5 && bmiValue <= 24.9) return "Normal BMI";
    if (bmiValue >= 25 && bmiValue <= 29.9) return "Overweight";
    return "Obesity";
  };

  const calculateBMR = () => {
    if (weight && height && age) {
      const weightInKg = parseFloat(weight);
      const heightInCm = parseFloat(height);
      const ageInYears = parseInt(age, 10);

      let bmrValue = 0;
      if (sex === "male") {
        bmrValue = 10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears + 5;
      } else {
        bmrValue = 10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears - 161;
      }

      setCalories(parseFloat(bmrValue.toFixed(2)));
    }
  };

  const calculateTotalCalories = () => {
    if (calories) {
      let multiplier = 1.2; // Default for sedentary
      switch (activityLevel) {
        case "light":
          multiplier = 1.375;
          break;
        case "moderate":
          multiplier = 1.55;
          break;
        case "active":
          multiplier = 1.725;
          break;
        case "veryActive":
          multiplier = 1.9;
          break;
      }
      setTotalCalories(parseFloat((calories * multiplier).toFixed(2)));
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Tabs */}
      <View className="flex-row border-2 rounded-xl border-primary justify-center mt-10 space-x-2 mx-10">
        <TouchableOpacity
          className={`flex-1 py-3 items-center rounded-lg ${
            activeTab === "BMI Check" ? "bg-primary" : "bg-white"
          }`}
          onPress={() => setActiveTab("BMI Check")}
        >
          <Text
            className={`text-lg ${
              activeTab === "BMI Check"
                ? "text-white font-bold"
                : "text-gray-500"
            }`}
          >
            BMI Check
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center rounded-lg ${
            activeTab === "Calorie Count" ? "bg-primary" : "bg-white"
          }`}
          onPress={() => setActiveTab("Calorie Count")}
        >
          <Text
            className={`text-lg ${
              activeTab === "Calorie Count"
                ? "text-white font-bold"
                : "text-gray-500"
            }`}
          >
            Calorie Count
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="justify-center gap-10 items-center mx-10">
        <View className="w-full mt-7">
          <Text className="text-xl font-semibold mb-2">
            {activeTab === "BMI Check"
              ? "BMI Calculator"
              : "Calorie Calculator"}
          </Text>
          <View className="h-[2px] bg-primary w-full rounded-full" />
        </View>
        {activeTab === "BMI Check" ? (
          <>
            {/* BMI Input Card */}
            <View className="w-full bg-white py-7 px-10 rounded-lg shadow-md">
              <Text className="text-lg font-bold text-gray-700 mb-3">
                Weight (kg) :
              </Text>
              <TextInput
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
                keyboardType="numeric"
                placeholder="Enter your weight"
                value={weight}
                onChangeText={setWeight}
              />
              <Text className="text-lg font-bold text-gray-700 mb-3">
                Height (cm) :
              </Text>
              <TextInput
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-5"
                keyboardType="numeric"
                placeholder="Enter your height"
                value={height}
                onChangeText={setHeight}
              />
              <TouchableOpacity
                className="bg-primary py-3 rounded-lg"
                onPress={calculateBMI}
              >
                <Text className="text-white text-center font-bold">
                  Calculate
                </Text>
              </TouchableOpacity>
            </View>

            {/* BMI Result Card */}
            <View className="w-full bg-white p-5 rounded-lg shadow-md">
              <Text className="text-2xl font-bold text-center mb-3">
                BMI Result
              </Text>
              <Text className="text-5xl font-bold text-primary text-center mb-3">
                {bmi ? parseFloat(bmi).toFixed(2) : "0.00"}
              </Text>
              <Text className="text-2xl font-bold text-gray-700 text-center">
                {bmi ? getBMIStatus(parseFloat(bmi)) : "Calculate Your BMI"}
              </Text>
              <Text className="text-sm text-gray-500 text-center mt-3">
                Underweight: BMI less than 18.5{"\n"}
                Normal weight: BMI 18.5 to 24.9{"\n"}
                Overweight: BMI 25 to 29.9{"\n"}
                Obesity: BMI 30 or higher
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* Calorie Input Card */}
            <View className="w-full bg-white py-7 px-10 rounded-lg shadow-md">
              <Text className="text-lg font-bold text-gray-700 mb-3">Sex:</Text>
              <View className="w-full border border-gray-300 rounded-lg mb-3">
                <Picker
                  selectedValue={sex}
                  style={{ height: 50, width: "100%" }}
                  onValueChange={(itemValue) => setSex(itemValue)}
                >
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                </Picker>
              </View>
              <Text className="text-lg font-bold text-gray-700 mb-3">Age:</Text>
              <TextInput
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
                keyboardType="numeric"
                placeholder="Enter your age"
                value={age}
                onChangeText={setAge}
              />
              <Text className="text-lg font-bold text-gray-700 mb-3">
                Weight (kg):
              </Text>
              <TextInput
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
                keyboardType="numeric"
                placeholder="Enter your weight"
                value={weight}
                onChangeText={setWeight}
              />
              <Text className="text-lg font-bold text-gray-700 mb-3">
                Height (cm):
              </Text>
              <TextInput
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-5"
                keyboardType="numeric"
                placeholder="Enter your height"
                value={height}
                onChangeText={setHeight}
              />
              <TouchableOpacity
                className="bg-primary py-3 rounded-lg"
                onPress={calculateBMR}
              >
                <Text className="text-white text-center font-bold">
                  Calculate
                </Text>
              </TouchableOpacity>
            </View>

            {/* Calorie Result Card */}
            <View className="w-full p-5 rounded-lg border-2 border-primary">
              <Text className="text-2xl font-bold text-center text-gray-800 mb-3">
                Calorie Result
              </Text>
              <Text className="text-5xl font-bold text-primary text-center mb-3">
                {calories !== null ? calories.toFixed(2) : "0.00"}
              </Text>
              <Text className="text-lg text-gray-700 text-center">
                {calories !== null
                  ? `Your daily calorie requirement is ${calories} kcal.`
                  : "Calculate Your Calories"}
              </Text>
            </View>

            {/* Activity Level Card */}
            <View className="w-full bg-white py-7 px-10 rounded-lg shadow-md">
              <Text className="text-lg font-bold text-gray-700 mb-3">
                Activity Level:
              </Text>
              <View className="w-full border border-gray-300 rounded-lg mb-5">
                <Picker
                  selectedValue={activityLevel}
                  style={{ height: 55, width: "100%" }}
                  onValueChange={(itemValue) => setActivityLevel(itemValue)}
                >
                  <Picker.Item label="Sedentary" value="sedentary" />
                  <Picker.Item label="Lightly active" value="light" />
                  <Picker.Item label="Moderately active" value="moderate" />
                  <Picker.Item label="Very active" value="active" />
                  <Picker.Item label="Extra active" value="veryActive" />
                </Picker>
              </View>
              <TouchableOpacity
                className="bg-primary py-3 rounded-lg"
                onPress={calculateTotalCalories}
              >
                <Text className="text-white text-center font-bold">
                  Calculate
                </Text>
              </TouchableOpacity>
            </View>

            {/* Total Calorie Result Card */}
            <View className="w-full p-5 rounded-lg border-2 border-primary">
              <Text className="text-xl font-bold text-center mb-3">
                Total Calorie Requirement
              </Text>
              <Text className="text-5xl font-bold text-primary text-center mb-3">
                {totalCalories !== null ? totalCalories.toFixed(2) : "0.00"}
              </Text>
              <Text className="text-lg text-gray-700 text-center">
                {totalCalories !== null
                  ? `Your total calorie requirement is ${totalCalories} kcal.`
                  : "Select your activity level and calculate."}
              </Text>
            </View>
            {/* Recommendation Section */}
            <View className="w-full bg-white p-10 rounded-lg shadow-md mb-10">
              <Text className="text-2xl font-bold text-center mb-5 text-primary">
                BMR & TDEE Tips and Tricks!
              </Text>
              <View className="space-y-4">
                <View className=" mb-5">
                  <Text className="text-lg font-semibold text-gray-800">
                    Boost Your BMR (Slightly):
                  </Text>
                  <Text className="text-gray-700 mt-1">
                    <Text className="font-bold">Muscle Up:</Text> Muscle burns
                    more calories at rest than fat. Consider incorporating
                    strength training to increase your muscle mass, which can
                    give your BMR a small but long-term boost.
                  </Text>
                  <Text className="text-gray-700 mt-1">
                    <Text className="font-bold">Spicy Things Up:</Text>{" "}
                    Capsaicin, a compound found in chili peppers, may
                    temporarily increase your metabolic rate. However, the
                    effect is small and tolerance can build.
                  </Text>
                </View>
                <View>
                  <Text className="text-lg font-semibold text-gray-800">
                    Be Mindful of TDEE Calculations:
                  </Text>
                  <Text className="text-gray-700 mt-1">
                    <Text className="font-bold">Honesty is Key:</Text> Activity
                    levels can be tricky to estimate. Be honest with yourself
                    about your daily movement. Don't overestimate workouts and
                    underestimate daily activities like fidgeting.
                  </Text>
                  <Text className="text-gray-700 mt-1">
                    <Text className="font-bold">Track and Adjust:</Text> Use a
                    calorie tracking app or monitor your weight for a few weeks
                    after calculating your TDEE. Fine-tune your calorie intake
                    based on observed weight changes.
                  </Text>
                  <Text className="text-gray-700 mt-1">
                    <Text className="font-bold">
                      Beware the Weekend Warrior:
                    </Text>{" "}
                    If you're very active on weekends but mostly sedentary
                    during the week, your TDEE calculation might be inaccurate.
                    Consider averaging your activity level throughout the week.
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default Metric;
