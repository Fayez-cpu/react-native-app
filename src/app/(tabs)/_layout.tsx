import { tabs } from "@/constants/data";
import { colors, components } from "@/constants/theme";
import { deleteAuthToken, getAuthToken } from "@/lib/auth-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { } from "expo-image";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
const tabBar = components.tabBar;

interface TabIconProps {
  focused: boolean;
  icon: any;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const getUser = async () => {
    const token = await getAuthToken();

    if (!token) {
      router.replace("/sign-in")
      return null;
    }

    const response = await fetch("https://my-app.app.runonflux.io/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(response)
    if (response.status === 401) {
      await deleteAuthToken();
      queryClient.clear();
      router.replace("/sign-in")
      return null;
    }

    if (!response.ok) {
      throw new Error("Unable to verify your session");
    }

    const data = await response.json();
    return data.user;
  };



  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 30 * 60 * 1000,
    retry: false,
  });

  
  const {data: dashboard, isLoading: isDashboardLoading} = useQuery({
    queryKey: ["dashboardData"],
    queryFn: getDashboard,
    enabled: !!user,
    staleTime: 15 * 60 * 1000
  })

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center">Logging in failed. Please try again later.</Text>
        
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const TabIcon = ({focused, icon}: TabIconProps) => {
    return (
      <View className="tabs-icon">
          <View className={clsx('tabs-pill', focused && 'tabs-active')}>
            <Image source={icon}  className="tabs-glyph" />
          </View>
      </View>
    )
  }
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: "#000000",
      tabBarShowLabel: false,
      tabBarStyle: {
        position: "absolute",
        bottom: Math.max(insets.bottom, tabBar.horizontalInset),
        height: tabBar.height,
        marginHorizontal: tabBar.horizontalInset,
        borderRadius: tabBar.radius,
        backgroundColor: colors.primary,
        borderTopWidth: 0,
        elevation: 0,
      },
      tabBarItemStyle: {
        paddingVertical: tabBar.height / 2 - tabBar.iconFrame/ 1.6,

      },
      tabBarIconStyle: {
        width: tabBar.iconFrame,
        height: tabBar.iconFrame,
        alignItems: "center",
      }
      }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={tab.icon} />,
          }}
        />
      ))}
      <Tabs.Screen name="subscriptions/[id]" options={{ href: null }} />
    </Tabs>
  );
}
