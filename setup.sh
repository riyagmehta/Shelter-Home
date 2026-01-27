#!/bin/bash

echo "🏠 Sweet Home Finder - Quick Setup Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null
then
    echo "⚠️  PostgreSQL not found. Please install PostgreSQL."
    echo "   Visit: https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ PostgreSQL found"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Update backend/.env with your PostgreSQL password"
echo "   2. Create the database: createdb sweet_home_finder"
echo "   3. Run migrations: cd backend && npx sequelize-cli db:migrate"
echo "   4. Start backend: cd backend && npm start"
echo "   5. Start frontend: cd frontend && npm start"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
