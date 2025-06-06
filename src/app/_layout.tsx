import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RootLayout = () => {
    const [loaded] = useFonts({
        SplineSansMonoBold: require('@assets/fonts/spline-sans-mono-bold.ttf'),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <GestureHandlerRootView>
            <SafeAreaProvider>
                <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

export default RootLayout;
