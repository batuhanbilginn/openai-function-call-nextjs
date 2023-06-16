"use client"

import { useState } from "react"

import { ChatGPTMessage } from "@/types/openai"
import ChatInput from "@/components/chat-input"
import ChatBox from "@/components/chatbox"

export default function IndexPage() {
  const [messages, setMessages] = useState<ChatGPTMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const sendMessageHandler = async (message: string) => {
    const messagesToSend: ChatGPTMessage[] = [
      ...messages,
      { role: "user", content: message },
    ]
    setMessages(messagesToSend)
    try {
      setIsSending(true)
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: messagesToSend,
        }),
      })
      const data = await response.json()

      // Check if it's a function call
      if (data?.function_call) {
        const functionCall = data.function_call

        // Send email
        try {
          const functionArguments = JSON.parse(functionCall.arguments)
          const emailResponse = await fetch("/api/email", {
            method: "POST",
            body: JSON.stringify({
              to: functionArguments.email,
              subject: functionArguments.subject,
              html: functionArguments.body,
            }),
          })
          const emailData = await emailResponse.json()
          console.log(emailData)
          const functionCallMessage: ChatGPTMessage = {
            role: "assistant",
            content: `Email has been sent to ${functionArguments.email} with subject ${functionArguments.subject}.`,
          }
          setMessages([...messagesToSend, functionCallMessage])
        } catch (error) {
          console.log(error)
          const functionCallMessage: ChatGPTMessage = {
            role: "assistant",
            content: `There is an error. I couldn't send the email. Please try again.`,
          }
          setMessages([...messagesToSend, functionCallMessage])
        } finally {
          return
        }
      }

      setMessages([...messagesToSend, data])
    } catch (error) {
      console.log(error)
    } finally {
      setIsSending(false)
    }
  }
  return (
    <section className="container relative flex flex-col h-full gap-6 py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Send Emails with OpenAI&apos;s Function Calls
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          You can get JSON object with the latest feature of OpenAI called
          Function Calls. You can use this JSON object to send emails to your
          users.
        </p>
      </div>
      {/* Chatbox */}
      <ChatBox messages={messages} isSending={isSending} />
      {/* Input */}
      <ChatInput handler={sendMessageHandler} />
    </section>
  )
}
