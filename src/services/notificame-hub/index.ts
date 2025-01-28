// Mock do Notificame Hub
export class NotificameHubService {
  private eventHandlers: Map<string, Function[]> = new Map();
  private messageQueue: any[] = [];

  async initialize() {
    logger.info('Notificame Hub Mock inicializado');
    this.startMessageSimulation();
    return true;
  }

  async sendMessage(options: any) {
    const messageId = `msg_${Date.now()}`;
    const message = {
      id: messageId,
      ...options,
      status: 'queued',
      timestamp: new Date().toISOString()
    };

    // Simula estados da mensagem
    setTimeout(() => this.updateMessageStatus(messageId, 'sent'), 1000);
    setTimeout(() => this.updateMessageStatus(messageId, 'delivered'), 3000);
    setTimeout(() => this.updateMessageStatus(messageId, 'read'), 5000);

    return message;
  }

  private updateMessageStatus(messageId: string, status: string) {
    const statusUpdate = {
      id: messageId,
      status,
      timestamp: new Date().toISOString()
    };
    this.emit('messageStatus', statusUpdate);
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

  private startMessageSimulation() {
    // Simula recebimento de mensagens a cada 30 segundos
    setInterval(() => {
      const mockMessage = {
        id: `incoming_${Date.now()}`,
        from: '5511999999999',
        text: 'Mensagem simulada de teste',
        timestamp: new Date().toISOString()
      };
      this.messageQueue.push(mockMessage);
      this.emit('messageReceived', mockMessage);
    }, 30000);
  }

  destroy() {
    this.eventHandlers.clear();
    this.messageQueue = [];
  }
}
