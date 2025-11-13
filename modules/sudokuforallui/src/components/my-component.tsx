import { requireNativeView } from "expo";
import * as React from "react";
import { ViewProps } from "react-native";

export interface MyComponentProps extends ViewProps {
    text: string;
}

const NativeView: React.ComponentType<MyComponentProps> = requireNativeView(
    "SudokuForAllUI",
    "MyComponentView",
);

export const MyComponent = (props: MyComponentProps) => {
    return <NativeView {...props} />;
};
