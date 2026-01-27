# 🏠 Sweet Home Finder

A full-stack web application for pet adoption, connecting shelters with potential pet adopters through an intelligent matching system.

## 🌟 Features

- **User Dashboard**: Browse available pets for adoption
- **Shelter Dashboard**: Manage pets and adoption applications
- **Smart Matching Quiz**: Get personalized pet recommendations
- **Real-time Chat**: Communication between adopters and shelters using Socket.IO
- **Adoption Applications**: Track and manage adoption requests
- **User Authentication**: Secure login/signup with JWT tokens

## 🛠️ Tech Stack

### Frontend
- React 18
- Chakra UI
- Socket.IO Client
- React Router
- Axios

### Backend
- Node.js & Express
- PostgreSQL
- Sequelize ORM
- Socket.IO
- JWT Authentication
- bcrypt for password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

#### Option 1: Using Setup Scripts

**On Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows:**
```bash
setup.bat
```

#### Option 2: Manual Setup

1. **Clone the repository**
```bash
git clone https://github.com/riyagmehta/Sweet-home-Finder.git
cd Sweet-home-Finder
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure environment variables**
   - Update `backend/.env` with your PostgreSQL credentials
   - Update `frontend/.env` if needed (default points to localhost:5001)

5. **Setup database**
```bash
# Create database
createdb sweet_home_finder

# Run migrations
cd backend
npx sequelize-cli db:migrate

# (Optional) Seed sample data
npx sequelize-cli db:seed:all
```

6. **Run the application**

Backend (Terminal 1):
```bash
cd backend
npm start
```

Frontend (Terminal 2):
```bash
cd frontend
npm start
```

Visit `http://localhost:3000` to see the app! 🎉

## 📚 Documentation

For detailed setup, deployment, and troubleshooting instructions, see:
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment guide for various platforms

## 🗂️ Project Structure

```
Sweet-home-Finder/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── migrations/      # Database migrations
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── seeders/         # Database seeders
│   ├── .env            # Environment variables
│   ├── server.js       # Express server entry point
│   └── package.json
├── frontend/
│   ├── public/         # Static files
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── Pages/      # Page components
│   │   ├── assets/     # Images and assets
│   │   ├── utils/      # Utility functions
│   │   └── App.jsx     # Main App component
│   ├── .env           # Frontend environment variables
│   └── package.json
├── DEPLOYMENT_GUIDE.md
├── setup.sh           # Linux/Mac setup script
└── setup.bat          # Windows setup script
```

## 🔐 Environment Variables

### Backend (.env)
```env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=sweet_home_finder
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5001
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5001/api
```

## 🐛 Common Issues

### "Port already in use"
Kill the process using the port:
```bash
# Mac/Linux
lsof -ti:5001 | xargs kill -9

# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

### Database connection failed
- Ensure PostgreSQL is running
- Check credentials in backend/.env
- Verify database exists: `psql -l`

### Module not found errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🌐 Deployment

Deploy to:
- **Heroku** (Backend + Database)
- **Netlify/Vercel** (Frontend)
- **Railway** (Full Stack)
- **Render** (Full Stack)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for step-by-step instructions.

## 📝 API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `POST /api/shelters/signup` - Shelter registration
- `POST /api/shelters/login` - Shelter login

### Pets
- `GET /api/pets` - Get all pets
- `GET /api/pets/:id` - Get pet by ID
- `POST /api/pets` - Create new pet (shelter only)
- `PUT /api/pets/:id` - Update pet (shelter only)
- `DELETE /api/pets/:id` - Delete pet (shelter only)

### Adoptions
- `POST /api/adoption-applications` - Submit adoption application
- `GET /api/adoption-applications` - Get applications
- `PUT /api/adoption-applications/:id` - Update application status

### Chat
- `POST /api/chat/messages` - Send message
- `GET /api/chat/messages/:userId/:recipientId` - Get chat history

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Authors

- Riya Mehta - [@riyagmehta](https://github.com/riyagmehta)

## 🙏 Acknowledgments

- Chakra UI for the component library
- Socket.IO for real-time communication
- Sequelize for ORM functionality

---

**Made with ❤️ for pets and their future families**
