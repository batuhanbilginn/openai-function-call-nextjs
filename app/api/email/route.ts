import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY ?? "")
  const body = await request.json()
  const { to, subject, html } = body

  try {
    const data = await resend.emails.send({
      from: "community@email.makr.dev",
      to,
      subject,
      html,
    })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
