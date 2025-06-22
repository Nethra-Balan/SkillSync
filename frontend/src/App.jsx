import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Mentorship from "./pages/Mentorship/Mentorship";
import Resources from "./pages/Resources/Resources";
import DiscussionForum from "./pages/DiscussionForum/DiscussionForum";
import Navbar from "./components/Navbar/Navbar";
import "./App.module.css";

function App() {
	const user = localStorage.getItem("token");
	// const location = useLocation();

	// // Pages where Navbar should be hidden
	// const hideNavbarPaths = ["/login", "/signup"];
	// const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

	return (
		<div className="app">

			<Routes>
				{user && <Route path="/" exact element={<Home />} />}
				<Route path="/signup" exact element={<Signup />} />
				<Route path="/login" exact element={<Login />} />
				<Route path="/" element={<Navigate replace to="/login" />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/mentorship" element={<Mentorship />} />
				<Route path="/resources" element={<Resources />} />
				<Route path="/forum" element={<DiscussionForum />} />
			</Routes>
		</div>
	);
}

export default App;
