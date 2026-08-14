import { Link, useLocalSearchParams } from "expo-router";
import { Text } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


const SubscriptionDetails = () => {
    const {id} = useLocalSearchParams()
    return (
        <SafeAreaView>
            <Text>Subscription Details:</Text>
            <Link href="/">Go back</Link>
        </SafeAreaView>
    )
}

export default SubscriptionDetails
