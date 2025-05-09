import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  OneToMany,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from "typeorm";
import bcrypt from "bcrypt";
import { ArtisanProfile } from "./artisans";
import { Category } from "./category";
import { products } from "./products";
import { Order } from "./order";
import { Notification } from "./notifications";
import { review } from "./review";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  firstname!: string;

  @Column({ type: "varchar", length: 100 })
  lastname!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  username!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email!: string;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @Column({ type: "varchar", length: 255, nullable: true })
  password!: string | null;

  @Column({ type: "boolean", default: false })
  isVerified!: boolean;

  @Column({ type: "enum", enum: ["buyer", "artisan"], nullable: true })
  role!: "buyer" | "artisan" | null;

  @Column({ type: "varchar", nullable: true })
  resetToken!: string | null;

  @Column({ type: "timestamp", nullable: true })
  tokenExpiry!: Date | null;

  @OneToMany(() => review, (review) => review.user)
  reviews!: review[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
  })
  notifications!: Notification[];

  @OneToOne(() => ArtisanProfile, (artisanProfile) => artisanProfile.user, {
    nullable: true,
  })
  @JoinColumn()
  artisanProfile!: ArtisanProfile | null;

  @ManyToMany(() => Category)
  @JoinTable()
  interests!: Category[];

  @OneToMany(() => products, (products) => products.user)
  products!: products[];
  @Column({ type: "varchar", nullable: true, unique: true })
  googleId!: string | null;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", nullable: true, onUpdate: "CURRENT_TIMESTAMP" })
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
