import Link from "next/link";

function parseChannels() {
  const raw = process.env.TELEGRAM_CHANNELS ?? "";
  return raw
    .split(",")
    .map((channel) => channel.trim())
    .filter(Boolean);
}

export default function HomePage() {
  const channels = parseChannels();

  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ marginBottom: "16px" }}>אוסף חדשות מטלגרם</h1>
      <p style={{ marginBottom: "24px", maxWidth: "720px" }}>
        הדף מציג ערוצי טלגרם שהוגדרו במשתנה הסביבה
        <strong> TELEGRAM_CHANNELS</strong>. לכל ערוץ יש עמוד נפרד עם
        ההודעות האחרונות שהבוט קלט.
      </p>
      {channels.length === 0 ? (
        <div style={{ background: "#fff5f5", padding: "16px", borderRadius: "8px" }}>
          <p style={{ margin: 0 }}>
            לא הוגדרו ערוצים. הוסף משתנה סביבה בשם TELEGRAM_CHANNELS עם רשימת
            ערוצים מופרדת בפסיקים (למשל: @channel1,@channel2).
          </p>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "12px" }}>
          {channels.map((channel) => (
            <li key={channel}>
              <Link
                href={`/${channel.replace(/^@/, "")}`}
                style={{
                  display: "block",
                  padding: "16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "#1a202c"
                }}
              >
                {channel}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
