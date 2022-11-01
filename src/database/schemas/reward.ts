import { model, Schema } from 'mongoose';

export default model(
  'Reward',
  new Schema({
    index: {
      type: Number,
      required: true
    },
    data: {
      type: JSON,
      required: true
    },
    availableOnDate: {
      type: Date,
      required: false
    },
    isUnlocked: {
      type: Boolean,
      required: true
    },
    unlockedOnDate: {
      type: Date,
      required: false
    },
    isFavorite: {
      type: Boolean,
      required: false
    }
  })
);
