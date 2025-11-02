// src/services/recombeeSync.js
import { client, AddUser, SetUserValues, AddItem, SetItemValues } from './recombeeClient.js';
import User from '../models/userModel.js';     // adjust to your real user model
import Activity from '../models/activityModel.js'; // or events, etc.

export const syncRecombeeData = async () => {
  try {
    const users = await User.find();
    const items = await Activity.find(); // or whatever you recommend

    // === Sync Users ===
    for (const user of users) {
      await client.send(new AddUser(user._id.toString()));
      await client.send(
        new SetUserValues(user._id.toString(), {
          wilaya: user.wilaya,
          interests: user.interests.join(', '),
        })
      );
    }

    // === Sync Items ===
    for (const item of items) {
      await client.send(new AddItem(item._id.toString()));
      await client.send(
        new SetItemValues(item._id.toString(), {
          title: item.title,
          category: item.category,
        })
      );
    }

    console.log('✅ Recombee sync completed successfully.');
  } catch (err) {
    console.error('❌ Recombee sync failed:', err.message);
  }
};
