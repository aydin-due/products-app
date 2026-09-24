import ThemedButton from '@/presentation/theme/components/themed-button'
import ThemedLink from '@/presentation/theme/components/themed-link'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import ThemedTextInput from '@/presentation/theme/components/themed-text-input'
import { useTheme } from '@/presentation/theme/hooks/use-theme'
import { KeyboardAvoidingView, ScrollView, useWindowDimensions, View } from 'react-native'

const RegisterScreen = () => {
    const { height } = useWindowDimensions()
    const bgColor = useTheme().background

    return (
        <KeyboardAvoidingView behavior='padding' style={{
            flex: 1
        }}>
            <ScrollView style={{
                paddingHorizontal: 40,
                backgroundColor: bgColor
            }}>
                <View style={{ paddingTop: height * .35 }}>
                    <ThemedText type='title'>create an account</ThemedText>
                    <ThemedText style={{ color: 'grey' }}>please create an account to continue</ThemedText>
                </View>
                <View style={{ marginTop: 20 }}>
                    <ThemedTextInput
                        placeholder='name'
                        autoCapitalize='words'
                        icon='person-outline'
                    />
                    <ThemedTextInput
                        placeholder='password'
                        secureTextEntry
                        autoCapitalize='none'
                        icon='lock-closed-outline'
                    />
                    <View style={{ marginTop: 10 }} />
                    <ThemedButton icon='arrow-forward-outline'>register</ThemedButton>
                    <View style={{ marginBottom: 40 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <ThemedText>already have an account?</ThemedText>
                        <ThemedLink href='/auth/login' style={{ marginHorizontal: 10 }}>log in</ThemedLink>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen