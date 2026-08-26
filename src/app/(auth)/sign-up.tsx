import { posthog } from "@/lib/posthog"
import { Link } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'


const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSignUp = async () => {
        setLoading(true)

        if (!email || !password) {
            Alert.alert("Missing Information", "Please enter both email and password.")
            setLoading(false)
            return
        }
        try{
            const response = await fetch("https://my-app.app.runonflux.io/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email, password: password })
            })
            if (response.status === 400) {
                Alert.alert("Sign-up Error", "Email already exists.")
                setLoading(false)
                return
            }
            const data = await response.json()
            if (response.status === 200){
                posthog?.capture("account_signed_up")
                Alert.alert("Sign-up Successful", "Your account has been created. Please sign in.")
            }
            console.log("Sign-up successful:", data)
            
            setLoading(false)
        } catch (error) {
            Alert.alert("Sign-up Error", "An error occurred while signing up.")
            setLoading(false)
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Sign up</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.textInput}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.textInput}
                secureTextEntry
            />
            <Pressable onPress={handleSignUp} style={styles.button}>
                {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Sign up</Text>}
            </Pressable>
            <Link href="/(auth)/sign-in">Already have an account? Sign in</Link>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
    },
    textInput: {
        width: "70%",
        height: 40,
        borderColor: "#CCCCCC",
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    button: {
        backgroundColor: "#007BFF",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 16,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
    },
})
export default SignUp