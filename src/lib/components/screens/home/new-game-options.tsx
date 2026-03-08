import { TextHelper } from "@/lib/helpers/text-helper";
import { Difficulty } from "@/lib/shared-types";
import { PlusIcon } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";
import { PressableBounce } from "../../common/pressable-bounce";
import { useState } from "react";

type Option = {
    name: string,
    value: Difficulty
};

const difficulties: Difficulty[] = [
    'easy',
    'medium',
    'hard',
    'very-hard',
    'extreme'
]
const options: Option[] = difficulties.map((difficulty) => (
    { name: TextHelper.formatDifficulty(difficulty), value: difficulty }
));

type NewGameOptionsProps = {
    onOptionPress: (option: Option) => void
}

export const NewGameOptions = (
    { onOptionPress }: NewGameOptionsProps
) => {
    const [loadingDifficulty, setLoadingDifficulty] = useState<Difficulty | null>(null);

    const handlePress = (option: Option) => {
        setLoadingDifficulty(option.value);
        // Use setTimeout to allow the UI to update before generating the puzzle
        setTimeout(() => {
            onOptionPress(option);
            setLoadingDifficulty(null);
        }, 50);
    };

    return (
        <View className="gap-3 max-w-sm w-full">
            <Text className="text-white text-center font-bold text-base">Start a new game:</Text>
            <View className="gap-2">
                {options.map((option) => (
                    <PressableBounce
                        key={option.value}
                        className="bg-neutral-700 px-5 py-4 flex-row rounded-xl items-center justify-between"
                        onPress={() => handlePress(option)}
                        disabled={loadingDifficulty !== null}
                        style={loadingDifficulty !== null ? { opacity: 0.3 } : undefined}
                    >
                        <Text className="text-white text-base font-medium">{option.name}</Text>
                        {loadingDifficulty === option.value ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <PlusIcon size={20} color="white" />
                        )}
                    </PressableBounce>
                ))}
            </View>
        </View>
    );
}
