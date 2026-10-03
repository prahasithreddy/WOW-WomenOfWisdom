"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/actions/notifications";

type EntityType = "member_profile" | "business" | "market_item" | "event";
type Decision = "approve" | "changes" | "reject";

async function getEntityAndOwnerId(entityType: EntityType, entityId: string) {
  switch (entityType) {
    case "member_profile": {
      const p = await db.memberProfile.findUnique({ where: { id: entityId } });
      return { entity: p, ownerId: p?.userId };
    }
    case "business": {
      const b = await db.business.findUnique({ where: { id: entityId } });
      return { entity: b, ownerId: b?.ownerId };
    }
    case "market_item": {
      const m = await db.marketItem.findUnique({ where: { id: entityId } });
      return { entity: m, ownerId: m?.sellerId };
    }
    case "event": {
      const e = await db.event.findUnique({ where: { id: entityId } });
      return { entity: e, ownerId: e?.organiserId };
    }
  }
}

async function updateEntityStatus(entityType: EntityType, entityId: string, status: string) {
  switch (entityType) {
    case "member_profile":
      return db.memberProfile.update({ where: { id: entityId }, data: { status } });
    case "business":
      return db.business.update({ where: { id: entityId }, data: { status } });
    case "market_item":
      return db.marketItem.update({ where: { id: entityId }, data: { status } });
    case "event":
      return db.event.update({ where: { id: entityId }, data: { status } });
  }
}

export async function submitForReview(entityType: EntityType, entityId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await updateEntityStatus(entityType, entityId, "SUBMITTED");
  await db.reviewLog.create({
    data: {
      entityType,
      entityId,
      state: "SUBMITTED",
      reviewerId: null,
      comment: "Submitted for review",
    },
  });

  // Notify admins
  const admins = await db.user.findMany({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    select: { id: true },
  });
  for (const admin of admins) {
    await createNotification({
      userId: admin.id,
      type: "SYSTEM",
      title: `New ${entityType.replace("_", " ")} submitted`,
      message: `A ${entityType.replace("_", " ")} is waiting for review.`,
      payload: { entityType, entityId },
    });
  }

  return { success: true };
}

export async function adminReview(
  entityType: EntityType,
  entityId: string,
  decision: Decision,
  comment?: string
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) return { error: "Forbidden" };

  const newStatus =
    decision === "approve" ? "PUBLISHED" :
    decision === "changes" ? "CHANGES_REQUESTED" :
    "REJECTED";

  await updateEntityStatus(entityType, entityId, newStatus);
  await db.reviewLog.create({
    data: {
      entityType,
      entityId,
      state: newStatus,
      reviewerId: session.user.id,
      comment: comment ?? null,
    },
  });

  // Notify owner
  const { ownerId } = await getEntityAndOwnerId(entityType, entityId) ?? {};
  if (ownerId) {
    const notifType =
      decision === "approve" ? "CONTENT_APPROVED" :
      decision === "changes" ? "CONTENT_CHANGES_REQUESTED" :
      "CONTENT_REJECTED";

    const notifTitle =
      decision === "approve" ? "Your content is now live!" :
      decision === "changes" ? "Changes requested on your submission" :
      "Your submission was rejected";

    const notifMessage = comment
      ? `Admin note: ${comment}`
      : decision === "approve"
      ? "Your content has been approved and published."
      : "Please review the feedback and resubmit.";

    await createNotification({
      userId: ownerId,
      type: notifType,
      title: notifTitle,
      message: notifMessage,
      payload: { entityType, entityId, decision },
    });
  }

  // Audit log
  await db.auditLog.create({
    data: {
      actorId: session.user.id,
      action: `REVIEW_${decision.toUpperCase()}`,
      entity: entityType,
      entityId,
      after: JSON.stringify({ status: newStatus, comment }),
    },
  });

  return { success: true };
}

export async function approveMember(userId: string, comment?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) return { error: "Forbidden" };

  await db.user.update({
    where: { id: userId },
    data: { role: "MEMBER", status: "APPROVED" },
  });

  // Also publish their profile if submitted
  await db.memberProfile.updateMany({
    where: { userId, status: { in: ["SUBMITTED", "IN_REVIEW", "APPROVED"] } },
    data: { status: "PUBLISHED" },
  });

  await createNotification({
    userId,
    type: "MEMBER_APPROVED",
    title: "Welcome to Women's Circle!",
    message: "Your membership has been approved. Explore your dashboard to get started.",
  });

  await db.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "APPROVE_MEMBER",
      entity: "user",
      entityId: userId,
      after: JSON.stringify({ status: "APPROVED", comment }),
    },
  });

  return { success: true };
}

export async function rejectMember(userId: string, comment: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) return { error: "Forbidden" };

  await db.user.update({
    where: { id: userId },
    data: { status: "REJECTED" },
  });

  await createNotification({
    userId,
    type: "MEMBER_REJECTED",
    title: "Membership Application Update",
    message: comment,
  });

  return { success: true };
}
