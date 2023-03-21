const { Schema, model } = require('mongoose');
const { ObjectId } = Schema;

const TodoSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Todo', TodoSchema);
