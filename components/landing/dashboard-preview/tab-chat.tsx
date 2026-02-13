import { TabChatVoicePanel } from "./tab-chat-voice-panel";
import { TabChatMessages } from "./tab-chat-messages";

export function TabChat() {
  return (
    <div className="flex-1 flex flex-col sm:flex-row animate-fade-in-up">
      {/* Voice Panel */}
      <TabChatVoicePanel />

      {/* Divider */}
      <div className="hidden sm:block w-px bg-white/[0.05]" />
      <div className="sm:hidden h-px bg-white/[0.05]" />

      {/* Chat Messages */}
      <TabChatMessages />
    </div>
  );
}
