import "@/global.css";
import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text className="text-5xl font-sans-extrabold text-primary">
        Welcome
      </Text>
      <Link href="/(auth)/sign-up" asChild>
        <Pressable className="mt-4 rounded bg-primary p-4">
          <Text className="font-sans-bold text-white">Sign up</Text>
        </Pressable>
      </Link>
      <Link href="/subscriptions/spotify" asChild>
        <Pressable className="mt-4 rounded bg-primary p-4">
          <Text className="font-sans-bold text-white">Spotify Subscription</Text>
        </Pressable>
      </Link>
      <Text className="mt-4 text-center text-sm text-muted-foreground">
        Edit <Text className="font-mono font-bold">src/app/(tabs)/index.tsx</Text> to customize this screen.
      </Text>
    </SafeAreaView>
  );
}