import Reward from './database/schemas/reward';

export async function getNextReward() {
  const lockedRewardWithLowestIndex = await Reward.findOne({
    isUnlocked: false
  }).sort({
    index: 1
  });

  if (!lockedRewardWithLowestIndex) return null;

  if (lockedRewardWithLowestIndex.availableOnDate)
    return lockedRewardWithLowestIndex;

  // Give it an availableOnDate of one hour ago so it's available immediately
  lockedRewardWithLowestIndex.availableOnDate = new Date(Date.now() - 3600000);
  await lockedRewardWithLowestIndex.save();
  return lockedRewardWithLowestIndex;
}

export async function getUnlockedRewards() {
  const unlockedRewards = await Reward.find({
    isUnlocked: true
  }).sort({
    index: 1
  });

  return unlockedRewards;
}

export async function unlockNextReward() {
  const nextReward = await getNextReward();
  if (!nextReward) return null;

  if (new Date().getTime() < nextReward.availableOnDate.getTime()) return false;

  nextReward.isUnlocked = true;
  nextReward.unlockedOnDate = new Date();

  await nextReward.save();

  // Give the new next reward an unlock date 1 day in the future
  const newNextReward = await getNextReward();
  if (!newNextReward) return null;

  newNextReward.availableOnDate = new Date();
  // Increment availableOnDate by two minutes
  // newNextReward.availableOnDate.setMinutes(
  //   newNextReward.availableOnDate.getMinutes() + 2
  // );
  newNextReward.availableOnDate.setDate(
    newNextReward.availableOnDate.getDate() + 1
  );

  await newNextReward.save();

  return true;
}

export async function setFavorite(index: number, isFavorite: boolean) {
  console.log('setFavorite', index, '->', isFavorite);
  const reward = await Reward.findOne({ index });
  reward.isFavorite = isFavorite;

  console.log('  ', reward.isFavorite);

  await reward.save();
}

export async function addReward(data: any) {
  // Get the next available index
  const nextIndex = await Reward.countDocuments({});

  // Create a new reward
  const reward = new Reward({
    index: nextIndex,
    data,
    availableOnDate: null,
    isUnlocked: false,
    unlockedOnDate: null
  });

  // Save the reward to the database
  await reward.save();
  console.log('✅', 'Added reward at index', nextIndex);
}

// setInterval(() => {
//   addReward({
//     title: 'New reward',
//     description: 'This is a new reward'
//   });
// }, 1000);
