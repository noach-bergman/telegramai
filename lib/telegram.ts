export type TelegramMessage = {
  id: number;
  date: number;
  text: string | null;
  chatTitle: string;
  chatUsername: string | null;
};

type TelegramUpdateResponse = {
  ok: boolean;
  result: Array<{
    update_id: number;
    channel_post?: {
      message_id: number;
      date: number;
      text?: string;
      caption?: string;
      chat: {
        id: number;
        title: string;
        username?: string;
      };
    };
  }>;
};

const TELEGRAM_API_BASE = "https://api.telegram.org";

export async function fetchChannelMessages(channel: string, token: string) {
  const url = new URL(`${TELEGRAM_API_BASE}/bot${token}/getUpdates`);
  url.searchParams.set("limit", "100");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.status}`);
  }

  const data = (await response.json()) as TelegramUpdateResponse;

  if (!data.ok) {
    throw new Error("Telegram API returned ok=false");
  }

  const normalized = channel.replace(/^@/, "").toLowerCase();

  const messages = data.result
    .map((update) => update.channel_post)
    .filter((post): post is NonNullable<typeof post> => Boolean(post))
    .filter((post) => post.chat.username?.toLowerCase() === normalized)
    .map<TelegramMessage>((post) => ({
      id: post.message_id,
      date: post.date,
      text: post.text ?? post.caption ?? null,
      chatTitle: post.chat.title,
      chatUsername: post.chat.username ?? null
    }))
    .sort((a, b) => b.date - a.date);

  return messages;
}
