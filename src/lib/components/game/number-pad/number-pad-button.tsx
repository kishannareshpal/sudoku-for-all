import { PressableScale, PressableScaleProps } from "@/lib/components/shared/pressable-scale";
import React from 'react';
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

type NumberPadButtonProps = PressableScaleProps & {
    value: number,
    selected?: boolean
}

export const NumberPadButton = (
    {
        value,
        selected,
        ...restProps
    }: NumberPadButtonProps,
) => {
    const animatedButtonStyle = useAnimatedStyle(
        () => ({
            backgroundColor: withTiming(selected ? '#FFD147' : '#222222', {
                duration: 260,
            })
        }),
        [selected]
    );

    const animatedButtonTextStyle = useAnimatedStyle(
        () => ({
            color: withTiming(selected ? 'black' : 'white', {
                duration: 260,
            })
        }),
        [selected]
    );

    return (
        <PressableScale
            activeScale={0.90}
            style={[styles.button, animatedButtonStyle]}
            {...restProps}
        >
            <Animated.Text style={[styles.buttonText, animatedButtonTextStyle]}>
                {value}
            </Animated.Text>
        </PressableScale>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
    },

    buttonText: {
        fontWeight: 'medium',
        fontSize: 22
    }
})
