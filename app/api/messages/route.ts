import { fetchChannelMessages } from "@/lib/telegram";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get("channel");
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!channel) {
    return Response.json({ error: "Missing channel parameter" }, { status: 400 });
  }

  if (!token) {
    return Response.json({ error: "Missing TELEGRAM_BOT_TOKEN" }, { status: 500 });
  }

  try {
    const messages = await fetchChannelMessages(channel, token);
    return Response.json({ channel, messages });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
