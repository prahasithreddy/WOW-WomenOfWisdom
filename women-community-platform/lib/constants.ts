// ─── Role & Status Constants ──────────────────────────────────────────────────

export const UserRole = {
  VISITOR: "VISITOR",
  PENDING: "PENDING",
  MEMBER: "MEMBER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const ContentStatus = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  IN_REVIEW: "IN_REVIEW",
  APPROVED: "APPROVED",
  PUBLISHED: "PUBLISHED",
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
  REJECTED: "REJECTED",
  ARCHIVED: "ARCHIVED",
  EXPIRED: "EXPIRED",
} as const;

export type ContentStatus = (typeof ContentStatus)[keyof typeof ContentStatus];

export const EventType = {
  CULTURAL: "CULTURAL",
  CORPORATE: "CORPORATE",
  PROPERTY: "PROPERTY",
  WEBINAR: "WEBINAR",
  OTHER: "OTHER",
} as const;

export type EventType = (typeof EventType)[keyof typeof EventType];

export const OfferingType = {
  PRODUCT: "PRODUCT",
  SERVICE: "SERVICE",
} as const;

export type OfferingType = (typeof OfferingType)[keyof typeof OfferingType];

export const MarketCategory = {
  USED_ITEMS: "USED_ITEMS",
  MOVING_OUT: "MOVING_OUT",
  OTHER: "OTHER",
} as const;

export type MarketCategory = (typeof MarketCategory)[keyof typeof MarketCategory];

export const MarketCondition = {
  NEW: "NEW",
  LIKE_NEW: "LIKE_NEW",
  GOOD: "GOOD",
  FAIR: "FAIR",
} as const;

export type MarketCondition = (typeof MarketCondition)[keyof typeof MarketCondition];

export const SaleStatus = {
  AVAILABLE: "AVAILABLE",
  RESERVED: "RESERVED",
  SOLD: "SOLD",
} as const;

export type SaleStatus = (typeof SaleStatus)[keyof typeof SaleStatus];

export const RegistrationStatus = {
  CONFIRMED: "CONFIRMED",
  WAITLIST: "WAITLIST",
  CANCELLED: "CANCELLED",
} as const;

export type RegistrationStatus = (typeof RegistrationStatus)[keyof typeof RegistrationStatus];

export const NotificationType = {
  MEMBER_APPROVED: "MEMBER_APPROVED",
  MEMBER_REJECTED: "MEMBER_REJECTED",
  CONTENT_APPROVED: "CONTENT_APPROVED",
  CONTENT_REJECTED: "CONTENT_REJECTED",
  CONTENT_CHANGES_REQUESTED: "CONTENT_CHANGES_REQUESTED",
  ENQUIRY_RECEIVED: "ENQUIRY_RECEIVED",
  EVENT_REGISTRATION: "EVENT_REGISTRATION",
  INVITATION_SENT: "INVITATION_SENT",
  SYSTEM: "SYSTEM",
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

// ─── Display Labels ───────────────────────────────────────────────────────────

export const EVENT_TYPE_LABELS: Record<string, string> = {
  CULTURAL: "Cultural",
  CORPORATE: "Corporate",
  PROPERTY: "Property",
  WEBINAR: "Webinar",
  OTHER: "Other",
};

export const MARKET_CATEGORY_LABELS: Record<string, string> = {
  USED_ITEMS: "Used Items",
  MOVING_OUT: "Moving Out Sale",
  OTHER: "Other",
};

export const MARKET_CONDITION_LABELS: Record<string, string> = {
  NEW: "New",
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
};

export const CONTENT_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  IN_REVIEW: "In Review",
  APPROVED: "Approved",
  PUBLISHED: "Published",
  CHANGES_REQUESTED: "Changes Needed",
  REJECTED: "Rejected",
  ARCHIVED: "Archived",
  EXPIRED: "Expired",
};

// ─── Design Tokens ───────────────────────────────────────────────────────────

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-lavender-100 text-purple-700",
  SUBMITTED: "bg-blue-50 text-blue-700",
  IN_REVIEW: "bg-amber-50 text-amber-700",
  APPROVED: "bg-teal-50 text-teal-700",
  PUBLISHED: "bg-teal-100 text-teal-800",
  CHANGES_REQUESTED: "bg-blush-100 text-rose-700",
  REJECTED: "bg-red-50 text-red-700",
  ARCHIVED: "bg-gray-100 text-gray-600",
  EXPIRED: "bg-gray-100 text-gray-500",
  PENDING: "bg-amber-50 text-amber-700",
  SUSPENDED: "bg-red-50 text-red-700",
};
