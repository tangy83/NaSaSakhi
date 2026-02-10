// Shared enums

export enum UserRole {
  USER = 'user',
  REVIEWER = 'reviewer',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum OrganizationStatus {
  PENDING = 'pending',
  PENDING_REVERIFICATION = 'pending_reverification',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVISION_REQUESTED = 'revision_requested',
}
