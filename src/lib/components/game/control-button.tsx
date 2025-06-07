import React from "react";
import { StyleSheet } from "react-native";
import { IconButton, IconButtonProps } from "../shared/icon-button";

type ControlButtonProps = IconButtonProps

export const ControlButton = (
    {
        style,
        iconProps,
        ...restProps
    }: ControlButtonProps
) => {
    return (
        <IconButton
            style={[styles.container, style]}
            iconProps={{
                style: styles.icon,
                size: 24,
                ...iconProps
            }}
            {...restProps}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        flex: 0,
        alignSelf: 'center',
        gap: 6,
        padding: 8,
        borderRadius: 50,
        backgroundColor: '#222222',
    },

    icon: {
        color: 'white'
    }
});

