import Navbar from "../../components/Navbar/Navbar";
import styles from "./Home.module.css";

const Home = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<div className={styles.main_container}>
			<Navbar />
		</div>
	);
};

export default Home;