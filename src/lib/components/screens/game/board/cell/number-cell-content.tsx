import { BOARD_OUTLINE_WIDTH } from "@/lib/constants/board";
import { NumberCharacter, Point } from "@/lib/shared-types";
import { useGraphicsStore } from "@/lib/store/graphics";
import { Skia, TextBlob } from "@shopify/react-native-skia";
import { useShallow } from "zustand/react/shallow";

type NumberCellContentProps = {
    value: number;
    cellPoint: Point,
    isStatic: boolean;
};

export const NumberCellContent = ({
    value,
    cellPoint,
    isStatic = true,
}: NumberCellContentProps) => {
    const cellLength = useGraphicsStore((state) => state.boardLayout.cellLength)
    const valueCharSize = useGraphicsStore(
        useShallow((state) => state.getCharSizeFor('number', value.toString() as NumberCharacter))
    )
    const font = useGraphicsStore((state) => state.fontLayout.numberFont);

    if (!font) {
        return null;
    }

    const textBlob = Skia.TextBlob.MakeFromText(value.toString(), font);
    const centeredTextPoint = {
        x: cellPoint.x + (cellLength / 2) - (valueCharSize.width / 2),
        y: cellPoint.y + (cellLength / 2) + (valueCharSize.height / 2) - (BOARD_OUTLINE_WIDTH / 2),
    };

    return (
        <TextBlob
            antiAlias
            x={centeredTextPoint.x}
            y={centeredTextPoint.y}
            blob={textBlob}
            color={isStatic ? 'black' : 'orange'}
        />
    );
};