# Next.js Frontend

A modern Next.js frontend application that consumes content from Strapi CMS.

## 🚀 Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## 📋 Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Strapi backend running (see [strapi-backend](../strapi-backend) repository)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

Update the URL if your Strapi backend is running on a different host/port.

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Strapi Admin Panel**: http://localhost:1337/admin (requires Strapi backend)
- **Strapi API**: http://localhost:1337/api/articles (requires Strapi backend)

## 📝 Features

- Fetches articles from Strapi API
- Displays article list with title, content preview, and publish date
- Responsive design with Tailwind CSS
- Dark mode support

## 🔧 Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build Next.js for production
- `npm run start` - Start Next.js production server
- `npm run lint` - Run ESLint

## 🗂️ Project Structure

```
nextjs-frontend/
├── app/              # Next.js App Router
│   ├── page.tsx      # Home page
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Global styles
├── public/           # Static assets
└── ...
```

## 🔌 Connecting to Strapi

The frontend fetches data from Strapi using the `NEXT_PUBLIC_STRAPI_URL` environment variable. Make sure:

1. Strapi backend is running
2. Articles are published (not just saved as draft)
3. Public API permissions are enabled in Strapi Admin Panel
4. CORS is configured in Strapi to allow requests from `http://localhost:3000`

## 🐛 Troubleshooting

### API Connection Issues
- Verify Strapi backend is running on the URL specified in `.env.local`
- Check browser console for API errors
- Ensure CORS is properly configured in Strapi

### No Articles Displayed
- Make sure articles are published in Strapi (not just saved as draft)
- Verify API permissions in Strapi Admin Panel (Settings → Roles → Public)
- Check that the Article content type has `find` and `findOne` permissions enabled

## 📚 Next Steps

- Add article detail pages
- Implement search functionality
- Add pagination
- Implement authentication
- Add image optimization
- Set up production deployment

## 📄 License

MIT
