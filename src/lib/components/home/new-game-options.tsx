import { TextHelper } from "@/lib/helpers/text-helper";
import { Difficulty } from "@/lib/shared-types";
import { StyleSheet, View } from "react-native";
import { Button } from "../shared/button";

type Option = {
    name: string,
    value: Difficulty
};

const difficulties: Difficulty[] = [
    'easy',
    'medium',
    'hard',
    'very-hard',
    'extreme'
]
const options: Option[] = difficulties.map((difficulty) => (
    {
        name: TextHelper.formatDifficulty(difficulty),
        value: difficulty
    }
));

type NewGameOptionsProps = {
    onOptionPress: (option: Option) => void
}

export const NewGameOptions = (
    {
        onOptionPress
    }: NewGameOptionsProps
) => {
    return (
        <View style={styles.container}>
            {options.map((option) => (
                <Button
                    key={option.value}
                    label={option.name}
                    onPress={() => onOptionPress(option)}
                    style={styles.button}
                    activeScale={0.95}
                    textProps={{
                        style: styles.buttonText
                    }}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 6
    },

    button: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 24,
        minWidth: '100%',
        maxWidth: 400
    },

    buttonText: {
        fontSize: 16
    }
});
