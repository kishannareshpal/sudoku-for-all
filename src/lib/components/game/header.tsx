import { TextHelper } from "@/lib/helpers/text-helper";
import { TimeHelper } from "@/lib/helpers/time-helper";
import { gameplayStoreState, useGameplayStore } from "@/lib/store/gameplay";
import * as Haptics from 'expo-haptics';
import { router } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "../shared/icon-button";

export const Header = () => {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="bg-white"
            style={{
                paddingLeft: insets.left + 24,
                paddingRight: insets.right + 24,
                paddingTop: insets.top + 12,
                paddingBottom: 12,
            }}
        >
            {/* <View style={styles.buttonsContainer}>
                <BackButton />
                <PauseButton />
            </View>*/}

            <View className="items-center">
                <Timer />
                <Stats />
            </View>
        </View>
    );
}

const BackButton = () => {
    const handleNavigateBack = (): void => {
        router.back();
    }

    return (
        <IconButton
            iconProps={{
                type: 'ionicons',
                name: 'chevron-back-outline'
            }}
            onPress={handleNavigateBack}
        />
    )
}

const PauseButton = () => {
    const gameState = useGameplayStore((state) => state.state);

    const handlePauseGame = (): void => {
        gameplayStoreState().toggleGameState();

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    return (
        <IconButton
            iconProps={{
                type: 'ionicons',
                name: gameState === 'paused' ? 'play' : 'pause'
            }}
            onPress={handlePauseGame}
        />
    )
}

const Timer = () => {
    const timeElapsedInSeconds = useGameplayStore((store) => store.puzzle?.timeElapsedInSeconds ?? 0);

    return (
        <Text className="text-black font-bold text-lg">
            {TimeHelper.formatInterval(timeElapsedInSeconds)}
        </Text>
    )
}

const Stats = () => {
    const difficulty = useGameplayStore((store) => store.puzzle?.difficulty);

    return (
        <View className="flex-row gap-1">
            <Text className="text-black">
                {difficulty ? TextHelper.formatDifficulty(difficulty) : 'N/a'}
            </Text>
            <Text className="text-black">•</Text>
            <Text className="text-black">120 Points</Text>
        </View>
    )
}
