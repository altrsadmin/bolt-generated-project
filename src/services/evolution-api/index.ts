// Mock do Evolution API
export class EvolutionApiService {
  private instances: Map<string, any> = new Map();
  private eventHandlers: Map<string, Function[]> = new Map();

  async initialize() {
    logger.info('Evolution API Mock inicializado');
    return true;
  }

  async createInstance(instanceName: string) {
    const instance = {
      instanceName,
      status: 'created',
      state: 'disconnected',
      qrcode: null
    };
    this.instances.set(instanceName, instance);
    return instance;
  }

  async connectInstance(instanceName: string) {
    const instance = this.instances.get(instanceName);
    if (!instance) throw new Error('Instance not found');
    
    // Simula geração de QR Code após 2 segundos
    setTimeout(() => {
      instance.state = 'qrcode';
      instance.qrcode = 'mock-qr-code-data';
      this.emit('stateChange', {
        instanceName,
        currentState: 'qrcode',
        qrcode: instance.qrcode
      });
      
      // Simula conexão após 5 segundos
      setTimeout(() => {
        instance.state = 'connected';
        instance.qrcode = null;
        this.emit('stateChange', {
          instanceName,
          currentState: 'connected'
        });
      }, 5000);
    }, 2000);

    return true;
  }

  on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(handler);
  }

  private emit(event: string, data: any) {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }

  destroy() {
    this.instances.clear();
    this.eventHandlers.clear();
  }
}
