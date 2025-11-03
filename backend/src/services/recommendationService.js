// src/services/recommendationService.js
import { client } from './recombeeClient.js';
import User from '../models/user.model.js';
import Event from '../models/event.model.js';
import Workshop from '../models/workshop.model.js';

/**
 * Calculate similarity score between user interests and activity tags/categories
 * @param {Array} userInterests - User's selected interests
 * @param {Array} activityTags - Activity tags or categories
 * @returns {Number} - Similarity score (0-1)
 */
const calculateInterestMatch = (userInterests, activityTags) => {
  if (!userInterests || userInterests.length === 0) return 0;
  if (!activityTags || activityTags.length === 0) return 0;

  const matches = userInterests.filter((interest) => activityTags.includes(interest));
  return matches.length / userInterests.length;
};

/**
 * Get personalized recommendations based on user interests
 * @param {String} userId - User ID
 * @param {Number} count - Number of recommendations to return
 * @returns {Array} - Array of recommended activity IDs
 */
export const getRecommendations = async (userId, count = 5) => {
  try {
    // Get user with interests
    const user = await User.findById(userId).select('interests');

    if (!user || !user.interests || user.interests.length === 0) {
      // If user has no interests, fall back to Recombee recommendations
      return await getRecombeeRecommendations(userId, count);
    }

    // Get all events and workshops
    const events = await Event.find({ status: 'open', date: { $gte: new Date() } })
      .select('_id title category')
      .lean();

    const workshops = await Workshop.find({ status: 'open', date: { $gte: new Date() } })
      .select('_id title category')
      .lean();

    // Combine activities and calculate scores
    const allActivities = [
      ...events.map((e) => ({ ...e, type: 'event' })),
      ...workshops.map((w) => ({ ...w, type: 'workshop' })),
    ];

    // Score each activity based on interest match
    const scoredActivities = allActivities.map((activity) => {
      const activityCategories = activity.category ? [activity.category] : [];
      const score = calculateInterestMatch(user.interests, activityCategories);

      return {
        id: activity._id.toString(),
        type: activity.type,
        score,
      };
    });

    // Sort by score (descending) and get top results
    const topRecommendations = scoredActivities
      .filter((a) => a.score > 0) // Only include activities with some interest match
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map((a) => a.id);

    // If we don't have enough interest-based recommendations, supplement with Recombee
    if (topRecommendations.length < count) {
      const recombeeRecs = await getRecombeeRecommendations(
        userId,
        count - topRecommendations.length
      );
      return [
        ...topRecommendations,
        ...recombeeRecs.filter((id) => !topRecommendations.includes(id)),
      ];
    }

    return topRecommendations;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Interest-based recommendation error:', err.message);
    // Fall back to Recombee recommendations
    return await getRecombeeRecommendations(userId, count);
  }
};

/**
 * Get recommendations from Recombee (fallback)
 * @param {String} userId - User ID
 * @param {Number} count - Number of recommendations
 * @returns {Array} - Array of recommended activity IDs
 */
const getRecombeeRecommendations = async (userId, count = 5) => {
  try {
    // Dynamically import requests from recombee-api-client
    const requests = await import('recombee-api-client/lib/requests.cjs'); // ✅ correct path

    const { RecommendItemsToUser } = requests;

    const response = await client.send(new RecommendItemsToUser(userId, count));
    return response.recomms.map((r) => r.id);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Recombee recommendation error:', err.message);
    return [];
  }
};
