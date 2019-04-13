export async function up(knex) {
  await knex.schema.table('journeys', table => {
    table.string('route_id')
      .references('routes.id')
      .onDelete('CASCADE');

    table.dateTime('departure')
      .notNullable()
      .defaultTo(knex.fn.now());

    table.dateTime('arrival')
      .defaultTo(null);
  });
}

export async function down(knex) {
  await knex.schema.table('journeys', table => {
    table.dropColumn('route_id');
    table.dropColumn('departure');
    table.dropColumn('arrival');
  });
}
