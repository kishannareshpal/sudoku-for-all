// import { useBoardGraphicsContext } from "@/lib/components/game/board/board-graphics-context";
// import { BOARD_OUTLINE_WIDTH, CELL_OUTLINE_WIDTH, ROWS_COUNT } from "@/lib/constants/board";
// import { GridIndex } from "@/lib/shared-types";
// import { useMemo } from "react";
// import { StyleSheet, View } from "react-native";

// export const BoardCellDivisions = () => {
//     const innerLines = useMemo(() => {
//         const items = [];

//         // Here we can use either ROWS_COUNT or COLUMNS_COUNT because we know it's a square board
//         for(let innerGridIndex = 0; innerGridIndex < ROWS_COUNT - 1; innerGridIndex++) {
//             const touchesSubgrid = ((innerGridIndex + 1) % 3) === 0;
//             const dividerType = touchesSubgrid ? 'grid' : 'cell';

//             items.push(
//                 <Divider
//                     key={`row-${innerGridIndex}`}
//                     orientation="row"
//                     alignment="after"
//                     index={innerGridIndex as GridIndex}
//                     type={dividerType}
//                 />,

//                 <Divider
//                     key={`col-${innerGridIndex}`}
//                     orientation="col"
//                     alignment="after"
//                     index={innerGridIndex as GridIndex}
//                     type={dividerType}
//                 />
//             );
//         }

//         return items;
//     }, []);

//     return (
//         <View style={styles.container}>
//             {innerLines}

//             <OuterBorder />
//         </View>
//     )
// }

// type DividerProps = {
//     type: 'cell' | 'grid',
//     alignment: 'before' | 'after',
//     orientation: 'row' | 'col',
//     index: GridIndex,
// }

// const OuterBorder = () => {
//     return (
//         <View style={styles.outerBorder} />
//     )
// }

// const Divider = (
//     {
//         type,
//         alignment,
//         orientation,
//         index,
//     }: DividerProps
// ) => {
//     const boardCanvas = useBoardGraphicsContext();

//     const thickness: number = type === 'cell' ? CELL_OUTLINE_WIDTH : BOARD_OUTLINE_WIDTH;

//     const getOffsetStyleForOrientation = (): { top: number } | { left: number } => {
//         let offset: number = (alignment === 'before') ? (index * boardCanvas.cellLength) : ((index + 1) * boardCanvas.cellLength);

//         // Consider the thickness so the divider is positioned exactly in the middle of where it's supposed to be.
//         offset = offset - (thickness / 2);

//         if (orientation === 'row') {
//             return {
//                 top: offset
//             }
//         } else {
//             return {
//                 left: offset
//             }
//         }
//     }

//     const getThicknessStyleForTypeAndOrientation = (): { width: number } | { height: number } => {
//         if (orientation === 'row') {
//             return {
//                 height: thickness
//             }
//         } else {
//             return {
//                 width: thickness
//             }
//         }
//     }

//     return (
//         <View
//             style={
//                 [
//                     orientation === 'row' ? styles.rowDivider : styles.colDivider,
//                     styles.dividerColor,
//                     getThicknessStyleForTypeAndOrientation(),
//                     getOffsetStyleForOrientation(),
//                 ]
//             }
//         />
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//     },

//     outerBorder: {
//         flex: 1,

//         borderWidth: BOARD_OUTLINE_WIDTH,
//         borderColor: '#3D2E00',
//     },

//     dividerColor: {
//         backgroundColor: '#3D2E00',
//     },

//     rowDivider: {
//         position: 'absolute',
//         width: '100%',
//     },

//     colDivider: {
//         position: 'absolute',
//         height: '100%'
//     },
// })
