import { useAuthStore } from '@/presentation/auth/store/use-auth-store'
import ThemedButton from '@/presentation/theme/components/themed-button'
import ThemedLink from '@/presentation/theme/components/themed-link'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import ThemedTextInput from '@/presentation/theme/components/themed-text-input'
import { useTheme } from '@/presentation/theme/hooks/use-theme'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, KeyboardAvoidingView, ScrollView, useWindowDimensions, View } from 'react-native'

const LoginScreen = () => {
    const { height } = useWindowDimensions()
    const bgColor = useTheme().background
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const [isPosting, setIsPosting] = useState(false)
    const { login } = useAuthStore()

    const onLogin = async () => {
        const { email, password } = form
        console.log(`${email} ${password}`)
        if (email.length === 9 || password.length === 0) {
            return
        }
        setIsPosting(true)
        const success = await login(email, password)
        setIsPosting(false)
        if (success) {
            router.replace('/')
            return
        }

        Alert.alert('error', 'invalid username or password')
    }

    return (
        <KeyboardAvoidingView behavior='padding' style={{
            flex: 1
        }}>
            <ScrollView style={{
                paddingHorizontal: 40,
                backgroundColor: bgColor
            }}>
                <View style={{ paddingTop: height * .35 }}>
                    <ThemedText type='title'>login</ThemedText>
                    <ThemedText style={{ color: 'grey' }}>please log in to continue</ThemedText>
                </View>
                <View style={{ marginTop: 20 }}>
                    <ThemedTextInput
                        placeholder='email'
                        keyboardType='email-address'
                        autoCapitalize='none'
                        icon='mail-outline'
                        value={form.email}
                        onChangeText={(val) => setForm({ ...form, email: val })}
                    />
                    <ThemedTextInput
                        placeholder='password'
                        secureTextEntry
                        autoCapitalize='none'
                        icon='lock-closed-outline'
                        value={form.password}
                        onChangeText={(val) => setForm({ ...form, password: val })}
                    />
                    <View style={{ marginTop: 10 }} />
                    <ThemedButton
                        icon='arrow-forward-outline'
                        onPress={onLogin}
                        disabled={isPosting}
                    >log in</ThemedButton>
                    <View style={{ marginBottom: 40 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <ThemedText>don't have an account?</ThemedText>
                        <ThemedLink href='/auth/register' style={{ marginHorizontal: 10 }}>create an account</ThemedLink>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen