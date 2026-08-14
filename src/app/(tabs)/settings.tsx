import { Link } from "expo-router";
import { Text } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


const Settings = () => {
    return (
        <SafeAreaView>
            <Text>Sign in </Text>
            <Text>This is settings </Text>
            <Link href="/(auth)/sign-up">Create account</Link>
        </SafeAreaView>
    )
}

export default Settings
