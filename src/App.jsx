import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/lib/useAppStore';

// Pages
import Onboarding from '@/pages/Onboarding.jsx';
import Layout from '@/components/Layout.jsx';
import Dashboard from '@/pages/Dashboard.jsx';
import WorkoutHome from '@/pages/workout/WorkoutHome.jsx';
import RoutineBuilder from '@/pages/workout/RoutineBuilder.jsx';
import ActiveWorkout from '@/pages/workout/ActiveWorkout.jsx';
import ExerciseLibraryPage from '@/pages/workout/ExerciseLibraryPage.jsx';
import Nutrition from '@/pages/Nutrition.jsx';
import Progress from '@/pages/Progress.jsx';
import Profile from '@/pages/Profile.jsx';

function AppRoutes() {
  const { onboarded } = useApp();

  if (!onboarded) {
    return (
      <Routes>
        <Route path="*" element={<Onboarding />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/workout" element={<WorkoutHome />} />
      </Route>
      <Route path="/workout/routine/:id" element={<RoutineBuilder />} />
      <Route path="/workout/active/:routineId" element={<ActiveWorkout />} />
      <Route path="/workout/library" element={<ExerciseLibraryPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <AppProvider>
          <AppRoutes />
          <Toaster />
        </AppProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;