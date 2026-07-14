/**
 * Message Database Model Placeholder
 * 
 * Future Integration: Mongoose (MongoDB) or Prisma (SQL) database schemas.
 * 
 * ============================================================================
 * EXAMPLE MONGOOSE SCHEMA DEFINITION:
 * 
 * import mongoose from 'mongoose';
 * 
 * const messageSchema = new mongoose.Schema({
 *   sessionId: { 
 *     type: mongoose.Schema.Types.ObjectId, 
 *     ref: 'ChatSession', 
 *     required: true 
 *   },
 *   sender: { 
 *     type: String, 
 *     enum: ['user', 'ai'], 
 *     required: true 
 *   },
 *   text: { 
 *     type: String, 
 *     required: true 
 *   },
 *   attachment: {
 *     name: { type: String, required: false },
 *     size: { type: Number, required: false },
 *     mimetype: { type: String, required: false },
 *     path: { type: String, required: false }
 *   },
 *   createdAt: { 
 *     type: Date, 
 *     default: Date.now 
 *   }
 * });
 * 
 * export default mongoose.model('Message', messageSchema);
 * ============================================================================
 */

export class MessageModel {
  constructor({ id, sessionId, sender, text, attachment, createdAt }) {
    this.id = id;
    this.sessionId = sessionId;
    this.sender = sender; // 'user' | 'ai'
    this.text = text;
    this.attachment = attachment || null; // { name, size, mimetype, path }
    this.createdAt = createdAt || new Date();
  }
}
