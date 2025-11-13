import { getDb } from "./db";
export async function handler() {
  const db = getDb();

  try {
    const snapshot = await db
      .collection("notifications")
      .orderBy("datetime", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return {
        statusCode: 200,
        body: JSON.stringify({ id: -1, datetime: new Date(2000, 1, 1) }),
      };
    }

    const doc = snapshot.docs[0];
    return {
      statusCode: 200,
      body: JSON.stringify({ id: doc.id, ...doc.data() }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
}
