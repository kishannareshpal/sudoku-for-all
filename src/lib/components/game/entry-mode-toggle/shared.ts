import { EntryMode } from "@/lib/shared-types";

export type EntryModeOption = { label: string, value: EntryMode };

export const ENTRY_MODES: EntryModeOption[] = [
    { label: "Pen", value: "number" },
    { label: "Notes", value: "note" },
];
