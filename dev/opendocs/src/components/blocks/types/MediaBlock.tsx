import { useMemo, useState } from "react";
import type { ImageBlock, VideoBlock } from "@/types/docs";
import { Image as ImageIcon, Video as VideoIcon, Wand2, ChevronDown, ChevronRight, Play, Eye, EyeOff } from "lucide-react";
import { useDocsStore } from "@/store/useDocsStore";
import { executeOpenDocsCommand } from "@/commands/executeCommand";

const API_AUTH_TOKEN = import.meta.env.VITE_API_AUTH_TOKEN || "";

export function ImageBlockView({
  block,
  disabled,
  onUpdate,
}: {
  block: ImageBlock;
  disabled: boolean;
  onUpdate: (patch: Partial<ImageBlock>) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800">
          <ImageIcon className="h-3.5 w-3.5 text-zinc-500" />
        </div>
        <input
          disabled={disabled}
          value={block.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder="Paste image URL..."
          className="flex-1 bg-transparent text-xs text-zinc-500 outline-none hover:text-zinc-900 dark:hover:text-zinc-100"
        />
      </div>
      {block.url ? (
        <img
          src={block.url}
          alt={block.alt || ""}
          className="max-h-[480px] w-full rounded-lg object-contain shadow-sm border border-zinc-100 dark:border-zinc-800"
        />
      ) : (
        <div className="flex h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <ImageIcon className="mb-2 h-8 w-8 text-zinc-300" />
          <p className="text-xs text-zinc-400 font-medium">Image Placeholder</p>
        </div>
      )}
    </div>
  );
}

export function VideoBlockView({
  block,
  disabled,
  onUpdate,
}: {
  block: VideoBlock;
  disabled: boolean;
  onUpdate: (patch: Partial<VideoBlock>) => void;
}) {
  const { state } = useDocsStore();
  const [analyzing, setAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showScenes, setShowScenes] = useState(false);
  const [hideUnimportant, setHideUnimportant] = useState(false);

  const embedUrl = useMemo(() => {
    const url = block.url;
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
      }
      if (u.hostname === "youtu.be") {
        const id = u.pathname.split("/").filter(Boolean)[0];
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
      }
      if (u.hostname.includes("vimeo.com")) {
        const id = u.pathname.split("/").filter(Boolean)[0];
        return id ? `https://player.vimeo.com/video/${id}` : null;
      }
    } catch { return null; }
    return null;
  }, [block.url]);

   const handleAnalyze = async () => {
     if (!block.url || analyzing) return;
     setAnalyzing(true);
     try {
       const response = await fetch('/api/video/analyze', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'X-OpenDocs-Token': API_AUTH_TOKEN || '',
         },
         body: JSON.stringify({ url: block.url }),
       });

       const result = await response.json();

       if (response.ok && result.analyzed) {
         onUpdate({
           analyzed: true,
           transcript: result.transcript,
           scenes: result.scenes,
           aiError: undefined,
         });
         setShowAnalysis(true);
       } else {
         throw new Error(result.message || 'Analysis failed');
       }
     } catch (error) {
       console.error("Video analysis failed:", error);
       onUpdate({ aiError: "AI analysis failed. Please try again." });
     } finally {
       setAnalyzing(false);
     }
   };

   const importImportantScenes = () => {
     const pageId = state.selectedPageId || "";
     if (!pageId || !block.scenes) return;

     const importantScenes = block.scenes.filter(s => s.important);
     
     importantScenes.forEach((scene) => {
       const newBlock = {
         id: `scene_${scene.id}`,
         type: "video" as const,
         url: block.url,
         caption: scene.description,
         createdAt: new Date().toISOString(),
       };

       executeOpenDocsCommand({
         type: "block.create",
         pageId,
         blockType: "video",
         initial: newBlock,
       });
     });

     setShowScenes(false);
   };

  const visibleScenes = block.scenes?.filter(s => !hideUnimportant || s.important) || [];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800">
          <VideoIcon className="h-3.5 w-3.5 text-zinc-500" />
        </div>
        <input
          disabled={disabled}
          value={block.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder="Paste YouTube/Vimeo URL..."
          className="flex-1 bg-transparent text-xs text-zinc-500 outline-none hover:text-zinc-900 dark:hover:text-zinc-100"
        />
        {block.url && !block.analyzed && (
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing || disabled}
            className="flex items-center gap-1 rounded bg-violet-600 px-2 py-1 text-xs text-white hover:bg-violet-700 disabled:opacity-50"
          >
            <Wand2 className="h-3.5 w-3.5" />
            {analyzing ? "Analyzing..." : "AI Analyze"}
          </button>
        )}
      </div>

      {embedUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-zinc-200 bg-black dark:border-zinc-800 shadow-lg">
          <iframe
            className="h-full w-full"
            src={`${embedUrl}?start=${0}`}
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      {!embedUrl && block.url && (
        <div className="flex h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <VideoIcon className="mb-2 h-8 w-8 text-zinc-300" />
          <p className="text-xs text-zinc-400 font-medium">Unsupported video URL</p>
        </div>
      )}

      {!embedUrl && !block.url && (
        <div className="flex h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <VideoIcon className="mb-2 h-8 w-8 text-zinc-300" />
          <p className="text-xs text-zinc-400 font-medium">Video Placeholder</p>
        </div>
      )}

      {block.analyzed && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              AI Analysis
            </span>
            <button
              type="button"
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              {showAnalysis ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>

          {showAnalysis && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex w-full items-center justify-between rounded bg-zinc-50 px-3 py-2 text-left text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <span>Transcript</span>
                {showTranscript ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>

              {showTranscript && block.transcript && (
                <div className="max-h-48 overflow-y-auto rounded bg-white p-3 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 custom-scrollbar">
                  {block.transcript}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowScenes(!showScenes)}
                className="flex w-full items-center justify-between rounded bg-zinc-50 px-3 py-2 text-left text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <span>Scene Segments ({block.scenes?.length || 0})</span>
                {showScenes ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>

              {showScenes && block.scenes && block.scenes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                      <input
                        type="checkbox"
                        checked={hideUnimportant}
                        onChange={(e) => setHideUnimportant(e.target.checked)}
                        className="h-3 w-3"
                      />
                      Hide unimportant
                    </label>
                    {visibleScenes.some(s => s.important) && (
                      <button
                        type="button"
                        onClick={importImportantScenes}
                        className="ml-auto rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                      >
                        Import Important ({visibleScenes.filter(s => s.important).length})
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar">
                    {visibleScenes.map((scene) => (
                      <div
                        key={scene.id}
                        className={`flex items-start gap-2 rounded border px-3 py-2 ${
                          scene.important
                            ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/20"
                            : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const newScenes = [...(block.scenes || [])];
                            const sceneIndex = newScenes.findIndex(s => s.id === scene.id);
                            if (sceneIndex >= 0) {
                              newScenes[sceneIndex] = { ...scene, important: !scene.important };
                              onUpdate({ scenes: newScenes });
                            }
                          }}
                          className="mt-0.5"
                        >
                          {scene.important ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-zinc-400" />
                          )}
                        </button>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                              {scene.duration}s
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (embedUrl) {
                                  window.open(`${embedUrl}?start=${scene.start}`, "_blank");
                                }
                              }}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                            >
                              <Play className="h-3 w-3" />
                              Play
                            </button>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">
                            {scene.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {block.aiError && (
        <div className="rounded bg-red-50 p-2 text-xs text-red-700 dark:bg-red-950/20 dark:text-red-400">
          {block.aiError}
        </div>
      )}
    </div>
  );
}
