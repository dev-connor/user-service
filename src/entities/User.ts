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
import { RefreshToken } from "./RefreshToken"

@Index("user_pkey", ["id"], { unique: true })
@Entity("user", { schema: "app" })
export class User {
  // constructor(partial?: Partial<User>) {
  //   if (partial) {
  //     Object.entries(partial).forEach(([key, value]) => {
  //       if (value !== null) this[key] = value
  //     })
  //   }
  // }

  // @Column("character varying", { primary: true, name: "id" })
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("character varying", { name: "email" })
  email: string 

  @Column("character varying", { name: "password_hash" })
  passwordHash: string 

  @Column("character varying", { name: "name" })
  name: string 

  @OneToOne(() => RefreshToken)
  @JoinColumn({ name: "token_id" })
  refreshToken: RefreshToken

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date

  @Column("timestamp with time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null
}
