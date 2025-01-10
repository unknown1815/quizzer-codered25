import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthGuard from './components/AuthGuard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Quiz from './components/Quiz';
import History from './pages/History';
import Resources from './pages/Resources';
import PdfChat from './pages/PdfChat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <>
                <Navbar />
                <Home />
              </>
            </AuthGuard>
          }
        />
        <Route
          path="/quiz"
          element={
            <AuthGuard>
              <>
                <Navbar />
                <Quiz />
              </>
            </AuthGuard>
          }
        />
        <Route
          path="/history"
          element={
            <AuthGuard>
              <>
                <Navbar />
                <History />
              </>
            </AuthGuard>
          }
        />
        <Route
          path="/resources"
          element={
            <AuthGuard>
              <>
                <Navbar />
                <Resources />
              </>
            </AuthGuard>
          }
        />
        <Route
          path="/pdf-chat"
          element={
            <AuthGuard>
              <>
                <Navbar />
                <PdfChat />
              </>
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;