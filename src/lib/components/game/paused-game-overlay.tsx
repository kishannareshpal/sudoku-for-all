import { useStoreSubscription } from "@/lib/hooks/use-store-subscription";
import { gameplayStore } from "@/lib/store/gameplay-store";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedProps, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

/**
 * A thin material to put over the board when the game is paused in order to blur the numbers out until they start playing
 * again.
 */
export const PausedGameOverlay = () => {
    const currentOpacity = useSharedValue<number>(0);
    const currentTextScale = useSharedValue<number>(0);
    const currentBlurIntensity = useSharedValue<number>(0);

    useStoreSubscription(
        gameplayStore,
        (store) => store.state,
        (currentState) => {
            const hasGameBecomePaused = currentState === 'paused';

            currentBlurIntensity.value = withTiming(hasGameBecomePaused ? 60 : 0, { duration: 220 });
            currentTextScale.value = withSpring(hasGameBecomePaused ? 1 : 0, { duration: 320 });
            currentOpacity.value = withSpring(hasGameBecomePaused ? 1 : 0, { duration: 320 });
        },
        { fireImmediately: true }
    )

    const animatedTextStyle = useAnimatedStyle(
        () => ({
            transform: [{ scale: currentTextScale.value }],
            opacity: currentOpacity.value
        }),
        [currentOpacity]
    );

    const animatedBlurProps = useAnimatedProps(() => {
        return {
          intensity: currentBlurIntensity.value,
        };
    });

    return (
        <AnimatedBlurView
            animatedProps={animatedBlurProps}
            tint="systemUltraThinMaterial"
            style={styles.container}
        >
            <Animated.Text style={[animatedTextStyle, styles.text]}>
                Paused
            </Animated.Text>
        </AnimatedBlurView>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        pointerEvents: 'none'
    },

    text: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white'
    }
})
