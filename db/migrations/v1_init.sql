\connect app_db;

CREATE SCHEMA IF NOT EXISTS app;
SET search_path TO app;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "user" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "password_hash" varchar,
  "name" varchar,
  "email" varchar,
  "refresh_token_id" uuid,
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now(),
  "deleted_at" timestamptz
);

CREATE TABLE "refresh_token" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "token_hash" varchar,
  "issued_at" timestamptz not null default now(),
  "expire_at" timestamptz
);

