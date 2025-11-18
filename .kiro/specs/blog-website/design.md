# Design Document

## Overview

The Blog Website System is a modern, full-stack web application built with React and Vite for the frontend, integrated with Supabase for backend services. The application features a public-facing blog with rich media support, text-to-speech capabilities, reader comments, and a secure admin dashboard for content management. The design emphasizes user experience with responsive layouts, theme customization, and accessibility features.

### Technology Stack

- **Frontend Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS for responsive design and theming
- **Backend**: Supabase (PostgreSQL database, Authentication, Storage)
- **Text-to-Speech**: Web Speech API
- **Routing**: React Router v6
- **State Management**: React Context API + Hooks
- **Rich Text Editor**: React Quill or TipTap for admin content creation
- **Media Handling**: Supabase Storage with direct upload and URL reference support

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React Application (Vite)                   │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │ Public Pages │  │ Admin Pages  │  │ Shared UI    │ │ │
│  │  │ - Blog Feed  │  │ - Dashboard  │  │ - Theme      │ │ │
│  │  │ - Article    │  │ - Editor     │  │ - Navigation │ │ │
│  │  │ - Comments   │  │ - Login      │  │ - Components │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  │                                                          │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │         Context Providers & Services             │  │ │
│  │  │  - Auth Context  - Theme Context                 │  │ │
│  │  │  - Supabase Client  - TTS Service                │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │ Auth Service │  │ Storage      │      │
│  │ Database     │  │ (Email/Pass) │  │ (Media Files)│      │
│  │ - articles   │  │              │  │              │      │
│  │ - comments   │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Application Structure

```
src/
├── components/
│   ├── common/           # Shared components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── LoadingSpinner.jsx
│   ├── blog/             # Public blog components
│   │   ├── ArticleFeed.jsx
│   │   ├── ArticleCard.jsx
│   │   ├── ArticleView.jsx
│   │   ├── AudioReader.jsx
│   │   └── CommentSection.jsx
│   └── admin/            # Admin dashboard components
│       ├── AdminLayout.jsx
│       ├── ArticleList.jsx
│       ├── ArticleEditor.jsx
│       ├── MediaUploader.jsx
│       └── CommentModeration.jsx
├── pages/
│   ├── Home.jsx          # Main blog feed page
│   ├── Article.jsx       # Individual article page
│   ├── AdminLogin.jsx    # Admin authentication
│   └── AdminDashboard.jsx # Admin content management
├── contexts/
│   ├── AuthContext.jsx   # Authentication state
│   └── ThemeContext.jsx  # Theme management
├── services/
│   ├── supabase.js       # Supabase client configuration
│   ├── articleService.js # Article CRUD operations
│   ├── commentService.js # Comment operations
│   ├── authService.js    # Authentication logic
│   └── ttsService.js     # Text-to-speech functionality
├── hooks/
│   ├── useAuth.js        # Authentication hook
│   ├── useTheme.js       # Theme hook
│   └── useArticles.js    # Article data hook
├── utils/
│   ├── mediaHandler.js   # Media upload/URL handling
│   └── formatters.js     # Date and text formatting
├── App.jsx               # Main app component with routing
└── main.jsx              # Application entry point
```

## Components and Interfaces

### 1. Public Blog Components

#### ArticleFeed Component
- **Purpose**: Display all published articles in reverse chronological order
- **Props**: None (fetches data internally)
- **State**: 
  - `articles`: Array of article objects
  - `loading`: Boolean for loading state
  - `error`: Error message if fetch fails
- **Key Features**:
  - Infinite scroll or pagination
  - Article preview cards with thumbnail, title, excerpt, date
  - Responsive grid layout

#### ArticleView Component
- **Purpose**: Display full article content with media and comments
- **Props**: `articleId` (from URL params)
- **State**:
  - `article`: Full article object
  - `comments`: Array of comment objects
  - `loading`: Boolean
- **Key Features**:
  - Rich media rendering (images, videos)
  - Audio reader integration
  - Comment section below content
  - Responsive typography

#### AudioReader Component
- **Purpose**: Provide text-to-speech playback for articles
- **Props**: `articleContent` (text to read)
- **State**:
  - `isPlaying`: Boolean
  - `isPaused`: Boolean
  - `utterance`: SpeechSynthesisUtterance instance
