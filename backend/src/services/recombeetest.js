// src/services/testRecombee.js
import { client, AddUser } from './recombeeClient.js';

(async () => {
  try {
    const result = await client.send(new AddUser('user-123'));
    console.log('✅ Successfully added user to Recombee:', result);
  } catch (error) {
    console.error('❌ Recombee error:', error);
  }
})();
