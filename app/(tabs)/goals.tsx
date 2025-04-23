import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { ListItem } from 'react-native-elements';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const goals = () => {
  const [activeView, setActiveView] = useState<'day' | 'week'>('day');
  const [dayData, setDayData] = useState({ breakfast: 0, lunch: 0, dinner: 0 });
  const [weekData, setWeekData] = useState<number[]>([]);
  const [weekHistoryData, setWeekHistoryData] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2500);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันคำนวณวันในสัปดาห์
  const getCurrentWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const startDate = new Date(today);
    
    // หาวันจันทร์ของสัปดาห์นี้
    startDate.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    // สร้าง array ของวันที่ทั้งสัปดาห์
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return {
        dateString: date.toISOString().split('T')[0],
        dayName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        fullDayName: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i],
        dateObject: date
      };
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) setUserId(user.uid);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchMeals = async () => {
      try {
        setLoading(true);
        
        const q = query(
          collection(db, 'users', userId, 'meals'),
          orderBy('date', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const allMeals = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name as string,
          calories: doc.data().calories as number,
          mealType: doc.data().mealType as 'breakfast' | 'lunch' | 'dinner',
          date: doc.data().date as string,
          userId: doc.data().userId as string
        }));

        // ประมวลผลข้อมูลประจำวัน
        const today = new Date().toISOString().split('T')[0];
        const todayMeals = allMeals.filter(meal => meal.date === today);
        
        const breakfast = todayMeals
          .filter(m => m.mealType === 'breakfast')
          .reduce((sum, m) => sum + (m.calories || 0), 0);
          
        const lunch = todayMeals
          .filter(m => m.mealType === 'lunch')
          .reduce((sum, m) => sum + (m.calories || 0), 0);
          
        const dinner = todayMeals
          .filter(m => m.mealType === 'dinner')
          .reduce((sum, m) => sum + (m.calories || 0), 0);

        setDayData({ breakfast, lunch, dinner });

        // ประมวลผลข้อมูลประจำสัปดาห์
        const weekDates = getCurrentWeekDates();
        
        const dailyTotals = weekDates.map(day => {
          const dailyMeals = allMeals.filter(m => m.date === day.dateString);
          return dailyMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
        });

        setWeekData(dailyTotals);
        
        // เก็บข้อมูลสำหรับแสดงประวัติ
        const weekHistory = weekDates.map(day => ({
          date: day.dateString,
          dayName: day.dayName,
          fullDayName: day.fullDayName,
          dateObject: day.dateObject,
          totalCalories: allMeals
            .filter(m => m.date === day.dateString)
            .reduce((sum, m) => sum + (m.calories || 0), 0),
          meals: allMeals.filter(m => m.date === day.dateString)
        }));

        setWeekHistoryData(weekHistory);
        
        // เลือกวันปัจจุบันโดยอัตโนมัติ
        setSelectedDay(today);

      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [userId]);

  const barChartData = activeView === 'day'
    ? {
        labels: ['Breakfast', 'Lunch', 'Dinner'],
        datasets: [{ data: [dayData.breakfast, dayData.lunch, dayData.dinner] }],
      }
    : {
        labels: weekHistoryData.map(day => day.dayName),
        datasets: [{ data: weekData }],
      };

  const totalDayCalories = dayData.breakfast + dayData.lunch + dayData.dinner;

  const selectedDayData = weekHistoryData.find(day => day.date === selectedDay);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#57B4BA" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, {
            backgroundColor: activeView === 'day' ? '#FFFFFF' : '#57B4BA',
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20
          }]}
          onPress={() => setActiveView('day')}
        >
          <Text style={{ color: activeView === 'day' ? '#000' : '#FFF', fontSize: 18, fontWeight: 'bold' }}>Day</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, {
            backgroundColor: activeView === 'week' ? '#FFFFFF' : '#57B4BA',
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20
          }]}
          onPress={() => setActiveView('week')}
        >
          <Text style={{ color: activeView === 'week' ? '#000' : '#FFF', fontSize: 18, fontWeight: 'bold' }}>Week</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rectangle}>
        <Text style={styles.title}>
          {activeView === 'day' ? `Calorie Now : ${totalDayCalories}/${dailyCalorieGoal}` : 'Weekly Summary'}
        </Text>
        <Text style={styles.subTitle}>
          {activeView === 'day' ? `Today : ${new Date().toLocaleDateString()}` : 'Week Summary'}
        </Text>

        <BarChart
          data={barChartData}
          width={Dimensions.get('window').width - 90}
          height={250}
          yAxisLabel=''
          yAxisSuffix=" cal"
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(34, 139, 230, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            barPercentage: 0.6,
          }}
          showValuesOnTopOfBars
          style={{ marginVertical: 20, borderRadius: 10, alignSelf: 'center' }}
        />

        <ScrollView style={{ width: '100%' }}>
          {activeView === 'day' ? (
            <>
              <Text style={styles.sectionHeader}>Today's Meals</Text>
              <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>Breakfast</ListItem.Title>
                  <ListItem.Subtitle>{dayData.breakfast} cal</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
              <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>Lunch</ListItem.Title>
                  <ListItem.Subtitle>{dayData.lunch} cal</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
              <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>Dinner</ListItem.Title>
                  <ListItem.Subtitle>{dayData.dinner} cal</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            </>
          ) : (
            <>
              <Text style={styles.sectionHeader}>Select a Day</Text>
              <View style={styles.daySelectorContainer}>
                {weekHistoryData.map((day) => (
                  <TouchableOpacity
                    key={day.date}
                    style={[
                      styles.dayButton,
                      selectedDay === day.date && styles.selectedDayButton
                    ]}
                    onPress={() => setSelectedDay(day.date)}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      selectedDay === day.date && styles.selectedDayButtonText
                    ]}>
                      {day.dayName}
                    </Text>
                    <Text style={styles.dayButtonDate}>
                      {day.dateObject.getDate()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedDayData && (
                <>
                  <Text style={styles.sectionHeader}>
                    {selectedDayData.fullDayName} - {selectedDayData.date}
                  </Text>
                  <Text style={styles.totalCaloriesText}>
                    Total: {selectedDayData.totalCalories} cal
                  </Text>
                  
                  {selectedDayData.meals.length > 0 ? (
                    selectedDayData.meals.map((meal: any, i: number) => (
                      <ListItem key={i} bottomDivider>
                        <ListItem.Content>
                          <ListItem.Title>
                            {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)} - {meal.name}
                          </ListItem.Title>
                          <ListItem.Subtitle>{meal.calories} cal</ListItem.Subtitle>
                        </ListItem.Content>
                      </ListItem>
                    ))
                  ) : (
                    <Text style={styles.noMealsText}>No meals recorded for this day</Text>
                  )}
                </>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#FFF' },
  toggleContainer: { flexDirection: 'row', marginTop: 60 },
  toggleButton: {
    width: 150, height: 55, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#57B4BA'
  },
  rectangle: {
    width: 350, height: 650, backgroundColor: '#FFF',
    position: 'absolute', top: 150, borderRadius: 20, padding: 20,
    borderWidth: 2, borderColor: '#57B4BA', alignItems: 'center'
  },
  title: { color: '#57B4BA', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  sectionHeader: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginTop: 10, 
    marginBottom: 15,
    color: '#57B4BA'
  },
  daySelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayButton: {
    width: 40,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 2,
  },
  selectedDayButton: {
    backgroundColor: '#57B4BA',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedDayButtonText: {
    color: '#FFF',
  },
  dayButtonDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  totalCaloriesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#57B4BA',
    marginBottom: 15,
    textAlign: 'center',
  },
  noMealsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
  },
});

export default goals;