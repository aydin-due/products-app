import { ThemedText } from '@/presentation/theme/components/themed-text'
import { View } from 'react-native'

const HomeScreen = () => {
    return (
        <View style={{ paddingTop: 100, paddingHorizontal: 20 }}>
            <ThemedText style={{ fontFamily: 'KanitBold' }}>home</ThemedText>
            <ThemedText style={{ fontFamily: 'KanitRegular' }}>home</ThemedText>
            <ThemedText style={{ fontFamily: 'KanitThin' }}>home</ThemedText>
            <ThemedText>home</ThemedText>
        </View>
    )
}

export default HomeScreen