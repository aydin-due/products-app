import { Link, LinkProps } from 'expo-router'
import { useTheme } from '../hooks/use-theme'

interface Props extends LinkProps {
}

const ThemedLink = ({ style, ...rest }: Props) => {
    const primaryColor = useTheme().primary

    return (
        <Link
            style={[{
                color: primaryColor,
                fontSize: 16,
            }, style]}
            {...rest}
        />
    )
}

export default ThemedLink