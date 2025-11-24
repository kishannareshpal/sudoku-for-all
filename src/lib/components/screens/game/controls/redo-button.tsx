import { IconButton } from "@/lib/components/common/buttons/icon-button";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { gameplayStoreState } from "@/lib/store/gameplay";
import { RedoIcon } from "lucide-react-native";

export const RedoButton = () => {
    const redo = () => {
        CellHelper.redoLastMove(gameplayStoreState())
    }

    return (
        <IconButton className="bg-black" onPress={redo}>
            <RedoIcon color="white" size={18} />
        </IconButton>
    );
};
