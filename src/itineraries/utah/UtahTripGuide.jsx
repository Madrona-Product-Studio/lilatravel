/*
 * Utah Trip Guide - Iteration 1
 * 
 * WEATHER SYSTEM:
 * The app uses a hybrid weather approach for reliability:
 * 
 * 1. INSTANT LOAD: Fallback data (November averages) loads immediately
 * 2. BACKGROUND UPDATE: Live weather fetches after 2 seconds (non-blocking)
 * 3. GRACEFUL DEGRADATION: If live fetch fails, fallback data remains
 * 
 * This ensures the app ALWAYS loads quickly with relevant weather info,
 * while trying to get live data when possible.
 * 
 * Weather data includes:
 * - Zion National Park
 * - Bryce Canyon  
 * - Capitol Reef
 * - Springdale, UT
 * - Torrey, UT
 */

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Download, MessageCircle, X, CheckSquare } from 'lucide-react';

// Data
import { parkLocations, fallbackWeather } from './data/weatherConfig';

// Pages
import CoverPage from './pages/CoverPage';
import ItineraryOverview from './pages/ItineraryOverview';
import Day1 from './pages/Day1';
import Day2 from './pages/Day2';
import Day3 from './pages/Day3';
import Day4 from './pages/Day4';
import Day5 from './pages/Day5';
import Day6 from './pages/Day6';
import Day7 from './pages/Day7';
import Confirmations from './pages/Confirmations';
import PackingList from './pages/PackingList';
import QuickReference from './pages/QuickReference';

