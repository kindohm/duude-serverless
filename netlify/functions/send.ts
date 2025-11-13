import { getDb } from "./db";
export async function handler() {
  const db = getDb();
  const now = new Date().toISOString();
  try {
    await db.collection("notifications").add({ datetime: now });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notification sent", datetime: now }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
}
