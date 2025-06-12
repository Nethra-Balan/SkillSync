import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import loginImage from "../../assets/images/loginConnect.png";


const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:5000/api/auth/login";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", res.data);
			localStorage.setItem("userId", res.userId);
			window.location = "/";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Login</h1>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <p className={styles.error_line}>⚠️{error}</p>}
						<button type="submit" className={styles.green_btn}>
							Login
						</button>
					</form>
				</div>
				<div className={styles.right}>
					<div className={styles.title}>
						<h1>Skill<span>Sync</span></h1>
						<h2>Connect. Sync. Grow.</h2>
						<img src={loginImage} alt="Connect" />
					</div>
					<div className={styles.down}>
						<h1>Don't have an account?</h1>
						<Link to="/signup">
							<button type="button" className={styles.white_btn}>
								Signup
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;