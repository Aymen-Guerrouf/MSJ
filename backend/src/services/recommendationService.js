// src/services/recommendationService.js
import { client } from './recombeeClient.js';

export const getRecommendations = async (userId, count = 5) => {
  try {
    // Dynamically import requests from recombee-api-client
    const recombee = await import('recombee-api-client');
    const requests = await import('recombee-api-client/lib/requests.cjs'); // ✅ correct path

    const { RecommendItemsToUser } = requests;

    const response = await client.send(new RecommendItemsToUser(userId, count));
    return response.recomms.map(r => r.id);
  } catch (err) {
    console.error('❌ Recommendation error:', err.message);
    return [];
  }
};
