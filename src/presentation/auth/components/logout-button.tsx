import { useTheme } from '@/presentation/theme/hooks/use-theme'
import Ionicons from '@react-native-vector-icons/ionicons'
import { TouchableOpacity } from 'react-native'
import { useAuthStore } from '../store/use-auth-store'

const LogoutButton = () => {

    const primaryColor = useTheme().primary
    const { logout } = useAuthStore()

    return (
        <TouchableOpacity onPress={logout}>
            <Ionicons name='log-out-outline' color={primaryColor} size={24} />
        </TouchableOpacity>
    )
}

export default LogoutButton