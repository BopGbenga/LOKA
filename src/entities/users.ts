import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import bcrypt from "bcryptjs";

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

  @Column({ type: "varchar", length: 255 })
  password!: string; // Store hashed password

  @Column({ type: "boolean", default: false }) // Defaults to false
  isVerified!: boolean;

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

  // Hash password before inserting a new user
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      // Check if password exists
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  // Update `updatedAt` timestamp before updating a user
  @BeforeUpdate()
  async updateTimestamp(): Promise<void> {
    this.updatedAt = new Date();
  }

  // Compare provided password with stored hashed password
  async isMatch(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
