import mongoose from 'mongoose';

const ChatsSchema = new mongoose.Schema({
  author: String,
  authorEmail: String,
  postTitle: String,
  postContent: String,
  postAttachments: Array,
});
export const ChatsModel = mongoose.models.chats || mongoose.model('chats', ChatsSchema)

const BannedUsersSchema = new mongoose.Schema({
  userEmail: String,
});
export const BannedUsersModel = mongoose.models.bannedusers || mongoose.model('bannedusers', BannedUsersSchema)