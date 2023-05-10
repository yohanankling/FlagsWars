import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../components/pages/loginPage';
import { HomePage } from '../components/pages/homePage';
import { RegisterPage } from '../components/pages/registerPage';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { FriendsPage } from '../components/pages/friendsPage';
import GamePage from '../components/pages/gamePage';
import OfflineGamePage from '../components/pages/offlineGamePage';
import { WelcomePage } from '../components/pages/welcomePage';
import { ProfilePage } from '../components/pages/profilePage';
import { ContactPage } from '../components/pages/contactPage';
import { BetaPage } from '../components/pages/BetaPage';
import { TutorialPage } from '../components/pages/tutorialPage';

export const AppRouter = () => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
  });

  return (
    <BrowserRouter>
      <Routes>
        {!currentUser ? (
          <>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/beta" element={<BetaPage />} />
            <Route path="/game/:id" element={<GamePage />} />
            <Route path="/offline" element={<OfflineGamePage />} />
            <Route path="/tutorial" element={<TutorialPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};
