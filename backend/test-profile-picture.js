// Test profile picture in API response
const testProfilePicture = async () => {
  try {
    console.log('🔍 Testing Profile Picture Data...\n');

    // Login first
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
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginData.message);
      return;
    }

    const token = loginData.token;
    console.log('✅ Login successful');

    // Get profile data
    const profileResponse = await fetch('http://localhost:5000/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const profileData = await profileResponse.json();
    
    if (profileResponse.ok) {
      console.log('✅ Profile fetch successful');
      console.log('\n📊 Profile Picture Status:');
      console.log('- Has profilePicture field:', 'profilePicture' in profileData.user);
      console.log('- profilePicture value:', profileData.user.profilePicture);
      console.log('- profilePicture type:', typeof profileData.user.profilePicture);
      
      if (profileData.user.profilePicture) {
        console.log('- profilePicture length:', profileData.user.profilePicture.length);
        console.log('- Is base64 data:', profileData.user.profilePicture.startsWith('data:image/'));
      } else {
        console.log('- profilePicture is null/empty');
      }

      console.log('\n👤 User Data Summary:');
      console.log('- Full Name:', profileData.user.fullName);
      console.log('- Email:', profileData.user.email);
      console.log('- Has Profile Picture:', !!profileData.user.profilePicture);
      
    } else {
      console.log('❌ Profile fetch failed:', profileData.message);
    }

  } catch (error) {
    console.error('❌ Error testing profile picture:', error.message);
  }
};

// Run the test
testProfilePicture();