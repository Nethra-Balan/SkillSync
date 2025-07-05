import { Route, Routes, Navigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Mentorship from "./pages/Mentorship/Mentorship";
import Resources from "./pages/Resources/Resources";
import DiscussionForum from "./pages/DiscussionForum/DiscussionForum";
import Quiz from "./pages/Quiz/Quiz";
import Navbar from "./components/Navbar/Navbar";
import "./App.module.css";

function App() {
  const user = localStorage.getItem("token");

  return (
    <div className="app">
      <Routes>
        {user ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mentorship" element={<Mentorship />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/forum" element={<DiscussionForum />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
