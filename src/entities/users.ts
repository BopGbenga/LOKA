// src/entities/User.ts

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  firstname!: string;

  @Column({ type: "varchar", length: 100 })
  lastname!: string;

  @Column({ type: "varchar", length: 100 })
  username!: string;

  @Column({ type: "varchar", length: 100 })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string; // Store hashed password

  @Column({
    type: "enum", // Store as string
    enum: ["artisan", "consumer"],
    default: "consumer",
  })
  role!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date; // Created timestamp

  @Column({ type: "timestamp", nullable: true })
  updatedAt!: Date; // Updated timestamp
}
