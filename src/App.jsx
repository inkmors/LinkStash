import { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, AuthContext } from './contexts/AuthContext'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import ResetPassword from './components/Auth/ResetPassword'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NotFound from './pages/Error'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import { HeadProvider } from 'react-head'

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { currentUser, initialCheckDone } = useContext(AuthContext);

  if (!initialCheckDone) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  }

  if (currentUser === undefined) return null;

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !currentUser.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <HeadProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/" 
                element={
                    <Home />
                } 
              />
              
              <Route path="/admin" element={
              <PrivateRoute adminOnly>
                <AdminDashboard />
              </PrivateRoute>

            } />

              <Route path="/reset-password" element={
                <ResetPassword />
            } />

              <Route 
                path="*" 
                element={
                    <NotFound />
                } 
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HeadProvider>
  )
}

export default App