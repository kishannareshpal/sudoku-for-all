import { TextHelper } from "@/lib/helpers/text-helper";
import { Difficulty } from "@/lib/shared-types";
import { StyleSheet, View } from "react-native";
import { Button } from "../../common/button";

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
        gap: 6,
    },

    button: {
        backgroundColor: '#3b3b3b',
        padding: 12,
        borderRadius: 12,
        paddingVertical: 18,
        width: 400,
        maxWidth: '100%',
        cursor: 'pointer'
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});
