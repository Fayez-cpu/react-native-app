import {View, Text} from 'react-native'
import React from 'react'
import {Link} from "expo-router"


const Insights = () => {
    return (
        <View>
            <Text>Sign in</Text>
            <Link href="/(auth)/sign-up">Creat account</Link>
        </View>
    )
}

export default Insights
