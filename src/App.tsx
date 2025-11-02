import "./App.css";
import Navbar from "./components/common/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile/Profile";
import { Themes } from "./pages/Themes";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Threads from "./pages/Thread/Threads";
import ThemeStatistic from "./pages/ThemeStatictic";
import LikedThreads from "./pages/Profile/LikedThreads";
import Users from "./pages/Profile/Users";
import Thread from "./pages/Thread/Thread";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-base-200 w-screen">
        <Navbar />

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profilis" element={<Profile />}>
              <Route path="megstami-irasai" element={<LikedThreads />} />
              <Route path="naudotoju-sarasas" element={<Users />} />
            </Route>
            <Route path="/temos-forma" element={<Themes />} />
            <Route path="/prisijungimas" element={<Login />} />
            <Route path="/registracija" element={<Registration />} />
            <Route path="/irasai/:themeId" element={<Threads />} />
            <Route path="/irasai/:themeId/:postId" element={<Thread />} />
            <Route
              path="/temos-statistika/:themeId"
              element={<ThemeStatistic />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
