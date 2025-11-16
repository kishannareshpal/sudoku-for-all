import { IconButton } from "@/lib/components/common/buttons/icon-button";
import { UndoIcon } from "lucide-react-native";

export const UndoButton = () => {
    const undo = () => {
        // gameplayStore()
    }

    return (
        <IconButton className="bg-black">
            <UndoIcon color="white" size={18} />
        </IconButton>
    );
};
