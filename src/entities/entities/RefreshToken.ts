import { Column, Entity, Index } from "typeorm";

@Index("refresh_token_pkey", ["id"], { unique: true })
@Entity("refresh_token", { schema: "app" })
export class RefreshToken {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("character varying", { name: "token_hash", nullable: true })
  tokenHash: string | null;

  @Column("timestamp without time zone", { name: "issued_at", nullable: true })
  issuedAt: Date | null;

  @Column("timestamp without time zone", { name: "expire_at", nullable: true })
  expireAt: Date | null;
}
