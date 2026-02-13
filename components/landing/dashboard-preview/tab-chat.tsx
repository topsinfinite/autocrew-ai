import { TabChatVoicePanel } from "./tab-chat-voice-panel";
import { TabChatMessages } from "./tab-chat-messages";

export function TabChat() {
  return (
    <div className="flex-1 flex flex-col sm:flex-row min-h-0 animate-fade-in-up overflow-y-auto sm:overflow-y-hidden">
      {/* Voice Panel */}
      <TabChatVoicePanel />

      {/* Divider */}
      <div className="hidden sm:block w-px bg-white/[0.05]" />
      <div className="sm:hidden h-px bg-white/[0.05] flex-shrink-0" />

      {/* Chat Messages */}
      <TabChatMessages />
    </div>
  );
}
