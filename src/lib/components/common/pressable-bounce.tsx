import * as React from 'react';
import { GestureResponderEvent, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import {
    createAnimatedComponent,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

const AnimatedPressable = createAnimatedComponent(Pressable);

export type PressableBounceProps = PressableProps & {
    children?: React.ReactNode,
    style?: StyleProp<ViewStyle>,
};

/**
 * React Native's `Pressable` component that adds a spring-based 'bounce' animation when the user presses the component.
 * 
 * @todo support haptic feedback
 */
export const PressableBounce = ({ onPress, onPressIn, onPressOut, style, className, children, ...props }: PressableBounceProps) => {
    const scale = useSharedValue(1);

    const bounceTo = (toValue: number, velocity: number = 10) => {
        scale.value = withSpring(toValue, {
            velocity,
            damping: 20,
            stiffness: 200,
            mass: 1,
            overshootClamping: false
        });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const handleOnPressIn: PressableProps['onPressIn'] = (event) => {
        if (!onPress) {
            return;
        }

        bounceTo(0.93, 0.1)
        onPressIn?.(event)
    }

    const handleOnPressOut: PressableProps['onPressOut'] = (event: GestureResponderEvent) => {
        if (!onPress) {
            return;
        }

        bounceTo(1, 0.4)
        onPressOut?.(event)
    }

    return (
        <AnimatedPressable
            onPressIn={handleOnPressIn}
            onPressOut={handleOnPressOut}
            onPress={onPress}
            style={[animatedStyle, style]}
            className={className}
            {...props}
        >
            {children}
        </AnimatedPressable>
    );
};