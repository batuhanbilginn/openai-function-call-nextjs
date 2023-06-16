export type ChatGPTAgent = "user" | "system" | "assistant"
export interface ChatGPTMessage {
  role: ChatGPTAgent
  content: string
}

export interface ChatGPTFunction {
  name: string
  description: string
  parameters: {
    type: string
    properties: {
      [key: string]: {
        type: string
        description: string
        enum?: string[]
      }
    }
    required: string[]
  }
}

export interface OpenAIStreamPayload {
  model: "gpt-3.5-turbo-0613" | "gpt-4-0613"
  messages: ChatGPTMessage[]
  functions?: ChatGPTFunction[]
  temperature: number
  max_tokens: number
  stream: boolean
  api_key: string
}
