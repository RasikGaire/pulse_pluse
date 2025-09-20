// Debug script to check "User not found" error
console.log(`
🔍 DEBUGGING "USER NOT FOUND" ERROR

This error can happen for several reasons:
1. User not logged in (no token in localStorage)
2. Token expired or invalid
3. Backend not running
4. API endpoint returning wrong response
5. Frontend not sending proper Authorization header

Let's check each possibility...
`);

// This script needs to be run in browser console to access localStorage
console.log(`
📋 DEBUGGING STEPS:

1. Open browser console (F12) and run:
   localStorage.getItem('token')
   localStorage.getItem('user')

2. Check if you see a token and user data

3. If no token/user, you need to login first:
   - Go to http://localhost:5173/login
   - Login with: rajesh.shrestha@gmail.com / password123

4. If token exists but still getting error, check network tab:
   - Open DevTools > Network tab
   - Go to profile page
   - Look for /api/profile request
   - Check if Authorization header is sent
   - Check response status and message

5. Test API directly from terminal:
`);

console.log('We will test the API endpoint to see if backend is working...');