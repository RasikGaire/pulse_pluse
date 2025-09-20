// Verify contact message was saved to database
const mongoose = require('mongoose');
const ContactMessage = require('./model/ContactMessage');
require('dotenv').config();

const verifyContactMessage = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the latest contact message
    const latestMessage = await ContactMessage.findOne().sort({ createdAt: -1 });
    
    if (latestMessage) {
      console.log('\n📩 Latest Contact Message:');
      console.log('ID:', latestMessage._id);
      console.log('Name:', `${latestMessage.firstName} ${latestMessage.lastName}`);
      console.log('Email:', latestMessage.email);
      console.log('Phone:', latestMessage.phone);
      console.log('Message:', latestMessage.message);
      console.log('Status:', latestMessage.status);
      console.log('Created At:', latestMessage.createdAt);
    } else {
      console.log('❌ No contact messages found in database');
    }

    // Get total count
    const totalCount = await ContactMessage.countDocuments();
    console.log(`\n📊 Total contact messages in database: ${totalCount}`);

  } catch (error) {
    console.error('❌ Error verifying contact message:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
};

// Run verification
verifyContactMessage();