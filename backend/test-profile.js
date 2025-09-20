const https = require('http');

// Login and get token
const loginData = JSON.stringify({
  email: "rajesh.shrestha@gmail.com",
  password: "password123"
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const loginReq = https.request(loginOptions, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const loginResponse = JSON.parse(data);
    console.log('Login Response:', loginResponse.success);
    
    if (loginResponse.success) {
      const token = loginResponse.token;
      console.log('Token received, length:', token.length);
      
      // Test profile endpoint
      const profileOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/profile',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const profileReq = https.request(profileOptions, (profileRes) => {
        let profileData = '';
        
        profileRes.on('data', (chunk) => {
          profileData += chunk;
        });
        
        profileRes.on('end', () => {
          console.log('Profile Response Status:', profileRes.statusCode);
          const profileResponse = JSON.parse(profileData);
          console.log('Profile Response:', profileResponse);
        });
      });
      
      profileReq.on('error', (err) => {
        console.error('Profile Request Error:', err);
      });
      
      profileReq.end();
    }
  });
});

loginReq.on('error', (err) => {
  console.error('Login Request Error:', err);
});

loginReq.write(loginData);
loginReq.end();