import LogoutButton from '@/presentation/auth/components/logout-button'
import { useAuthStore } from '@/presentation/auth/store/use-auth-store'
import { useTheme } from '@/presentation/theme/hooks/use-theme'
import { Redirect, Stack } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'

const CheckAuthLayout = () => {
    const { status, checkStatus } = useAuthStore()
    const bgColor = useTheme().background

    useEffect(() => {
        checkStatus()
    }, [])

    if (status === 'checking') {
        return <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
            <ActivityIndicator />
        </View>
    }

    if (status === 'unauthenticated') {
        return <Redirect href='/auth/login' />
    }

    return <Stack
        screenOptions={{
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: bgColor
            },
            contentStyle: {
                backgroundColor: bgColor
            }
        }}
    >
        <Stack.Screen
            name='(home)/index'
            options={{ title: 'products', headerLeft: () => <LogoutButton /> }}
        />
    </Stack>


}

export default CheckAuthLayout