- **Key Features**:
  - Play/Pause/Stop controls
  - Visual feedback for playback state
  - Handles text preprocessing (removes HTML tags)

#### CommentSection Component
- **Purpose**: Display comments and allow new comment submission
- **Props**: `articleId`
- **State**:
  - `comments`: Array of comments
  - `newComment`: Form state for new comment
  - `submitting`: Boolean
- **Key Features**:
  - Comment form with name and message fields
  - Real-time comment display
  - Auto-approval on submission

### 2. Admin Components

#### AdminLayout Component
- **Purpose**: Wrapper for admin pages with navigation and auth check
- **Props**: `children`
- **Key Features**:
  - Protected route logic
  - Admin navigation sidebar
  - Logout button

#### ArticleEditor Component
- **Purpose**: Create and edit articles with rich text and media
- **Props**: `articleId` (optional, for editing)
- **State**:
  - `title`: String
  - `content`: Rich text content
  - `media`: Array of media objects (images/videos)
  - `publishedAt`: Date
  - `saving`: Boolean
- **Key Features**:
  - Rich text editor (React Quill/TipTap)
  - Media uploader with preview
  - URL input for external media
  - Save/Publish/Draft controls

#### MediaUploader Component
- **Purpose**: Handle file uploads and URL references for media
- **Props**: 
  - `onMediaAdded`: Callback function
  - `acceptedTypes`: Array of MIME types
- **State**:
  - `uploadProgress`: Number (0-100)
  - `mediaUrl`: String for URL input
  - `uploadMethod`: 'file' | 'url'
- **Key Features**:
  - Drag-and-drop file upload
  - URL input field
  - Upload progress indicator
  - Preview before confirmation

#### CommentModeration Component
- **Purpose**: View and delete comments across all articles
- **Props**: None
- **State**:
  - `comments`: Array of all comments with article context
  - `loading`: Boolean
- **Key Features**:
  - List all comments with article titles
  - Delete button for each comment
  - Confirmation dialog before deletion

### 3. Shared Components

#### ThemeToggle Component
- **Purpose**: Switch between dark and light themes
- **Props**: None (uses ThemeContext)
- **Key Features**:
  - Toggle button with icon
  - Persists preference to localStorage
  - Smooth transition animations

#### Header Component
- **Purpose**: Main navigation for public pages
- **Key Features**:
  - Logo/site title
  - Theme toggle
  - Responsive mobile menu

## Data Models

### Article Model

```typescript
interface Article {
  id: string;                    // UUID
  title: string;                 // Article title
  content: string;               // Rich text HTML content
  excerpt: string;               // Short preview text
  author_id: string;             // Reference to admin user
  published_at: timestamp;       // Publication date
  created_at: timestamp;         // Creation date
  updated_at: timestamp;         // Last update date
  media: MediaItem[];            // Array of associated media
  is_published: boolean;         // Publication status
}

interface MediaItem {
  id: string;                    // UUID
  article_id: string;            // Foreign key to article
  type: 'image' | 'video';       // Media type
  url: string;                   // Storage URL or external URL
  source: 'upload' | 'url';      // Source type
  caption?: string;              // Optional caption
  order: number;                 // Display order in article
  created_at: timestamp;
}
```

### Comment Model

```typescript
interface Comment {
  id: string;                    // UUID
  article_id: string;            // Foreign key to article
  author_name: string;           // Commenter's name
  content: string;               // Comment text
  created_at: timestamp;         // Comment timestamp
  is_approved: boolean;          // Approval status (always true)
}
```

### Database Schema

