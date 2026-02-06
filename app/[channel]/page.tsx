import Link from "next/link";
import { headers } from "next/headers";

type Message = {
  id: number;
  date: number;
  text: string | null;
  chatTitle: string;
  chatUsername: string | null;
};

function getBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_BASE_URL;
  if (explicit) {
    return explicit;
  }

  const headerList = headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";

  return host ? `${protocol}://${host}` : "http://localhost:3000";
}

async function getMessages(channel: string) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/messages?channel=${channel}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    return { error: true, messages: [] as Message[] };
  }

  const data = (await response.json()) as { messages: Message[] };
  return { error: false, messages: data.messages };
}

export default async function ChannelPage({
  params
}: {
  params: { channel: string };
}) {
  const { error, messages } = await getMessages(params.channel);

  return (
    <main style={{ padding: "32px" }}>
      <Link href="/" style={{ display: "inline-block", marginBottom: "16px" }}>
        ← חזרה לעמוד הראשי
      </Link>
      <h1 style={{ marginBottom: "12px" }}>@{params.channel}</h1>
      {error ? (
        <p style={{ color: "#c53030" }}>
          לא הצלחנו לטעון הודעות. בדוק שהבוט מחובר לערוץ ושמשתנה הסביבה
          TELEGRAM_BOT_TOKEN מוגדר.
        </p>
      ) : messages.length === 0 ? (
        <p>אין הודעות זמינות עדיין עבור הערוץ הזה.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "16px" }}>
          {messages.map((message) => (
            <li
              key={message.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "16px"
              }}
            >
              <div style={{ fontSize: "12px", color: "#718096", marginBottom: "8px" }}>
                {new Date(message.date * 1000).toLocaleString("he-IL")}
              </div>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                {message.chatTitle}
              </div>
              <p style={{ margin: 0 }}>{message.text ?? "(ללא טקסט)"}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
