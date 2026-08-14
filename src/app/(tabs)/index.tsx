import "@/global.css";
import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link href="/(auth)/sign-up" className="mt-4 rounded bg-primary text-white p-4">Sign up</Link>
      <Link href="/subscriptions/spotify" className="mt-4 rounded bg-primary text-white p-4">Spotify Subscription</Link>
      <Text className="mt-4 text-center text-sm text-muted-foreground">
        Edit <Text className="font-mono font-bold">src/app/(tabs)/index.tsx</Text> to customize this screen.
      </Text>
    </SafeAreaView>
  );
}