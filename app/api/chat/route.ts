import { NextResponse } from "next/server"
import { Configuration, OpenAIApi } from "openai"

import { ChatGPTFunction } from "@/types/openai"

const functions: ChatGPTFunction[] = [
  {
    name: "send_email",
    description: "Send an email to a user",
    parameters: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description:
            "The email address of the recipient. You should always ask the user if you don't know the email address.",
        },
        subject: {
          type: "string",
          description: "The subject of the email",
        },
        body: {
          type: "string",
          description: "The body of the email. Must be written in HTML.",
        },
      },
      required: ["email", "subject", "body"],
    },
  },
]

export async function POST(request: Request) {
  // Get formData from request
  const body = await request.json()
  const { messages, api_key } = body

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY ?? api_key,
  })

  if (configuration.apiKey === undefined) {
    console.log("No API key provided.")
    return NextResponse.json(
      {
        message: "No API key provided.",
      },
      {
        status: 401,
      }
    )
  }

  const openai = new OpenAIApi(configuration)

  try {
    console.log("Creating chat completion...")
    const completion = await openai.createChatCompletion({
      model: "gpt-4-0613",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant. You may need to call functions to complete your tasks. You can only call functions if user has given you permission to do so. If you don't know the arguments to pass into function you MUST ASK TO THE USER. If you want to call 'send_email' function you HAVE TO ASK FOR RECIPIENT EMAIL first and then you can call the function. Always answer in markdown. Current date:" +
            new Date().toLocaleDateString("en-US"),
        },
        ...messages,
      ],
      functions,
      temperature: 0.6,
      max_tokens: 1000,
      /* function_call: "auto" */
    })
    return NextResponse.json(completion.data.choices[0].message)
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
      return NextResponse.json({
        message: error.response.data?.error?.message ?? "Unknown error",
      })
    } else {
      console.log(error)
      return NextResponse.json({
        message: error.error?.message ?? "Unknown error",
      })
    }
  }
}
