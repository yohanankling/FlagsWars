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
            <Route path="/game/:id" element={<GamePage />} />
            <Route path="/offline" element={<OfflineGamePage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};
