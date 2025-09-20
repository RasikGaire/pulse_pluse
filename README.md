# PulsePlush - Blood Donation Platform 🩸

A comprehensive web application designed to connect blood donors with those in need, streamlining the blood donation process and saving lives through technology.

## 🌟 Features

### 🔐 User Authentication
- **Secure Registration & Login**: JWT-based authentication system
- **Profile Management**: Complete user profile with personal information
- **Profile Picture Upload**: Users can upload and manage their profile pictures
- **Email Verification**: Secure account verification process

### 🩸 Blood Donation Management
- **Donor Registration**: Users can register as blood donors
- **Blood Type Management**: Support for all blood types (A+, A-, B+, B-, AB+, AB-, O+, O-)
- **Donor Search**: Advanced search functionality with filters for blood type, location, and availability
- **Donor Profiles**: Detailed donor profiles with contribution history

### 🏥 Blood Bank System
- **Blood Bank Directory**: Comprehensive list of registered blood banks
- **Real-time Inventory**: Live blood inventory tracking
- **Bank Details**: Complete information including contact details, operating hours, and facilities
- **Location-based Search**: Find blood banks by district and availability

### 📞 Contact & Communication
- **Contact Form**: Direct communication channel with popup notifications
- **Message Storage**: All contact messages are stored in the database
- **Emergency Contacts**: Quick access to emergency blood services

### 🎯 Additional Features
- **Responsive Design**: Mobile-friendly interface
- **Modern UI/UX**: Clean and intuitive user interface
- **Real-time Updates**: Live data synchronization
- **Search & Filters**: Advanced filtering options for better user experience

## 🛠️ Technology Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Icons** - Beautiful icon components
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
PulsePlush/
├── backend/
│   ├── controller/          # Business logic controllers
│   │   ├── user.js         # User management
│   │   ├── bloodBank.js    # Blood bank operations
│   │   ├── contact.js      # Contact form handling
│   │   └── ...
│   ├── model/              # Database models
│   │   ├── User.js         # User schema
│   │   ├── BloodBank.js    # Blood bank schema
│   │   ├── ContactMessage.js # Contact message schema
│   │   └── ...
│   ├── routes/             # API routes
│   │   ├── user.js         # User routes
│   │   ├── bloodBank.js    # Blood bank routes
│   │   ├── contact.js      # Contact routes
│   │   └── ...
│   ├── seeds/              # Database seeding
│   ├── auth.js             # Authentication middleware
│   ├── server.js           # Main server file
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Layout/     # Layout components
│   │   │   └── UI/         # UI components
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx    # Landing page
│   │   │   ├── Login.jsx   # Authentication
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx # User profile
│   │   │   ├── FindDonor.jsx # Donor search
│   │   │   ├── Contact.jsx # Contact form
│   │   │   └── ...
│   │   ├── contexts/       # React contexts
│   │   ├── api/            # API utilities
│   │   ├── style/          # Stylesheets
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:RasikGaire/pulse_pluse.git
   cd pulse_pluse
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/pulseplush
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pulseplush
   
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

4. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

5. **Database Seeding (Optional)**
   ```bash
   cd ../backend
   node seeds/index.js
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server will run on `http://localhost:5000`

2. **Start Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   Application will run on `http://localhost:5173`

## 📱 Usage

### For Blood Donors
1. **Register** as a new user or **Login** to existing account
2. **Complete Profile** with personal information and blood type
3. **Upload Profile Picture** for better visibility
4. **Set Availability** status for blood donation
5. **Respond to Requests** from those in need

### For Blood Seekers
1. **Browse Donors** by blood type and location
2. **Search Blood Banks** for immediate requirements
3. **Contact Donors** directly through the platform
4. **Submit Requests** through the contact form

### For Blood Banks
1. **Register** your blood bank (Admin feature)
2. **Update Inventory** in real-time
3. **Manage Availability** for different blood types
4. **Provide Contact Information** for emergencies

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Blood Banks
- `GET /api/blood-banks` - Get all blood banks
- `GET /api/blood-banks/:id` - Get specific blood bank
- `GET /api/blood-banks/search` - Search blood banks by type
- `POST /api/blood-banks/create` - Create new blood bank (Admin)

### Donors
- `GET /api/users/donors` - Get all donors
- `GET /api/users/donors/search` - Search donors with filters

### Contact
- `POST /api/contact` - Submit contact message
- `GET /api/contact` - Get contact messages (Admin)

## 🔒 Security Features
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Cross-origin request security
- **Error Handling** - Comprehensive error management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Bibek Adhikari
- **Repository Owner**: RasikGaire
- **Project Type**: BCA Final Year Project

## 📞 Support

For support, email adhikaribibek84@gmail.com or create an issue in this repository.

## 🙏 Acknowledgments

- Thanks to all contributors who helped make this project possible
- Special thanks to the open-source community for the amazing libraries and tools
- Inspired by the need to save lives through technology

---

**Made with ❤️ for saving lives through blood donation**

*This project aims to bridge the gap between blood donors and those in need, making blood donation more accessible and efficient.*