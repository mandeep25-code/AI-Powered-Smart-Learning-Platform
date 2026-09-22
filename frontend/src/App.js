import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import DashboardSelector from "@/pages/DashboardSelector";
import LearningHub from "@/pages/LearningHub";
import CourseDetail from "@/pages/CourseDetail";
import CareerTracks from "@/pages/CareerTracks";
import TrackDetail from "@/pages/TrackDetail";
import Roadmaps from "@/pages/Roadmaps";
import AITutor from "@/pages/AITutor";
import Quizzes from "@/pages/Quizzes";
import Flashcards from "@/pages/Flashcards";
import StudyPlanner from "@/pages/StudyPlanner";
import CodingArena from "@/pages/CodingArena";
import PlacementHub from "@/pages/PlacementHub";
import AptitudeArena from "@/pages/AptitudeArena";
import InterviewPrep from "@/pages/InterviewPrep";
import ResumeStudio from "@/pages/ResumeStudio";
import FuturePath from "@/pages/FuturePath";
import ResourceVault from "@/pages/ResourceVault";
import QuickRev from "@/pages/QuickRev";
import PremiumVault from "@/pages/PremiumVault";
import InstructorStudio from "@/pages/InstructorStudio";
import Achievements from "@/pages/Achievements";
import Analytics from "@/pages/Analytics";
import Profile from "@/pages/Profile";
import CareerLaunchpad from "@/pages/CareerLaunchpad";
import CodeLab from "@/pages/CodeLab";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/design-selection" element={<DashboardSelector />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<LearningHub />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="tracks" element={<CareerTracks />} />
            <Route path="tracks/:slug" element={<TrackDetail />} />
            <Route path="roadmaps" element={<Roadmaps />} />
            <Route path="tutor" element={<AITutor />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="planner" element={<StudyPlanner />} />
            <Route path="coding" element={<CodingArena />} />
            <Route path="code-lab" element={<CodeLab />} />
            <Route path="placement" element={<PlacementHub />} />
            <Route path="aptitude" element={<AptitudeArena />} />
            <Route path="interview" element={<InterviewPrep />} />
            <Route path="resume" element={<ResumeStudio />} />
            <Route path="future" element={<FuturePath />} />
            <Route path="resources" element={<ResourceVault />} />
            <Route path="launchpad" element={<CareerLaunchpad />} />
            <Route path="quickrev" element={<QuickRev />} />
            <Route path="premium" element={<PremiumVault />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="instructor"
              element={
                <ProtectedRoute role="teacher">
                  <InstructorStudio />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
