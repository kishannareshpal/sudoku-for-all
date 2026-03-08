import { IconButton } from "@/lib/components/common/buttons/icon-button";
import { insertHintAtCurrentCell } from "@/lib/helpers/values";
import { useGameplayStore } from "@/lib/store/gameplay";
import * as Haptics from 'expo-haptics';
import { LightbulbIcon } from "lucide-react-native";

export const HintButton = () => {
    const disabled = useGameplayStore((state) => state.state !== 'playing');

    const hint = () => {
        const inserted = insertHintAtCurrentCell();
        if (inserted) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        }
    }

    return (
        <IconButton className="bg-black" onPress={hint} disabled={disabled}>
            <LightbulbIcon color="white" size={18} />
        </IconButton>
    );
};
