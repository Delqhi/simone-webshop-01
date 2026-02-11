/**
 * Type definitions for youtube-transcript-api
 * Based on the actual API usage patterns
 */

declare module 'youtube-transcript-api' {
  export interface TranscriptItem {
    text: string;
    duration: number;
    offset: number;
  }

  export interface TranscriptConfig {
    lang?: string;
  }

  export class YoutubeTranscript {
    static fetchTranscript(
      videoId: string,
      config?: TranscriptConfig
    ): Promise<TranscriptItem[]>;
  }

  export default YoutubeTranscript;
}