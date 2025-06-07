import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps } from "react";

const supportedIconComponentByType = {
    'ionicons': Ionicons,
    'material': MaterialCommunityIcons
}

export type SupportedIconType = keyof typeof supportedIconComponentByType;

export type BaseIconProps =
    { type: 'ionicons', name: keyof typeof Ionicons.glyphMap }
    | { type: 'material', name: keyof typeof MaterialCommunityIcons.glyphMap }


export type IconProps<TIconType extends SupportedIconType = SupportedIconType> =
    Omit<ComponentProps<typeof supportedIconComponentByType[TIconType]>, 'name'>
    & BaseIconProps

export const Icon = (
    {
        type,
        name,
        ...restProps
    }: IconProps
) => {
    const SupportedIcon = supportedIconComponentByType[type];

    if (!SupportedIcon) {
        throw new Error(`Failed to render an icon. Unsupported icon type provided: ${type}`);
    }

    return (
        <SupportedIcon
            // @ts-ignore - I was not able to properly infer the name, thus I'm explicitly ignoring typescript in the next lines.
            // Update this using a proper type-safe definition if/when you can. Thank you
            name={name}
            {...restProps}
        />
    )
}
