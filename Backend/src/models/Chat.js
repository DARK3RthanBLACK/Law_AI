import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      default: 'New Session',
    },
    preview: {
      type: String,
      default: '',
    },
    messages: [messageSchema],
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
