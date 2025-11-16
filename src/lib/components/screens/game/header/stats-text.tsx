import { TextHelper } from "@/lib/helpers/text-helper";
import { useGameplayStore } from "@/lib/store/gameplay";
import { Text, View } from "react-native";

export const StatsText = () => {
    const difficulty = useGameplayStore((store) => store.puzzle?.difficulty);

    return (
        <View className="flex-row gap-1">
            <Text className="text-black">
                {difficulty ? TextHelper.formatDifficulty(difficulty) : 'N/a'}
            </Text>
            <Text className="text-black">•</Text>
            <Text className="text-black">120 Points</Text>
        </View>
    );
};
