import { Link } from "expo-router";
import { Text } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


const Subscriptions = () => {
    return (
        <SafeAreaView>
            <Text>Subscriptions</Text>
            <Link href="/(auth)/sign-up">Create account</Link>
        </SafeAreaView>
    )
}

export default Subscriptions
