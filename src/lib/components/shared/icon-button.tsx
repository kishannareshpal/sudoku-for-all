import { StyleSheet } from "react-native"
import { Button, ButtonProps } from "./button"
import { Icon, IconProps } from "./icon"

export type IconButtonProps = Omit<ButtonProps, 'icon'> & {
    iconProps: IconProps
}

export const IconButton = (
    {
        iconProps,
        ...restProps
    }: IconButtonProps
) => {
    const { style: iconStyle, ...restIconProps } = iconProps || { style: {} };

    return (
        <Button
            activeOpacity={0.5}
            icon={
                <Icon
                    style={[styles.icon, iconStyle]}
                    size={32}
                    {...restIconProps}
                />
            }
            {...restProps}
        />
    )
}

const styles = StyleSheet.create({
    icon: {
        color: 'white',
    }
});
