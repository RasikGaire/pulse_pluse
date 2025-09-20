const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../model/User');
require('dotenv').config();

// Sample donor data
const donorData = [
  {
    fullName: "Rajesh Kumar Shrestha",
    email: "rajesh.shrestha@gmail.com",
    password: "password123",
    phone: "+9779841234567",
    address: "Thamel, Kathmandu",
    district: "Kathmandu",
    bloodType: "O+",
    dateOfBirth: new Date("1990-05-15"),
    isDonor: true,
    description: "Active blood donor for 5+ years. Always ready to help save lives.",
    socialMedia: {
      facebook: "https://facebook.com/rajesh.shrestha",
      instagram: "https://instagram.com/rajesh_shrestha",
      whatsapp: "+9779841234567"
    },
    availability: {
      isAvailable: true,
      availableDate: new Date("2024-12-01"),
      notes: "Available for emergency donations"
    },
    location: {
      type: "Point",
      coordinates: [85.3240, 27.7172] // Kathmandu coordinates
    }
  },
  {
    fullName: "Sita Devi Poudel",
    email: "sita.poudel@yahoo.com",
    password: "password123",
    phone: "+9779856789012",
    address: "Patan Dhoka, Lalitpur",
    district: "Lalitpur",
    bloodType: "A-",
    dateOfBirth: new Date("1985-08-22"),
    isDonor: true,
    description: "Dedicated volunteer at Red Cross Society. Passionate about community service.",
    socialMedia: {
      facebook: "https://facebook.com/sita.poudel",
      instagram: "https://instagram.com/sitapoudel",
      whatsapp: "+9779856789012"
    },
    availability: {
      isAvailable: true,
      availableDate: new Date("2024-11-15"),
      notes: "Prefer weekends for donation"
    },
    location: {
      type: "Point",
      coordinates: [85.3206, 27.6683] // Lalitpur coordinates
    }
  },
  {
    fullName: "Bikram Singh Thapa",
    email: "bikram.thapa@hotmail.com",
    password: "password123",
    phone: "+9779812345678",
    address: "Bhaktapur Durbar Square",
    district: "Bhaktapur",
    bloodType: "B+",
    dateOfBirth: new Date("1992-03-10"),
    isDonor: true,
    description: "Medical student and active blood donor. Believes in giving back to society.",
    socialMedia: {
      facebook: "https://facebook.com/bikram.thapa",
      instagram: "https://instagram.com/bikramthapa",
      whatsapp: "+9779812345678"
    },
    availability: {
      isAvailable: false,
      availableDate: new Date("2025-01-20"),
      notes: "Recently donated, will be available next month"
    },
    location: {
      type: "Point",
      coordinates: [85.4298, 27.6710] // Bhaktapur coordinates
    }
  },
  {
    fullName: "Kamala Sharma Adhikari",
    email: "kamala.adhikari@gmail.com",
    password: "password123",
    phone: "+9779823456789",
    address: "Lakeside, Pokhara",
    district: "Pokhara",
    bloodType: "AB-",
    dateOfBirth: new Date("1988-12-05"),
    isDonor: true,
    description: "Teacher and community leader. Regular blood donor for past 3 years.",
    socialMedia: {
      facebook: "https://facebook.com/kamala.adhikari",
      instagram: "https://instagram.com/kamala_adhikari",
      whatsapp: "+9779823456789"
    },
    availability: {
      isAvailable: true,
      availableDate: new Date("2024-12-10"),
      notes: "Available during school holidays"
    },
    location: {
      type: "Point",
      coordinates: [83.9856, 28.2096] // Pokhara coordinates
    }
  },
  {
    fullName: "Arjun Bahadur Gurung",
    email: "arjun.gurung@outlook.com",
    password: "password123",
    phone: "+9779834567890",
    address: "Narayanghat, Chitwan",
    district: "Chitwan",
    bloodType: "O-",
    dateOfBirth: new Date("1995-07-18"),
    isDonor: true,
    description: "Army officer and blood donation advocate. Universal donor ready to help.",
    socialMedia: {
      facebook: "https://facebook.com/arjun.gurung",
      instagram: "https://instagram.com/arjun_gurung",
      whatsapp: "+9779834567890"
    },
    availability: {
      isAvailable: true,
      availableDate: new Date("2024-11-25"),
      notes: "Can donate immediately in emergencies"
    },
    location: {
      type: "Point",
      coordinates: [84.4303, 27.7000] // Chitwan coordinates
    }
  },
  {
    fullName: "Sunita Rai Limbu",
    email: "sunita.limbu@gmail.com",
    password: "password123",
    phone: "+9779845678901",
    address: "New Baneshwor, Kathmandu",
    district: "Kathmandu",
    bloodType: "A+",
    dateOfBirth: new Date("1993-09-30"),
    isDonor: true,
    description: "Nurse at Bir Hospital. Strong advocate for regular blood donation.",
    socialMedia: {
      facebook: "https://facebook.com/sunita.limbu",
      instagram: "https://instagram.com/sunita_limbu",
      whatsapp: "+9779845678901"
    },
    availability: {
      isAvailable: true,
      availableDate: new Date("2024-12-05"),
      notes: "Available after work hours"
    },
    location: {
      type: "Point",
      coordinates: [85.3240, 27.7172] // Kathmandu coordinates
    }
  },
  {
    fullName: "Deepak Magar Thakuri",
    email: "deepak.magar@yahoo.com",
    password: "password123",
    phone: "+9779856789023",
    address: "Sanepa, Lalitpur",
    district: "Lalitpur",
    bloodType: "B-",
    dateOfBirth: new Date("1987-11-12"),
    isDonor: true,
    description: "Software engineer and blood donation volunteer. Tech for good enthusiast.",
    socialMedia: {
      facebook: "https://facebook.com/deepak.magar",
      instagram: "https://instagram.com/deepak_magar",
      whatsapp: "+9779856789023"
    },
    availability: {
      isAvailable: false,
      availableDate: new Date("2025-02-01"),
      notes: "Recently donated, next availability in 2 months"
    },
    location: {
      type: "Point",
      coordinates: [85.3206, 27.6683] // Lalitpur coordinates
    }
  },
  {
    fullName: "Maya Tamang Lama",
    email: "maya.tamang@hotmail.com",
    password: "password123",
    phone: "+9779867890234",
    address: "Suryabinayak, Bhaktapur",
    district: "Bhaktapur",
    bloodType: "AB+",
    dateOfBirth: new Date("1991-04-25"),
    isDonor: true,
    description: "Social worker at local NGO. Passionate about community health initiatives.",
    socialMedia: {
      facebook: "https://facebook.com/maya.tamang",
      instagram: "https://instagram.com/maya_tamang",
      whatsapp: "+9779867890234"
    },
    availability: {
      isAvailable: true,
      availableDate: new Date("2024-11-30"),
      notes: "Flexible schedule, can adjust for donations"
    },
    location: {
      type: "Point",
      coordinates: [85.4298, 27.6710] // Bhaktapur coordinates
    }
  },
  {
    fullName: "Roshan Koirala Sharma",
    email: "roshan.koirala@gmail.com",
    password: "password123",
    phone: "+9779878901345",
    address: "Mahendrapul, Pokhara",
    district: "Pokhara",
    bloodType: "O+",
    dateOfBirth: new Date("1989-06-08"),
    isDonor: true,
    description: "Tourism professional and mountain guide. Believes in helping fellow humans.",
    socialMedia: {
      facebook: "https://facebook.com/roshan.koirala",
      instagram: "https://instagram.com/roshan_koirala",
      whatsapp: "+9779878901345"
    },
    availability: {
      isAvailable: true,
      availableDate: new Date("2024-12-15"),
      notes: "Available when not on trekking expeditions"
    },
    location: {
      type: "Point",
      coordinates: [83.9856, 28.2096] // Pokhara coordinates
    }
  },
  {
    fullName: "Anita Shrestha Maharjan",
    email: "anita.maharjan@outlook.com",
    password: "password123",
    phone: "+9779889012456",
    address: "Bharatpur-10, Chitwan",
    district: "Chitwan",
    bloodType: "A-",
    dateOfBirth: new Date("1994-01-20"),
    isDonor: true,
    description: "Agricultural extension officer. Dedicated to serving rural communities.",
    socialMedia: {
      facebook: "https://facebook.com/anita.maharjan",
      instagram: "https://instagram.com/anita_maharjan",
      whatsapp: "+9779889012456"
    },
    availability: {
      isAvailable: true,
      availableDate: new Date("2024-11-28"),
      notes: "Available during office hours and weekends"
    },
    location: {
      type: "Point",
      coordinates: [84.4303, 27.7000] // Chitwan coordinates
    }
  },
  {
    fullName: "Dinesh Kumar Karki",
    email: "dinesh.karki@gmail.com",
    password: "password123",
    phone: "+9779890123567",
    address: "Kalimati, Kathmandu",
    district: "Kathmandu",
    bloodType: "B+",
    dateOfBirth: new Date("1986-10-14"),
    isDonor: true,
    description: "Business owner and philanthropist. Regular supporter of health initiatives.",
    socialMedia: {
      facebook: "https://facebook.com/dinesh.karki",
      instagram: "https://instagram.com/dinesh_karki",
      whatsapp: "+9779890123567"
    },
    availability: {
      isAvailable: false,
      availableDate: new Date("2025-01-10"),
      notes: "Will be available after business season"
    },
    location: {
      type: "Point",
      coordinates: [85.3240, 27.7172] // Kathmandu coordinates
    }
  },
  {
    fullName: "Gita Devi Acharya",
    email: "gita.acharya@yahoo.com",
    password: "password123",
    phone: "+9779801234678",
    address: "Jawalakhel, Lalitpur",
    district: "Lalitpur",
    bloodType: "O-",
    dateOfBirth: new Date("1990-02-28"),
    isDonor: true,
    description: "Bank employee and community volunteer. Universal donor committed to saving lives.",
    socialMedia: {
      facebook: "https://facebook.com/gita.acharya",
      instagram: "https://instagram.com/gita_acharya",
      whatsapp: "+9779801234678"
    },
    availability: {
      isAvailable: true,
      availableDate: new Date("2024-12-08"),
      notes: "Available during lunch breaks and after work"
    },
    location: {
      type: "Point",
      coordinates: [85.3206, 27.6683] // Lalitpur coordinates
    }
  }
];

