import { NativeModule, requireNativeModule } from 'expo';

import { SudokuForAllUIModuleEvents } from './SudokuForAllUI.types';

declare class SudokuForAllUIModule extends NativeModule<SudokuForAllUIModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<SudokuForAllUIModule>('SudokuForAllUI');
