import { NewGameOptions } from "@/lib/components/home/new-game-options";
import { Title } from "@/lib/components/home/title";
import { GameHelper } from "@/lib/helpers/game-helper";
import { Difficulty } from "@/lib/shared-types";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = () => {
    const router = useRouter();

    const handleStartNewGame = (difficulty: Difficulty) => {
        GameHelper.newGame(difficulty);

        router.push({
            pathname: "/game",
            params: { difficulty: difficulty },
        });
    };

    const safeAreaInsets = useSafeAreaInsets();

    return (
        <ScrollView
            className="bg-neutral-800"
            contentContainerClassName="flex-1 justify-center items-center gap-6"
            contentContainerStyle={
                {
                    paddingTop: safeAreaInsets.top + 12,
                    paddingBottom: safeAreaInsets.bottom + 12,
                    paddingLeft: safeAreaInsets.left + 12,
                    paddingRight: safeAreaInsets.right + 12,
                }
            }
        >
            <Title />

            <NewGameOptions
                onOptionPress={(option) => handleStartNewGame(option.value)}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollViewContainer: {
        backgroundColor: "green",
    },
});

export default HomeScreen;
