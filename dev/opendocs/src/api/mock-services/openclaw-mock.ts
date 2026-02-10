import { nanoid } from 'nanoid';

interface OpenClawMessage {
  id: string;
  channelId: string;
  content: string;
  authorId: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'failed';
}

interface OpenClawChannel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'video';
  createdAt: string;
}

const channels: Map<string, OpenClawChannel> = new Map();
const messages: Map<string, OpenClawMessage> = new Map();

export const mockOpenClawService = {
  /**
   * Send a message to a channel
   */
  async sendMessage(data: {
    channelId: string;
    content: string;
    authorId: string;
  }): Promise<OpenClawMessage> {
    const message: OpenClawMessage = {
      id: nanoid(),
      channelId: data.channelId,
      content: data.content,
      authorId: data.authorId,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };

    messages.set(message.id, message);

    setTimeout(() => {
      const pending = messages.get(message.id);
      if (pending) {
        pending.status = 'delivered';
      }
    }, 500);

    return message;
  },

  /**
   * Get a message by ID
   */
  async getMessage(messageId: string): Promise<OpenClawMessage | null> {
    return messages.get(messageId) || null;
  },

  /**
   * List messages in a channel
   */
  async listMessages(channelId: string): Promise<OpenClawMessage[]> {
    return Array.from(messages.values())
      .filter((m) => m.channelId === channelId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  /**
   * Create a channel
   */
  async createChannel(data: {
    name: string;
    type?: 'text' | 'voice' | 'video';
  }): Promise<OpenClawChannel> {
    const channel: OpenClawChannel = {
      id: nanoid(),
      name: data.name,
      type: data.type || 'text',
      createdAt: new Date().toISOString(),
    };

    channels.set(channel.id, channel);
    return channel;
  },

  /**
   * List all channels
   */
  async listChannels(): Promise<OpenClawChannel[]> {
    return Array.from(channels.values());
  },

  /**
   * Get a channel by ID
   */
  async getChannel(channelId: string): Promise<OpenClawChannel | null> {
    return channels.get(channelId) || null;
  },

  /**
   * Clear all mock data
   */
  async clearAll(): Promise<void> {
    channels.clear();
    messages.clear();
  },
};

export type { OpenClawMessage, OpenClawChannel };
