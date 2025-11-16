import { useGameplayStore } from "@/lib/store/gameplay";
import clsx from "clsx";
import { BlurView } from "expo-blur";
import { useEffect } from "react";
import Animated, { useAnimatedProps, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
// import { useBoardGraphicsContext } from "./board/board-graphics-context";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

/**
 * A thin material placed over the board when the game is paused in order to blur the numbers to avoid easily cheating the time
 */
export const PausedGameOverlay = () => {
    const textOpacity = useSharedValue<number>(0);
    const containerOpacity = useSharedValue<number>(0);
    const textScale = useSharedValue<number>(0);
    const currentBlurIntensity = useSharedValue<number>(0);

    const isPaused = useGameplayStore((state) => state.state === 'paused');

    useEffect(() => {
        currentBlurIntensity.value = withSpring(isPaused ? 40 : 0, {
            duration: 75
        });

        textScale.value = withSpring(isPaused ? 1 : 0, {
            stiffness: 80,
            damping: 10,
            mass: 0.75,
            velocity: 10
        });

        textOpacity.value = withSpring(isPaused ? 1 : 0, { duration: 300 });
        containerOpacity.value = withSpring(isPaused ? 1 : 0, { duration: 75 })
    }, [containerOpacity, currentBlurIntensity, isPaused, textOpacity, textScale])

    const animatedTextStyle = useAnimatedStyle(
        () => ({
            transform: [{ scale: textScale.value }],
            opacity: textOpacity.value
        })
    );

    const animatedContainerStyle = useAnimatedStyle(
        () => ({
            opacity: containerOpacity.value,

        })
    )

    const animatedBlurProps = useAnimatedProps(() => {
        return {
            intensity: currentBlurIntensity.value
        };
    });

    return (
        <Animated.View
            className={clsx(
                'flex-1 relative justify-center items-center',
                isPaused ? 'pointer-events-all' : undefined
            )}
            style={animatedContainerStyle}
        >
            <AnimatedBlurView
                animatedProps={animatedBlurProps}
                className="absolute inset-0"
                tint="extraLight"
            />

            <Animated.Text className="text-black text-5xl font-bold leading-none" style={animatedTextStyle}>
                Paused
            </Animated.Text>
        </Animated.View>
    )
}
