import { PropsWithChildren } from "react";
import { ViewProps } from "react-native";
import { Gesture, GestureDetector, Pressable, PressableProps } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export type PressableScaleProps = PropsWithChildren<Omit<PressableProps, 'style'> & {
    /**
     * The scale when it's pressed.
     *
     * @default 0.95
     */
    activeScale?: number;

    /**
     * The opacity for when the button is active.
     *
     * @default 1
     */
    activeOpacity?: number

    /**
     * How long the transition lasts when the button is pressed in milliseconds.
     *
     * @default 60ms
     */
    transitionDurationInMs?: number;

    style?: ViewProps['style']
}>;

const PRESSABLE_SCALE_INACTIVE_SCALE = 1;
const PRESSABLE_SCALE_INACTIVE_OPACITY = 1;

const PRESSABLE_SCALE_DEFAULT_ACTIVE_SCALE = 0.95;
const PRESSABLE_SCALE_DEFAULT_TRANSITION_DURATION_IN_MS = 60;
const PRESSABLE_SCALE_DEFAULT_ACTIVE_OPACITY = 1;

export const PressableScale = (
    {
        style,
        children,
        activeScale = PRESSABLE_SCALE_DEFAULT_ACTIVE_SCALE,
        activeOpacity = PRESSABLE_SCALE_DEFAULT_ACTIVE_OPACITY,
        transitionDurationInMs = PRESSABLE_SCALE_DEFAULT_TRANSITION_DURATION_IN_MS,
        ...restProps
    }: PressableScaleProps
) => {
    const currentScale = useSharedValue(PRESSABLE_SCALE_INACTIVE_SCALE);
    const currentOpacity = useSharedValue(PRESSABLE_SCALE_INACTIVE_OPACITY)

    const tapGesture = Gesture
        .Tap()
        .onBegin(() => {
            currentScale.value = withSpring(activeScale);
            currentOpacity.value = withSpring(activeOpacity);
        })
        .onFinalize(() => {
            currentScale.value = withSpring(PRESSABLE_SCALE_INACTIVE_SCALE);
            currentOpacity.value = withSpring(PRESSABLE_SCALE_INACTIVE_OPACITY);
        })

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: currentOpacity.value,
        transform: [{
            scale: currentScale.value,
        }],
    }));

    return (
        <GestureDetector gesture={tapGesture}>
            <Pressable {...restProps}>
                <Animated.View style={[animatedStyle, style]}>
                    {children}
                </Animated.View>
            </Pressable>
        </GestureDetector>
    );
};
