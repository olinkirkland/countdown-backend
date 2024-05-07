import { model, Schema } from 'mongoose';

export default model(
  'Story',
  new Schema({
    text: {
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
    variables1: {
      type: Object,
      required: true
    },
    variables2: {
      type: Object,
      required: true
    }
  })
);
