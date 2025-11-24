import { View } from "react-native"
import { EraseButton } from "./controls/erase-button"
import { ControlGroup } from "./controls/group"
import { HintButton } from "./controls/hint-button"
import { RedoButton } from "./controls/redo-button"
import { UndoButton } from "./controls/undo-button"
import { EntryModeToggle } from "./entry-mode-toggle"

export const Controls = () => {
    return (
        <View className="flex-row justify-between items-center gap-2">
            <ControlGroup>
                <UndoButton />
                <RedoButton />
            </ControlGroup>

            <EntryModeToggle />

            <ControlGroup>
                <HintButton />
                <EraseButton />
            </ControlGroup>
        </View>
    )
}