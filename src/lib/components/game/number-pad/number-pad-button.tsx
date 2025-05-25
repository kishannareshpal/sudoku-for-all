import React from 'react';
import { StyleSheet, Text } from "react-native";
import { PressableScale, PressableScaleProps } from "@/lib/components/shared/pressable-scale";

type NumberPadButtonProps = PressableScaleProps & {
    value: number
}

export const NumberPadButton = (
    {
        value
    }: NumberPadButtonProps,
) => {
    return (
        <PressableScale style={styles.button}>
            <Text style={styles.buttonText}>
                {value}
            </Text>
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
        backgroundColor: '#222222'
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    }
})
