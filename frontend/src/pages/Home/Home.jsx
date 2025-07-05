import Navbar from "../../components/Navbar/Navbar";
import HeaderSection from "../../components/HeaderSection/HeaderSection";
import FeatureSection from "../../components/FeatureSection/FeatureSection";
import styles from "./Home.module.css";

const Home = () => {
	return (
		<div className={styles.main_container}>
			<Navbar />

			<HeaderSection />

			<FeatureSection
				number={1}
				title="Discussions"
				description="Engage with peers and experts in meaningful conversations that help you grow your skills and network."
				image="https://source.unsplash.com/600x400/?resources,books"
				link="/forum"
			/>

			<FeatureSection
				number={2}
				title="Resources"
				description="Access curated learning materials and guides tailored to your SkillSync journey."
				image="https://source.unsplash.com/600x400/?resources,books"
				reverse
				link="/resources"
			/>

			<FeatureSection
				number={3}
				title="Quiz"
				description="Test your knowledge and track your progress in real time with interactive quizzes."
				image="https://source.unsplash.com/600x400/?resources,books"
				link="/quiz"
			/>

		</div>
	);
};

export default Home;
