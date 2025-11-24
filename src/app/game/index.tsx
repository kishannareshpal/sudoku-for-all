import { Board } from "@/lib/components/screens/game/board";
import { BoardWrapper } from "@/lib/components/screens/game/board/wrapper";
import { Controls } from "@/lib/components/screens/game/controls";
import { Header } from "@/lib/components/screens/game/header";
import { NumberPad } from "@/lib/components/screens/game/number-pad";
import { PausedGameOverlay } from "@/lib/components/screens/game/paused-game-overlay";
import { useGameplayStore } from "@/lib/store/gameplay";
import { Stack } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GameScreen = () => {
    const insets = useSafeAreaInsets();

    return (
        <>
            <Stack.Screen options={{ header: () => <Header /> }} />

            <View className="flex-1 bg-white p-3 gap-2" style={{ paddingBottom: insets.bottom }}>
                <View className="flex-1">
                    <BoardWrapper>
                        <Board />

                        <View className="absolute inset-0">
                            <PausedGameOverlay />
                        </View>
                    </BoardWrapper>
                </View>

                <View className="justify-center gap-3">
                    <Controls />

                    <DebugMoves />

                    <View className="gap-3 items-center justify-center">
                        <NumberPad />
                    </View>
                </View>
            </View>
        </>
    );
}

const DebugMoves = () => {
    const moveHistory = useGameplayStore((state) => state.puzzle?.moveHistory);

    return (
        <ScrollView className="h-50">
            <Text>
                {JSON.stringify(moveHistory, null, 2)}
            </Text>
        </ScrollView>
    )
}

export default GameScreen;
