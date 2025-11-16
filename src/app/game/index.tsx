import { Board } from "@/lib/components/screens/game/board";
import { BoardWrapper } from "@/lib/components/screens/game/board/wrapper";
import { Controls } from "@/lib/components/screens/game/controls";
import { EntryModeToggle } from "@/lib/components/screens/game/entry-mode-toggle";
import { Header } from "@/lib/components/screens/game/header";
import { NumberPad } from "@/lib/components/screens/game/number-pad";
import { PausedGameOverlay } from "@/lib/components/screens/game/paused-game-overlay";
import { Stack } from "expo-router";
import { View } from "react-native";
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

                <View className="justify-center gap-2">
                    <Controls />

                    <View className="gap-2 items-center justify-center">
                        <EntryModeToggle />
                        <NumberPad />
                    </View>
                </View>
            </View>
        </>
    );
}

export default GameScreen;
