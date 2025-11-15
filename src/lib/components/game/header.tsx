import { TextHelper } from "@/lib/helpers/text-helper";
import { TimeHelper } from "@/lib/helpers/time-helper";
import { gameplayStoreState, useGameplayStore } from "@/lib/store/gameplay";
import * as Haptics from 'expo-haptics';
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { IconButton } from "../shared/icon-button";

export const Header = () => {
    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>
                <BackButton />
                <PauseButton />
            </View>

            <View style={styles.descriptionContainer}>
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
        <Text style={styles.titleText}>
            {TimeHelper.formatInterval(timeElapsedInSeconds)}
        </Text>
    )
}

const Stats = () => {
    const difficulty = useGameplayStore((store) => store.puzzle?.difficulty);

    return (
        <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>
                {difficulty ? TextHelper.formatDifficulty(difficulty) : 'N/a'}
            </Text>
            <Text style={styles.subtitleText}>•</Text>
            <Text style={styles.subtitleText}>120 Points</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },

    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    descriptionContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    titleText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    },

    subtitleContainer: {
        flexDirection: 'row',
        gap: 6
    },

    subtitleText: {
        color: 'white',
        fontSize: 16
    },
});
