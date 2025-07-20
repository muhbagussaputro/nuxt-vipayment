# Technical Context: Vipayment

## Technology Stack

### Frontend Framework
- **Nuxt.js 3.17.3**: Vue-based meta-framework
- **Vue 3.5.13**: Composition API dengan reactive system
- **Vue Router 4.5.1**: Client-side routing

### Styling & UI
- **TailwindCSS 6.11.5**: Utility-first CSS framework
- **Custom CSS**: Scoped styles untuk complex components
- **Responsive Design**: Mobile-first approach

### Development Tools
- **TypeScript**: Type safety dengan tsconfig.json
- **Nuxt DevTools**: Development debugging
- **Vite**: Fast build tool dan dev server

### Deployment & Hosting
- **Static Site Generation**: Pre-built untuk performance
- **Netlify**: Configured dengan netlify.toml
- **GitHub Actions**: Automated deployment dengan windsurf_deployment.yaml

## Configuration Files

### Nuxt Configuration (`nuxt.config.ts`)
```typescript
{
  ssr: false,                    // Static generation
  target: 'static',             
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000'
    }
  }
}
```

### Environment Variables
- `NUXT_PUBLIC_API_BASE`: API backend URL
- Development default: `http://localhost:8000`
- Production: Needs proper API endpoint

## API Integration

### Base Configuration
- **Default Endpoint**: `http://localhost:8000`
- **Method**: RESTful API dengan POST requests
- **Error Handling**: Try-catch dengan user feedback

### Request Pattern
```javascript
const { data } = await useFetch('/vipayment/game/services', {
  baseURL: useRuntimeConfig().public.apiBase,
  method: 'POST',
  body: { filter_type, filter_value, filter_status }
})
```

## Development Workflow

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run generate     # Generate static site
npm run preview      # Preview production build
```

### Project Structure
```
├── app.vue                 # Root application
├── pages/                  # Route-based pages
├── components/             # Reusable components
├── public/                 # Static assets
├── server/                 # Server-side code
└── nuxt.config.ts         # Nuxt configuration
```

## Current Limitations & Technical Debt

### 1. API Configuration
- Hardcoded localhost URL dalam development
- Missing production API endpoint configuration
- No API authentication atau rate limiting

### 2. Error Handling
- Basic error messages
- No centralized error management
- Missing offline handling

### 3. State Management
- Component-level state only
- No global state management
- No persistence layer

### 4. Performance
- No image optimization strategy
- Missing lazy loading untuk images
- No bundle optimization

### 5. Security
- No CSRF protection
- Missing input sanitization
- No API key management

### 6. Testing
- No unit tests
- No integration tests
- No end-to-end testing

### 7. Monitoring
- No error tracking
- No performance monitoring
- No analytics integration 