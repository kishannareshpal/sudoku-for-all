import { CursorMode } from "@/lib/shared-types";

export type Option = {
    label: string;
    value: CursorMode;
};

export type OptionElementWidthMap = {
    [optionName: string]: number;
};
