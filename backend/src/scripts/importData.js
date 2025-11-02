import { client, rqs } from '../services/recombeeClient.js';
import fs from 'fs';

const users = JSON.parse(fs.readFileSync('./users.json'));
const events = JSON.parse(fs.readFileSync('./events.json'));

async function importData() {
  const userRequests = users.map(user =>
    new rqs.SetUserValues(user._id, {
      wilaya: user.wilaya,
      interests: user.interests.join(', '),
    }, { cascadeCreate: true })
  );

  const eventRequests = events.map(event =>
    new rqs.SetItemValues(event._id, {
      title: event.title,
      category: event.category.join(', '),
      wilaya: event.wilaya,
    }, { cascadeCreate: true })
  );

  await client.send(new rqs.Batch(userRequests));
  await client.send(new rqs.Batch(eventRequests));

  console.log('✅ Users and Events uploaded successfully');
}

importData();
