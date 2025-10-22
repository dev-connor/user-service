-- v001__init_schema.sql
-- 사용할 데이터베이스 선택
\connect app_db;

-- 스키마 생성
CREATE SCHEMA IF NOT EXISTS app;
SET search_path TO app;

CREATE TABLE "user" (
  "id" uuid PRIMARY KEY,
  "password_hash" varchar,
  "name" varchar,
  "email" varchar,
  "token_id" uuid,
  "created_at" timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "refresh_token" (
  "id" uuid PRIMARY KEY,
  "token_hash" varchar,
  "issued_at" timestamp,
  "expire_at" timestamp
);

