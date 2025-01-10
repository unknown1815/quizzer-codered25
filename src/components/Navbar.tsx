import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Avatar from './Avatar';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();
        if (data) {
          setUserName(data.name);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* Animated Quizzer Logo */}
              <Link
                to="/"
                className="text-xl font-bold text-white animate-fadeIn"
              >
                Quizzer
              </Link>
            </div>
            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-white hover:text-gray-400"
              >
                Home
              </Link>
              <Link
                to="/quiz"
                className="inline-flex items-center px-1 pt-1 text-white hover:text-gray-400"
              >
                Quizzer
              </Link>
              <Link
                to="/history"
                className="inline-flex items-center px-1 pt-1 text-white hover:text-gray-400"
              >
                History
              </Link>
              <Link
                to="/resources"
                className="inline-flex items-center px-1 pt-1 text-white hover:text-gray-400"
              >
                Resources
              </Link>
              <Link
                to="/pdf-chat"
                className="inline-flex items-center px-1 pt-1 text-white hover:text-gray-400"
              >
                PDF Chat
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative">
              {/* Profile Avatar */}
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded-full"
              >
                <Avatar name={userName} size="sm" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-white ring-opacity-5">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-600">
                    {userName}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-black">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 text-base font-medium text-white hover:text-gray-400 hover:bg-gray-800"
            >
              Home
            </Link>
            <Link
              to="/quiz"
              className="block pl-3 pr-4 py-2 text-base font-medium text-white hover:text-gray-400 hover:bg-gray-800"
            >
              Quizzer
            </Link>
            <Link
              to="/history"
              className="block pl-3 pr-4 py-2 text-base font-medium text-white hover:text-gray-400 hover:bg-gray-800"
            >
              History
            </Link>
            <Link
              to="/resources"
              className="block pl-3 pr-4 py-2 text-base font-medium text-white hover:text-gray-400 hover:bg-gray-800"
            >
              Resources
            </Link>
            <Link
              to="/pdf-chat"
              className="block pl-3 pr-4 py-2 text-base font-medium text-white hover:text-gray-400 hover:bg-gray-800"
            >
              PDF Chat
            </Link>
            <div className="pl-3 pr-4 py-2 text-base font-medium text-white">
              {userName}
            </div>
            <button
              onClick={handleLogout}
              className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-white hover:text-gray-400 hover:bg-gray-800"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
