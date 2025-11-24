import { TimeHelper } from "@/lib/helpers/time-helper";
import { useTimer } from "@/lib/hooks/use-timer";
import { useGameplayStore } from "@/lib/store/gameplay";
import { Text } from "react-native";

export const Timer = () => {
    const timeElapsedInSeconds = useGameplayStore((state) => state.puzzle?.timeElapsedInSeconds);

    useTimer();

    if (timeElapsedInSeconds === undefined) {
        return null;
    }

    return (
        <Text className="text-black font-bold text-lg">
            {TimeHelper.formatInterval(timeElapsedInSeconds)}
        </Text>
    );
};
