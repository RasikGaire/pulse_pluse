// Test profile authentication flow
const testProfileAuth = async () => {
  console.log('🔍 Testing Profile Authentication Flow...\n');

  try {
    // Test 1: Login with seeded user credentials
    console.log('📝 Step 1: Testing login...');
    const loginResponse = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'rajesh.shrestha@gmail.com',
        password: 'password123'
      }),
    });

    const loginData = await loginResponse.json();
    console.log('Login Response Status:', loginResponse.status);
    console.log('Login Response Data:', loginData);

    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginData.message);
      return;
    }

    const token = loginData.token;
    console.log('✅ Login successful, token received');

    // Test 2: Fetch profile with token
    console.log('\n📝 Step 2: Testing profile fetch...');
    const profileResponse = await fetch('http://localhost:5000/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const profileData = await profileResponse.json();
    console.log('Profile Response Status:', profileResponse.status);
    console.log('Profile Response Data:', profileData);

    if (profileResponse.ok) {
      console.log('✅ Profile fetch successful');
      console.log('User details:', {
        fullName: profileData.user.fullName,
        email: profileData.user.email,
        bloodType: profileData.user.bloodType,
        phone: profileData.user.phone
      });
    } else {
      console.log('❌ Profile fetch failed:', profileData.message);
    }

    // Test 3: Check if endpoints exist
    console.log('\n📝 Step 3: Testing API health...');
    const healthResponse = await fetch('http://localhost:5000/', {
      method: 'GET',
    });

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend server is running:', healthData.message);
    } else {
      console.log('❌ Backend server may not be running');
    }

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    console.log('\n🔧 Possible issues:');
    console.log('1. Backend server not running (npm start in backend folder)');
    console.log('2. Database connection issues');
    console.log('3. Network connectivity problems');
    console.log('4. CORS configuration issues');
  }
};

// Run the test
testProfileAuth();