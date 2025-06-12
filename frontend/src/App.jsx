import { Route, Routes, Navigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Mentorship from "./pages/Mentorship/Mentorship";

function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{user && <Route path="/" exact element={<Home />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="/mentorship" element={<Mentorship />} />
		</Routes>
	);
}

export default App;