import { IoniconsName } from '@/constants/types'
import Ionicons from '@react-native-vector-icons/ionicons'
import { Pressable, PressableProps, StyleSheet } from 'react-native'
import { useTheme } from '../hooks/use-theme'
import { ThemedText } from './themed-text'

interface Props extends PressableProps {
    icon?: IoniconsName
    children: string
}

const ThemedButton = ({ children, icon, ...rest }: Props) => {
    const primaryColor = useTheme().primary

    return (
        <Pressable
            style={({ pressed }) => [{
                ...styles.btn,
                backgroundColor: pressed ? primaryColor + '90' : primaryColor,
            }]}
            {...rest}

        >
            <ThemedText style={{ color: 'white', marginRight: 10 }}>{children}</ThemedText>
            {icon && <Ionicons name={icon} color='white' size={20} />}
        </Pressable>
    )
}

export default ThemedButton

const styles = StyleSheet.create({
    btn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5
    }
})