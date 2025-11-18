import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Home } from './pages/Home';
import { Article } from './pages/Article';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { CommentModeration } from './components/admin/CommentModeration';
import { ArticleList } from './components/admin/ArticleList';
import { ArticleEditor } from './components/admin/ArticleEditor';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/article/:id" element={<Article />} />
              
              {/* Admin Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Admin Routes - Protected */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                {/* Default admin page - Article List */}
                <Route index element={<ArticleList />} />
                
                {/* Article management routes */}
                <Route path="articles/new" element={<ArticleEditor />} />
                <Route path="articles/edit/:id" element={<ArticleEditor />} />
                
                {/* Comment moderation route */}
                <Route path="comments" element={<CommentModeration />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
