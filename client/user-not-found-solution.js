console.log(`
🚨 "USER NOT FOUND" ERROR - STEP-BY-STEP SOLUTION

📋 DIAGNOSIS:
The backend API is working perfectly (Status 200).
This is a frontend authentication state issue.

🔍 ROOT CAUSES:
1. User not logged in (most common)
2. Token expired or missing
3. Browser cache issues
4. Direct URL access without login

🚀 SOLUTION STEPS:

STEP 1: CLEAR BROWSER STATE
Open browser DevTools (F12) and run:
-> localStorage.clear()
-> sessionStorage.clear()
-> Then refresh the page

STEP 2: LOGIN PROPERLY
1. Go to: http://localhost:5173/login
2. Enter credentials:
   Email: rajesh.shrestha@gmail.com
   Password: password123
3. Click Login
4. Wait for successful redirect

STEP 3: VERIFY AUTHENTICATION
After login, check in DevTools console:
-> localStorage.getItem('token')
-> localStorage.getItem('user')
Both should return data (not null)

STEP 4: ACCESS PROFILE
Navigate to: http://localhost:5173/profile
Should work without "User not found" error

🔧 ALTERNATIVE CREDENTIALS:
If rajesh.shrestha doesn't work, try:
- anita.maharjan@gmail.com / password123
- kumar.gurung@gmail.com / password123
- sita.tamang@gmail.com / password123

⚠️ IMPORTANT NOTES:
1. Never go directly to /profile without logging in first
2. Login is required for every browser session
3. If you see "User not found", you're not authenticated
4. Backend is working - this is frontend auth state issue

💡 WHY THIS HAPPENS:
- Direct URL access: Typing http://localhost:5173/profile directly
- No stored session: Browser has no login credentials
- Development mode: Hot reload clearing auth state
- Expired session: Token expired, need fresh login

✅ AFTER FOLLOWING STEPS:
Profile page will show complete user information including:
- Full name: Rajesh Kumar Shrestha
- Email: rajesh.shrestha@gmail.com
- Blood type: O+
- Phone: +9779841234567
- Social media links
- Donation statistics
`);

console.log('🎯 Quick Fix: Clear storage → Login → Access profile');
console.log('📞 Need help? Check browser console for detailed logs.');