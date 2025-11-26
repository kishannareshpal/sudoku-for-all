import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { getNumberValueAt } from "@/lib/helpers/values";
import { useGameplayStore } from "@/lib/store/gameplay";
import { Group } from "@shopify/react-native-skia";
import { PeerNote } from "./peer-cell/peer-note";
import { PeerNumber } from "./peer-cell/peer-number";

export const Peers = () => {
    const valueUnderCursor = useGameplayStore((state) => {
        if (!state.puzzle) {
            return 0;
        }

        return getNumberValueAt({
            position: state.cursorGridPosition,
            playerGridNotation: state.puzzle.player,
            givenGridNotation: state.puzzle.given
        })
    });

    const cursorPeerCells = useGameplayStore((state) => state.cursorPeerCells);

    return (
        <Group>
            {cursorPeerCells.map((peerCellMetadata) => {
                const key = `pc-${peerCellMetadata.type}-${GridPositionHelper.stringNotationOf(
                    peerCellMetadata.gridPosition,
                )}`;

                if (peerCellMetadata.type === "note") {
                    return (
                        <PeerNote
                            key={key}
                            gridPosition={peerCellMetadata.gridPosition}
                            value={valueUnderCursor}
                        />
                    );
                } else if (peerCellMetadata.type === 'number') {
                    return (
                        <PeerNumber
                            key={key}
                            gridPosition={peerCellMetadata.gridPosition}
                        />
                    );
                } else if (peerCellMetadata.type === 'both') {
                    return (
                        <Group key={key}>
                            <PeerNote
                                gridPosition={peerCellMetadata.gridPosition}
                                value={valueUnderCursor}
                            />

                            <PeerNumber gridPosition={peerCellMetadata.gridPosition} />
                        </Group>
                    )
                } else {
                    return null
                }
            })}
        </Group>
    );
};



