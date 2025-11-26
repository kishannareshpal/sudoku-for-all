import { IconButton } from "@/lib/components/common/buttons/icon-button";
import { isMoveRedoable, redoLastMove } from "@/lib/helpers/history";
import { useGameplayStore } from "@/lib/store/gameplay";
import { RedoIcon } from "lucide-react-native";

export const RedoButton = () => {
    const isRedoable = useGameplayStore((state) => state.puzzle && isMoveRedoable({ moveHistory: state.puzzle.moveHistory }))

    const redo = () => {
        redoLastMove()
    }

    return (
        <IconButton className="bg-black" onPress={redo} disabled={!isRedoable}>
            <RedoIcon color="white" size={18} />
        </IconButton>
    );
};
