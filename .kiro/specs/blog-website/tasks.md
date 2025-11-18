# Implementation Plan

- [x] 1. Initialize project and configure Supabase






  - Create Vite + React project with TypeScript support
  - Install dependencies: @supabase/supabase-js, react-router-dom, tailwindcss
  - Configure Tailwind CSS with dark mode support
  - Set up Supabase client with environment variables
  - _Requirements: 12.1, 12.2_

- [x] 2. Set up Supabase database schema





  - [x] 2.1 Create articles table with all required columns


    - Write SQL migration for articles table
    - Add indexes for performance optimization
    - _Requirements: 12.2, 1.1_
  
  - [x] 2.2 Create media table with foreign key relationships


    - Write SQL migration for media table
    - Add indexes on article_id and order_index
    - _Requirements: 2.2, 2.3, 2.4, 2.5_
  
  - [x] 2.3 Create comments table with auto-approval


    - Write SQL migration for comments table
    - Set default is_approved to true
    - Add index on article_id
    - _Requirements: 4.1, 4.3_
  
  - [x] 2.4 Implement Row Level Security policies


    - Write RLS policies for public read access to published articles
    - Write RLS policies for admin full access
    - Write RLS policies for public comment creation
    - Write RLS policies for admin comment deletion
    - _Requirements: 5.3, 5.4, 6.5, 8.3, 9.3_
  
  - [x] 2.5 Create storage bucket for media files


    - Create 'media' storage bucket in Supabase
    - Configure public access policies for the bucket
    - _Requirements: 12.5, 2.2, 2.3_

- [x] 3. Implement core services layer






  - [x] 3.1 Create Supabase client configuration

    - Write supabase.js with client initialization
    - Load environment variables for URL and anon key
    - _Requirements: 12.1_
  
  - [x] 3.2 Implement article service with CRUD operations


    - Write getPublishedArticles() function
    - Write getArticleById() function with media and comments
    - Write createArticle() function for admin
    - Write updateArticle() function for admin
    - Write deleteArticle() function for admin
    - Write uploadMedia() function for file uploads
    - Write addMediaToArticle() function for media references
    - _Requirements: 1.1, 1.2, 6.5, 7.4, 8.3, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 3.3 Implement comment service


    - Write getCommentsByArticle() function
    - Write createComment() function with auto-approval
    - Write deleteComment() function for admin
    - Write getAllComments() function for admin moderation
    - _Requirements: 4.1, 4.3, 9.2, 9.3_
  
  - [x] 3.4 Implement authentication service


    - Write signIn() function with email/password
    - Write signOut() function
    - Write getSession() function
    - Write onAuthStateChange() listener
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [x] 3.5 Implement text-to-speech service


    - Write speak() function with HTML tag stripping
    - Write pause() function
    - Write resume() function
    - Write stop() function
    - Write isSpeaking() and isPaused() helper functions
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Create context providers for global state






  - [x] 4.1 Implement AuthContext

    - Create AuthContext with user state
    - Implement login, logout, and session management
    - Add auth state listener for session persistence
    - _Requirements: 5.3, 5.5, 5.6_
  
  - [x] 4.2 Implement ThemeContext


    - Create ThemeContext with theme state (light/dark)
    - Implement toggleTheme() function
    - Add localStorage persistence for theme preference
    - Apply theme class to document root
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 5. Build shared UI components





  - [x] 5.1 Create Header component


    - Build responsive navigation with logo/title
    - Integrate ThemeToggle component
    - Add mobile menu for small screens
    - _Requirements: 10.1, 11.4_
  
  - [x] 5.2 Create ThemeToggle component


    - Build toggle button with sun/moon icons
    - Connect to ThemeContext
    - Add smooth transition animations
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [x] 5.3 Create Footer component


    - Build footer with copyright and links
    - Make responsive for all screen sizes
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [x] 5.4 Create LoadingSpinner component


    - Build animated loading indicator
    - Support both light and dark themes
    - _Requirements: 10.3_

- [x] 6. Implement public blog pages and components







  - [x] 6.1 Create ArticleFeed component


    - Fetch published articles using articleService
    - Display articles in responsive grid layout
    - Show article preview cards with thumbnail, title, excerpt, date
    - Implement loading and error states
    - _Requirements: 1.1, 1.2, 1.3, 11.1, 11.2, 11.3_
  

  - [x] 6.2 Create ArticleCard component

    - Display article thumbnail (first image or placeholder)
    - Show title, excerpt, and formatted publication date
    - Add click handler to navigate to full article
    - Make responsive for all screen sizes
    - _Requirements: 1.3, 1.4, 11.1, 11.2, 11.3_
  


  - [x] 6.3 Create Home page

    - Integrate Header, ArticleFeed, and Footer components
    - Set up as main route ("/")
    - _Requirements: 1.1, 1.2_
  
  - [x] 6.4 Create ArticleView component


    - Fetch article by ID with media and comments
    - Render article title, content, and metadata
    - Display embedded images and videos in content
    - Integrate AudioReader component
    - Integrate CommentSection component
    - Implement responsive typography
    - _Requirements: 1.4, 2.1, 2.6, 3.1, 4.1, 11.1, 11.2, 11.3_
  

  - [x] 6.5 Create AudioReader component

    - Build play/pause/stop control buttons
    - Integrate ttsService for text-to-speech
    - Strip HTML tags from article content before speaking
    - Show visual feedback for playback state
    - Handle browser compatibility (check for speechSynthesis)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  

  - [x] 6.6 Create CommentSection component

    - Display all comments for the article
    - Build comment form with name and message fields
    - Implement comment submission with auto-approval
    - Show success message after submission
    - Display comments with author name and timestamp
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  

  - [x] 6.7 Create Article page

    - Integrate ArticleView component
    - Extract article ID from URL params
    - Set up as route ("/article/:id")
    - _Requirements: 1.4_

