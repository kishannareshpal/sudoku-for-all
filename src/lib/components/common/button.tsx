import { ActivityIndicator, StyleSheet, Text, TextProps } from "react-native";
import { PressableBounce, PressableBounceProps } from "./pressable-bounce";

export type ButtonProps = PressableBounceProps & {
    label?: string,
    textProps?: TextProps,
    loading?: boolean,
    disabled?: boolean
}

export const Button = (
    {
        label,
        textProps,
        style,
        loading,
        disabled,
        ...restProps
    }: ButtonProps
) => {
    return (
        <PressableBounce
            style={[
                styles.container,
                disabled ? styles.disabled : undefined,
                style
            ]}
            disabled={disabled}
            {...restProps}
        >
            {label ? (
                <Text {...textProps}>
                    {label}
                </Text>
            ) : null}

            {loading ? (
                <ActivityIndicator />
            ) : null}
        </PressableBounce>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },

    disabled: {
        opacity: 0.5
    }
});
