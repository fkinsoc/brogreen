import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  AlertTriangle,
  FileText,
  UploadCloud,
  Settings,
  Search,
  Bell,
  Menu,
  LogOut,
  Activity,
  X,
  Layers,
  ChevronRight,
  ShieldAlert,
  RefreshCw,
  Compass,
} from 'lucide-react';
import Chatbot from './Chatbot';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../lib/i18n';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { staticParcels } from '../lib/data';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, isApproved, loading, refreshUser } = useAuth();
  const { t } = useTranslation();
  const notificationRef = useRef<HTMLDivElement>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchingParcels = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return staticParcels.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.landOwner.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.surveyNumber.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      navigate(`/parcels?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUser();
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const content = document.getElementById('main-content');
      if (!content) {
        return;
      }
      const originalHeight = content.style.height;
      const originalOverflow = content.style.overflow;
      content.style.height = 'max-content';
      content.style.overflow = 'visible';

      const canvas = await html2canvas(content, {
        scale: 2,
        backgroundColor: '#0d130f',
        logging: false,
        useCORS: true,
        windowHeight: content.scrollHeight,
      });

      content.style.height = originalHeight;
      content.style.overflow = originalOverflow;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('bro-foresee-cadastral-report.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navigation = [
    { name: t('nav.dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('nav.parcels'), href: '/parcels', icon: FileText },
    { name: t('nav.gisMap'), href: '/map', icon: MapIcon },
    { name: t('nav.alerts'), href: '/alerts', icon: AlertTriangle },
    { name: t('nav.farmerPortal'), href: '/farmer-portal', icon: Compass },
    { name: t('nav.upload'), href: '/upload', icon: UploadCloud },
    { name: t('nav.reports'), href: '/reports', icon: FileText },
    { name: t('nav.logs'), href: '/logs', icon: Activity },
    { name: t('nav.settings'), href: '/settings', icon: Settings },
  ];

  const notifications = [
    {
      id: 1,
      text: 'Survey delay flagged on Parcel LA-MH-2035 (Bhosari)',
      time: '12m ago',
      urgent: true,
    },
    {
      id: 2,
      text: 'Batch sync complete for 18 parcels in Chinchwad',
      time: '1h ago',
      urgent: false,
    },
    {
      id: 3,
      text: 'Hearing of objections scheduled for Sector 4',
      time: '3h ago',
      urgent: false,
    },
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0d130f] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#386b4e] border-t-transparent animate-spin" />
      </div>
    );
  }

  // PENDING APPROVAL GATE: Restrict operational access until admin approves
  if (!isApproved) {
    return (
      <div className="min-h-screen bg-[#0d1410] text-[#eff3ef] flex flex-col font-sans selection:bg-[#2e543e]">
        {/* Minimal Top Brand Bar */}
        <div className="h-14 border-b border-[#1f2e24] px-6 flex items-center justify-between bg-[#121c16]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xs bg-[#1f4230] flex items-center justify-center text-[#d9a86c] border border-[#2b5941]">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm text-white">Bro Foresee</span>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Link
              to="/farmer-portal"
              className="text-xs text-[#8cd0a5] hover:underline"
            >
              {t('auth.openPortal')}
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-xs text-[#8a9e91] hover:text-white bg-[#19261e] border border-[#263a2c] rounded-xs transition-colors"
            >
              {t('nav.signOut')}
            </button>
          </div>
        </div>

        {/* Pending Screen Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-xs bg-[#141d17] border border-[#233127] p-6 sm:p-8 text-center space-y-5">
            <div className="w-12 h-12 rounded-xs bg-[#2c2217] border border-[#523e25] text-[#dca364] flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-xs text-[11px] font-semibold bg-[#2c2217] text-[#e0a86b] border border-[#523e25] mb-2 uppercase tracking-wide">
                {t('auth.pendingTitle')}
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {t('auth.pendingHeading')}
              </h2>
              <p className="text-xs text-[#8ca193] mt-2 leading-relaxed">
                {t('auth.pendingDesc')}
              </p>
            </div>

            <div className="bg-[#0e1611] border border-[#1e2f24] rounded-xs p-3.5 text-xs text-left space-y-1.5 font-mono">
              <div className="flex justify-between text-[#82998a]">
                <span>{t('auth.email')}:</span>
                <span className="text-white font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between text-[#82998a]">
                <span>Account ID:</span>
                <span className="text-[#a4c7b2] truncate max-w-[200px]">{user.uid}</span>
              </div>
              <div className="flex justify-between text-[#82998a]">
                <span>Clearance Level:</span>
                <span className="text-[#dfa364]">Unapproved (Standard Applicant)</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="w-full py-2 px-4 rounded-xs bg-[#1f4230] hover:bg-[#28573f] text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? t('auth.verifyingStatus') : t('auth.checkApproval')}</span>
              </button>

              <div className="p-3 bg-[#17251c] border border-[#273e2f] rounded-xs text-xs text-[#95b0a0] leading-relaxed">
                {t('auth.farmerNotice')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentNav = navigation.find(
    (n) => location.pathname === n.href || (n.href !== '/' && location.pathname.startsWith(n.href))
  );

  return (
    <div className="min-h-screen bg-[#0d130f] text-[#eff3ef] flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#111c15] text-[#dce4de] border-r border-[#1e2f24] flex flex-col transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static transition-transform duration-200 ease-out`}
      >
        {/* Brand header */}
        <div className="h-14 px-5 border-b border-[#1e2f24] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xs bg-[#1f4230] flex items-center justify-center text-[#d9a86c] border border-[#2b5941]">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight text-white leading-none">
                {t('nav.brand')}
              </div>
              <div className="text-[10px] text-[#869b8d] font-normal mt-0.5">
                {t('nav.brandSubtitle')}
              </div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-[#869b8d] hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`px-3 py-2 text-xs font-medium rounded-xs flex items-center gap-2.5 transition-colors ${
                  isActive
                    ? 'bg-[#1e3829] text-white font-semibold'
                    : 'text-[#9cb0a2] hover:text-white hover:bg-[#15251b]'
                }`}
              >
                <item.icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-[#82c499]' : 'text-[#728779]'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer profile & controls */}
        <div className="p-3 border-t border-[#1e2f24] space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-xs bg-[#0d1610] border border-[#1a2b20]">
            <div className="w-7 h-7 rounded-xs bg-[#543d2c] text-[#f2ede4] flex items-center justify-center text-xs font-medium uppercase font-mono">
              {user.email ? user.email[0] : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{user.email}</div>
              <div className="text-[10px] text-[#7d9485] truncate">
                {role === 'admin'
                  ? t('nav.administrator')
                  : role === 'farmer'
                  ? t('nav.landowner')
                  : t('nav.fieldOperator')}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title={t('nav.signOut')}
              className="p-1 text-[#7d9485] hover:text-white hover:bg-[#1a2b20] rounded-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-[#697d70]">
            <Link to="/legal" className="hover:text-white transition-colors underline">
              {t('nav.termsPrivacy')}
            </Link>
            <span>{t('nav.version')}</span>
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 sm:px-6 bg-[#121a15] border-b border-[#212c24] transition-colors">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-[#95a398] hover:text-white"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-1.5 text-xs text-[#95a398]">
              <span className="hidden sm:inline">{t('header.project')}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50 hidden sm:inline" />
              <span className="font-semibold text-[#eff3ef]">
                {currentNav ? currentNav.name : t('nav.dashboard')}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Functional Search Input with Dropdown */}
            <div className="relative w-52 sm:w-64" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit}>
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#828c84]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  placeholder={t('header.searchPlaceholder')}
                  className="w-full pl-8 pr-2.5 py-1 text-xs bg-[#18231c] border border-[#28372d] rounded-xs text-[#eff3ef] placeholder-[#828c84] focus:outline-none focus:border-[#37634b]"
                />
              </form>

              {/* Instant Search Results Dropdown */}
              {showSearchResults && searchQuery.trim().length > 0 && (
                <div className="absolute right-0 left-0 mt-1 bg-[#141d17] border border-[#27382c] rounded-xs overflow-hidden z-50 divide-y divide-[#1b271f]">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-[#7e9587] uppercase tracking-wider bg-[#0f1712] flex items-center justify-between">
                    <span>{t('header.matchingParcels')} ({matchingParcels.length})</span>
                    <button
                      onClick={() => setShowSearchResults(false)}
                      className="text-[#657a6d] hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    {matchingParcels.length === 0 ? (
                      <div className="p-3 text-xs text-[#7e9587] text-center">
                        {t('header.noMatches')} "{searchQuery}"
                      </div>
                    ) : (
                      matchingParcels.slice(0, 5).map((p) => (
                        <Link
                          key={p.id}
                          to={`/parcels/${p.id}`}
                          onClick={() => {
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                          className="p-2.5 block hover:bg-[#1a261f] transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-white">
                              {p.id} · Survey {p.surveyNumber}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded-xs border font-medium ${
                                p.riskLevel === 'High'
                                  ? 'bg-[#2c1d1a] text-[#e47668] border-[#4d2823]'
                                  : p.riskLevel === 'Medium'
                                  ? 'bg-[#2c2217] text-[#dfa364] border-[#4d3a24]'
                                  : 'bg-[#18261e] text-[#7fba96] border-[#274031]'
                              }`}
                            >
                              {p.riskLevel}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#869b8e] mt-0.5 truncate">
                            {p.landOwner} · {p.village} ({p.areaAcres} Acres)
                          </div>
                        </Link>
                      ))
                    )}
                  </div>

                  {matchingParcels.length > 0 && (
                    <div className="p-2 bg-[#0f1712] text-center">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs text-[#82c499] hover:underline font-medium cursor-pointer"
                      >
                        {t('header.viewInRegistry')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Notifications Menu */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 text-[#95a398] hover:text-white hover:bg-[#1a251f] rounded-xs transition-colors"
                aria-label="View notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#a63529]" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-[#151e18] border border-[#28372d] rounded-xs overflow-hidden z-50">
                  <div className="p-3 border-b border-[#212c24] flex items-center justify-between bg-[#111813]">
                    <div className="text-xs font-semibold text-[#eff3ef]">
                      {t('header.notifications')}
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[#828c84] hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="max-h-[260px] overflow-y-auto divide-y divide-[#1d2720]">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 hover:bg-[#19241e] transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                              notif.urgent ? 'bg-[#a63529]' : 'bg-[#1b6338]'
                            }`}
                          />
                          <div>
                            <p className="text-xs text-[#dce2dd] leading-snug">
                              {notif.text}
                            </p>
                            <p className="text-[10px] text-[#7b857d] mt-1 tabular-nums">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 border-t border-[#212c24] bg-[#111813] text-center">
                    <Link
                      to="/alerts"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-medium text-[#82c499] hover:underline"
                    >
                      {t('header.allWarnings')}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Export PDF Button */}
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-3 py-1.5 text-xs font-semibold bg-[#1f4230] hover:bg-[#173325] text-white rounded-xs transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
            >
              {isExporting ? t('nav.exporting') : t('nav.exportReport')}
            </button>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
          <div className="h-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <Chatbot />
    </div>
  );
}
