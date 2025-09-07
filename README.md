# Dental Booking Application

A modern, responsive dental appointment booking system built with Next.js 15, TypeScript, and Prisma.

## Features

- **2-step booking process** with auto-progression
- **Real-time API integration** for doctors, appointment types, and time slots
- **Form validation** with Zod and React Hook Form
- **Responsive design** that works on all devices
- **Database integration** with PostgreSQL and Prisma

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dental-booking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/dental_booking?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Push the schema to your database
   npm run db:push
   
   # Seed the database with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

- `GET /api/doctors` - Fetch available doctors
- `GET /api/appointment-types` - Get appointment types
- `GET /api/time-slots?doctorId=X&date=Y` - Get available time slots
- `POST /api/appointments` - Create a new appointment
- `GET /api/appointments?patientEmail=X` - Get patient appointments

## Database Schema

The application uses the following main entities:

- **Patients** - Patient information and medical history
- **Doctors** - Doctor profiles and specialties
- **AppointmentTypes** - Different types of appointments
- **Appointments** - Booked appointments
- **TimeSlots** - Available time slots for booking

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Forms**: React Hook Form, Zod validation
- **Database**: PostgreSQL, Prisma ORM
- **API**: Next.js API routes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run format` - Format code
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with initial data

### Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── header.tsx     # Header component
│   ├── footer.tsx     # Footer component
│   └── ...            # Form components
├── hooks/             # Custom React hooks
│   └── use-api.ts     # API integration hooks
├── lib/               # Utility functions
│   ├── prisma.ts      # Prisma client
│   ├── utils.ts       # General utilities
│   └── validations.ts # Zod schemas
└── prisma/            # Database schema and migrations
    ├── schema.prisma  # Database schema
    └── seed.ts        # Database seed script
```

## Features Implemented

✅ **Auto-progression** - Forms automatically advance when completed  
✅ **API Integration** - Real-time data from backend APIs  
✅ **Form Validation** - Comprehensive validation with error handling  
✅ **Responsive Design** - Works on mobile, tablet, and desktop  
✅ **Loading States** - Proper loading indicators throughout  
✅ **Error Handling** - Graceful error handling with fallbacks  
✅ **Success/Error Pages** - Clear feedback for booking results  
✅ **Streamlined Flow** - Time selection integrated into appointment details step  

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.