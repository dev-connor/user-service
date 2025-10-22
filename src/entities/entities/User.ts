import { Column, Entity, Index } from "typeorm";

@Index("user_pkey", ["id"], { unique: true })
@Entity("user", { schema: "app" })
export class User {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("character varying", { name: "password_hash", nullable: true })
  passwordHash: string | null;

  @Column("character varying", { name: "name", nullable: true })
  name: string | null;

  @Column("character varying", { name: "email", nullable: true })
  email: string | null;

  @Column("uuid", { name: "token_id", nullable: true })
  tokenId: string | null;

  @Column("timestamp without time zone", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;
}
