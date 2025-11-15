import { EntryType } from "@/lib/shared-types";

export type Option = {
    label: string;
    value: EntryType;
};

export type OptionElementWidthMap = {
    [optionName: string]: number;
};
