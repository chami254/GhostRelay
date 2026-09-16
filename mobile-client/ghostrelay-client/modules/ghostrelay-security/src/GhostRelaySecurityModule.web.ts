import { registerWebModule, NativeModule } from 'expo';

import { GhostRelaySecurityModuleEvents } from './GhostRelaySecurity.types';

class GhostRelaySecurityModule extends NativeModule<GhostRelaySecurityModuleEvents> {
  PI = Math.PI;

  hello() {
    return 'Hello world! 👋';
  }

  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
}

export default registerWebModule(GhostRelaySecurityModule, 'GhostrelaySecurityModule');
