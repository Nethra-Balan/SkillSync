import Navbar from "../../components/Navbar/Navbar";
import HeaderSection from "../../components/HeaderSection/HeaderSection";
import FeatureSection from "../../components/FeatureSection/FeatureSection";
import styles from "./Home.module.css";

import discussionsImage from "../../assets/images/discussion.webp";
import resourceImage from "../../assets/images/resource.jpg";
import quizImage from "../../assets/images/quiz.jpg";

const Home = () => {
	return (
		<div className={styles.main_container}>
			<Navbar />

			<HeaderSection />

			<FeatureSection
				number={1}
				title="Discussions"
				description="Engage with peers and experts in meaningful conversations that help you grow your skills and network."
				image={discussionsImage}
				link="/forum"
			/>

			<FeatureSection
				number={2}
				title="Resources"
				description="Access curated learning materials and guides tailored to your SkillSync journey."
				image={resourceImage}
				reverse
				link="/resources"
			/>

			<FeatureSection
				number={3}
				title="Quiz"
				description="Test your knowledge and track your progress in real time with interactive quizzes."
				image={quizImage}
				link="/quiz"
			/>

		</div>
	);
};

export default Home;
