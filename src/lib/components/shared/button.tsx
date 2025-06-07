import { ReactElement } from "react";
import { ActivityIndicator, StyleSheet, Text, TextProps } from "react-native";
import { Icon } from "./icon";
import { PressableScale, PressableScaleProps } from "./pressable-scale";

export type ButtonProps = PressableScaleProps & {
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
        <PressableScale
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
        </PressableScale>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
    },

    disabled: {
        opacity: 0.5
    }
});
