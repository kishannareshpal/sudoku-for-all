import { Text } from "react-native";
import { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { PressableBounce, PressableBounceProps } from "../../../common/pressable-bounce";

type ToggleButtonProps = PressableBounceProps & {
    value: number,
    toggled?: boolean
}

export const ToggleButton = (
    {
        value,
        toggled,
        ...props
    }: ToggleButtonProps,
) => {
    const animatedButtonStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: withSpring(toggled ? '#FFD147' : '#222222', { duration: 50 }),
        };
    });

    return (
        <PressableBounce
            className="bg-neutral-800 size-14 p-1 items-center justify-center rounded-xl"
            style={animatedButtonStyle}
            {...props}
        >
            <Text
                className="font-bold text-bas text-[22px]"
                style={{ color: toggled ? 'black' : 'white' }}
            >
                {value}
            </Text>
        </PressableBounce>
    )
};