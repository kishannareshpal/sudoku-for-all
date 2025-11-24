import { EntryMode } from "@/lib/shared-types";
import { PropsWithChildren, useEffect } from "react";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const NUMBER_ENTRY_MODE_CONTAINER_COLOR = '#f5f5f5';
const NOTES_ENTRY_MODE_CONTAINER_COLOR = '#222222';

type NumberPadContainerProps = PropsWithChildren<{
    entryMode: EntryMode
}>

export const NumberPadContainer = ({ children, entryMode }: NumberPadContainerProps) => {
    const backdropColor = useSharedValue(0);
    const animatedBackdropStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                backdropColor.value,
                [0, 1],
                [NUMBER_ENTRY_MODE_CONTAINER_COLOR, NOTES_ENTRY_MODE_CONTAINER_COLOR]
            )
        };
    });

    useEffect(() => {
        backdropColor.value = withSpring(entryMode === "number" ? 0 : 1, { duration: 75 });
    }, [backdropColor, entryMode]);

    return (
        <Animated.View
            className="gap-1 p-3 rounded-2xl self-center justify-center items-center border border-neutral-300"
            style={animatedBackdropStyle}
        >
            {children}
        </Animated.View>
    )
}