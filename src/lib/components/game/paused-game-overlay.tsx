import { useStoreSubscription } from "@/lib/hooks/use-store-subscription";
import { gameplayStore } from "@/lib/store/gameplay-store";
import { Canvas, RadialGradient, Rect, vec } from "@shopify/react-native-skia";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedProps, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
// import { useBoardGraphicsContext } from "./board/board-graphics-context";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

/**
 * A thin material to put over the board when the game is paused in order to blur the numbers out until they start playing
 * again.
 */
export const PausedGameOverlay = () => {
    const boardCanvas = useBoardGraphicsContext();

    const currentOpacity = useSharedValue<number>(0);
    const currentContainerOpacity = useSharedValue<number>(0);
    const currentTextScale = useSharedValue<number>(0);
    const currentBlurIntensity = useSharedValue<number>(0);

    useStoreSubscription(
        gameplayStore,
        (store) => store.state,
        (currentState) => {
            const hasGameBecomePaused = currentState === 'paused';

            currentBlurIntensity.value = withSpring(hasGameBecomePaused ? 60 : 0, {
                mass: 1,
                damping: 30,
                stiffness: 150,
                overshootClamping: false,
                restDisplacementThreshold: 0.001,
                restSpeedThreshold: 5,
            });

            currentTextScale.value = withSpring(hasGameBecomePaused ? 1 : 0, {
                mass: 1,
                damping: 30,
                stiffness: 150,
                overshootClamping: false,
                restDisplacementThreshold: 0.00001,
                restSpeedThreshold: 5,
            });

            currentOpacity.value = withSpring(hasGameBecomePaused ? 1 : 0, { duration: 320 });

            currentContainerOpacity.value = withSpring(hasGameBecomePaused ? 1 : 0, { duration: 500 })
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

    const animatedContainerStyle = useAnimatedStyle(
        () => ({
            opacity: currentContainerOpacity.value,
        })
    )

    const animatedBlurProps = useAnimatedProps(() => {
        return {
          intensity: currentBlurIntensity.value,
        };
    });

    return (
        <Animated.View style={[styles.container, animatedContainerStyle]}>
            <AnimatedBlurView
                animatedProps={animatedBlurProps}
                tint="dark"
                style={styles.blurContainer}
            />

            <Canvas style={styles.blurEdgeContainer}>
                <Rect
                    x={0}
                    y={0}
                    width={boardCanvas.boardLength}
                    height={boardCanvas.boardLength}
                >
                    <RadialGradient
                        c={vec(boardCanvas.boardLength / 2)}
                        r={boardCanvas.boardLength - 4} // TODO: Explain this magic number 4 (border width?)
                        colors={['transparent', '#191509']} //! TODO: Change black with board bg color?
                    />
                </Rect>
            </Canvas>

            <Animated.Text style={[animatedTextStyle, styles.text]}>
                Paused
            </Animated.Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
    },

    blurContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1
    },

    blurEdgeContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1
    },

    text: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white'
    }
})
