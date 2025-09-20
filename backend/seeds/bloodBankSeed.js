const mongoose = require('mongoose');
const BloodBank = require('../model/BloodBank');
require('dotenv').config();

// Sample blood bank data
const bloodBankData = [
  {
    name: "Nepal Red Cross Society Blood Bank",
    address: "Kalimati, Kathmandu, Nepal",
    district: "Kathmandu",
    contact: {
      phone: "+9771427050101",
      email: "bloodbank@nrcs.org",
      emergencyContact: "+9771427050102"
    },
    operatingHours: {
      monday: { open: "07:00", close: "19:00", isOpen: true },
      tuesday: { open: "07:00", close: "19:00", isOpen: true },
      wednesday: { open: "07:00", close: "19:00", isOpen: true },
      thursday: { open: "07:00", close: "19:00", isOpen: true },
      friday: { open: "07:00", close: "19:00", isOpen: true },
      saturday: { open: "07:00", close: "17:00", isOpen: true },
      sunday: { open: "08:00", close: "16:00", isOpen: true }
    },
    bloodInventory: {
      "A+": 45,
      "A-": 12,
      "B+": 38,
      "B-": 8,
      "AB+": 15,
      "AB-": 4,
      "O+": 52,
      "O-": 18
    },
    location: {
      type: "Point",
      coordinates: [85.3240, 27.7172]
    },
    isActive: true,
    facilities: ["Blood Collection", "Blood Testing", "Storage", "Emergency Services", "Mobile Units"],
    certification: {
      isGovernmentApproved: true,
      license: "NRCS-BB-001",
      expiryDate: new Date("2025-12-31")
    }
  },
  {
    name: "Tribhuvan University Teaching Hospital Blood Bank",
    address: "Maharajgunj, Kathmandu, Nepal",
    district: "Kathmandu",
    contact: {
      phone: "+9771441230301",
      email: "bloodbank@tuth.org.np",
      emergencyContact: "+9771441230302"
    },
    operatingHours: {
      monday: { open: "00:00", close: "23:59", isOpen: true },
      tuesday: { open: "00:00", close: "23:59", isOpen: true },
      wednesday: { open: "00:00", close: "23:59", isOpen: true },
      thursday: { open: "00:00", close: "23:59", isOpen: true },
      friday: { open: "00:00", close: "23:59", isOpen: true },
      saturday: { open: "00:00", close: "23:59", isOpen: true },
      sunday: { open: "00:00", close: "23:59", isOpen: true }
    },
    bloodInventory: {
      "A+": 68,
      "A-": 22,
      "B+": 43,
      "B-": 15,
      "AB+": 28,
      "AB-": 9,
      "O+": 75,
      "O-": 31
    },
    location: {
      type: "Point",
      coordinates: [85.3345, 27.7398]
    },
    isActive: true,
    facilities: ["Blood Collection", "Blood Testing", "Storage", "Emergency Services"],
    certification: {
      isGovernmentApproved: true,
      license: "TUTH-BB-002",
      expiryDate: new Date("2025-12-31")
    }
  },
  {
    name: "Patan Academy of Health Sciences Blood Bank",
    address: "Lagankhel, Lalitpur, Nepal",
    district: "Lalitpur",
    contact: {
      phone: "+9771552226601",
      email: "bloodbank@pahs.edu.np",
      emergencyContact: "+9771552226602"
    },
    operatingHours: {
      monday: { open: "06:00", close: "20:00", isOpen: true },
      tuesday: { open: "06:00", close: "20:00", isOpen: true },
      wednesday: { open: "06:00", close: "20:00", isOpen: true },
      thursday: { open: "06:00", close: "20:00", isOpen: true },
      friday: { open: "06:00", close: "20:00", isOpen: true },
      saturday: { open: "06:00", close: "18:00", isOpen: true },
      sunday: { open: "08:00", close: "16:00", isOpen: true }
    },
    bloodInventory: {
      "A+": 35,
      "A-": 15,
      "B+": 28,
      "B-": 10,
      "AB+": 12,
      "AB-": 5,
      "O+": 40,
      "O-": 18
    },
    location: {
      type: "Point",
      coordinates: [85.3206, 27.6683]
    },
    isActive: true,
    facilities: ["Blood Collection", "Blood Testing", "Storage"],
    certification: {
      isGovernmentApproved: true,
      license: "PAHS-BB-003",
      expiryDate: new Date("2025-12-31")
    }
  },
  {
    name: "Bhaktapur Cancer Hospital Blood Bank",
    address: "Bhaktapur-4, Bhaktapur, Nepal",
    district: "Bhaktapur",
    contact: {
      phone: "+9771661200501",
      email: "bloodbank@bch.org.np",
      emergencyContact: "+9771661200502"
    },
    operatingHours: {
      monday: { open: "07:00", close: "19:00", isOpen: true },
      tuesday: { open: "07:00", close: "19:00", isOpen: true },
      wednesday: { open: "07:00", close: "19:00", isOpen: true },
      thursday: { open: "07:00", close: "19:00", isOpen: true },
      friday: { open: "07:00", close: "19:00", isOpen: true },
      saturday: { open: "07:00", close: "17:00", isOpen: true },
      sunday: { open: "08:00", close: "16:00", isOpen: true }
    },
    bloodInventory: {
      "A+": 25,
      "A-": 8,
      "B+": 22,
      "B-": 6,
      "AB+": 10,
      "AB-": 3,
      "O+": 32,
      "O-": 12
    },
    location: {
      type: "Point",
      coordinates: [85.4298, 27.6710]
    },
    isActive: true,
    facilities: ["Blood Collection", "Blood Testing", "Storage", "Emergency Services"],
    certification: {
      isGovernmentApproved: true,
      license: "BCH-BB-004",
      expiryDate: new Date("2025-12-31")
    }
  },
  {
    name: "Gandaki Medical College Blood Bank",
    address: "Lekhnath-18, Pokhara, Nepal",
    district: "Pokhara",
    contact: {
      phone: "+9776152641601",
      email: "bloodbank@gmc.edu.np",
      emergencyContact: "+9776152641602"
    },
    operatingHours: {
      monday: { open: "06:00", close: "20:00", isOpen: true },
      tuesday: { open: "06:00", close: "20:00", isOpen: true },
      wednesday: { open: "06:00", close: "20:00", isOpen: true },
      thursday: { open: "06:00", close: "20:00", isOpen: true },
      friday: { open: "06:00", close: "20:00", isOpen: true },
      saturday: { open: "06:00", close: "18:00", isOpen: true },
      sunday: { open: "08:00", close: "16:00", isOpen: true }
    },
    bloodInventory: {
      "A+": 30,
      "A-": 11,
      "B+": 26,
      "B-": 7,
      "AB+": 13,
      "AB-": 4,
      "O+": 38,
      "O-": 15
    },
    location: {
      type: "Point",
      coordinates: [83.9856, 28.2096]
    },
    isActive: true,
    facilities: ["Blood Collection", "Blood Testing", "Storage"],
    certification: {
      isGovernmentApproved: true,
      license: "GMC-BB-005",
      expiryDate: new Date("2025-12-31")
    }
  }
];

// Function to seed blood banks
const seedBloodBanks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await BloodBank.deleteMany({});
    console.log('Cleared existing blood bank data');

    const bloodBanks = await BloodBank.insertMany(bloodBankData);
    console.log(`Successfully seeded ${bloodBanks.length} blood banks`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding blood banks:', error);
    process.exit(1);
  }
};

module.exports = { bloodBankData, seedBloodBanks };

if (require.main === module) {
  seedBloodBanks();
}