import { Text, View } from "react-native";

export const Title = () => {
    return (
        <View className="w-full">
            <Text
                className="font-black text-9xl text-center text-neutral-100 italic"
                style={{ includeFontPadding: false, lineHeight: 100, marginBottom: -50 }}
            >
                SUD
            </Text>
            <Text
                className="font-black text-9xl text-center text-neutral-100 italic"
                style={{ includeFontPadding: false, lineHeight: 100 }}
            >
                OKU
            </Text>
        </View>
    )
}
