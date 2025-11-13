import { NativeModule, requireNativeModule } from "expo";

// <SudokuForAllUIModuleEvents>
declare class SudokuForAllUIModule extends NativeModule {
    // PI: number;
    // hello(): string;
    // setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<SudokuForAllUIModule>("SudokuForAllUI");
