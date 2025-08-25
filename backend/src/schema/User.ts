import { pgTable, uuid, varchar, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { organizations } from './Account';

export const userRoles = pgTable('user_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(), // e.g., 'orgAdmin', 'recruiter', 'superAdmin'
  label: varchar('label', { length: 100 }),
  description: varchar('description', { length: 255 }),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'set null' }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// organizations table must be defined elsewhere and imported if needed for type safety
export const orgTeams = pgTable('org_teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamName: varchar('team_name', { length: 100 }).notNull(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'set null' }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }).notNull().unique(), // Work email
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'set null' }), // Nullable
  teamId: uuid('team_id').references(() => orgTeams.id, { onDelete: 'set null' }),
  roleId: uuid('role_id').notNull().references(() => userRoles.id),
  isEmailVerified: boolean('is_email_verified').default(false),
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  signupSource: varchar('signup_source', { length: 100 }),
});