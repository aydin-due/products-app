import { IoniconsName } from '@/constants/types'
import Ionicons from '@react-native-vector-icons/ionicons'
import { TouchableOpacity } from 'react-native'
import { useTheme } from '../hooks/use-theme'


interface Props {
    onPress: () => void,
    icon: IoniconsName
}

const MenuIconButton = ({ onPress, icon }: Props) => {
    const primaryColor = useTheme().primary
    return (

        <TouchableOpacity onPress={onPress}>
            <Ionicons name={icon} size={24} color={primaryColor} />
        </TouchableOpacity>
    )
}

export default MenuIconButton