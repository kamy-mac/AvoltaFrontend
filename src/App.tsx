import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { lazyLoad } from './utils/lazyLoad';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SuperAdminRoute from './components/auth/SuperAdminRoute';

// Lazy load pages
const HomePage = lazyLoad(() => import('./pages/HomePage'));
const LoginPage = lazyLoad(() => import('./pages/LoginPage'));
const NewsPage = lazyLoad(() => import('./pages/NewsPage'));
const NewsDetailPage = lazyLoad(() => import('./pages/NewsDetailPage'));
const ContactPage = lazyLoad(() => import('./pages/ContactPage'));
const BacAirportPage = lazyLoad(() => import('./pages/BacAirportPage'));
const AdminDashboard = lazyLoad(() => import('./pages/admin/AdminDashboard'));

// Lazy load admin pages
const CreatePublication = lazyLoad(() => import('./pages/admin/CreatePublication'));
const EditPublication = lazyLoad(() => import('./pages/admin/EditPublication'));
const Publications = lazyLoad(() => import('./pages/admin/Publications'));
const PendingPublications = lazyLoad(() => import('./pages/admin/PendingPublications'));
const Newsletter = lazyLoad(() => import('./pages/admin/Newsletter'));
const UserManagement = lazyLoad(() => import('./pages/admin/UserManagement'));

// Lazy load newsletter popup
const NewsletterPopup = lazy(() => import('./components/newsletter/NewsletterPopup'));

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/bac-airport" element={<BacAirportPage />} />
          {/* Add more routes as needed */}
          
          {/* Admin Routes */}
          {/* Protected routes for admin */}  
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }>
            <Route path="create" element={<CreatePublication />} />
            <Route path="publications" element={<Publications />} />
            <Route path="publications/edit/:id" element={<EditPublication />} />
            <Route path="pending" element={
              <SuperAdminRoute>
                <PendingPublications />
              </SuperAdminRoute>
            } />
            <Route path="newsletter" element={<Newsletter />} />
            <Route path="users" element={
              <SuperAdminRoute>
                <UserManagement />
              </SuperAdminRoute>
            } />
          </Route>
        </Routes>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <NewsletterPopup />
      </Suspense>
    </div>
  );
}

export default App;