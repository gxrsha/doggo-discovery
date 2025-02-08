# Doggo Discovery 🐾

A Next.js application that helps users discover and match with their perfect dog companion. The app provides an interactive interface to browse, filter, and favorite dogs, ultimately helping users find their ideal match.

## Features

### Authentication

- **Login Page** (`/login`)
  - Simple authentication with name and email
  - Redirects to search page on successful login
  - Responsive design with a clean, modern interface

### Dog Search & Discovery (`/search`)

- **Browse Dogs**

  - Grid view of available dogs with images and key information
  - Responsive layout adapting to different screen sizes
  - Each dog card displays:
    - Dog's photo
    - Name
    - Breed
    - Age
    - Location (zip code)

- **Search Filters**

  - Filter by breed(s)
  - Filter by age range (min/max)
  - Sort dogs by breed (A-Z or Z-A)
  - Sticky filter panel for easy access

- **Favorites System**

  - Heart icon to favorite/unfavorite dogs
  - Track favorite count
  - Clear all favorites option
  - Generate match from favorited dogs

- **Pagination**
  - Navigate through multiple pages of results
  - Display current page and total pages
  - Previous/Next navigation

### Match Generation

- **Match Modal**
  - Generate perfect match from favorited dogs
  - Displays match details with celebration animation
  - Shows comprehensive information about the matched dog

### Navigation

- **Navbar**
  - App logo and title (clickable to reset search)
  - Logout functionality
  - Consistent across all authenticated pages

## Technical Details

### Built With

- [Next.js 14](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

### Key Components

- Responsive design for mobile and desktop
- Client-side state management
- API integration with authentication
- Image optimization with Next.js Image component
- Modern UI with animations and transitions

## Getting Started

1. **Installation**

   ```bash
   npm install
   ```

2. **Development**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app

3. **Build**
   ```bash
   npm run build
   ```

## Project Structure

```
app/
├── components/          # Reusable UI components
├── services/           # API and other services
├── types/              # TypeScript type definitions
├── login/             # Login page
└── search/            # Main search page
```

## API Integration

The application integrates with a dog discovery API that provides:

- Dog search with filters
- Breed listings
- Match generation
- Authentication services

## Future Enhancements

- Location-based search
- Advanced filtering options
- User preferences storage
- Detailed dog profiles
- Social sharing features