// Function to hash passwords
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Seed function
const seedDonors = async () => {
  try {
    // Connect to MongoDB Atlas
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing donors
    await User.deleteMany({ isDonor: true });
    console.log('Cleared existing donors');

    // Hash passwords for all donors
    const donorsWithHashedPasswords = await Promise.all(
      donorData.map(async (donor) => ({
        ...donor,
        password: await hashPassword(donor.password)
      }))
    );

    // Insert new donors
    const insertedDonors = await User.insertMany(donorsWithHashedPasswords);
    console.log(`✅ Successfully inserted ${insertedDonors.length} donors`);

    // Log summary
    const bloodTypeCount = {};
    const districtCount = {};
    
    insertedDonors.forEach(donor => {
      bloodTypeCount[donor.bloodType] = (bloodTypeCount[donor.bloodType] || 0) + 1;
      districtCount[donor.district] = (districtCount[donor.district] || 0) + 1;
    });

    console.log('\n📊 Summary:');
    console.log('Blood Type Distribution:', bloodTypeCount);
    console.log('District Distribution:', districtCount);
    console.log(`Available Donors: ${insertedDonors.filter(d => d.availability.isAvailable).length}`);

    await mongoose.connection.close();
    console.log('\n🎉 Donor seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding donors:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDonors();
}

module.exports = { seedDonors, donorData };