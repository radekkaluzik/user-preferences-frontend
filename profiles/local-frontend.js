/*global module*/

const APP_ID = 'user-preferences';
const FRONTEND_PORT = 8002;
const routes = {};

routes[`/beta/${APP_ID}`] = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/${APP_ID}`]      = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/beta/apps/${APP_ID}`]       = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`]            = { host: `https://localhost:${FRONTEND_PORT}` };

module.exports = { routes };
