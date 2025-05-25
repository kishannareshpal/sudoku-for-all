import { StyleSheet, View } from "react-native";
import { NumberPadButton } from "@/lib/components/game/number-pad/number-pad-button";
import Animated, { Easing, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";
import { useGameplayStore } from "@/lib/store/gameplay-store";

export const NumberPad = () => {
    const cursorMode = useGameplayStore((store) => store.cursorMode);

    const animatedStyle = useAnimatedStyle(
        () => ({
            backgroundColor: withTiming(cursorMode === 'note' ? '#222222' : 'transparent', {
                duration: 200,
            }),
        }),
        [cursorMode]
    )

    const renderButtons = () => {
        const buttonRows = [];

        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            const buttonRow = [];

            for (let colIndex = 0; colIndex < 3; colIndex++) {
                const number = (colIndex + rowIndex * 3) + 1

                buttonRow.push(
                    <NumberPadButton
                        value={number}
                    />
                )
            }

            buttonRows.push(
                <View style={styles.row}>
                    {buttonRow}
                </View>
            );
        }

        return buttonRows;
    }

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            {renderButtons()}
        </Animated.View>
    );
};


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flex: 0,
        alignSelf: 'center',
        gap: 6,
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'transparent',
    },

    row: {
        flexDirection: 'row',
        gap: 6
    }
})
