// import {
//   MigrationInterface,
//   QueryRunner,
//   Table,
//   TableForeignKey,
// } from "typeorm";

// export class CreateUserTable1733958638362 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // Create the users table
//     await queryRunner.createTable(
//       new Table({
//         name: "users",
//         columns: [
//           {
//             name: "id",
//             type: "int",
//             isPrimary: true,
//             isGenerated: true,
//             generationStrategy: "increment",
//           },
//           {
//             name: "firstname",
//             type: "varchar",
//             length: "100",
//           },
//           {
//             name: "lastname",
//             type: "varchar",
//             length: "100",
//           },
//           {
//             name: "username",
//             type: "varchar",
//             length: "100",
//             isUnique: true,
//           },
//           {
//             name: "email",
//             type: "varchar",
//             length: "100",
//             isUnique: true,
//           },
//           {
//             name: "password",
//             type: "varchar",
//             length: "255",
//             isNullable: true,
//           },
//           {
//             name: "isVerified",
//             type: "boolean",
//             default: false,
//           },
//           {
//             name: "role",
//             type: "enum",
//             enum: ["buyer", "artisan"],
//             isNullable: true,
//           },
//           {
//             name: "resetToken",
//             type: "varchar",
//             isNullable: true,
//           },
//           {
//             name: "tokenExpiry",
//             type: "timestamp",
//             isNullable: true,
//           },
//           {
//             name: "googleId",
//             type: "varchar",
//             isNullable: true,
//             isUnique: true,
//           },
//           {
//             name: "artisanProfileId",
//             type: "int",
//             isNullable: true,
//           },
//           {
//             name: "createdAt",
//             type: "timestamp",
//             default: "CURRENT_TIMESTAMP",
//           },
//           {
//             name: "updatedAt",
//             type: "timestamp",
//             isNullable: true,
//             onUpdate: "CURRENT_TIMESTAMP",
//           },
//         ],
//       }),
//       true
//     );

//     // Create foreign key for artisanProfile
//     await queryRunner.createForeignKey(
//       "users",
//       new TableForeignKey({
//         columnNames: ["artisanProfileId"],
//         referencedColumnNames: ["id"],
//         referencedTableName: "artisan_profile", // Ensure this matches the ArtisanProfile table name
//         onDelete: "CASCADE",
//       })
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropTable("users");
//   }
// }
