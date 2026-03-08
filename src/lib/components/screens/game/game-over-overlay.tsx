import { TextHelper } from "@/lib/helpers/text-helper";
import { TimeHelper } from "@/lib/helpers/time-helper";
import { useGameplayStore } from "@/lib/store/gameplay";
import { useRouter } from "expo-router";
import { TrophyIcon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export const GameOverOverlay = () => {
    const router = useRouter();
    const isGameOver = useGameplayStore((state) => state.state === 'over');
    const puzzle = useGameplayStore((state) => state.puzzle);

    if (!isGameOver || !puzzle) {
        return null;
    }

    const formattedTime = TimeHelper.formatInterval(puzzle.timeElapsedInSeconds);
    const formattedDifficulty = TextHelper.formatDifficulty(puzzle.difficulty);

    const handleNewGame = () => {
        router.back();
    };

    return (
        <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(200)}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 24,
                padding: 32,
            }}
        >
            <View style={{ alignItems: 'center', gap: 16 }}>
                <TrophyIcon color="#FFD147" size={64} fill="#FFD147" />

                <Text style={{ fontSize: 36, fontWeight: 'bold', color: 'black' }}>
                    Well done!
                </Text>
            </View>

            <Text style={{ fontSize: 16, color: '#555', textAlign: 'center', lineHeight: 24 }}>
                You solved this {formattedDifficulty} puzzle in {formattedTime}.
                {'\n'}Your final score is {puzzle.score} points!
            </Text>

            <Text style={{ fontSize: 14, color: '#888' }}>
                Up for another challenge?
            </Text>

            <Pressable
                onPress={handleNewGame}
                style={{
                    backgroundColor: '#222',
                    paddingHorizontal: 32,
                    paddingVertical: 14,
                    borderRadius: 16,
                    borderCurve: 'continuous',
                }}
            >
                <Text style={{ color: 'white', fontSize: 17, fontWeight: '600' }}>
                    New game
                </Text>
            </Pressable>
        </Animated.View>
    );
};
