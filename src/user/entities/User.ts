import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { RefreshToken } from "../../auth/entities/RefreshToken"

@Index("user_pkey", ["id"], { unique: true })
@Entity("user", { schema: "app" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("character varying", { name: "email" })
  email: string 

  @Column("character varying", { name: "password_hash" })
  passwordHash: string 

  @Column("character varying", { name: "name" })
  name: string 
  
  @Column("character varying", { name: "refresh_token_id", nullable: true })
  refreshTokenId: string | null 

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date

  @Column("timestamp with time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null
}