- [x] 7. Implement admin authentication




  - [x] 7.1 Create AdminLogin page


    - Build login form with email and password fields
    - Integrate authService for authentication
    - Show error messages for invalid credentials
    - Redirect to admin dashboard on successful login
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [x] 7.2 Create ProtectedRoute component


    - Check authentication status using AuthContext
    - Redirect to login page if not authenticated
    - Render protected content if authenticated
    - _Requirements: 5.3, 5.5_
  
  - [x] 7.3 Add logout functionality


    - Create logout button in admin layout
    - Call authService.signOut()
    - Redirect to home page after logout
    - _Requirements: 5.6_

- [x] 8. Build admin dashboard layout and navigation




  - [x] 8.1 Create AdminLayout component


    - Build admin navigation sidebar with links
    - Add logout button
    - Integrate with ProtectedRoute
    - Make responsive for mobile devices
    - _Requirements: 5.1, 5.6, 11.4_
  
  - [x] 8.2 Create AdminDashboard page


    - Set up nested routing for admin sections
    - Integrate AdminLayout as wrapper
    - Define routes for article list, editor, and comment moderation
    - _Requirements: 5.1_

- [ ] 9. Implement article management features






  - [x] 9.1 Create ArticleList component


    - Fetch all articles (published and drafts) for admin
    - Display articles in table or card format
    - Add edit and delete buttons for each article
    - Implement delete confirmation dialog
    - Show article status (published/draft)
    - _Requirements: 7.1, 8.1, 8.2_
  
  - [x] 9.2 Create MediaUploader component


    - Build file upload interface with drag-and-drop
    - Add URL input field for external media
    - Show upload progress indicator
    - Display media preview before confirmation
    - Validate file types (images and videos only)
    - Call articleService.uploadMedia() for file uploads
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 6.3, 6.4_
  
  - [x] 9.3 Create ArticleEditor component






    - Integrate rich text editor (React Quill or TipTap)
    - Add input fields for title and excerpt
    - Integrate MediaUploader for images and videos
    - Implement save as draft functionality
    - Implement publish functionality
    - Load existing article data for editing mode
    - Call articleService.createArticle() or updateArticle()
    - Show success/error messages
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 9.4 Wire up article creation flow




    - Create route for new article ("/admin/articles/new")
    - Create route for editing article ("/admin/articles/edit/:id")
    - Add "New Article" button in ArticleList
    - Navigate to editor on button click
    - _Requirements: 6.1, 7.1, 7.2_
  
  - [x] 9.5 Implement article deletion





    - Add delete button in ArticleList
    - Show confirmation dialog before deletion
    - Call articleService.deleteArticle()
    - Refresh article list after deletion
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 10. Implement comment moderation




  - [x] 10.1 Create CommentModeration component


    - Fetch all comments using commentService.getAllComments()
    - Display comments with article title context
    - Add delete button for each comment
    - Implement delete confirmation dialog
    - Call commentService.deleteComment()
    - Show success message after deletion
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x] 10.2 Add comment moderation route




    - Create route ("/admin/comments")
    - Add navigation link in AdminLayout
    - _Requirements: 9.1_

