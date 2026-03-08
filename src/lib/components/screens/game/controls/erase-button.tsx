import { IconButton } from "@/lib/components/common/buttons/icon-button";
import { isValueErasableAt } from "@/lib/helpers/values";
import { gameplayStoreState, useGameplayStore } from "@/lib/store/gameplay";
import * as Haptics from 'expo-haptics';
import { EraserIcon } from "lucide-react-native";

export const EraseButton = () => {
    const isErasable = useGameplayStore((state) =>
        state.state === 'playing' && !!state.puzzle && isValueErasableAt({
            position: state.cursorGridPosition,
            givenGridNotation: state.puzzle.given,
            notesGridNotation: state.puzzle.notes,
            playerGridNotation: state.puzzle.player,
        })
    );

    const erase = () => {
        const { cursorGridPosition, erasePlayerValueAt } = gameplayStoreState();
        erasePlayerValueAt(cursorGridPosition);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    }

    return (
        <IconButton className="bg-black" onPress={erase} disabled={!isErasable}>
            <EraserIcon color="white" size={18} />
        </IconButton>
    );
};
