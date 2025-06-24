import styles from "./Home.module.css";

const Home = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<button className={styles.white_btn} onClick={() => window.location.href = "/profile"}>
					Profile
				</button>
				<button className={styles.white_btn} onClick={() => window.location.href = "/mentorship"}>
					Connect
				</button>
				<button className={styles.white_btn} onClick={() => window.location.href = "/resources"}>
					Resources
				</button>
				<button className={styles.white_btn} onClick={() => window.location.href = "/forum"}>
					Discussions
				</button>
				<button className={styles.white_btn} onClick={() => window.location.href = "/quiz"}>
					Quiz
				</button>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
				
			</nav>
		</div>
	);
};

export default Home;