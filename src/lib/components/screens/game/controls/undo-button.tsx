import { IconButton } from "@/lib/components/common/buttons/icon-button";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { gameplayStoreState } from "@/lib/store/gameplay";
import { UndoIcon } from "lucide-react-native";

export const UndoButton = () => {
    const undo = () => {
        CellHelper.undoLastMove(gameplayStoreState())
    }

    return (
        <IconButton className="bg-black" onPress={undo}>
            <UndoIcon color="white" size={18} />
        </IconButton>
    );
};
