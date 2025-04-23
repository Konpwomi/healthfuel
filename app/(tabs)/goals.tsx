import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { ListItem } from 'react-native-elements';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const goals = () => {
  const [activeView, setActiveView] = useState<'day' | 'week'>('day');
  const [dayData, setDayData] = useState({ breakfast: 0, lunch: 0, dinner: 0 });
  const [weekData, setWeekData] = useState<number[]>([]);
  const [weekHistoryData, setWeekHistoryData] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2500);
  const [loading, setLoading] = useState(true);

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
        
        // ดึงข้อมูลจาก collection "meals" โดยตรง (ตามโครงสร้าง Firebase ที่ให้มา)
        const q = collection(db, 'users', userId, 'meals');
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
        const todayDate = new Date();
        const weekDates = [...Array(7)].map((_, i) => {
          const d = new Date(todayDate);
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        });

        const dailyTotals = weekDates.reverse().map(date => {
          const dailyMeals = allMeals.filter(m => m.date === date);
          return dailyMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
        });

        setWeekData(dailyTotals);
        setWeekHistoryData(
          weekDates.map(date => ({
            date,
            meals: allMeals.filter(m => m.date === date)
          }))
        );

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
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{ data: weekData }],
      };

  const totalDayCalories = dayData.breakfast + dayData.lunch + dayData.dinner;

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
          <Text style={styles.sectionHeader}>History Meals</Text>
          {activeView === 'day' ? (
            <>
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
            weekHistoryData.map((day, index) => (
              <View key={index}>
                <Text style={styles.sectionHeader}>{day.date}</Text>
                {day.meals.map((meal: any, i: number) => (
                  <ListItem key={i} bottomDivider>
                    <ListItem.Content>
                      <ListItem.Title>{meal.mealType} - {meal.name}</ListItem.Title>
                      <ListItem.Subtitle>{meal.calories} cal</ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                ))}
              </View>
            ))
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
  sectionHeader: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
});

export default goals;