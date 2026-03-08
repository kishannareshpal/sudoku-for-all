import { IconButton } from "@/lib/components/common/buttons/icon-button";
import { insertHintAtRandom } from "@/lib/helpers/values";
import { LightbulbIcon } from "lucide-react-native";

export const HintButton = () => {
    const hint = () => {
        const inserted = insertHintAtRandom()
    }

    return (
        <IconButton className="bg-black" onPress={hint}>
            <LightbulbIcon color="white" size={18} />
        </IconButton>
    );
};
