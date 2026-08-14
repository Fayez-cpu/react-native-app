import { Link } from "expo-router"
import { Text, View } from 'react-native'


const SignIn = () => {
    return (
        <View>
            <Text>Sign in</Text>
            <Link href="/settings">Create account</Link>
        </View>
    )
}

export default SignIn
