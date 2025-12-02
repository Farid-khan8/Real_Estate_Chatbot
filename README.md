🏠 Real Estate Analysis Chatbot
📋 Project Overview
A full-stack web application that provides intelligent real estate market analysis through a conversational chatbot interface. Users can ask natural language questions about property prices, demand trends, and area comparisons, and receive data-driven insights with visualizations.

Live Demo: [Coming Soon] | Tech Stack: React + Django + Chart.js + Bootstrap

✨ Key Features
🤖 Intelligent Chat Interface
Natural language processing for real estate queries
Context-aware responses with market insights
Quick suggestion buttons for common queries
Real-time conversation history

📊 Comprehensive Data Visualization
Interactive price trend charts (Line/Bar charts)
Demand index visualization over time
Area comparison charts with side-by-side analysis
Growth percentage calculations and visualizations

📈 Advanced Analysis Capabilities
Single Area Analysis: Detailed insights for specific localities
Multi-Area Comparison: Compare prices, demand, and growth between areas
Trend Analysis: Historical data analysis over custom time periods
Market Insights: AI-generated summaries with actionable recommendations

🎯 User-Friendly Features
Responsive design for mobile and desktop
Quick query suggestions
Sortable data tables with filtering
Export analysis results
Dark/Light mode support

🏗️ Architecture
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ React Frontend│ │ Django API │ │ Data Layer │
│ │ │ │ │ │
│ ├─ Chat UI │◄──►│ ├─ Query Parser│◄──►│ ├─ Excel Data │
│ ├─ Charts │ │ ├─ Analytics │ │ ├─ Sample Data │
│ └─ Data Tables │ │ └─ API Routes │ │ └─ Data Models │
└─────────────────┘ └─────────────────┘ └─────────────────┘

🛠️ Technology Stack

Frontend-
React 18 - UI library for building interactive interfaces
React-Bootstrap - Responsive UI components
Chart.js + React-Chartjs-2 - Data visualization
Axios - HTTP client for API calls
React Icons - Icon library

Backend-
Django 4.2 - Python web framework
Django REST Framework - API development
Pandas - Data manipulation and analysis
OpenPyXL - Excel file processing
Python-dotenv - Environment management

Development Tools-
npm - Package management
pip - Python package management
SQLite - Development database
CORS Headers - Cross-origin resource sharing

📁 Project Structure
real-estate-chatbot/
├── backend/ # Django Backend
│ ├── config/ # Django settings
│ │ ├── settings.py # Project configuration
│ │ └── urls.py # URL routing
│ ├── chatbot/ # Chatbot application
│ │ ├── models.py # Data models
│ │ ├── views.py # API views and logic
│ │ ├── urls.py # App URLs
│ │ └── tests.py # Unit tests
│ ├── data/ # Excel data files
│ │ └── real_estate_data.xlsx
│ ├── requirements.txt # Python dependencies
│ └── manage.py # Django CLI
│
├── frontend/ # React Frontend
│ ├── public/ # Static assets
│ └── src/
│ ├── components/ # React components
│ │ ├── ChatInterface.js
│ │ ├── ChartDisplay.js
│ │ ├── SummaryCard.js
│ │ └── DataTable.js
│ ├── App.js # Root component
│ └── index.js # Entry point
│
├── start.sh # macOS startup script
├── cleanup.sh # Cleanup script
└── README.md # This file

🚀 Quick Start
Prerequisites
Python 3.8+ (already on macOS)
Node.js 16+ (download from nodejs.org)
Git

Installation

1-Clone and Setup

# Clone the repository

git clone <repository-url>
cd real-estate-chatbot

# Method 1: Use the setup script (macOS)

chmod +x start.sh
./start.sh

# Method 2: Manual setup

2-Backend Setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

3-Frontend Setup
cd frontend
npm install
npm start

4-Access the Application
Frontend: http://localhost:3000
Backend API: http://localhost:8000/api

💬 Sample Queries
Try these example queries in the chatbot:

Analysis Queries
"Analyze Wakad"
"Show me analysis for Aundh"
"What's the market status in Baner?"

Comparison Queries
"Compare Aundh and Wakad"
"Show comparison between Baner and Hinjewadi"
"Which is better: Wakad or Akurdi?"

Trend Queries
"Show price growth for Wakad over the last 3 years"
"What's the demand trend in Aundh?"
"Price trend analysis for Baner"

General Queries
"What areas do you have data for?"
"Show me the most expensive area"
"Which area has highest growth?"

🔧 API Endpoints
POST /api/query/
Description: Process chatbot queries
Request:
{
"query": "Analyze Wakad"
}

Response:
{
"type": "analysis",
"area": "Wakad",
"summary": "Detailed analysis summary...",
"chart_data": {
"labels": ["2021", "2022", "2023"],
"price": [6000, 6500, 7000],
"demand": [70, 75, 80]
},
"table_data": [...]
}

GET /api/areas/
Description: Get list of available areas
Response:
{
"areas": ["Wakad", "Aundh", "Akurdi", "Baner", "Hinjewadi"]
}

🎨 UI Components
Chat Interface
Real-time conversation display
Message bubbles with user/bot differentiation
Quick suggestion buttons
Input validation

Chart Display
Interactive line charts for trends
Comparison charts for area analysis
Responsive design
Tooltips with detailed information

Summary Card
Natural language analysis summaries
Key metrics highlights
Growth percentages
Market recommendations

Data Table
Sortable columns
Search functionality
Responsive design
Export options

🔍 How It Works
1-Query Processing
User submits natural language query
Backend parses query using regex patterns
Identifies query type (analysis/comparison/trend)

2-Data Analysis
Filters data based on area and time period
Calculates statistics and growth rates
Generates natural language summaries

3-Response Generation
Creates JSON response with summary, chart data, and table data
Frontend renders interactive visualizations
Updates chat history in real-time

🧪 Testing the Application
Backend Tests
cd backend
python manage.py test chatbot

Frontend Tests
cd frontend
npm test

Manual Testing
Start both servers using ./start.sh
Open http://localhost:3000
Try sample queries from the suggestions
Verify charts render correctly
Check data table sorting functionality
