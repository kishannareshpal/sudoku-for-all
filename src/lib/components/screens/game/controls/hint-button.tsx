import { IconButton } from "@/lib/components/common/buttons/icon-button";
import { LightbulbIcon } from "lucide-react-native";

export const HintButton = () => {
    return (
        <IconButton className="bg-black">
            <LightbulbIcon color="white" size={18} />
        </IconButton>
    );
};
