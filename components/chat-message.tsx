import ReactMarkdown from "react-markdown"

import { ChatGPTMessage } from "@/types/openai"

import { Avatar, AvatarFallback } from "./ui/avatar"

const ChatMessage = ({ data }: { data: ChatGPTMessage }) => {
  const isAssistant = data.role === "assistant"
  return (
    <div className="flex items-start gap-4 pl-1">
      {/* Avatar */}
      <Avatar
        className={`border-none text-xs font-bold ring-2 ring-offset-0 ${
          !isAssistant ? "ring-neutral-500" : "ring-emerald-500"
        }`}
      >
        <AvatarFallback
          className={`border-none ${
            !isAssistant
              ? "bg-neutral-100 text-neutral-950"
              : "bg-emerald-100 text-emerald-950"
          }`}
        >
          {isAssistant ? "AI" : "YOU"}
        </AvatarFallback>
      </Avatar>
      {/* Message */}
      <div className="mt-2">
        <ReactMarkdown>{data.content}</ReactMarkdown>
      </div>
    </div>
  )
}

export default ChatMessage
