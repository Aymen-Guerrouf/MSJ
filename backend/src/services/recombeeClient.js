// src/services/recombeeClient.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// ✅ Import the entire module as default
const recombee = require('recombee-api-client');

// ✅ Create the client - RecombeeClient might be on the default export
export const client = new recombee.ApiClient(
  'mj-recommender-minitere-recommender',
  'dh4gszjnkQPEd2Ax0rd91U6e7gitT5B19UwHOVFqmYGACIjYPXKwtwl2pKD7vNJg',
  { region: 'eu-west' }
);

// ✅ Export request classes
export const requests = recombee.requests;
export const { AddUser, SetUserValues, AddItem, SetItemValues, AddRating } = recombee.requests;
export const rqs = await import('recombee-api-client/lib/requests/index.js')
  .catch(async () => await import('recombee-api-client/lib/requests.js'));