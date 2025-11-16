import Animted, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { PressableBounce, PressableBounceProps } from "../../shared/pressable-bounce";

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
    const animatedButtonStyle = useAnimatedStyle(
        () => ({
            backgroundColor: withSpring(toggled ? '#FFD147' : '#222222', {
                duration: 150,
            })
        }),
        [toggled]
    );

    const animatedButtonTextStyle = useAnimatedStyle(
        () => ({
            color: withSpring(toggled ? 'black' : 'white', {
                duration: 260,
            })
        }),
        [toggled]
    );

    return (
        <PressableBounce
            className="bg-neutral-800 min-w-12 min-h-12 p-1 items-center justify-center rounded-xl"
            style={animatedButtonStyle}
            {...props}
        >
            <Animted.Text style={animatedButtonTextStyle} className="font-bold text-base">
                {value}
            </Animted.Text>
        </PressableBounce>
    )

    // return (
    //     // <PressableScale
    //     //     activeScale={0.90}
    //     //     style={[styles.button, animatedButtonStyle]}
    //     //     {...restProps}
    //     // >
    //     //     <Animated.Text style={[styles.buttonText, animatedButtonTextStyle]}>
    //     //         {value}
    //     //     </Animated.Text>
    //     // </PressableScale>
    // );
};