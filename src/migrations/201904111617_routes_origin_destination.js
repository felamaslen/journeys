export async function up(knex) {
  await knex.schema.table('routes', (table) => {
    table.string('origin')
      .index()
      .notNullable();

    table.string('destination')
      .index()
      .notNullable();

    table.unique(['origin', 'destination']);
  });
}

export async function down(knex) {
  await knex.schema.table('routes', (table) => {
    table.dropColumn('origin');
    table.dropColumn('destination');
  });
}
