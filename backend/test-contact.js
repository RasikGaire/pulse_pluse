// Test script for contact form submission
const testContactForm = async () => {
  const testData = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    phone: "9876543210",
    message: "This is a test message from the contact form."
  };

  try {
    console.log('Testing contact form submission...');
    console.log('Sending data:', testData);

    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();
    
    console.log('\n--- Response Status:', response.status);
    console.log('--- Response Data:', data);

    if (data.success) {
      console.log('\n✅ Contact form submission successful!');
      console.log('Contact ID:', data.contactMessage?.id);
    } else {
      console.log('\n❌ Contact form submission failed');
      if (data.errors) {
        console.log('Validation errors:', data.errors);
      }
    }

  } catch (error) {
    console.error('\n❌ Error testing contact form:', error.message);
    console.log('Make sure the backend server is running on http://localhost:5000');
  }
};

// Run the test
testContactForm();