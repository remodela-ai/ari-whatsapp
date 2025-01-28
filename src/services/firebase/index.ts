import type { DocumentData } from "firebase-admin/firestore";
import { firebaseServer } from "./firebase";

export * from "./firebase";

export const findUserByPhone = async (phone: string): Promise<DocumentData | null> => {
  const userFirebaseDocument = await firebaseServer.firestore.collection("users").doc(phone).get();
  if (userFirebaseDocument.exists) {
    return userFirebaseDocument.data();
  }
  return null;
};

export const addUserAsync = async (phone: string, user: DocumentData) => {
  await firebaseServer.firestore.collection("users").doc(phone).set(user);
};

export const addRowRemodelaAsync = async (from: string, row: DocumentData) => {
  await firebaseServer.firestore.collection("remodela").doc(from).set(row);
};
