import { IconButton } from "@/lib/components/common/buttons/icon-button";
import { isMoveUndoable, undoLastMove } from "@/lib/helpers/history";
import { useGameplayStore } from "@/lib/store/gameplay";
import { Undo2Icon } from "lucide-react-native";

export const UndoButton = () => {
    const isUndoable = useGameplayStore((state) => state.puzzle && isMoveUndoable({ moveHistory: state.puzzle.moveHistory }))

    const undo = () => {
        undoLastMove()
    }

    return (
        <IconButton className="bg-black" onPress={undo} disabled={!isUndoable}>
            <Undo2Icon color="white" size={18} />
        </IconButton>
    );
};
