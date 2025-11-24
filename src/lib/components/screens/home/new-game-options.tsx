import { TextHelper } from "@/lib/helpers/text-helper";
import { Difficulty } from "@/lib/shared-types";
import { PlusIcon } from "lucide-react-native";
import { Text, View } from "react-native";
import { PressableBounce } from "../../common/pressable-bounce";

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
    return (
        <View className="gap-2 w-full">
            {options.map((option) => (
                <PressableBounce
                    key={option.value}
                    className="bg-neutral-700 px-4 py-5 flex-row rounded-xl items-center justify-between"
                    onPress={() => onOptionPress(option)}
                >
                    <Text className="font-bold text-white text-base">{option.name}</Text>

                    <PlusIcon size={22} color="white" />
                </PressableBounce>

                // <Button
                //     key={option.value}
                //     label={option.name}
                //     onPress={() => onOptionPress(option)}
                // />
            ))}
        </View>
    );
}