```sql
-- Articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT false
);

-- Media table
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('upload', 'url')),
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_approved BOOLEAN DEFAULT true
);

-- Indexes for performance
CREATE INDEX idx_articles_published ON articles(published_at DESC) WHERE is_published = true;
CREATE INDEX idx_comments_article ON comments(article_id, created_at DESC);
CREATE INDEX idx_media_article ON media(article_id, order_index);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public read access to published articles
CREATE POLICY "Public can view published articles"
  ON articles FOR SELECT
  USING (is_published = true);

-- Admin full access to articles
CREATE POLICY "Admins can manage articles"
  ON articles FOR ALL
  USING (auth.role() = 'authenticated');

-- Public read access to media for published articles
CREATE POLICY "Public can view media"
  ON media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM articles 
      WHERE articles.id = media.article_id 
      AND articles.is_published = true
    )
  );

-- Admin full access to media
CREATE POLICY "Admins can manage media"
  ON media FOR ALL
  USING (auth.role() = 'authenticated');

-- Public can read all approved comments
CREATE POLICY "Public can view approved comments"
  ON comments FOR SELECT
  USING (is_approved = true);

-- Public can insert comments (auto-approved)
CREATE POLICY "Public can create comments"
  ON comments FOR INSERT
  WITH CHECK (is_approved = true);

-- Admin can delete comments
CREATE POLICY "Admins can delete comments"
  ON comments FOR DELETE
  USING (auth.role() = 'authenticated');
```

## Service Layer Design

### Supabase Client Configuration

