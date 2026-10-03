"use server";

import { db } from "@/lib/db";

interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  message: string;
  payload?: Record<string, unknown>;
}

export async function createNotification(input: CreateNotificationInput) {
  return db.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      payloadJson: JSON.stringify(input.payload ?? {}),
    },
  });
}
