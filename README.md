# Calorie Tracker - Health & Sports Manager

A comprehensive health tracking application built with Node.js, Express, Prisma, and PostgreSQL for managing calories, body metrics, and sports activities.

## 🚀 Features

- **Health Metrics Tracking**: Weight, BMI, body fat, water percentage, muscle mass, and more
- **Calorie Management**: Track calories burned and alcohol consumption
- **Diet Logging**: Monitor diet quality with custom categories
- **Activity Tracking**: Record active hours and physical activities
- **RESTful API**: Complete CRUD operations for health records
- **PostgreSQL Database**: Robust data persistence with Prisma ORM
- **Docker Support**: Easy development environment setup

## 📋 Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- Git

## 🔧 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/agraciag/calorie-tracker.git
cd calorie-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database configuration
```

### 4. Start the database and setup
```bash
# Using Docker Compose
docker-compose up -d postgres

# Run database migrations
npm run db:setup
```

### 5. Start development server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 🗃️ Database Configuration

- **PostgreSQL container**: `localhost:5433`
- **Database name**: `sports_manager`
- **Username**: `postgres`  
- **Password**: Configure in `.env` file

## 📡 API Endpoints

### Health Records
- `POST /records` - Create a new health record
- `GET /records/:userId` - Get all records for a user
- `PUT /records/:id` - Update a specific record
- `DELETE /records/:id` - Delete a record
- `GET /health` - API health check

### Example Record Structure
```json
{
  "userId": 1,
  "date": "2025-06-18T00:00:00.000Z",
  "weight": 70.5,
  "bmi": 23.1,
  "bodyFat": 15.2,
  "water": 58.7,
  "metabolism": 1650,
  "alcoholUnits": 2,
  "alcoholCalories": 140,
  "dietLog": "bien",
  "activeHours": 8.5,
  "caloriesBurned": 350
}
```

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm start               # Start production server

# Database
npm run db:migrate      # Create and apply new migration
npm run db:studio       # Open Prisma Studio
npx prisma db seed      # Run seed script (if configured)

# Docker
docker-compose up -d    # Start all services
docker-compose down     # Stop all services
docker-compose logs postgres  # View database logs
```

## 📁 Project Structure

```
calorie-tracker/
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore rules
├── README.md          # Project documentation
├── package.json       # Project configuration
├── tsconfig.json      # TypeScript configuration
├── schema.prisma      # Database schema
├── docker-compose.yml # Docker services
├── index.ts          # Main server file
├── index.html        # Basic frontend
├── RecordForm.tsx    # React form component
└── migrations/       # Prisma migrations
```

## 🔒 Security Notes

- Environment variables are excluded from version control
- PostgreSQL data directory is not tracked in Git
- Use strong passwords for production deployments
- Configure proper CORS settings for production

## 🧪 Testing API

Test the API endpoints using curl or your preferred API client:

```bash
# Health check
curl http://localhost:3000/health

# Create a record
curl -X POST http://localhost:3000/records \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "weight": 70.5, "dietLog": "bien"}'

# Get user records
curl http://localhost:3000/records/1
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ using Node.js, Express, Prisma, and PostgreSQL**
