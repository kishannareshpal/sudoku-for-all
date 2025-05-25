import { Gesture, GestureDetector, Pressable, PressableProps, State, } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { PropsWithChildren } from "react";
import { ViewProps } from "react-native";
import { setShouldAnimateExitingForTag } from "react-native-reanimated/lib/typescript/core";

export type PressableScaleProps = PropsWithChildren<Omit<PressableProps, 'style'> & {
    /**
     * The scale when it's pressed.
     *
     * @default 0.95
     */
    activeScale?: number;

    /**
     * How long the transition lasts when the button is pressed in milliseconds.
     *
     * @default 60ms
     */
    transitionDurationInMs?: number;

    style?: ViewProps['style']
}>;

const PRESSABLE_SCALE_DEFAULT_ACTIVE_SCALE = 0.85;
const PRESSABLE_SCALE_DEFAULT_TRANSITION_DURATION_IN_MS = 60;

export const PressableScale = (
    {
        style,
        children,
        activeScale = PRESSABLE_SCALE_DEFAULT_ACTIVE_SCALE,
        transitionDurationInMs = PRESSABLE_SCALE_DEFAULT_TRANSITION_DURATION_IN_MS,
        ...restProps
    }: PressableScaleProps
) => {
    const currentScale = useSharedValue(1);

    const tapGesture = Gesture
        .LongPress()
        .onBegin(() => {
            currentScale.value = withSpring(activeScale);
        })
        .onFinalize(() => {
            currentScale.value = withSpring(1);
        })

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{
            scale: currentScale.value,
        }]
    }));

    return (
        <GestureDetector gesture={tapGesture}>
            <Pressable {...restProps}>
                <Animated.View style={[style, animatedStyle]}>
                    {children}
                </Animated.View>
            </Pressable>
        </GestureDetector>
    );
};