- [x] 11. Implement routing and navigation




  - [x] 11.1 Set up React Router


    - Configure BrowserRouter in App.jsx
    - Define public routes (/, /article/:id)
    - Define admin routes (/admin/login, /admin/*)
    - Wrap admin routes with ProtectedRoute
    - _Requirements: 1.1, 1.4, 5.1_
  
  - [x] 11.2 Add navigation between pages


    - Implement article card click navigation
    - Add back to home link in article page
    - Add navigation links in admin sidebar
    - _Requirements: 1.4_

- [x] 12. Style application with Tailwind CSS





  - [x] 12.1 Configure Tailwind dark mode


    - Set darkMode to 'class' in tailwind.config.js
    - Define custom color palette for light and dark themes
    - _Requirements: 10.2, 10.3_
  

  - [x] 12.2 Style public pages

    - Apply responsive layout styles to ArticleFeed
    - Style ArticleCard with hover effects
    - Style ArticleView with readable typography
    - Style CommentSection with form and comment list
    - Apply theme colors to all components
    - _Requirements: 10.3, 11.1, 11.2, 11.3, 11.5_
  

  - [x] 12.3 Style admin pages

    - Style AdminLogin form
    - Style AdminLayout sidebar and navigation
    - Style ArticleList table/cards
    - Style ArticleEditor form and rich text editor
    - Style CommentModeration list
    - _Requirements: 10.3, 11.1, 11.2, 11.3_
  

  - [x] 12.4 Ensure responsive design


    - Test all pages on desktop (1024px+)
    - Test all pages on tablet (768px-1023px)
    - Test all pages on mobile (<768px)
    - Adjust layouts and navigation for touch interfaces
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 13. Add error handling and user feedback





  - [x] 13.1 Create ErrorBoundary component


    - Implement error boundary with fallback UI
    - Log errors to console
    - Add reload button in error state
    - _Requirements: 12.6_
  
  - [x] 13.2 Add error handling to all service calls


    - Wrap service calls in try-catch blocks
    - Display user-friendly error messages
    - Show retry options for network errors
    - Handle authentication errors with redirect
    - _Requirements: 5.4, 12.6_
  
  - [x] 13.3 Add loading states


    - Show LoadingSpinner during data fetching
    - Disable buttons during form submission
    - Show upload progress for media files
    - _Requirements: 1.2, 6.5_
  
  - [x] 13.4 Add success feedback


    - Show success messages after article creation/update
    - Show success messages after comment submission
    - Show success messages after deletion operations
    - _Requirements: 4.4, 6.6, 7.5, 9.5_

- [-] 14. Implement media handling utilities





  - [ ] 14.1 Create media validation functions
    - Validate file types (images: jpg, png, gif, webp; videos: mp4, webm)
    - Validate file sizes (max 10MB for images, 50MB for videos)
    - Return user-friendly error messages for invalid files
    - _Requirements: 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 14.2 Create media display components


    - Build responsive image component with lazy loading
    - Build video player component with controls
    - Handle both uploaded and URL-referenced media
    - _Requirements: 2.6, 11.1, 11.2, 11.3_

- [ ] 15. Add utility functions and helpers
  - [ ] 15.1 Create date formatting utilities
    - Write function to format timestamps (e.g., "January 15, 2024")
    - Write function for relative time (e.g., "2 hours ago")
    - _Requirements: 1.3, 4.5_
  
  - [ ] 15.2 Create text formatting utilities
    - Write function to generate article excerpts
    - Write function to strip HTML tags for plain text
    - Write function to truncate text with ellipsis
    - _Requirements: 1.3, 3.5_

- [ ] 16. Set up environment configuration
  - [ ] 16.1 Configure environment variables
    - Ensure .env file has VITE_PUBLIC_SUPABASE_URL
    - Ensure .env file has VITE_SUPABASE_PUBLIC_ANON_KEY
    - Add .env to .gitignore
    - Create .env.example template
    - _Requirements: 12.1_
  
  - [ ] 16.2 Configure Vite build settings
    - Set up production build configuration
    - Enable minification and tree-shaking
    - Configure source maps for debugging
    - _Requirements: 12.1_

- [ ] 17. Create admin user in Supabase
  - [ ] 17.1 Set up admin authentication
    - Create admin user in Supabase Auth dashboard
    - Test login with admin credentials
    - Verify admin can access protected routes
    - _Requirements: 5.1, 5.2, 5.3_

- [ ]* 18. Testing and quality assurance
  - [ ]* 18.1 Write unit tests for services
    - Test articleService CRUD operations
    - Test commentService operations
    - Test authService authentication flow
    - Test ttsService speech functions
    - _Requirements: All_
  
  - [ ]* 18.2 Write component tests
    - Test ArticleFeed renders articles correctly
    - Test CommentSection submits comments
    - Test ThemeToggle switches themes
    - Test AudioReader controls playback
    - Test ArticleEditor saves articles
    - _Requirements: All_
  
  - [ ]* 18.3 Perform integration testing
    - Test complete article creation and publishing flow
    - Test comment submission and display flow
    - Test admin authentication and authorization
    - Test theme persistence across navigation
    - _Requirements: All_
  
  - [ ]* 18.4 Test responsive design
    - Test all pages on different screen sizes
    - Verify mobile navigation works correctly
    - Check touch interactions on mobile devices
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ]* 18.5 Perform accessibility testing
    - Test keyboard navigation
    - Verify screen reader compatibility
    - Check color contrast ratios
    - Validate ARIA labels and roles
    - _Requirements: 3.1, 10.3, 11.5_

- [ ] 19. Final integration and polish
  - [ ] 19.1 Test complete user journeys
    - Test reader flow: browse → read article → play audio → comment
    - Test admin flow: login → create article → publish → moderate comments
    - Verify all features work together seamlessly
    - _Requirements: All_
  
  - [ ] 19.2 Optimize performance
    - Implement code splitting for admin routes
    - Add image lazy loading
    - Optimize bundle size
    - Test loading times
    - _Requirements: 11.5_
  
  - [ ] 19.3 Final styling and UX polish
    - Review all pages for visual consistency
    - Add smooth transitions and animations
    - Ensure all interactive elements have hover/focus states
    - Verify theme colors are applied consistently
    - _Requirements: 10.3, 11.5_
