import { addColumns, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

import { TableName } from '@/database/schema';

// See "Migrations API" for more details
// https://watermelondb.dev/docs/Advanced/Migrations#migrations-api

/**
 * Migrations for the WatermelonDB schema.
 *
 * toVersion: ⚠️ Set this to a number one larger than the current schema version
 */
export default schemaMigrations({
  migrations: [
    // 重新开始
    // {
    //   toVersion: 5,
    //   steps: [
    //     addColumns({
    //       table: TableName.GROUP_MSGS,
    //       columns: [{ name: 'member_ids', type: 'string', isOptional: true }],
    //     }),
    //   ],
    // },
    // {
    //   toVersion: 4,
    //   steps: [
    //     addColumns({
    //       table: TableName.GROUP_MSGS,
    //       columns: [{ name: 'gender', type: 'string', isOptional: true }],
    //     }),
    //   ],
    // },
    // {
    //   toVersion: 3,
    //   steps: [
    //     addColumns({
    //       table: TableName.GROUP_MSGS,
    //       columns: [{ name: 'forward_info', type: 'string', isOptional: true }],
    //     }),
    //   ],
    // },
    // {
    //   toVersion: 2,
    //   steps: [
    //     addColumns({
    //       table: TableName.GROUP_MSGS,
    //       columns: [{ name: 'is_read', type: 'boolean', isIndexed: true }],
    //     }),
    //   ],
    // },
  ],
});
