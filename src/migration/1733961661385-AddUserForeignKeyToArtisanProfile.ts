// import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

// export class AddUserForeignKeyToArtisanProfile1733958638364
//   implements MigrationInterface
// {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.createForeignKey(
//       "artisan_profile",
//       new TableForeignKey({
//         columnNames: ["userId"],
//         referencedColumnNames: ["id"],
//         referencedTableName: "users",
//         onDelete: "CASCADE",
//       })
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropForeignKey(
//       "artisan_profile",
//       "FK_5b8778554cd73170db5ea04bb2a"
//     );
//   }
// }
