import { TimeHelper } from "@/lib/helpers/time-helper";
import { useGameplayStore } from "@/lib/store/gameplay";
import { Text } from "react-native";

export const Timer = () => {
    const timeElapsedInSeconds = useGameplayStore((store) => store.puzzle?.timeElapsedInSeconds ?? 0);

    return (
        <Text className="text-black font-bold text-lg">
            {TimeHelper.formatInterval(timeElapsedInSeconds)}
        </Text>
    );
};
