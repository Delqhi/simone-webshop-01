/**
 * Video Analysis Service
 * Handles YouTube transcript extraction and AI scene analysis
 * Best Practices Feb 2026
 */

export interface VideoScene {
  id: string;
  start: number;
  end: number;
  duration: number;
  description: string;
  important: boolean;
}

export interface VideoAnalysisResult {
  url: string;
  transcript: string;
  scenes: VideoScene[];
  analyzed: boolean;
}

/**
 * Extract YouTube video ID from URL
 */
export function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      return u.searchParams.get('v');
    }
    if (u.hostname === 'youtu.be') {
      return u.pathname.split('/').filter(Boolean)[0];
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Fetch YouTube transcript using youtube-transcript-api
 */
export async function fetchTranscript(videoId: string): Promise<string> {
  try {
    // Dynamic import for ESM compatibility
    const { YoutubeTranscript } = await import('youtube-transcript-api');
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    return transcriptItems.map((item) => item.text).join(' ');
  } catch (error) {
    console.error('Failed to fetch transcript:', error);
    throw new Error('Could not fetch video transcript. Video may not have captions available.');
  }
}

/**
 * Analyze transcript and detect scenes using NVIDIA Mistral AI
 */
export async function analyzeScenesWithAI(
  transcript: string,
  videoDuration: number,
  apiKey: string
): Promise<VideoScene[]> {
  const prompt = `Analyze this video transcript and identify distinct scenes/segments.
  
Transcript:
${transcript}

Video Duration: ${videoDuration} seconds

Identify 3-8 distinct scenes based on topic changes. For each scene provide:
- Start time (seconds)
- End time (seconds)  
- Brief description (1-2 sentences)
- Importance score (0-100, where 100 is most important)

Return ONLY a JSON array in this exact format:
[
  {"start": 0, "end": 120, "description": "Introduction and overview", "importance": 90},
  {"start": 120, "end": 300, "description": "Main topic discussion", "importance": 85}
]

Important: Return ONLY the JSON array, no markdown, no explanation.`;

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-large-3-675b-instruct-2512',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2048,
        temperature: 0.3,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI analysis failed: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || '';
    
    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    const scenes = JSON.parse(jsonMatch[0]);
    
    // Add IDs and format
    return scenes.map((scene: any, index: number) => ({
      id: `scene_${index}_${Date.now()}`,
      start: scene.start,
      end: scene.end,
      duration: scene.end - scene.start,
      description: scene.description,
      important: scene.importance >= 70,
    }));
  } catch (error) {
    console.error('Scene analysis failed:', error);
    // Return fallback scenes
    return generateFallbackScenes(videoDuration);
  }
}

/**
 * Generate fallback scenes when AI fails
 */
function generateFallbackScenes(duration: number): VideoScene[] {
  const numScenes = Math.min(5, Math.max(3, Math.floor(duration / 300)));
  const sceneDuration = duration / numScenes;
  
  return Array.from({ length: numScenes }, (_, i) => ({
    id: `scene_${i}_${Date.now()}`,
    start: Math.floor(i * sceneDuration),
    end: Math.floor((i + 1) * sceneDuration),
    duration: Math.floor(sceneDuration),
    description: `Scene ${i + 1}: Video segment from ${formatTime(i * sceneDuration)} to ${formatTime((i + 1) * sceneDuration)}`,
    important: i === 0 || i === numScenes - 1,
  }));
}

/**
 * Format seconds to MM:SS
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Complete video analysis pipeline
 */
export async function analyzeVideo(
  url: string,
  apiKey: string
): Promise<VideoAnalysisResult> {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  // Fetch transcript
  const transcript = await fetchTranscript(videoId);
  
  if (!transcript || transcript.trim().length === 0) {
    throw new Error('No transcript available for this video');
  }

  // Estimate video duration (rough estimate based on transcript length)
  // Average speaking rate: 130 words per minute
  const wordCount = transcript.split(' ').length;
  const estimatedDuration = Math.ceil((wordCount / 130) * 60);

  // Analyze scenes with AI
  const scenes = await analyzeScenesWithAI(transcript, estimatedDuration, apiKey);

  return {
    url,
    transcript,
    scenes,
    analyzed: true,
  };
}