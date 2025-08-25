import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';



export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  officialWebsite: varchar('official_website', { length: 255 }),
  verificationDocumentUrl: varchar('verification_document_url', { length: 512 }),
  acceptTerms: boolean('accept_terms').notNull().default(true),
  signupSource: varchar('signup_source', { length: 100 }),
  apiKey: varchar('api_key', { length: 255 }).notNull().unique(),
  verificationCode: varchar('verification_code', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull(),

});

export const organizationSettings = pgTable('organization_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  key: varchar('key', { length: 100 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const organizationProfiles = pgTable('organization_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull().unique(),
  logoUrl: varchar('logo_url', { length: 512 }),
  coverImageUrl: varchar('cover_image_url', { length: 512 }),
  about: varchar('about', { length: 2000 }),
  mission: varchar('mission', { length: 1000 }),
  vision: varchar('vision', { length: 1000 }),
  website: varchar('website', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  yearFounded: varchar('year_founded', { length: 10 }),
  headquarters: varchar('headquarters', { length: 255 }),
  numberOfEmployees: varchar('number_of_employees', { length: 50 }),
  orgType: varchar('org_type', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});