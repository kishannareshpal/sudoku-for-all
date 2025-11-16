import { IconButton } from "@/lib/components/common/buttons/icon-button";
import { router } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";

export const BackButton = () => {
    const handleNavigateBack = (): void => {
        router.back();
    }

    return (
        <IconButton className="bg-neutral-100" onPress={handleNavigateBack}>
            <ArrowLeftIcon color="black" size={24} />
        </IconButton>
    )
}