import { NewGameOptions } from "@/lib/components/home/new-game-options";
import { Title } from "@/lib/components/home/title";
import { GameHelper } from "@/lib/helpers/game-helper";
import { Difficulty } from "@/lib/shared-types";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = () => {
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const handleStartNewGame = (difficulty: Difficulty) => {
        GameHelper.newGame(difficulty);

        router.push({
            pathname: '/game',
            params: { difficulty: difficulty }
        });
    }

    const safeAreaInsets = useSafeAreaInsets();

    return (
        <ScrollView
            style={styles.scrollViewContainer}
            contentContainerStyle={[
                styles.scrollViewContentContainer,
                {
                    paddingTop: safeAreaInsets.top + 12,
                    paddingBottom: safeAreaInsets.bottom + 12,
                    paddingLeft: safeAreaInsets.left + 12,
                    paddingRight: safeAreaInsets.right + 12
                }
            ]}
        >
            <Title />

            <NewGameOptions
                onOptionPress={(option) => handleStartNewGame(option.value)}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        backgroundColor: '#0D1013'
    },
    scrollViewContentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24
    },
})

export default HomeScreen;
