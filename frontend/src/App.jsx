import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Pantry from './pages/Pantry';
import RecipeGenerator from './pages/RecipeGenerator';
import MyRecipes from './pages/MyRecipes';
import RecipeDetail from './pages/RecipeDetail';
import ShoppingList from './pages/ShoppingList';
import Settings from './pages/Settings';
import MealPlanner from './pages/MealPlanner';

function App() {
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7429/ingest/860c1e93-04d7-494b-8f7c-ce92bf59e777',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4d38f5'},body:JSON.stringify({sessionId:'4d38f5',runId:'pre-fix',hypothesisId:'H5',location:'src/App.jsx:useEffect',message:'App mounted instrumentation ping',data:{path:window.location.pathname},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Placeholder routes - to be implemented */}
          <Route path="/pantry" element={<ProtectedRoute><Pantry /></ProtectedRoute>} />
          <Route path="/generate" element={<ProtectedRoute><RecipeGenerator /></ProtectedRoute>} />
          <Route path="/recipes" element={<ProtectedRoute><MyRecipes /></ProtectedRoute>} />
          <Route path="/recipes/:id" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
          <Route path="/meal-plan" element={<ProtectedRoute><MealPlanner /></ProtectedRoute>} />
          <Route path="/shopping-list" element={<ProtectedRoute><ShoppingList /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#111827',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

// Temporary Coming Soon component
const ComingSoon = ({ page }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{page}</h1>
        <p className="text-gray-600">Coming soon...</p>
      </div>
    </div>
  );
};

export default App;
