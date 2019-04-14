# Journeys

Records cycle journey data.

URLS:
- Staging: TBC
- Production: TBC

## Architecture

This is an Express app, serving the API which is used by the Feast It frontend.

## Libraries used

- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Ava](https://github.com/avajs/ava)
- [React](https://reactjs.org/)
- [OpenLayers](https://openlayers.org/)

## Development

To run a development server, run:

- `npm run dev`

If you don't feel like provisioning development databases, you can run:

- `npm run dev:docker`

This will provision testing databases for you using `docker-compose`.

## Configuration

Configuration is achieved through environment variables. Here is a list of relevant ones:

- [*optional*] `PORT`: the port to listen on
- [*required*] `DATABASE_URL`: the URL to connect to PostgreSQL (**default**: `postgres://root:password@localhost:5432/journeys`)

