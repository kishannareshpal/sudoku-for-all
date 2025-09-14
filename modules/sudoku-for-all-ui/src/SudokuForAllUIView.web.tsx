import * as React from 'react';

import { SudokuForAllUIViewProps } from './SudokuForAllUI.types';

export default function SudokuForAllUIView(props: SudokuForAllUIViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
