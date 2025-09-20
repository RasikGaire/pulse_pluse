// Simple test script to check authentication flow
const testAuth = async () => {
  const API_BASE_URL = 'http://localhost:5000/api';
  
  // Check if we have stored credentials
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('Stored token:', !!token);
  console.log('Stored user:', !!user);
  
  if (!token) {
    console.log('No token found - user needs to login');
    return;
  }
  
  // Test profile endpoint
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Profile API Response Status:', response.status);
    const data = await response.json();
    console.log('Profile API Response Data:', data);
    
  } catch (error) {
    console.log('Profile API Error:', error);
  }
};

// Run the test
testAuth();