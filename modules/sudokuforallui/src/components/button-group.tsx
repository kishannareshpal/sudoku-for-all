import { requireNativeView } from "expo";
import * as React from "react";
import { ViewProps } from "react-native";

export type ButtonGroupOption = {
    label: string;
    value: string;
};

type OnSelectionChangePayload = {
    selectedOption: ButtonGroupOption | null;
};

export type ButtonGroupCallbackProps = {
    onSelectionChange?: (event: {
        nativeEvent: OnSelectionChangePayload;
    }) => void;
};

export interface ButtonGroupProps extends ButtonGroupCallbackProps, ViewProps {
    options: ButtonGroupOption[];
}

const NativeView: React.ComponentType<ButtonGroupProps> = requireNativeView(
    "SudokuForAllUI",
    "ButtonGroupView",
);

export const ButtonGroup = (props: ButtonGroupProps) => {
    return <NativeView {...props} />;
};
