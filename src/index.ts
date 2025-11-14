import express from "express";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // If GOOGLE_APPLICATION_CREDENTIALS is set, admin SDK will auto-load it
    admin.initializeApp();
  } else {
    // Otherwise, use SERVICE_ACCOUNT_JSON
    const serviceAccountJson = process.env.SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
      throw new Error("SERVICE_ACCOUNT_JSON environment variable is not set");
    }
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}
const db = admin.firestore();

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from public/
app.use(express.static("public"));

app.use(express.json());

app.post("/send", async (req, res) => {
  try {
    const datetime = new Date();
    const docRef = await db.collection("notifications").add({ datetime });
    res.json({
      message: "Notification added",
      id: docRef.id,
      datetime,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add notification" });
  }
});

app.get("/read", async (req, res) => {
  try {
    const snapshot = await db
      .collection("notifications")
      .orderBy("datetime", "desc")
      .limit(1)
      .get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "No notifications found" });
    }
    const doc = snapshot.docs[0];
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: "Failed to read notification" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
