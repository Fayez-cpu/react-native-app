import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import "@/global.css";
import { posthog } from "@/lib/posthog";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { useState } from "react";
import { FlatList, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
 
export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <ScrollView showsVerticalScrollIndicator={false}>
      <View className="home-header">
        <View className="home-user">
          <Image source={images.avatar} className="home-avatar" />
          <Text className="home-user-name">{HOME_USER.name}</Text>
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
              onPress={() => {
                const isExpanding = expandedSubscriptionId !== item.id;
                setExpandedSubscriptionId(isExpanding ? item.id : null);

                if (isExpanding) {
                  posthog?.capture("subscription_details_expanded", {
                    subscription_id: item.id,
                    ...(item.category && { subscription_category: item.category }),
                  });
                }
              }}
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