import { gameplayStoreState, useGameplayStore } from "@/lib/store/gameplay";
import { Host, Picker, Text } from "@expo/ui/swift-ui";
import { fixedSize, pickerStyle, tag } from "@expo/ui/swift-ui/modifiers";
import { ENTRY_MODES } from "./shared";

export const EntryModeToggle = () => {
    const entryMode = useGameplayStore((state) => state.entryMode);

    const handleSelectionChange = (selectedValue: string | number | null) => {
        const mode = ENTRY_MODES.find((m) => m.value === selectedValue);
        if (mode) {
            gameplayStoreState().setEntryMode(mode.value);
        }
    }

    return (
        <Host matchContents colorScheme="light">
            <Picker
                selection={entryMode}
                onSelectionChange={handleSelectionChange}
                modifiers={[
                    pickerStyle('segmented'),
                    fixedSize(),
                ]}
            >
                {ENTRY_MODES.map((mode) => (
                    <Text key={mode.value} modifiers={[tag(mode.value)]}>
                        {mode.label}
                    </Text>
                ))}
            </Picker>
        </Host>
    )
};
