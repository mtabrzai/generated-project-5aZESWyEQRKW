# Generated Project

A modern React application built with Vite, Tailwind CSS, and a robust component-based architecture.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm v9+

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run coverage
```

## 🛠 Tech Stack

### Core
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: JavaScript (ES Modules)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router DOM

### Utilities
- **Date Handling**: date-fns
- **Icons**: React Icons
- **HTTP Client**: Axios
- **Class Utilities**: clsx
- **Testing**: Vitest + Testing Library

## 📁 Project Structure

```
generated-project/
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── vercel.json
├── README.md
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── assets/                # Static assets
│   ├── components/            # Reusable UI components
│   │   ├── Avatar.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Navbar.jsx
│   │   ├── PostForm.jsx
│   │   ├── PostList.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── UserForm.jsx
│   │   └── UserList.jsx
│   ├── constants.js           # Application constants
│   ├── context/               # React context providers
│   │   └── AuthContext.jsx
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.js
│   │   ├── usePosts.js
│   │   └── useUsers.js
│   ├── pages/                 # Page components
│   │   ├── AdminDashboardPage.jsx
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── PostCreatePage.jsx
│   │   ├── PostDetailPage.jsx
│   │   ├── PostEditPage.jsx
│   │   ├── PostListPage.jsx
│   │   └── RegisterPage.jsx
│   ├── routes.jsx             # Route configuration
│   ├── stores/                # Zustand stores
│   │   ├── useAuthStore.js
│   │   ├── usePostStore.js
│   │   └── useUserStore.js
│   └── utils.js               # Utility functions
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Tailwind CSS
Customize the design system in `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Vite
Configure build settings in `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/'
})
```

## 🎯 Features

### Authentication
- Login/Register flow with form validation
- Protected routes with role-based access control
- Admin dashboard with user management

### Content Management
- Create, Read, Update, Delete posts
- Rich text editing with excerpt support
- Tagging system for posts
- Search and filtering capabilities

### User Experience
- Responsive design with Tailwind CSS
- Loading states and skeleton screens
- Error handling and user feedback
- Dark mode support

## 🧪 Testing

Run tests with:
```bash
npm test
```

Run tests with coverage:
```bash
npm run coverage
```

### Testing Stack
- **Unit Testing**: Vitest
- **Component Testing**: @testing-library/react
- **DOM Testing**: @testing-library/jest-dom
- **User Events**: @testing-library/user-event
- **Mocking**: jsdom

## 🚀 Deployment

### Vercel
The project includes a `vercel.json` configuration for seamless Vercel deployment:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

### Build Command
```bash
npm run build
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.