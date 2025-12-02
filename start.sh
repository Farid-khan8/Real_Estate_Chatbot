#!/bin/bash
# Real Estate Chatbot - macOS Startup Script

echo "🚀 Starting Real Estate Analysis Chatbot..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    lsof -ti:"$1" >/dev/null 2>&1
}

# Kill processes on ports 8000 and 3000 if they exist
echo -e "${BLUE}Cleaning up existing processes...${NC}"
if check_port 8000; then
    echo "Stopping Django server on port 8000..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
fi

if check_port 3000; then
    echo "Stopping React server on port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
fi

# Start Backend
echo -e "\n${GREEN}Starting Django Backend...${NC}"
cd backend

# Check for virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements if needed
if [ ! -f "requirements.txt" ]; then
    echo "Creating requirements.txt..."
    cat > requirements.txt << EOF
Django==4.2
djangorestframework==3.14
pandas==2.1
openpyxl==3.1
django-cors-headers==4.2
python-dotenv==1.0
EOF
fi

pip install -r requirements.txt > /dev/null 2>&1

# Run migrations
python manage.py migrate --noinput

# Start Django in background
echo "Starting Django server at http://localhost:8000"
python manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!
sleep 2  # Give Django time to start

# Start Frontend
echo -e "\n${GREEN}Starting React Frontend...${NC}"
cd ../frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install --silent
fi

# Start React in background
echo "Starting React server at http://localhost:3000"
npm start &
FRONTEND_PID=$!

# Wait for servers to be ready
sleep 3

echo -e "\n${GREEN}✅ Both servers are running!${NC}"
echo -e "\n${BLUE}====================${NC}"
echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}Backend API:${NC} http://localhost:8000/api"
echo -e "${GREEN}Available endpoints:${NC}"
echo -e "  • http://localhost:8000/api/query/ (POST)"
echo -e "  • http://localhost:8000/api/areas/ (GET)"
echo -e "${BLUE}====================${NC}"
echo -e "\n${GREEN}Sample queries to try:${NC}"
echo "  • Analyze Wakad"
echo "  • Compare Aundh and Baner"
echo "  • Show price growth for Akurdi over the last 3 years"
echo -e "\n${RED}Press Ctrl+C to stop both servers${NC}"

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo -e '\n${RED}Servers stopped.${NC}'; exit" INT

# Wait for both processes
wait