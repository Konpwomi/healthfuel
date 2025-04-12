import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="bg-white h-full flex items-center gap-10 ">
      <Text className="underline text-3xl">Home</Text>
      <Link href="/profile">Go profile</Link>
    </View> 
  );
}
