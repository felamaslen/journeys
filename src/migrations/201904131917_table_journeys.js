export async function up(knex) {
  await knex.raw('create extension if not exists "uuid-ossp"');
  await knex.schema.createTable('journeys', table => {
    table.string('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
  });
}

export async function down(knex) {
  await knex.raw('drop extension if exists "uuid-ossp"');
  await knex.schema.dropTableIfExists('journeys');
}
