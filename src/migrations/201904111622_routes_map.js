export async function up(knex) {
  await knex.schema.table('routes', (table) => {
    table.text('points')
      .notNullable();

    table.double('mid_lon').notNullable();
    table.double('mid_lat').notNullable();

    table.integer('length').notNullable();

    table.double('bearing').notNullable();
  });
}

export async function down(knex) {
  await knex.schema.table('routes', (table) => {
    table.dropColumn('points');
    table.dropColumn('mid_lon');
    table.dropColumn('mid_lat');
    table.dropColumn('length');
    table.dropColumn('bearing');
  });
}
