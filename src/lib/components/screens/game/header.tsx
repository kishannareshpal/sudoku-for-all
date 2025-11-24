import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton } from "./header/back-button";
import { PauseButton } from "./header/pause-button";
import { StatsText } from "./header/stats-text";
import { Timer } from "./header/timer-text";

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
            <View className="relative justify-center items-center">
                <View className="absolute flex-row inset-0 justify-between items-center">
                    <BackButton />
                    <PauseButton />
                </View>

                <View className="items-center">
                    <Timer />
                    <StatsText />
                </View>
            </View>
        </View>
    );
}
