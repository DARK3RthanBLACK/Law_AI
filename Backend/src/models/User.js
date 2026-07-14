/**
 * User Database Model Placeholder
 * 
 * Future Integration: Mongoose (MongoDB) or Prisma (SQL) database schemas.
 * 
 * ============================================================================
 * EXAMPLE MONGOOSE SCHEMA DEFINITION:
 * 
 * import mongoose from 'mongoose';
 * 
 * const userSchema = new mongoose.Schema({
 *   email: { 
 *     type: String, 
 *     required: true, 
 *     unique: true, 
 *     lowercase: true, 
 *     trim: true 
 *   },
 *   passwordHash: { 
 *     type: String, 
 *     required: false // Optional for users logging in via Google OAuth
 *   }, 
 *   googleId: { 
 *     type: String, 
 *     required: false 
 *   },
 *   createdAt: { 
 *     type: Date, 
 *     default: Date.now 
 *   }
 * });
 * 
 * export default mongoose.model('User', userSchema);
 * ============================================================================
 */

export class UserModel {
  constructor({ id, email, passwordHash, googleId, createdAt }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.googleId = googleId;
    this.createdAt = createdAt || new Date();
  }
}
