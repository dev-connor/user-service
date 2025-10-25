import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("refresh_token_pkey", ["id"], { unique: true })
@Entity("refresh_token", { schema: "app" })
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("character varying", { name: "token_hash" })
  tokenHash: string 

  @Column("timestamp with time zone", { name: "issued_at" })
  issuedAt: Date 

  @Column("timestamp with time zone", { name: "expire_at" })
  expireAt: Date 

}
