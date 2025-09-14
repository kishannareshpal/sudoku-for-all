import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './SudokuForAllUI.types';

type SudokuForAllUIModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class SudokuForAllUIModule extends NativeModule<SudokuForAllUIModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(SudokuForAllUIModule, 'SudokuForAllUIModule');
