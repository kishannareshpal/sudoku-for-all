import { Button, Host } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";
import { EvilIcons } from "@expo/vector-icons";

export const UndoControl = () => {
    return (
        <Host matchContents>
            <Button
                variant="glass"
                systemImage="gobackward.10.ar"
                color="red"
            />
        </Host>
    );
};
