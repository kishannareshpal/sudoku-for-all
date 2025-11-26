import { gameplayStoreState, useGameplayStore } from "@/lib/store/gameplay";
import { Host, Picker } from "@expo/ui/swift-ui";
import { fixedSize } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";
import { ENTRY_MODES } from "./shared";

export const EntryModeToggle = () => {
    const entryMode = useGameplayStore((state) => state.entryMode);
    const [selectedIndex, setSelectedIndex] = useState(ENTRY_MODES.findIndex((mode) => mode.value === entryMode));

    const handleOptionSelection = (modeIndex: number) => {
        const mode = ENTRY_MODES[modeIndex];
        gameplayStoreState().setEntryMode(mode.value)
        setSelectedIndex(modeIndex)
    }

    return (
        <Host matchContents colorScheme="light">
            <Picker
                options={ENTRY_MODES.map((mode) => mode.label)}
                selectedIndex={selectedIndex}
                onOptionSelected={({ nativeEvent: { index } }) => {
                    handleOptionSelection(index);
                }}
                modifiers={[
                    fixedSize(),
                ]}
                variant="segmented"
            />
        </Host>
    )
};
