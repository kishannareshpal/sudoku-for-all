import { NewGameOptions } from "@/lib/components/screens/home/new-game-options";
import { Title } from "@/lib/components/screens/home/title";
import { GameHelper } from "@/lib/helpers/game-helper";
import { Difficulty } from "@/lib/shared-types";
import { Stack, useRouter } from "expo-router";
import { SettingsIcon } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressableBounce } from "@/lib/components/common/pressable-bounce";

const HomeScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleStartNewGame = (difficulty: Difficulty) => {
        GameHelper.newGame(difficulty);

        router.push({
            pathname: "/game",
            params: { difficulty: difficulty },
        });
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                className="bg-neutral-800"
                contentContainerClassName="flex-1 justify-center items-center"
                contentContainerStyle={{
                    paddingTop: insets.top + 32,
                    paddingBottom: insets.bottom + 42,
                    paddingLeft: insets.left + 16,
                    paddingRight: insets.right + 16,
                    gap: 48,
                }}
            >
                <Title />

                <NewGameOptions
                    onOptionPress={(option) => handleStartNewGame(option.value)}
                />

                <PressableBounce
                    className="flex-row items-center gap-2"
                    onPress={() => {}}
                >
                    <SettingsIcon size={18} color="#a3a3a3" />
                    <Text className="text-neutral-400 text-base">Settings</Text>
                </PressableBounce>
            </ScrollView>
        </>
    );
};

export default HomeScreen;
