# SkillSync 🚀


SkillSync is a full-stack MERN web application designed to help learners and professionals **connect, collaborate, and grow**. It offers mentorship opportunities, curated learning resources, community discussions, and AI-powered quizzes using Gemini API to enhance skill development.

---

## ✨ Features

- **🔗 SkillShare** – Connect with mentors and peers
- **📚 SkillStack** – Curated learning resources
- **💬 SkillSpace** – Interactive community discussions
- **🧠 SkillStorm** – AI-powered quizzes (via Gemini API)
- **🧑‍💼 Profile Management** – Customizable user profiles
- **📱 Responsive UI** – Works across all screen sizes

---

## 🧑‍💻 Tech Stack

| Layer          | Tech Stack                           |
|----------------|--------------------------------------|
| Frontend       | React.js
| Backend        | Node.js, Express.js                  |
| Database       | MongoDB                              |
| AI Integration | Gemini API                           |

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js v16+
- MongoDB (local or Atlas)
- Gemini API Key

### 🛠️ Installation

1. **Clone the repo**

```bash
git clone https://github.com/Nethra-Balan/skillsync.git
cd skillsync
```

2. **Install frontend dependencies**

```bash
cd frontend
npm install
```

3. **Install backend dependencies**

```bash
cd ../backend
npm install
```
4. **Configure environment variables**


Create a .env file in the server/ folder:
```bash
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
VITE_GEMINI_API_KEY=<your-gemini-api-key>
```

5. **Run the app**
```bash
# Start backend
cd backend
npm start

# Start frontend (in a separate terminal)
cd ../frontend
npm run dev
```

🔗 **Access the app**

Visit: http://localhost:5173

---

## 🚀 Project Preview


**Home**  
  - The landing page offers a welcoming introduction to the platform, highlighting its purpose, core features, and how users can get started. It serves as the central hub from where users can navigate to various areas like learning, collaboration, and personalization.

**SkillShare**  
  - This section enables users to connect with mentors and peers in a knowledge-sharing environment. Whether you're looking to teach, learn, or collaborate, SkillShare fosters a supportive ecosystem where ideas and skills are exchanged freely.

**SkillStack**  
  - SkillStack houses a curated collection of educational resources, including articles, videos, and tutorials. Users can explore various topics tailored to their skill level, making it an ideal space for continuous self-paced learning and upskilling.

**SkillSpace**  
  - An interactive community forum designed for thoughtful discussion and engagement. Users can start conversations, ask questions, and contribute answers across a wide range of topics, building a vibrant and collaborative knowledge base.

**SkillStorm**  
  - Powered by the Gemini API, SkillStorm generates personalized, AI-driven quizzes to help users reinforce what they’ve learned. It's an engaging way to test comprehension, identify knowledge gaps, and challenge oneself in real time.

**Profile**  
  - This area allows users to create and manage personalized profiles. Users can update their information, track their learning progress, save favorite resources, and set preferences to tailor their experience on the platform.

**Auth**  
  - Secure user authentication is handled using JSON Web Tokens (JWT), ensuring that protected routes are only accessible to verified users. This mechanism supports a smooth login process while maintaining the integrity and privacy of user data.

---

## 🤝 Contributing

Contributions of any kind are appreciated.

### 📌 How to Contribute

1. **Fork** the repository  
2. **Create a new branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit your changes**

   ```bash
   git commit -m "Add: your feature name"
   ```

4. **Push to your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** and describe your changes clearly

---

## 🧪 Suggestions

Here are a few ways you can contribute:

- Add new components or pages  
- Improve styling or responsiveness  
- Optimize performance or security  
- Suggest new features or integrations  

---

## ⭐️ Show Your Support

If you liked this project, don’t forget to **star** the repository!

Have feedback or questions? Feel free to **open an issue**.
