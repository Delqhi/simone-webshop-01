import { useState } from "react";
import { Wand2, Brain, ChevronDown, ChevronRight, Minimize2, Maximize2, PanelRight, X } from "lucide-react";
import { agentPlan } from "@/services/nvidia";

type AITransformationType =
  | "refactor"
  | "summarize"
  | "expand"
  | "translate"
  | "fix";

interface BlockChatModalProps {
  blockId: string;
  isOpen: boolean;
  blockType: string;
  content: string;
  onClose: () => void;
  onUpdate: (newContent: string) => void;
}

export function BlockChatModal({
  blockId,
  isOpen,
  blockType,
  content,
  onClose,
  onUpdate,
}: BlockChatModalProps) {
   const [message, setMessage] = useState("");
   const [isTyping, setIsTyping] = useState(false);
   const [showAITransforms, setShowAITransforms] = useState(false);
   const [isDocked, setIsDocked] = useState(false);
   const [isMinimized, setIsMinimized] = useState(false);

   const aiTransformations: { type: AITransformationType; label: string; icon: any }[] = [
     { type: "refactor", label: "Refactor", icon: Wand2 },
     { type: "summarize", label: "Summarize", icon: Brain },
     { type: "expand", label: "Expand", icon: ChevronRight },
     { type: "translate", label: "Translate", icon: ChevronDown },
     { type: "fix", label: "Fix", icon: ChevronDown },
   ];

   const handleSend = async () => {
     if (!message.trim()) return;
     setIsTyping(true);

     try {
       const result = await agentPlan(
         `As an AI assistant, respond to this request about ${blockType}:\n\nUser said: ${message}\n\nCurrent content:\n${content}\n\nProvide a helpful, concise response.`,
         {
           blockId,
           blockType,
         }
       );

       if (result.reply) {
         onUpdate(result.reply);
         setMessage("");
      }
    } catch (error) {
      console.error("AI chat failed:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAITransform = async (type: AITransformationType) => {
    setIsTyping(true);
    setShowAITransforms(false);

    try {
      const prompts: Record<AITransformationType, string> = {
        refactor: "Refactor and improve the following content following best practices. Make it clearer, more concise, well-structured, and maintain the original meaning:",
        summarize: "Summarize the following content in 2-3 sentences, highlighting the key points:",
        expand: "Expand on the following content by adding relevant details, examples, and context to make it more comprehensive:",
        translate: "Translate the following content to English while maintaining the original meaning and tone:",
        fix: "Fix grammar, spelling, punctuation, and any other issues in the following content:",
      };

       const result = await agentPlan(
         `${prompts[type]}\n\n${content}`,
         {
           blockId,
           blockType,
           transformation: type,
         }
       );

       if (result.reply) {
         onUpdate(result.reply);
       }
    } catch (error) {
      console.error("AI transformation failed:", error);
    } finally {
      setIsTyping(false);
    }
  };

   if (!isOpen) return null;

   // Minimized State - Show floating button
   if (isMinimized) {
     return (
       <button
         type="button"
         onClick={() => setIsMinimized(false)}
         className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-violet-700 transition-all"
       >
         <Maximize2 className="h-4 w-4" />
         AI Chat
       </button>
     );
   }

   // Docked State - Show as right sidebar panel
   if (isDocked) {
     return (
       <div className="fixed right-0 top-0 h-full w-[400px] z-50 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col">
         <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
           <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
             AI Chat - {blockType}
           </h3>
           <div className="flex items-center gap-1">
             <button
               type="button"
               onClick={() => setIsMinimized(true)}
               className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
               title="Minimize"
             >
               <Minimize2 className="h-4 w-4" />
             </button>
             <button
               type="button"
               onClick={() => setIsDocked(false)}
               className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
               title="Undock"
             >
               <PanelRight className="h-4 w-4" />
             </button>
             <button
               type="button"
               onClick={onClose}
               className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
               title="Close"
             >
               <X className="h-4 w-4" />
             </button>
           </div>
         </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Quick AI Transformations
                </label>
                <button
                  type="button"
                  onClick={() => setShowAITransforms(!showAITransforms)}
                  className="flex w-full items-center justify-between rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  <span>Transform Content</span>
                  {showAITransforms ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>

                {showAITransforms && (
                  <div className="mt-2 space-y-1">
                    {aiTransformations.map((transform) => (
                      <button
                        key={transform.type}
                        type="button"
                        onClick={() => handleAITransform(transform.type)}
                        className="flex w-full items-center gap-2 rounded bg-violet-600 px-3 py-2 text-left text-xs text-white hover:bg-violet-700 disabled:opacity-50"
                        disabled={isTyping}
                      >
                        <transform.icon className="h-4 w-4" />
                        {transform.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="chat-input-docked" className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Chat with AI about this {blockType}
                </label>
                <textarea
                  id="chat-input-docked"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask AI to transform, explain, or improve this content..."
                  className="min-h-[100px] w-full rounded border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-600 focus:ring-offset-0"
                />
              </div>

              <button
                type="button"
                onClick={handleSend}
                disabled={!message.trim() || isTyping}
                className="w-full rounded bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {isTyping ? "AI is thinking..." : "Send Message"}
              </button>
            </div>
          </div>
       </div>
     );
   }

   // Modal State (default)
   return (
     <div
       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
       onClick={onClose}
     >
       <div
         className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl p-6 shadow-2xl"
         onClick={(e) => e.stopPropagation()}
       >
         <div className="mb-4 flex items-center justify-between">
           <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
             AI Chat
           </h3>
           <div className="flex items-center gap-1">
             <button
               type="button"
               onClick={() => setIsDocked(true)}
               className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
               title="Dock to right sidebar"
             >
               <PanelRight className="h-4 w-4" />
             </button>
             <button
               type="button"
               onClick={() => setIsMinimized(true)}
               className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
               title="Minimize"
             >
               <Minimize2 className="h-4 w-4" />
             </button>
             <button type="button" onClick={onClose} className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
               <X className="h-5 w-5" />
             </button>
           </div>
         </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Quick AI Transformations
            </label>
            <button
              type="button"
              onClick={() => setShowAITransforms(!showAITransforms)}
              className="flex w-full items-center justify-between rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <span>Transform Content</span>
              {showAITransforms ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {showAITransforms && (
              <div className="mt-2 space-y-1">
                {aiTransformations.map((transform) => (
                  <button
                    key={transform.type}
                    type="button"
                    onClick={() => handleAITransform(transform.type)}
                    className="flex w-full items-center gap-2 rounded bg-violet-600 px-3 py-2 text-left text-xs text-white hover:bg-violet-700 disabled:opacity-50"
                    disabled={isTyping}
                  >
                    <transform.icon className="h-4 w-4" />
                    {transform.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="chat-input" className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Chat with AI about this {blockType}
            </label>
            <textarea
              id="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask AI to transform, explain, or improve this content..."
              className="min-h-[100px] w-full rounded border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-600 focus:ring-offset-0"
            />
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim() || isTyping}
            className="w-full rounded bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {isTyping ? "AI is thinking..." : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
}

export type { BlockChatModalProps };
