import * as admin from "firebase-admin";

// Read service account JSON from environment variable
const serviceAccountJson = process.env.SERVICE_ACCOUNT_JSON;
let serviceAccount: admin.ServiceAccount | undefined = undefined;
if (serviceAccountJson) {
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (e) {
    throw new Error(
      "Invalid SERVICE_ACCOUNT_JSON environment variable: " +
        (e as Error).message
    );
  }
}

// Initialize Firestore only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: serviceAccount
      ? admin.credential.cert(serviceAccount)
      : admin.credential.applicationDefault(),
  });
}

export function getDb() {
  return admin.firestore();
}
