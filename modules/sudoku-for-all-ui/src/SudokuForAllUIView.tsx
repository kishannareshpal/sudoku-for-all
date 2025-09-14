import { requireNativeView } from 'expo';
import * as React from 'react';

import { SudokuForAllUIViewProps } from './SudokuForAllUI.types';

const NativeView: React.ComponentType<SudokuForAllUIViewProps> =
  requireNativeView('SudokuForAllUI');

export default function SudokuForAllUIView(props: SudokuForAllUIViewProps) {
  return <NativeView {...props} />;
}
