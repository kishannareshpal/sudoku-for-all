import { TextHelper } from "@/lib/helpers/text-helper";
import { Difficulty } from "@/lib/shared-types";
import { PlayCircleIcon } from "lucide-react-native";
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
        <View className="gap-8 w-full items-center">
            <View className="gap-3">
                <PressableBounce
                    className="px-3 py-2.5 rounded-2xl bg-yellow-400 gap-3"
                    onPress={() => { }}
                >
                    <View className="flex-row gap-2">
                        <View>
                            <Text className="text-base text-yellow-900 font-black">Easy</Text>
                            <Text className="text-sm">Points: 320</Text>
                            <Text className="text-sm">Played for: 2h 20m 12s</Text>
                        </View>

                        <PlayCircleIcon size={24} />
                    </View>

                    <Text className="font-semibold text-yellow-900">Tap to continue</Text>
                </PressableBounce>

                <View className="flex-row gap-2 justify-center">
                    <PressableBounce
                        className="rounded-full bg-white/20 gap-3 self-center px-3 py-2"
                        onPress={() => onOptionPress({ name: '', value: 'easy' })}
                    >
                        <Text className="font-semibold text-white">Past games</Text>
                    </PressableBounce>

                    <PressableBounce
                        className="rounded-full bg-yellow-100 gap-3 self-center px-3 py-2"
                        onPress={() => onOptionPress({ name: '', value: 'easy' })}
                    >
                        <Text className="font-semibold text-yellow-800">New game</Text>
                    </PressableBounce>
                </View>
            </View>

            {/* <View className="gap-3 max-w-sm w-full">
                <Text className="text-white text-center">Start a new game</Text>
                <View className="gap-2">
                    {options.map((option) => (
                        <PressableBounce
                            key={option.value}
                            className="bg-neutral-700 px-5 py-3 flex-row rounded-xl items-center justify-between"
                            onPress={() => onOptionPress(option)}
                        >
                            <Text className="text-white text-base font-semibold">{option.name}</Text>
                            <PlusIcon size={22} color="white" />
                        </PressableBounce>
                    ))}
                </View>
            </View> */}
        </View>
    );
}