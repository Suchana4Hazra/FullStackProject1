# StayTogether 🏠

**Your Perfect Home Away From Home**

StayTogether is a full-stack web application that allows users to discover, list, and book amazing accommodations worldwide. Built with modern web technologies and featuring a beautiful, responsive design similar to Airbnb.

![StayTogether Banner](https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

## ✨ Features

### 🏡 Property Management
- **Create Listings** - Add your property with photos, descriptions, and pricing
- **Edit & Delete** - Full CRUD operations for property owners
- **Category Filtering** - Browse properties by type (Apartments, Villas, Hotels, etc.)
- **Advanced Search** - Filter by price range, location, and amenities
- **Image Upload** - Cloudinary integration for optimized image storage

### 👤 User Authentication
- **Secure Registration** - User signup with validation
- **Login System** - Session-based authentication
- **Profile Management** - User dashboard and settings
- **Authorization** - Owner-only access to edit/delete listings

### 🗺️ Interactive Features
- **Geolocation** - Interactive maps with property locations
- **Reviews & Ratings** - User feedback system with star ratings
- **Real-time Updates** - Dynamic content loading
- **Responsive Design** - Mobile-first approach

### 🛡️ Security Features
- **CAPTCHA Protection** - Bot prevention on forms
- **Input Validation** - Server-side and client-side validation
- **XSS Protection** - Sanitized user inputs
- **Session Management** - Secure user sessions

## 🚀 Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **Bootstrap 5** - Responsive framework
- **JavaScript ES6+** - Interactive functionality
- **EJS Templates** - Server-side rendering

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - Object modeling for MongoDB

### External Services
- **Cloudinary** - Image storage and optimization
- **MapBox API** - Interactive maps and geocoding
- **Multer** - File upload handling

### Security & Validation
- **Joi** - Schema validation
- **Express Session** - Session management
- **CAPTCHA** - Form security

## 📁 Project Structure

```
StayTogether/
├── 📁 models/
│   ├── listing.js          # Property data model
│   ├── user.js             # User authentication model
│   └── review.js           # Review and rating model
├── 📁 routes/
│   ├── listing.js          # Property CRUD operations
│   ├── user.js             # Authentication routes
│   └── review.js           # Review management
├── 📁 Controller/
│   ├── listing.js          # Listing business logic
│   ├── user.js             # User management logic
│   └── review.js           # Review handling logic
├── 📁 views/
│   ├── 📁 listings/        # Property pages
│   ├── 📁 users/           # User authentication pages
│   └── 📁 includes/        # Reusable components
├── 📁 public/
│   ├── 📁 css/             # Stylesheets
│   ├── 📁 js/              # Client-side scripts
│   └── 📁 images/          # Static assets
├── 📁 middleware/          # Custom middleware
├── 📁 utils/               # Utility functions
├── cloudConfig.js          # Cloudinary configuration
├── geocodingConfig.js      # MapBox configuration
└── app.js                  # Main application file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- MapBox API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/staytogether.git
cd staytogether
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/staytogether
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/staytogether

# Cloudinary (for image uploads)
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret

# MapBox (for maps and geocoding)
MAPBOX_TOKEN=your_mapbox_token

# Session Secret
SESSION_SECRET=your_super_secret_key

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Initialize Database
```bash
# Seed sample data (optional)
node init/index.js
```

### 5. Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Visit `http://localhost:3000` to view the application.

## 📱 Usage

### For Travelers
1. **Browse Properties** - Use category filters to find your perfect stay
2. **View Details** - Check photos, amenities, and location on map
3. **Read Reviews** - See what other guests have said

### For Hosts
1. **Sign Up** - Create your host account
2. **Add Listing** - Upload photos and property details
3. **Set Pricing** - Define your nightly rates
4. **Receive Reviews** - Build your reputation

## 🎨 UI/UX Features

### Modern Design
- **Glassmorphism Effects** - Modern translucent elements
- **Smooth Animations** - CSS transitions and hover effects
- **Card-based Layout** - Clean, organized content presentation

### Interactive Elements
- **Category Bar** - Horizontal scrolling property types
- **Filter System** - Advanced search capabilities
- **Image Galleries** - Beautiful property showcases
- **Interactive Maps** - Location visualization

### Mobile Responsive
- **Mobile-first Design** - Optimized for all screen sizes
- **Touch-friendly Interface** - Easy navigation on mobile
- **Fast Loading** - Optimized images and assets

## 🔧 API Endpoints

### Properties
- `GET /listings` - Get all listings
- `GET /listings/:id` - Get specific listing
- `POST /listings` - Create new listing (auth required)
- `PUT /listings/:id` - Update listing (owner only)
- `DELETE /listings/:id` - Delete listing (owner only)

### Users
- `GET /register` - Registration page
- `POST /register` - Create new user
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `POST /logout` - End user session

### Reviews
- `POST /listings/:id/reviews` - Add review (auth required)
- `DELETE /listings/:id/reviews/:reviewId` - Delete review (author only)

## 📊 Database Schema

### Listing Model
```javascript
{
  title: String,
  description: String,
  price: Number,
  location: String,
  country: String,
  category: String, // apartment, villa, hotel, etc.
  image: {
    filename: String,
    url: String
  },
  geometry: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  owner: ObjectId,
  reviews: [ObjectId]
}
```

### User Model
```javascript
{
  username: String,
  email: String,
  password: String, // hashed
  createdAt: Date
}
```

### Review Model
```javascript
{
  rating: Number, // 1-5 stars
  comment: String,
  author: ObjectId,
  listing: ObjectId,
  createdAt: Date
}
```

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Known Issues & Roadmap

### Current Limitations
- Payment integration pending
- Real-time chat not implemented
- Advanced calendar booking system needed

### Future Enhancements
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Real-time messaging between hosts and guests
- [ ] Advanced booking calendar
- [ ] Email notifications
- [ ] Mobile app development
- [ ] Social media login integration
- [ ] Multi-language support
- [ ] Advanced analytics for hosts
