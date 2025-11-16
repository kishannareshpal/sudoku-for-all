import { IconButton } from "@/lib/components/common/buttons/icon-button";
import { gameplayStoreState, useGameplayStore } from "@/lib/store/gameplay";
import * as Haptics from 'expo-haptics';
import { PauseIcon, PlayIcon } from "lucide-react-native";
import { useAnimatedStyle, useSharedValue, withSequence, withSpring } from "react-native-reanimated";

export const PauseButton = () => {
    const scale = useSharedValue(1);
    const gameState = useGameplayStore((state) => state.state);

    const animate = () => {
        // Animate on gameState change
        scale.value = withSequence(
            withSpring(0.8, { duration: 1 }),
            withSpring(1, { duration: 1 })
        )
    }

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: scale.value
    }));

    const handleGameState = (): void => {
        animate();
        const nextState = gameplayStoreState().toggleGameState();

        if (nextState !== 'over') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }

    return (
        <IconButton onPress={handleGameState} style={animatedStyle}>
            {gameState === 'playing' ? (
                <PauseIcon fill="black" color="black" size={24} />
            ) : (
                <PlayIcon fill="black" color="black" size={24} />
            )}
        </IconButton>
    )
}