```javascript
// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLIC_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Article Service

```javascript
// src/services/articleService.js
export const articleService = {
  // Fetch all published articles
  async getPublishedArticles() {
    const { data, error } = await supabase
      .from('articles')
      .select('*, media(*)')
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Fetch single article with comments
  async getArticleById(id) {
    const { data, error } = await supabase
      .from('articles')
      .select('*, media(*), comments(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new article (admin only)
  async createArticle(articleData) {
    const { data, error } = await supabase
      .from('articles')
      .insert([articleData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update article (admin only)
  async updateArticle(id, updates) {
    const { data, error } = await supabase
      .from('articles')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete article (admin only)
  async deleteArticle(id) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Upload media file
  async uploadMedia(file, articleId) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${articleId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);
    
    return publicUrl;
  },

  // Add media reference to article
  async addMediaToArticle(mediaData) {
    const { data, error } = await supabase
      .from('media')
      .insert([mediaData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
```

### Comment Service

```javascript
// src/services/commentService.js
export const commentService = {
  // Get comments for an article
  async getCommentsByArticle(articleId) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Create new comment (auto-approved)
  async createComment(commentData) {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ ...commentData, is_approved: true }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete comment (admin only)
  async deleteComment(id) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get all comments (admin only)
  async getAllComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('*, articles(title)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
```

### Authentication Service

```javascript
// src/services/authService.js
export const authService = {
  // Sign in with email and password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
```

### Text-to-Speech Service

```javascript
// src/services/ttsService.js
export const ttsService = {
  utterance: null,
  
  // Initialize and play text
  speak(text) {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Strip HTML tags from content
      const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      
      this.utterance = new SpeechSynthesisUtterance(cleanText);
      this.utterance.rate = 1.0;
      this.utterance.pitch = 1.0;
      this.utterance.volume = 1.0;
      
      window.speechSynthesis.speak(this.utterance);
      return this.utterance;
    } else {
      throw new Error('Text-to-speech not supported in this browser');
    }
  },

  // Pause speech
  pause() {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  },

  // Resume speech
  resume() {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  },

  // Stop speech
  stop() {
    window.speechSynthesis.cancel();
  },

  // Check if speaking
  isSpeaking() {
    return window.speechSynthesis.speaking;
  },

  // Check if paused
  isPaused() {
    return window.speechSynthesis.paused;
  }
};
```

## Routing Structure

```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<Article />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
          <Route index element={<ArticleList />} />
          <Route path="articles/new" element={<ArticleEditor />} />
          <Route path="articles/edit/:id" element={<ArticleEditor />} />
          <Route path="comments" element={<CommentModeration />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## Theme Implementation

### Theme Context

```javascript
// src/contexts/ThemeContext.jsx
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme
        light: {
          bg: '#ffffff',
          text: '#1a1a1a',
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#8b5cf6'
        },
        // Dark theme
        dark: {
          bg: '#0f172a',
          text: '#f1f5f9',
          primary: '#60a5fa',
          secondary: '#94a3b8',
          accent: '#a78bfa'
        }
      }
    }
  }
}
```

## Error Handling

### Error Boundaries

```javascript
// src/components/common/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Service Error Handling

- All service methods throw errors that are caught by components
- Components display user-friendly error messages
- Network errors show retry options
- Authentication errors redirect to login
- Validation errors display inline with forms

### Error Types

1. **Network Errors**: Connection issues with Supabase
2. **Authentication Errors**: Invalid credentials, expired sessions
3. **Validation Errors**: Invalid form inputs
4. **Permission Errors**: Unauthorized access attempts
5. **Not Found Errors**: Missing articles or resources

## Testing Strategy

### Unit Testing

**Tools**: Vitest + React Testing Library

**Coverage Areas**:
- Service functions (articleService, commentService, authService)
- Utility functions (formatters, mediaHandler)
- Custom hooks (useAuth, useTheme, useArticles)
- Individual components in isolation

**Example Test Cases**:
- `articleService.getPublishedArticles()` returns correct data structure
- `ttsService.speak()` creates SpeechSynthesisUtterance with clean text
- `ThemeToggle` component switches theme and persists to localStorage
- `CommentSection` component submits comments with required fields

### Integration Testing

**Coverage Areas**:
- Article creation flow (editor → media upload → save → display)
- Comment submission and display flow
- Authentication flow (login → protected routes → logout)
- Theme persistence across page navigation

**Example Test Cases**:
- Admin can create article with media and see it in public feed
- Reader can submit comment and see it appear immediately
- Unauthenticated user redirected from admin pages
- Theme preference persists after browser refresh

### End-to-End Testing

**Tools**: Playwright or Cypress

**Coverage Areas**:
- Complete user journeys for readers and admins
- Cross-browser compatibility
- Responsive design on different screen sizes
- Audio reader functionality

**Example Test Cases**:
- Reader navigates from feed → article → plays audio → submits comment
- Admin logs in → creates article with image → publishes → verifies on public site
- Theme toggle works across all pages
- Mobile navigation menu functions correctly

### Accessibility Testing

**Tools**: axe-core, WAVE

**Coverage Areas**:
- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- ARIA labels and roles
- Focus management

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**: Lazy load admin components
2. **Image Optimization**: Compress uploads, use responsive images
3. **Caching**: Cache article list, implement stale-while-revalidate
4. **Pagination**: Limit initial article load, implement infinite scroll
5. **Debouncing**: Debounce search and filter inputs
6. **Memoization**: Use React.memo for expensive components

### Supabase Optimization

1. **Indexes**: Database indexes on frequently queried columns
2. **Select Specific Columns**: Avoid `SELECT *` where possible
3. **Connection Pooling**: Leverage Supabase's built-in pooling
4. **Storage CDN**: Use Supabase CDN for media delivery

## Security Considerations

### Authentication Security

- Passwords hashed by Supabase Auth
- JWT tokens for session management
- Secure HTTP-only cookies
- CSRF protection via Supabase SDK

### Authorization

- Row Level Security (RLS) policies enforce data access
- Admin routes protected by authentication check
- Client-side route guards + server-side RLS

### Input Validation

- Sanitize user inputs (comment content, article content)
- Validate file uploads (type, size limits)
- XSS prevention through React's built-in escaping
- SQL injection prevention through Supabase parameterized queries

### Content Security

- Content Security Policy (CSP) headers
- HTTPS enforcement
- Secure media upload validation
- Rate limiting on comment submission

## Deployment

### Build Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
});
```

### Environment Variables

```
VITE_PUBLIC_SUPABASE_URL=https://eielkzwmadqvgofvxumr.supabase.co
VITE_SUPABASE_PUBLIC_ANON_KEY=<anon_key>
```

### Hosting Options

- **Vercel**: Recommended for Vite/React apps
- **Netlify**: Alternative with similar features
- **Supabase Hosting**: If available for static sites

### Supabase Setup

1. Create Supabase project (already done)
2. Run database migrations for tables
3. Configure RLS policies
4. Create storage bucket for media
5. Set up admin user in Supabase Auth

## Future Enhancements

- Article categories and tags
- Search functionality
- Social media sharing
- Email notifications for new comments
- Draft/scheduled publishing
- Article analytics
- Multi-author support
- Comment threading/replies
- Markdown support in comments
- SEO optimization (meta tags, sitemap)
