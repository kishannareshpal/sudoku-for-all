import { BOARD_OUTLINE_WIDTH } from "@/lib/constants/board";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { NumberCharacter, Point } from "@/lib/shared-types";
import { useGraphicsStore } from "@/lib/store/graphics";
import { Group, Skia, TextBlob } from "@shopify/react-native-skia";
import { useShallow } from "zustand/react/shallow";

type NotesCellTextProps = {
    values: number[];
    cellPoint: Point;
};

export const NotesCellContent = ({
    values,
    cellPoint,
}: NotesCellTextProps) => {
    return (
        <Group>
            {values.map((noteValue) => (
                <NoteText
                    key={noteValue}
                    value={noteValue}
                    cellPoint={cellPoint}
                />
            ))}
        </Group>
    );
};

type NoteTextProps = {
    value: number;
    cellPoint: Point;
};

const NoteText = (
    {
        value,
        cellPoint,
    }: NoteTextProps
) => {
    const subCellLength = useGraphicsStore((state) => state.boardLayout.subCellLength)
    const valueCharSize = useGraphicsStore(
        useShallow((state) => state.getCharSizeFor('note', value.toString() as NumberCharacter))
    )
    const font = useGraphicsStore((state) => state.fontLayout.notesFont);

    if (!font) {
        return null;
    }

    const subgridPosition = SubgridPositionHelper.createFromFlatIndex(
        (value - 1) % 9,
    );

    const centeredTextPoint = {
        x: (cellPoint.x + (subCellLength / 2) - (valueCharSize.width / 2)) + (subCellLength * subgridPosition.col),
        y: (cellPoint.y + (subCellLength / 2) + (valueCharSize.height / 2) - (BOARD_OUTLINE_WIDTH / 2)) + (subCellLength * subgridPosition.row)
    }

    const textBlob = Skia.TextBlob.MakeFromText(value.toString(), font);

    return (
        <TextBlob
            antiAlias
            x={centeredTextPoint.x}
            y={centeredTextPoint.y}
            blob={textBlob}
        />
    );
};