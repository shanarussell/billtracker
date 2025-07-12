import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Bills', path: '/bill-management', icon: 'Receipt' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login-screen');
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback to localStorage logout
      localStorage.removeItem('authToken');
      navigate('/login-screen');
      setIsUserMenuOpen(false);
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-elevation-1">
      <div className="flex h-16 items-center px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Icon name="Receipt" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              BillTracker Pro
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-8 space-x-1">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={isActiveRoute(item.path) ? "default" : "ghost"}
              onClick={() => handleNavigation(item.path)}
              iconName={item.icon}
              iconPosition="left"
              iconSize={18}
              className="transition-colors duration-200"
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center space-x-4">
          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleUserMenu}
              iconName="User"
              iconPosition="left"
              iconSize={18}
              className="transition-colors duration-200"
            >
              <span className="hidden sm:inline">Account</span>
            </Button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover shadow-elevation-2 z-50">
                <div className="py-1">
                  <div className="px-3 py-2 text-sm text-muted-foreground border-b">
                    john.doe@example.com
                  </div>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      // Handle profile navigation
                    }}
                    className="flex w-full items-center px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                  >
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            iconName={isMobileMenuOpen ? "X" : "Menu"}
            iconSize={20}
            className="md:hidden transition-colors duration-200"
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-card">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActiveRoute(item.path) ? "default" : "ghost"}
                onClick={() => handleNavigation(item.path)}
                iconName={item.icon}
                iconPosition="left"
                iconSize={18}
                fullWidth
                className="justify-start transition-colors duration-200"
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;