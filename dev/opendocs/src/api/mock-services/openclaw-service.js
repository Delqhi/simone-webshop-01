/**
 * Mock OpenClaw Service for OpenDocs
 * Provides realistic messaging when OpenClaw Docker container is DOWN
 */

const mockMessages = [];

export const mockOpenClawService = {
  async sendMessage({ integrationId, to, text }) {
    const message = {
      id: 'msg-' + Date.now().toString(36),
      integrationId,
      to: to,
      text: text,
      status: 'sent',
      timestamp: new Date().toISOString(),
      mock: true
    };
    return message;
  },

  async listChannels() {
    return [
      { id: 'channel-1', name: 'WhatsApp Business', platform: 'whatsapp' },
      { id: 'channel-2', name: 'LinkedIn', platform: 'linkedin' }
    ];
  },

  async listMessages(channelId) {
    const channelMessages = mockMessages.filter(m => m.channelId === channelId);
    return channelMessages;
  },

  async getMessageStatus(messageId) {
    const message = mockMessages.find(m => m.id === messageId);
    return message || null;
  }
};