const UtahTripGuide = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);
  const [direction, setDirection] = useState('next');
  const [weather, setWeather] = useState({});
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [platform, setPlatform] = useState('unknown');
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const contentRef = useRef(null);

  // Check if app is already installed
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  // Detect platform for offline instructions
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setPlatform('ios');
    } else if (/android/i.test(userAgent)) {
      setPlatform('android');
    } else if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
      setPlatform('mac');
    } else {
      setPlatform('desktop');
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setIsServiceWorkerReady(true);
      });
    }
  }, []);

  // Listen for PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Handle install button click
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  // Handle offline mode info button click
  const handleOfflineModeClick = () => {
    setShowOfflineModal(true);
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setFeedbackSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('access_key', 'ff4efdd2-affd-4473-978e-01194e279da5');
      formData.append('subject', 'Utah Trip Guide - User Feedback');
      formData.append('message', feedbackText);
      formData.append('from_name', 'Utah Trip Guide User');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setFeedbackSubmitting(false);
        setFeedbackSubmitted(true);
        setTimeout(() => {
          setShowFeedbackModal(false);
          setFeedbackText('');
          setFeedbackSubmitted(false);
        }, 2000);
      } else {
        setFeedbackSubmitting(false);
        alert('Sorry, there was an error submitting your feedback. Please try again.');
      }
    } catch (error) {
      setFeedbackSubmitting(false);
      alert('Sorry, there was an error submitting your feedback. Please try again.');
    }
  };

  // Initialize with fallback weather data immediately
  useEffect(() => {
    setWeather(fallbackWeather);
  }, []);

  // Optionally try to fetch live weather after app loads (non-blocking)
  useEffect(() => {
    const fetchLiveWeather = async () => {
      try {
        const weatherData = {};
        let successCount = 0;
        
        const fetchPromises = Object.entries(parkLocations).map(async ([key, location]) => {
          try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/Denver&forecast_days=1`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            
            if (response.ok) {
              const data = await response.json();
              if (data.current && data.daily && data.current.temperature_2m !== undefined) {
                weatherData[key] = {
                  current: Math.round(data.current.temperature_2m),
                  high: Math.round(data.daily.temperature_2m_max[0]),
                  low: Math.round(data.daily.temperature_2m_min[0]),
                  weathercode: data.current.weather_code,
                  wind: Math.round(data.current.wind_speed_10m),
                  precipitation: data.daily.precipitation_probability_max[0] || 0
                };
                successCount++;
              }
            }
          } catch (err) {
            // silently fall back to default weather data
          }
        });

        await Promise.all(fetchPromises);
        
        if (successCount > 0) {
          setWeather(prev => ({ ...prev, ...weatherData }));
        }
      } catch (error) {
        // silently fall back to default weather data
      }
    };

    const timer = setTimeout(() => {
      fetchLiveWeather();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Helper function to navigate to a specific page with debouncing
  const goToPage = (pageIndex) => {
    if (pageIndex !== currentPage && !isTransitioning && pageIndex >= 0 && pageIndex < pages.length) {
      setDirection(pageIndex > currentPage ? 'next' : 'prev');
      setIsTransitioning(true);
      setCurrentPage(pageIndex);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Build the pages array from imported page components
  const pages = [
    CoverPage(),
    ItineraryOverview({ goToPage }),
    Day1(),
    Day2({ weather }),
    Day3({ weather }),
    Day4(),
    Day5({ weather }),
    Day6({ weather }),
    Day7(),
    Confirmations(),
    PackingList(),
    QuickReference(),
  ];

  // Scroll to top when page changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && currentPage > 0) {
        e.preventDefault();
        setDirection('prev');
        setCurrentPage(currentPage - 1);
      } else if (e.key === 'ArrowRight' && currentPage < pages.length - 1) {
        e.preventDefault();
        e.preventDefault();
        setCurrentPage(currentPage + 1);
      } else if (e.key === 'ArrowDown' && contentRef.current) {
        e.preventDefault();
        contentRef.current.scrollBy({ top: 100, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' && contentRef.current) {
        e.preventDefault();
        contentRef.current.scrollBy({ top: -100, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, pages.length]);

  const handleTouchStart = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) {
      setTouchStart(0);
      setTouchEnd(0);
      setTouchStartY(0);
      setTouchEndY(0);
      return;
    }

    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart - touchEnd;
    const distanceY = touchStartY - touchEndY;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY) * 1.5;
    const isLeftSwipe = distanceX > 50;
    const isRightSwipe = distanceX < -50;

    if (isHorizontalSwipe) {
      if (isLeftSwipe) {
        e.preventDefault();
        goToPage(currentPage + 1);
      } else if (isRightSwipe) {
        e.preventDefault();
        goToPage(currentPage - 1);
      }
    }

    setTouchStart(0);
    setTouchEnd(0);
    setTouchStartY(0);
    setTouchEndY(0);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const page = pages[currentPage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-blush via-sandstone to-sea-glass/30 flex items-center justify-center p-4 pb-20">
      <div className="w-full max-w-md">
        {/* Main Card with animations */}
        <div 
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            animation: 'fadeIn 0.5s ease-in'
          }}
        >
          {/* Card Header with smooth transitions */}
          <div 
            className="bg-gradient-to-r from-sky-blue to-ocean-teal text-white p-6 transition-all duration-500"
            style={{
              animation: direction === 'next' ? 'slideInRight 0.4s ease-out' : 'slideInLeft 0.4s ease-out'
            }}
          >
            {page.type === 'cover' ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4 animate-bounce">
                  {page.icon}
                </div>
                <h1 className="text-4xl font-bold mb-2 animate-fadeIn">{page.title}</h1>
                <h2 className="text-2xl font-light mb-4 animate-fadeIn" style={{ animationDelay: '0.1s' }}>{page.subtitle}</h2>
                <p className="text-lg opacity-90 animate-fadeIn" style={{ animationDelay: '0.2s' }}>{page.date}</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {page.icon}
                  <h2 className="text-2xl font-bold">{page.title}</h2>
                </div>
                {page.subtitle && (
                  <p className="text-sm opacity-90 ml-11">{page.subtitle}</p>
                )}
              </div>
            )}
          </div>

          {/* Card Content with scroll container */}
          <div 
            ref={contentRef}
            className="p-6 overflow-y-auto transition-all duration-500" 
            style={{ 
              maxHeight: '500px',
              animation: direction === 'next' ? 'slideInRight 0.4s ease-out' : 'slideInLeft 0.4s ease-out'
            }}
          >
            {page.content}
          </div>

          {/* Card Footer - Navigation */}
          <div className="bg-gray-50 px-4 py-4 flex items-center justify-between border-t">
            <button
              onClick={(e) => { e.preventDefault(); prevPage(); }}
              disabled={currentPage === 0}
              className={`p-3 rounded-full transition-all duration-200 touch-manipulation flex items-center justify-center ${
                currentPage === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-sky-blue hover:bg-sandstone active:scale-95 active:bg-sandstone/60'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent', minWidth: '48px', minHeight: '48px' }}
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            <div className="flex items-center gap-1.5 px-2">
              {pages.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    idx === currentPage
                      ? 'w-6 bg-sky-blue'
                      : 'w-1.5 bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={(e) => { e.preventDefault(); nextPage(); }}
              disabled={currentPage === pages.length - 1}
              className={`p-3 rounded-full transition-all duration-200 touch-manipulation flex items-center justify-center ${
                currentPage === pages.length - 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-sky-blue hover:bg-sandstone active:scale-95 active:bg-sandstone/60'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent', minWidth: '48px', minHeight: '48px' }}
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>

          {/* Page Counter */}
          <div className="bg-gray-100 text-center py-2 text-xs text-gray-600">
            Page {currentPage + 1} of {pages.length}
          </div>
        </div>

        {/* Navigation Hint */}
        <div className="text-center mt-4 text-sm text-gray-600 animate-fadeIn">
          <p className="hidden md:block">Use arrow keys or click to navigate • ↑↓ to scroll</p>
          <p className="md:hidden">Swipe left or right to navigate</p>
        </div>
      </div>

      {/* Fixed Footer - Enhanced Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 py-3 z-50 shadow-lg">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between gap-2 relative">
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-xs transition-all duration-200 active:scale-95"
              title="Share feedback"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Feedback</span>
            </button>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="text-center">
                <a 
                  href="https://www.samadhitravel.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-pacific-slate tracking-wide hover:text-sky-blue transition-colors duration-200"
                >
                  Utah <span className="text-sky-blue">NP Trip</span>
                </a>
              </div>
            </div>

            {isInstalled ? (
              <button
                onClick={handleOfflineModeClick}
                className="flex items-center gap-1.5 px-3 py-2 bg-sea-glass hover:bg-opacity-80 text-ocean-teal rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95"
                title="View offline mode info"
              >
                <CheckSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Installed</span>
              </button>
            ) : isInstallable ? (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-2 bg-sky-blue hover:bg-[#5595EE] text-white rounded-lg font-medium text-xs transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                title="Install for offline use"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Install</span>
              </button>
            ) : (
              <button
                onClick={handleOfflineModeClick}
                className="flex items-center gap-1.5 px-3 py-2 bg-sea-glass hover:bg-opacity-80 text-pacific-slate rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95"
                title="How to install for offline use"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline text-[10px]">Offline Ready</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-fadeIn">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Share Your Feedback</h3>
              <button
                onClick={(e) => {
                  setShowFeedbackModal(false);
                  setFeedbackText('');
                  setFeedbackSubmitted(false);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {feedbackSubmitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-sea-glass rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="w-8 h-8 text-ocean-teal" />
                </div>
                <p className="text-lg font-semibold text-gray-900">Thank you!</p>
                <p className="text-sm text-gray-600 mt-2">Your feedback has been sent.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="p-5">
                <p className="text-sm text-gray-600 mb-4">
                  We'd love to hear your thoughts, suggestions, or report any issues you've encountered.
                </p>
                
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your feedback here..."
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-transparent text-sm"
                  disabled={feedbackSubmitting}
                />

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      setShowFeedbackModal(false);
                      setFeedbackText('');
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                    disabled={feedbackSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!feedbackText.trim() || feedbackSubmitting}
                    className="flex-1 px-4 py-2.5 bg-sky-blue hover:bg-[#5595EE] text-white rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sky-blue"
                  >
                    {feedbackSubmitting ? 'Sending...' : 'Send Feedback'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Offline Mode Modal */}
      {showOfflineModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-200 rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900">Offline Mode</h3>
              <button
                onClick={() => setShowOfflineModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5">
              <div className="bg-sea-glass rounded-lg p-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 ${isServiceWorkerReady ? 'bg-ocean-teal' : 'bg-yellow-500'}`}></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      {isServiceWorkerReady ? '✓ App is cached for offline use' : '⏳ Preparing offline mode...'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isServiceWorkerReady 
                        ? 'You can use this guide without internet connection.' 
                        : 'Please wait a moment while we cache the app.'}
                    </p>
                  </div>
                </div>
              </div>

              {platform === 'ios' ? (
                <>
                  <h4 className="font-bold text-gray-900 mb-3">📱 Install on iPhone/iPad</h4>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                      <span className="font-bold text-sky-blue text-lg">1</span>
                      <p className="text-sm text-gray-700">
                        Tap the <strong>Share</strong> button <span className="inline-block text-xl">⎋</span> at the bottom of Safari
                      </p>
                    </div>
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                      <span className="font-bold text-sky-blue text-lg">2</span>
                      <p className="text-sm text-gray-700">
                        Scroll down and tap <strong>"Add to Home Screen"</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                      <span className="font-bold text-sky-blue text-lg">3</span>
                      <p className="text-sm text-gray-700">
                        Tap <strong>"Add"</strong> in the top right
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-sky-blue/10 to-ocean-teal/10 rounded-lg p-4 border border-sky-blue/20">
                    <p className="text-sm text-gray-700">
                      <strong className="text-ocean-teal">💡 Pro Tip:</strong> Once installed, the app will open in full screen like a native app and work offline!
                    </p>
                  </div>
                </>
              ) : platform === 'android' ? (
                <>
                  <h4 className="font-bold text-gray-900 mb-3">📱 Install on Android</h4>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                      <span className="font-bold text-sky-blue text-lg">1</span>
                      <p className="text-sm text-gray-700">
                        Look for <strong>"Install app"</strong> banner at the bottom
                      </p>
                    </div>
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                      <span className="font-bold text-sky-blue text-lg">2</span>
                      <p className="text-sm text-gray-700">
                        Or tap the <strong>⋮ menu</strong> → <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                      <span className="font-bold text-sky-blue text-lg">3</span>
                      <p className="text-sm text-gray-700">
                        Tap <strong>"Install"</strong> to add to home screen
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-sky-blue/10 to-ocean-teal/10 rounded-lg p-4 border border-sky-blue/20">
                    <p className="text-sm text-gray-700">
                      <strong className="text-ocean-teal">💡 Pro Tip:</strong> The app will appear on your home screen and work offline!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-gray-900 mb-3">💻 Install on Desktop</h4>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                      <span className="font-bold text-sky-blue text-lg">1</span>
                      <p className="text-sm text-gray-700">
                        Look for the <strong>install icon</strong> <Download className="inline w-4 h-4" /> in your browser's address bar
                      </p>
                    </div>
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                      <span className="font-bold text-sky-blue text-lg">2</span>
                      <p className="text-sm text-gray-700">
                        Click it and choose <strong>"Install"</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                      <span className="font-bold text-sky-blue text-lg">3</span>
                      <p className="text-sm text-gray-700">
                        The app will open in its own window
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-sky-blue/10 to-ocean-teal/10 rounded-lg p-4 border border-sky-blue/20">
                    <p className="text-sm text-gray-700">
                      <strong className="text-ocean-teal">💡 Pro Tip:</strong> Works best in Chrome or Edge. The app will be available in your applications and work offline!
                    </p>
                  </div>
                </>
              )}

              <div className="mt-5 pt-5 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">✨ Benefits of Installing</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-ocean-teal mt-0.5">✓</span>
                    <span>Works completely offline - no internet needed</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-ocean-teal mt-0.5">✓</span>
                    <span>Faster loading with instant access</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-ocean-teal mt-0.5">✓</span>
                    <span>Full-screen experience without browser UI</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-ocean-teal mt-0.5">✓</span>
                    <span>Easy access from your home screen</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setShowOfflineModal(false)}
                className="w-full mt-5 px-4 py-3 bg-sky-blue hover:bg-[#5595EE] text-white rounded-lg font-medium text-sm transition-all"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { 
            opacity: 0;
            transform: translateX(30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInLeft {
          from { 
            opacity: 0;
            transform: translateX(-30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in;
        }

        .touch-manipulation {
          touch-action: manipulation;
          -webkit-user-select: none;
          user-select: none;
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }

        button:active {
          transition: all 0.1s ease;
        }

        .overflow-y-auto {
          overscroll-behavior-y: contain;
          -webkit-overflow-scrolling: touch;
        }

        body {
          overscroll-behavior-x: none;
          overflow-x: hidden;
        }

        .overflow-y-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default UtahTripGuide;
