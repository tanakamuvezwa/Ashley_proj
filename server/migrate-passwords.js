// One-time password migration script
// Rehashes plain-text passwords in MongoDB to bcrypt
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apexlend';

const UserSchema = new mongoose.Schema({
  id: String, name: String, email: String, password: String, role: String, status: String, createdAt: String
});
const User = mongoose.model('User', UserSchema);

const KNOWN_PASSWORDS = {
  'admin@apexlend.ai':  'AdminPass123',
  'ashley@apexlend.ai': 'AshleyPass123',
  'lender@apexlend.ai': 'LenderPass123'
};

async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');
  
  const users = await User.find({});
  console.log(`Found ${users.length} users`);
  
  for (const user of users) {
    const isBcrypt = user.password?.startsWith('$2');
    if (isBcrypt) {
      console.log(`  [SKIP] ${user.email} — already hashed`);
      continue;
    }
    
    // Use known mapping or hash whatever plain text is stored
    const plainPw = KNOWN_PASSWORDS[user.email] || user.password;
    if (!plainPw) {
      console.log(`  [SKIP] ${user.email} — no password found`);
      continue;
    }
    
    const hashed = await bcrypt.hash(plainPw, 12);
    await User.updateOne({ _id: user._id }, { $set: { password: hashed } });
    console.log(`  [DONE] ${user.email} — password hashed`);
  }
  
  console.log('\nMigration complete!');
  process.exit(0);
}

migrate().catch(err => { console.error(err); process.exit(1); });
