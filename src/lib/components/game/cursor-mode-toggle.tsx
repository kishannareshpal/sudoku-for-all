import React, { useCallback, useEffect, useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, } from "react-native-reanimated";
import { PressableScale } from "@/lib/components/shared/pressable-scale";
import { gameplayStoreState, useGameplayStore } from "@/lib/store/gameplay-store";
import { CursorMode } from "@/lib/shared-types";
import { useImmer } from "use-immer";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Option = {
    label: string,
    value: CursorMode
}

type OptionElementWidthMap = {
    [optionName: string]: number
}

const OPTIONS: Option[] = [
    {label: 'Pen', value: 'number'},
    {label: 'Notes', value: 'note'},
];

export const CursorModeToggle = () => {
    const cursorMode = useGameplayStore((state) => state.cursorMode);

    const sliderBackgroundPositionX = useSharedValue(0);
    const selectedOptionElementWidth = useSharedValue(0);
    const [optionElementWidthMap, updateOptionElementWidthMap] = useImmer<OptionElementWidthMap>({});

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: sliderBackgroundPositionX.value,
        }],
        width: selectedOptionElementWidth.value,
    }));

    const getOptionElementWidthFor = useCallback((mode: CursorMode) => {
        return optionElementWidthMap[mode] ?? 0;
    }, [optionElementWidthMap]);

    /**
     * @remarks This function assumes 2 options only. If you add support for additional options, you will need to make
     * sure that this function offsets the X position past all the previous options and the gaps in between
     * @param mode
     */
    const determineOffsetXFor = useCallback((mode: CursorMode) => {
        const selectedOptionIndex = OPTIONS.findIndex((option) => option.value === mode);

        const pastOptions = OPTIONS.slice(0, selectedOptionIndex);
        // const offsetX = pastOptions.map((option) => {
        //     return getOptionElementWidthFor(option.value) + styles.container.gap;
        // }).reduce((acc, curr) => acc + curr, 0);

        return pastOptions.reduce(
            (currentSum, iteratingOption) => currentSum + getOptionElementWidthFor(iteratingOption.value) + styles.container.gap,
            0
        );

        // const offsetX = getOptionElementWidthFor('number') * 2;

        // // const optionElementWidth = getOptionElementWidthFor(mode);
        // // const optionElementStartingPositionX = mode === 'number'
        //     ? 0
        //     : getOptionElementWidthFor('number') + styles.container.gap;
        // return offsetX
    }, [getOptionElementWidthFor]);

    const moveSliderTo = useCallback((mode: CursorMode) => {
        const optionElementWidth = getOptionElementWidthFor(mode);
        const offsetX = determineOffsetXFor(mode);

        sliderBackgroundPositionX.value = withTiming(offsetX, {duration: 150});
        selectedOptionElementWidth.value = withSpring(optionElementWidth, {duration: 1200});
    }, [determineOffsetXFor, getOptionElementWidthFor, selectedOptionElementWidth, sliderBackgroundPositionX])

    useEffect(() => {
        moveSliderTo(cursorMode);
    }, [moveSliderTo, cursorMode]);

    const onToggle = (mode: CursorMode) => {
        gameplayStoreState().toggleCursorMode(mode);
        moveSliderTo(mode);
    }

    const onOptionElementLayoutFor = (
        event: LayoutChangeEvent,
        mode: CursorMode
    ) => {
        const width = event.nativeEvent?.layout?.width ?? 0

        updateOptionElementWidthMap(
            (draft) => {
                draft[mode] = width;
            }
        );
    }

    const horizontalSwipeGesture = Gesture
        .Pan()
        .onUpdate((e) => {
            if (e.translationX < -5) {
                // Detected a left swipe
                onToggle('number');

            } else if (e.translationX > 5) {
                // Detected a right swipe
                onToggle('note');
            }
        })
        .runOnJS(true);

    const isCursorModeSelected = (mode: CursorMode) => {
        return cursorMode === mode;
    }

    return (
        <GestureDetector gesture={horizontalSwipeGesture}>
            <View style={styles.container}>
                <Animated.View style={[styles.sliderBackground, animatedStyle]}/>

                {OPTIONS.map((option) => (
                    <PressableScale
                        key={option.value}
                        onPress={() => onToggle(option.value)}
                        style={styles.option}
                        onLayout={(event) => onOptionElementLayoutFor(event, option.value)}
                    >
                        <View>
                            <Text
                                style={
                                    [
                                        styles.optionText,
                                        isCursorModeSelected(option.value) ? styles.optionTextSelected : null
                                    ]
                                }
                            >
                                {option.label}
                            </Text>
                        </View>
                    </PressableScale>
                ))}
            </View>
        </GestureDetector>
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
    sliderBackground: {
        flex: 1,
        pointerEvents: 'box-none',
        position: "absolute",
        height: "100%",
        backgroundColor: "white",
        borderRadius: 20,
        margin: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    option: {
        opacity: 0.9,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 50
    },
    optionText: {
        color: 'white',
        fontWeight: 'bold'
    },
    optionTextSelected: {
        color: 'black'
    }
});

