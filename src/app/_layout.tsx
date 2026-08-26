import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { PostHogErrorBoundary, PostHogProvider } from "posthog-react-native";
import { useEffect } from "react";
import { Text, View } from "react-native";

import { posthog } from "@/lib/posthog";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'sans-regular': require('../../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-semibold': require('../../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-light': require('../../assets/fonts/PlusJakartaSans-Light.ttf'),
    'sans-medium': require('../../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-extrabold': require('../../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
  })

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (fontError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Failed to load fonts.</Text>
      </View>
    );
  }

  const content = (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </QueryClientProvider>
  );

  return posthog ? (
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary
        fallback={() => (
          <View className="flex-1 items-center justify-center">
            <Text>Something went wrong. Please restart the app.</Text>
          </View>
        )}
      >
        {content}
      </PostHogErrorBoundary>
    </PostHogProvider>
  ) : content;
}
