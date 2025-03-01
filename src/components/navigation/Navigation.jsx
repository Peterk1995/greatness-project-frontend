import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Sword, 
  Map, 
  Calendar, 
  Target, 
  Sun, 
  Moon, 
  Crown,
  Menu,
  X,
  Star,
  Trophy,
  LogOut
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext'

const Navigation = ({ user, onLogout, onShowCampaignModal }) => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  // Inspirational conquest quotes for dark mode
  const conquestQuotes = [
    "Fortune favors the bold.",
    "Conquer your destiny.",
    "Glory awaits those who dare.",
    "Today's discipline, tomorrow's victory."
  ];
  
  // Randomly select a quote
  const randomQuote = conquestQuotes[Math.floor(Math.random() * conquestQuotes.length)];
  
  return (
    <header className={`
      relative z-50 transition-all duration-500 ease-in-out
      ${isDarkMode 
        ? 'bg-gradient-to-r from-purple-900 via-purple-800 to-red-900 text-white border-b-2 border-gold-DEFAULT' 
        : 'bg-gradient-to-r from-amber-50 to-amber-100 text-gray-800 border-b-2 border-bronze-300'}
    `}>
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        {/* Upper navbar with logo and user info */}
        <div className="px-6 py-3 flex justify-between items-center">
          {/* Logo area */}
          <Link to="/app" className={`
            flex items-center space-x-3 group transition-all duration-300
            ${isDarkMode ? 'hover:text-gold-DEFAULT' : 'hover:text-bronze-500'}
          `}>
            <div className="relative">
              <Shield className={`
                w-8 h-8 transition-all duration-500
                ${isDarkMode 
                  ? 'text-gold-DEFAULT group-hover:text-gold-light' 
                  : 'text-bronze-500 group-hover:text-bronze-600'}
              `} />
              <Crown className={`
                absolute -top-1 -right-1 w-4 h-4 transition-all duration-500
                ${isDarkMode 
                  ? 'text-red-400' 
                  : 'text-bronze-600'}
              `} />
            </div>
            <div>
              <div className={`
                font-bold text-xl tracking-wider 
                ${isDarkMode ? 'text-gold-DEFAULT' : 'text-bronze-600'}
              `}>
                ΑΛΕΞΑΝΔΡΟΣ
              </div>
              <div className={`
                text-xs tracking-wide
                ${isDarkMode ? 'text-gold-light/80' : 'text-bronze-500/90'}
              `}>
                IMPERIAL COMMAND CENTER
              </div>
            </div>
          </Link>
          
          {/* User info and theme toggle */}
          <div className="flex items-center space-x-4">
            {isDarkMode && (
              <div className="hidden lg:block text-gold-light italic text-sm font-semibold animate-pulse mr-4">
                {randomQuote}
              </div>
            )}
            
            <div className={`
              px-4 py-2 rounded-full 
              ${isDarkMode 
                ? 'bg-purple-800/50 text-gold-light border border-gold-DEFAULT/30' 
                : 'bg-amber-200/50 text-bronze-700'}
            `}>
              <span className="text-sm">Hail, <span className="font-semibold">{user?.username || 'Conqueror'}</span></span>
            </div>
            
            <button 
              onClick={toggleDarkMode}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${isDarkMode 
                  ? 'bg-gradient-to-br from-purple-800 to-red-800 hover:from-purple-700 hover:to-red-700 text-gold-DEFAULT ring-2 ring-gold-DEFAULT/50' 
                  : 'bg-amber-200 hover:bg-amber-300 text-bronze-700'}
              `}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={onLogout}
              className={`
                px-4 py-2 rounded-md flex items-center transition-all duration-300
                ${isDarkMode 
                  ? 'bg-red-900/50 hover:bg-red-900/70 text-red-300 border border-red-700' 
                  : 'bg-red-100 hover:bg-red-200 text-red-800 border border-red-300'}
              `}
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              <span className="text-sm font-medium">Retreat</span>
            </button>
          </div>
        </div>
        
        {/* Lower navbar with navigation buttons */}
        <div className={`
          flex justify-center px-6 py-2 
          ${isDarkMode ? 'bg-gradient-to-r from-purple-950 via-black/40 to-purple-950' : 'bg-amber-200/50'}
        `}>
          <nav className={`
            flex items-center justify-center gap-1 px-4 rounded-full
            ${isDarkMode 
              ? 'bg-gradient-to-r from-purple-900/70 via-red-900/70 to-purple-900/70 border border-gold-DEFAULT/30' 
              : 'bg-amber-300/50 border border-bronze-300'}
          `}>
            {[
              { label: "Battles", icon: Calendar, to: "/tasks" },
              { label: "Campaigns", icon: Sword, to: "/campaigns" },
              { label: "Agora", icon: Target, to: "/agora" },
              { label: "Plan", icon: Map, isButton: true, onClick: onShowCampaignModal }
            ].map((item, idx) => {
              // Common classes
              const baseClasses = `
                relative flex items-center justify-center py-2 px-4 
                transition-all duration-300 mx-1
              `;
              
              // Classes based on dark/light mode
              const themeClasses = isDarkMode
                ? 'text-gold-light hover:text-gold-DEFAULT'
                : 'text-bronze-700 hover:text-bronze-900';
              
              // Element content
              const content = (
                <>
                  <item.icon className="w-5 h-5 mr-1.5" />
                  <span className="text-sm font-medium">{item.label}</span>
                  
                  {/* Decorative elements - different for dark/light mode */}
                  {isDarkMode ? (
                    // Dark mode: star elements on hover
                    <div className="absolute -bottom-1 left-0 w-full flex justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Star className="w-2 h-2 text-gold-DEFAULT" fill="#FFD700" />
                      <Star className="w-3 h-3 text-gold-DEFAULT" fill="#FFD700" />
                      <Star className="w-2 h-2 text-gold-DEFAULT" fill="#FFD700" />
                    </div>
                  ) : (
                    // Light mode: Greek key pattern decorative element
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-3/4 h-1 bg-bronze-400 transition-all duration-300 
                                      mask bg-[length:10px_10px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMEgxMFYySDBWMFoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0wIDJIMlYxMEgwVjJaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMyAySDEwVjRIM1YyWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTggNEgxMFYxMEg4VjRaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMyA0SDVWMTBIM1Y0WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==')]"></div>
                  )}
                </>
              );
              
              // Return either link or button
              return item.isButton ? (
                <button 
                  key={idx}
                  onClick={item.onClick}
                  className={`group ${baseClasses} ${themeClasses}`}
                >
                  {content}
                </button>
              ) : (
                <Link 
                  key={idx}
                  to={item.to}
                  className={`group ${baseClasses} ${themeClasses}`}
                >
                  {content}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Dark mode decoration - subtle star field */}
        {isDarkMode && (
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="star-field">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Navbar */}
      <div className="md:hidden">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Logo section */}
          <Link to="/app" className="flex items-center">
            <Shield className={isDarkMode ? 'text-gold-DEFAULT' : 'text-bronze-600'} size={24} />
            <span className={`ml-2 font-bold ${isDarkMode ? 'text-gold-DEFAULT' : 'text-bronze-700'}`}>
              ΑΛΕΞΑΝΔΡΟΣ
            </span>
          </Link>
          
          {/* Mobile menu controls */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleDarkMode}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${isDarkMode 
                  ? 'bg-purple-800 text-gold-DEFAULT ring-1 ring-gold-DEFAULT/50' 
                  : 'bg-amber-200 text-bronze-700'}
              `}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <button 
              onClick={toggleMobileMenu}
              className={`
                w-8 h-8 flex items-center justify-center rounded
                ${isDarkMode 
                  ? 'bg-purple-800 text-gold-light' 
                  : 'bg-amber-200 text-bronze-700'}
              `}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu drawer */}
        <div className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? 'max-h-96' : 'max-h-0'}
          ${isDarkMode ? 'bg-gradient-to-b from-purple-900 to-red-900' : 'bg-amber-100'}
        `}>
          <div className="px-4 py-2 space-y-1">
            {/* Inspirational quote in dark mode */}
            {isDarkMode && (
              <div className="py-2 text-center text-gold-light italic text-sm font-medium border-b border-gold-DEFAULT/20 mb-2">
                {randomQuote}
              </div>
            )}
          
            {[
              { label: "Battles", icon: Calendar, to: "/tasks" },
              { label: "Campaigns", icon: Sword, to: "/campaigns" },
              { label: "Agora", icon: Target, to: "/agora" },
              { label: "Plan", icon: Map, isButton: true, onClick: onShowCampaignModal }
            ].map((item, idx) => {
              const content = (
                <div className="flex items-center px-3 py-2">
                  <item.icon className={`
                    w-5 h-5 mr-3
                    ${isDarkMode ? 'text-gold-DEFAULT' : 'text-bronze-600'}
                  `} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
              
              return item.isButton ? (
                <button 
                  key={idx}
                  onClick={item.onClick}
                  className={`
                    w-full rounded-md
                    ${isDarkMode 
                      ? 'text-gold-light hover:bg-purple-800/50 border border-gold-DEFAULT/20' 
                      : 'text-bronze-700 hover:bg-amber-200/70'}
                  `}
                >
                  {content}
                </button>
              ) : (
                <Link 
                  key={idx}
                  to={item.to}
                  className={`
                    block rounded-md
                    ${isDarkMode 
                      ? 'text-gold-light hover:bg-purple-800/50 border border-gold-DEFAULT/20' 
                      : 'text-bronze-700 hover:bg-amber-200/70'}
                  `}
                >
                  {content}
                </Link>
              );
            })}
            
            {/* Logout button */}
            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gold-DEFAULT/20">
              <button 
                onClick={onLogout}
                className={`
                  w-full rounded-md px-3 py-2 text-sm font-medium flex items-center
                  ${isDarkMode 
                    ? 'text-red-300 hover:bg-red-900/50 border border-red-700/30' 
                    : 'text-red-600 hover:bg-red-100'}
                `}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Retreat from Battle
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;