import { IconButton } from "@/lib/components/common/buttons/icon-button";
import { isMoveUndoable, undoLastMove } from "@/lib/helpers/history";
import { useGameplayStore } from "@/lib/store/gameplay";
import * as Haptics from 'expo-haptics';
import { Undo2Icon } from "lucide-react-native";

export const UndoButton = () => {
    const isUndoable = useGameplayStore((state) =>
        state.state === 'playing' && !!state.puzzle && isMoveUndoable({ moveHistory: state.puzzle.moveHistory })
    );

    const undo = () => {
        undoLastMove();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    }

    return (
        <IconButton className="bg-black" onPress={undo} disabled={!isUndoable}>
            <Undo2Icon color="white" size={18} />
        </IconButton>
    );
};
