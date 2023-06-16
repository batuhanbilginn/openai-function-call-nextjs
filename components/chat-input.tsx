import { useState } from "react"

import { Input } from "./ui/input"

const ChatInput = ({
  handler,
}: {
  handler: (message: string) => Promise<void>
}) => {
  const [inputValue, setInputValue] = useState("")
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const message = inputValue.trim()
        if (message) {
          setInputValue("")
          await handler(message)
        }
      }}
      className="sticky flex items-end bottom-4"
    >
      <Input
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value)
        }}
        name="message"
        className="placeholder:text-sm bg-background"
        placeholder="Type your message here."
      />
    </form>
  )
}

export default ChatInput
