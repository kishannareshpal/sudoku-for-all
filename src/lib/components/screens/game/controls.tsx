import { View } from "react-native"
import { EraseButton } from "./controls/erase-button"
import { HintButton } from "./controls/hint-button"
import { RedoButton } from "./controls/redo-button"
import { UndoButton } from "./controls/undo-button"

export const Controls = () => {
    return (
        <View className="flex-row justify-between gap-2">
            <View className="flex-row gap-3 bg-neutral-100 border border-neutral-300 rounded-full p-1.5">
                <View className="flex-row gap-2">
                    <UndoButton />
                    <RedoButton />
                </View>
            </View>

            <View className="flex-row gap-3 bg-neutral-100 border border-neutral-300 rounded-full p-1.5">
                <HintButton />
                <EraseButton />
            </View>
        </View>
    )
}