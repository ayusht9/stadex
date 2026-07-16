import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { RiLoader4Line } from 'react-icons/ri';

const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Matches = lazy(() => import('./pages/Matches').then(module => ({ default: module.Matches })));
const Stadiums = lazy(() => import('./pages/Stadiums').then(module => ({ default: module.Stadiums })));
const Translator = lazy(() => import('./pages/Translator').then(module => ({ default: module.Translator })));
const Help = lazy(() => import('./pages/Help').then(module => ({ default: module.Help })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 font-sans">
          <Navbar />
          <main>
            <Suspense fallback={
              <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
                <RiLoader4Line className="h-12 w-12 animate-spin text-primary" />
              </div>
            }>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/stadiums" element={<Stadiums />} />
                <Route path="/help" element={<Help />} />
                <Route path="/translate" element={<Translator />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
