import { ReactElement } from "react";
import { ActivityIndicator, StyleSheet, Text, TextProps } from "react-native";
import { Icon } from "./icon";
import { PressableBounce, PressableBounceProps } from "./pressable-bounce";

export type ButtonProps = PressableBounceProps & {
    label?: string,
    textProps?: TextProps,
    loading?: boolean,
    disabled?: boolean,
    icon?: ReactElement<typeof Icon>,
}

export const Button = (
    {
        label,
        textProps,
        style,
        loading,
        disabled,
        icon,
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
            {icon ? icon : null}

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
