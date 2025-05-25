import { Stack } from "expo-router";
import { useFonts } from "expo-font";
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
                <Stack>
                    <Stack.Screen name="index" options={{headerShown: false}}/>
                </Stack>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

export default RootLayout;
