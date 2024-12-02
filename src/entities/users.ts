import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import bcrypt from "bcrypt";

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

  @Column({ type: "varchar", length: 100, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, nullable: true }) // Nullable for Google users
  password!: string | null;

  @Column({ type: "boolean", default: false })
  isVerified!: boolean;

  @Column({ type: "varchar", nullable: true })
  resetToken!: string | null;

  @Column({ type: "timestamp", nullable: true })
  tokenExpiry!: Date | null;

  @Column({
    type: "enum",
    enum: ["artisan", "consumer"],
    default: "consumer",
  })
  role!: string;

  @Column({ type: "varchar", nullable: true, unique: true }) // Store Google ID
  googleId!: string | null;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", nullable: true })
  updatedAt!: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      // Skip hashing for Google users
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeUpdate()
  async updateTimestamp(): Promise<void> {
    this.updatedAt = new Date();
  }

  async isMatch(password: string): Promise<boolean> {
    if (!this.password) return false; // No password for Google users
    return await bcrypt.compare(password, this.password);
  }
}
