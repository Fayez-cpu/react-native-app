import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import "@/global.css";
import { deleteAuthToken, getAuthToken } from "@/lib/auth-storage";
import { formatCurrency } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const queryClient = useQueryClient()
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  const getUser = async () => {
    const token = await getAuthToken()
    console.log(token)
    if (!token){
      router.replace("/sign-in")
      return null
    }
    const response = await fetch("https://my-app.app.runonflux.io/dashboard", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
    if (response.status === 401){
      await deleteAuthToken()
      queryClient.clear()
      router.replace("/sign-in")
      return null
    }
    if (!response.ok){
      throw new Error("Request failed")
    }
      const data = await response.json()
      return data.user
  }

  const getDashboard = async () => {
    
  }

  const {data : user, isLoading: isUserLoading, isError: isUserError, error, refetch} = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 30 * 60 * 1000,
    retry: false,
  })

  const {data: dashboardData, isLoading: isDashboardLoading, isError: isDashboardError,error: dashboardError, refetch: refetchDashboard} = useQuery({
    queryKey: ["dashboardData"],
    queryFn: getDashboard,
    enabled: !!user,
    staleTime: 15 * 60 * 1000
  })  
  const isLoading = isUserLoading || isDashboardLoading
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  if (isUserError) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-lg font-sans-bold">
          We couldn't load your account
        </Text>
        <Text className="mt-2 text-center">
          {error.message}
        </Text>
        <Pressable
          className="mt-5 rounded-lg bg-primary px-5 py-3"
          onPress={() => refetch()}
        >
          <Text className="font-sans-bold text-white">Try again</Text>
        </Pressable>
      </View>
    );
  }
  
  if (isDashboardError) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-lg font-sans-bold">
          We couldn't load your account
        </Text>
        <Text className="mt-2 text-center">
          {dashboardError.message}
        </Text>
        <Pressable
          className="mt-5 rounded-lg bg-primary px-5 py-3"
          onPress={() => refetchDashboard()}
        >
          <Text className="font-sans-bold text-white">Try again</Text>
        </Pressable>
      </View>
    );
  }  

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <ScrollView showsVerticalScrollIndicator={false}>
      <View className="home-header">
        <View className="home-user">
          <Image source={images.avatar} className="home-avatar" />
          <Text className="home-user-name">{user?.email}</Text>
        </View>

        <Image source={icons.add} className="home-add-icon" />
      </View>
      <View className="home-balance-card">
        <Text className="home-balance-label">Balance</Text>

        <View className="home-balance-row">
          <Text className="home-balance-amount">
            {formatCurrency(HOME_BALANCE.amount, "GBP")}
          </Text>
          <Text className="home-balance-date">
            {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
          </Text>
        </View>
      </View>

      <View>
        <ListHeading title="Upcoming" />
        <FlatList 
          data={UPCOMING_SUBSCRIPTIONS} renderItem={({item}) => ( 
            <UpcomingSubscriptionCard {... item} />)} 
            keyExtractor={(item) => item.id}
            horizontal
            nestedScrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={<Text className="home-empty-state">No upcoming renewals yet</Text>}
          />
      </View>
      <View>
        <ListHeading title="All Subscriptions" />

        {HOME_SUBSCRIPTIONS.length === 0 ? <View className="h-4" /> : 
        HOME_SUBSCRIPTIONS.map((item) => (
          <View key={item.id} className="mb-4">
            <SubscriptionCard
              {...item}
              expanded={expandedSubscriptionId === item.id}
              onPress={() => setExpandedSubscriptionId(expandedSubscriptionId === item.id ? null : item.id)}
            />
          </View>
        ))}

      </View>
      </ScrollView>
    </SafeAreaView>
  );
}


/* 
      <Link href="/(auth)/sign-up" asChild>
        <Pressable className="mt-4 rounded bg-primary p-4">
          <Text className="font-sans-bold text-white">Sign up</Text>
        </Pressable>
      </Link>
*/