import { saveAuthToken } from "@/lib/auth-storage"
import { posthog } from "@/lib/posthog"
import { Link, router } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

const SignIn = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSignIn = async () => {
        setLoading(true)

        if (!email || !password) {
            Alert.alert("Missing Information", "Please enter both email and password.")
            setLoading(false)
            return
        }
        try{
            const response = await fetch("https://my-app.app.runonflux.io/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email, password: password })
            })
            if (response.status === 400) {
                Alert.alert("Sign-in Error", "Invalid email or password.")
                setLoading(false)
                return
            }
            const data = await response.json()
            console.log(data)
            await saveAuthToken(data.token)
            posthog?.capture("user_signed_in")
            setLoading(false)
            router.replace("/")
        } catch (error) {
            Alert.alert("Sign-in Error", "An error occurred while signing in.")
            setLoading(false)
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Sign in</Text>
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
           
            <Pressable onPress={handleSignIn} style={styles.button}>
                {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Sign in</Text>}
            </Pressable>
             <Link href="/sign-up">Create account</Link>
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
        borderRadius: 4,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 16,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
})

export default SignIn
