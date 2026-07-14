import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import ChatView from './pages/ChatView.jsx';
import FeaturesPage from './pages/FeaturesPage.jsx';
import HowItWorksPage from './pages/HowItWorksPage.jsx';
import FaqPage from './pages/FaqPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatView />
              </ProtectedRoute>
            } 
          />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/faq" element={<FaqPage />} />
          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
