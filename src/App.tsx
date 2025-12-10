import "./App.css";
import Navbar from "./components/common/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile/Profile";
import { CreateThemeForm } from "./pages/CreateThemeForm.tsx";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Threads from "./pages/Thread/Threads";
import ThemeStatistic from "./pages/ThemeStatictic";
import LikedThreads from "./pages/Profile/LikedThreads";
import Users from "./pages/Profile/Users";
import Thread from "./pages/Thread/Thread";
import {EditThemeForm} from "./pages/EditThemeForm.tsx";
import EditProfile from "./pages/Profile/EditProfileForm.tsx";
import GameStats from "./pages/Profile/GameStats.tsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-base-200 w-screen">
        <Navbar />

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profilis/mano" element={<Profile />}>
              <Route path="megstami-irasai" element={<LikedThreads />} />
              <Route path="naudotoju-sarasas" element={<Users />} />
              <Route path="redaguoti" element={<EditProfile/>} />
              <Route path="zaidimu-statistika" element={<GameStats/>} />
            </Route>
            <Route path="/profilis/:userId" element={<Profile />}>
              <Route path="zaidimu-statistika" element={<GameStats/>} />
            </Route>
            <Route path="/temos-kurimo-forma" element={<CreateThemeForm />} />
            <Route path="/temos-redagavimo-forma/:themeId" element={<EditThemeForm />} />
            <Route path="/prisijungimas" element={<Login />} />
            <Route path="/registracija" element={<Registration />} />
            <Route path="/irasai/:themeId" element={<Threads />} />
            <Route path="/irasai/:themeId/:postId" element={<Thread />}>
              <Route path="redaguoti"/>
            </Route>
            <Route path="/temos-statistika/:themeId" element={<ThemeStatistic />}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
