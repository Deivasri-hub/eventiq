const ACTION_WEIGHTS = {
  VIEW: 1,
  CLICK: 2,
  LIKE: 3,
  SAVE: 4,
  REGISTER: 5,
  DISMISS: -3
};

function buildBehavioralProfile(interactions = [], allEvents = []) {
  const tagScores = {};
  const eventsMap = new Map();
  allEvents.forEach(e => eventsMap.set(Number(e.id), e));

  const now = Date.now();

  interactions.forEach(item => {
    const weight = ACTION_WEIGHTS[item.action] || 0;
    const evt = eventsMap.get(Number(item.event_id));
    if (!evt) return;

    let decay = 1.0;
    if (item.timestamp) {
      const itemTime = new Date(item.timestamp).getTime();
      const daysOld = Math.max(0, (now - itemTime) / (1000 * 60 * 60 * 24));
      decay = Math.max(0.4, 1.0 - daysOld * 0.02);
    }

    const effectiveWeight = weight * decay;

    const reqSkills = Array.isArray(evt.required_skills) ? evt.required_skills : [];
    const careerRel = Array.isArray(evt.career_relevance) ? evt.career_relevance : [];

    const tags = [
      evt.category,
      evt.event_type,
      ...reqSkills,
      ...careerRel
    ].filter(Boolean).map(t => String(t).trim().toLowerCase());

    tags.forEach(tag => {
      tagScores[tag] = (tagScores[tag] || 0) + effectiveWeight;
    });
  });

  return {
    tagScores,
    totalInteractions: interactions.length
  };
}

function calculateBehaviorScore(eventItem, profile) {
  if (!profile || profile.totalInteractions === 0) {
    return { score: 50 };
  }

  const reqSkills = Array.isArray(eventItem.required_skills) ? eventItem.required_skills : [];
  const careerRel = Array.isArray(eventItem.career_relevance) ? eventItem.career_relevance : [];

  const tags = [
    eventItem.category,
    eventItem.event_type,
    ...reqSkills,
    ...careerRel
  ].filter(Boolean).map(t => String(t).trim().toLowerCase());

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

  const avgScore = tags.length > 0 ? totalTagScore / tags.length : 0;
  const rawNormalized = 50 + avgScore * 8;
  const score = Math.max(0, Math.min(100, Math.round(rawNormalized)));

  return {
    score,
    topMatchTag: highestTag ? highestTag.toUpperCase() : null
  };
}

function getBehavioralWeight(interactionCount) {
  if (interactionCount === 0) return 0.0;
  if (interactionCount < 4) return 0.10;
  if (interactionCount < 8) return 0.20;
  return 0.30;
}

function combineHybridScore(existingScore, behaviorScore, interactionCount) {
  const behaviorWeight = getBehavioralWeight(interactionCount);
  const profileWeight = 1.0 - behaviorWeight;

  const combined = (existingScore * profileWeight) + (behaviorScore * behaviorWeight);
  const finalScore = Math.max(0, Math.min(100, Math.round(combined)));

  return {
    finalScore,
    behaviorWeightUsed: behaviorWeight
  };
}

module.exports = {
  ACTION_WEIGHTS,
  buildBehavioralProfile,
  calculateBehaviorScore,
  getBehavioralWeight,
  combineHybridScore
};
