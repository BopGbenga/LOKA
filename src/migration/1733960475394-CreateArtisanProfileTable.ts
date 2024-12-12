// import { MigrationInterface, QueryRunner, Table } from "typeorm";

// export class CreateArtisanProfileTable1733958638363
//   implements MigrationInterface
// {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.createTable(
//       new Table({
//         name: "artisan_profile",
//         columns: [
//           {
//             name: "id",
//             type: "int",
//             isPrimary: true,
//             isGenerated: true,
//             generationStrategy: "increment",
//           },
//           {
//             name: "businessName",
//             type: "varchar",
//           },
//           {
//             name: "businessCategory",
//             type: "varchar",
//           },
//           {
//             name: "businessLocation",
//             type: "varchar",
//           },
//           {
//             name: "businessDescription",
//             type: "text",
//             isNullable: true,
//           },
//           {
//             name: "contactInformation",
//             type: "varchar",
//           },
//           {
//             name: "userId",
//             type: "int",
//             isUnique: true,
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
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropTable("artisan_profile");
//   }
// }
