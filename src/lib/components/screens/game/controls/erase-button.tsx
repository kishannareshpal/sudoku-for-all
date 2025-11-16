import { IconButton } from "@/lib/components/common/buttons/icon-button";
import { gameplayStoreState } from "@/lib/store/gameplay";
import { EraserIcon } from "lucide-react-native";

export const EraseButton = () => {
    const erase = () => {
        const { cursorGridPosition, erasePlayerValueAt } = gameplayStoreState();
        erasePlayerValueAt(cursorGridPosition);
    }

    return (
        <IconButton className="bg-black" onPress={erase}>
            <EraserIcon color="white" size={18} />
        </IconButton>
    );
};
