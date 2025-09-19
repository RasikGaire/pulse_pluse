// Mock API to fetch blood donors
export const fetchBloodDonors = () => {
  const bloodDonorsData = [
    { id: 1, name: "John Doe", blood_type: "O+", location: "City, State", last_donated: "2023-01-15", contact: "555-1111" },
    { id: 2, name: "Jane Smith", blood_type: "A-", location: "Town, State", last_donated: "2022-12-01", contact: "555-2222" },
    { id: 3, name: "Peter Jones", blood_type: "B+", location: "Metropolis", last_donated: "2023-03-20", contact: "555-3333" },
    { id: 4, name: "Mary Lee", blood_type: "AB-", location: "Suburbia", last_donated: "2023-02-10", contact: "555-4444" },
    { id: 5, name: "Robert Brown", blood_type: "O-", location: "Riverside", last_donated: "2023-04-05", contact: "555-5555" }
  ];

  return new Promise((resolve) => setTimeout(() => resolve(bloodDonorsData), 1000));

  // Real API example:
  // return fetch("https://yourapi.com/blood-donors")
  //   .then(res => res.json())
  //   .catch(err => console.error(err));
};

// Mock API to fetch blood banks
export const fetchBloodBanks = () => {
  const bloodBanksData = [
    { id: 1, name: "Global Blood Bank", address: "123 Healthway, City, State", contact: "555-1234", availability: { "O+": 10, "A+": 5, "B+": 2, "AB+": 0 } },
    { id: 2, name: "Community Blood Center", address: "456 Lifeline Rd, Town, State", contact: "555-5678", availability: { "O+": 3, "A+": 7, "B+": 1, "AB+": 4 } },
    { id: 3, name: "National Blood Service", address: "789 Vitality Ave, Capital City", contact: "555-9012", availability: { "O+": 12, "A+": 8, "B+": 3, "AB+": 1 } },
    { id: 4, name: "City Health Blood Bank", address: "101 Care Street, Metropolis", contact: "555-3456", availability: { "O+": 0, "A+": 2, "B+": 5, "AB+": 0 } }
  ];

  return new Promise((resolve) => setTimeout(() => resolve(bloodBanksData), 1000));

  // Real API example:
  // return fetch("https://yourapi.com/blood-banks")
  //   .then(res => res.json())
  //   .catch(err => console.error(err));
};
