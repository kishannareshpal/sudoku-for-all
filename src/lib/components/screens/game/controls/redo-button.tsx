import { IconButton } from "@/lib/components/common/buttons/icon-button";
import { RedoIcon } from "lucide-react-native";

export const RedoButton = () => {
    return (
        <IconButton className="bg-black">
            <RedoIcon color="white" size={18} />
        </IconButton>
    );
};
