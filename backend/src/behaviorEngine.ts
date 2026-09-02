import { EventItem } from './db';

export interface UserInteractionRecord {
  id?: number;
  user_id: number;
  event_id: number;
  action: 'VIEW' | 'CLICK' | 'LIKE' | 'SAVE' | 'REGISTER' | 'DISMISS';
  timestamp?: string;
}

export const ACTION_WEIGHTS: Record<string, number> = {
  VIEW: 1,
  CLICK: 2,
  LIKE: 3,
  SAVE: 4,
  REGISTER: 5,
  DISMISS: -3,
};

export interface BehavioralProfile {
  tagScores: Record<string, number>;
  totalInteractions: number;
}

/**
  * Builds a user's behavioral preference profile from their interaction history.
  */
export function buildBehavioralProfile(
  interactions: UserInteractionRecord[],
  allEvents: EventItem[]
): BehavioralProfile {
  const tagScores: Record<string, number> = {};
  const eventsMap = new Map<number, EventItem>();
  allEvents.forEach(e => eventsMap.set(e.id, e));

  const now = Date.now();

  interactions.forEach(item => {
    const weight = ACTION_WEIGHTS[item.action] || 0;
    const evt = eventsMap.get(item.event_id);
    if (!evt) return;

    // Apply simple time-decay (recent behavior has higher impact)
    let decay = 1.0;
    if (item.timestamp) {
      const itemTime = new Date(item.timestamp).getTime();
      const daysOld = Math.max(0, (now - itemTime) / (1000 * 60 * 60 * 24));
      decay = Math.max(0.4, 1.0 - daysOld * 0.02);
    }

    const effectiveWeight = weight * decay;

    // Collect characteristics / tags
    const tags: string[] = [
      evt.category,
      evt.event_type,
      ...(evt.required_skills || []),
      ...(evt.career_relevance || [])
    ].filter(Boolean).map(t => t.trim().toLowerCase());

    tags.forEach(tag => {
      tagScores[tag] = (tagScores[tag] || 0) + effectiveWeight;
    });
  });

  return {
    tagScores,
    totalInteractions: interactions.length
  };
}

/**
  * Calculates behavioral match score (0-100) for a candidate event.
  */
export function calculateBehaviorScore(
  eventItem: EventItem,
  profile: BehavioralProfile
): { score: number; topMatchTag?: string; topAction?: string } {
  if (profile.totalInteractions === 0) {
    return { score: 50 };
  }

  const tags: string[] = [
    eventItem.category,
    eventItem.event_type,
    ...(eventItem.required_skills || []),
    ...(eventItem.career_relevance || [])
  ].filter(Boolean).map(t => t.trim().toLowerCase());

  let totalTagScore = 0;
  let highestTag = '';
  let highestScore = -Infinity;

  tags.forEach(tag => {
    const score = profile.tagScores[tag] || 0;
    totalTagScore += score;
    if (score > highestScore && score > 0) {
      highestScore = score;
      highestTag = tag;
    }
  });

  // Normalize raw total score to 0 - 100 range
  // Average tag score scaled
  const avgScore = tags.length > 0 ? totalTagScore / tags.length : 0;
  const rawNormalized = 50 + avgScore * 8;
  const score = Math.max(0, Math.min(100, Math.round(rawNormalized)));

  return {
    score,
    topMatchTag: highestTag ? highestTag.toUpperCase() : undefined
  };
}

/**
  * Calculates cold start dynamic behavioral weight.
  * 0 interactions = 0.0 behavior weight (100% profile score)
  * 1-3 interactions = 0.10 behavior weight (90% profile / 10% behavior)
  * 4-7 interactions = 0.20 behavior weight (80% profile / 20% behavior)
  * 8+ interactions = 0.30 behavior weight (70% profile / 30% behavior max)
  */
export function getBehavioralWeight(interactionCount: number): number {
  if (interactionCount === 0) return 0.0;
  if (interactionCount < 4) return 0.10;
  if (interactionCount < 8) return 0.20;
  return 0.30;
}

/**
  * Combines existing profile score and behavioral score into hybrid score.
  */
export function combineHybridScore(
  existingScore: number,
  behaviorScore: number,
  interactionCount: number
): { finalScore: number; behaviorWeightUsed: number } {
  const behaviorWeight = getBehavioralWeight(interactionCount);
  const profileWeight = 1.0 - behaviorWeight;

  const combined = (existingScore * profileWeight) + (behaviorScore * behaviorWeight);
  const finalScore = Math.max(0, Math.min(100, Math.round(combined)));

  return {
    finalScore,
    behaviorWeightUsed: behaviorWeight
  };
}
