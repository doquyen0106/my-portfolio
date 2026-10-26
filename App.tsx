import React, { useState, useEffect } from 'react';
import {
  User,
  Code2,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
  Download,
  Copy,
  Check,
  Sun,
  Moon,
  Menu,
  X,
  Send,
  Edit3,
  FileCode,
  Sparkles,
  Award,
  ChevronRight,
  Terminal,
  Layers,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { initialPortfolioData, PortfolioData, SkillItem } from './data/portfolioData';
import { generateSingleHtml } from './utils/generateSingleHtml';

export default function App() {
  const [data, setData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialPortfolioData;
      }
    }
    return initialPortfolioData;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeSkillCategory, setActiveSkillCategory] = useState<string>('all');
  const [timelineTab, setTimelineTab] = useState<'experience' | 'education'>('experience');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Sync theme to root class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Save changes to localStorage
  const handleSaveData = (newData: PortfolioData) => {
    setData(newData);
    localStorage.setItem('portfolio_data', JSON.stringify(newData));
    setShowEditModal(false);
  };

  const handleResetData = () => {
    setData(initialPortfolioData);
    localStorage.removeItem('portfolio_data');
    setShowEditModal(false);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(data.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const downloadSingleHtml = () => {
    const htmlContent = generateSingleHtml(data);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio_${data.personal.fullName.toLowerCase().replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyHtmlCode = () => {
    const htmlContent = generateSingleHtml(data);
    navigator.clipboard.writeText(htmlContent);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    
    // Create mailto link as fallback
    const mailto = `mailto:${data.personal.email}?subject=${encodeURIComponent(
      contactForm.subject || 'Liên hệ từ Portfolio'
    )}&body=${encodeURIComponent(
      `Họ tên: ${contactForm.name}\nEmail: ${contactForm.email}\n\nNội dung:\n${contactForm.message}`
    )}`;
    
    setTimeout(() => {
      window.location.href = mailto;
    }, 1200);
  };

  // Filter skills
  const filteredSkills = activeSkillCategory === 'all'
    ? data.skills
    : data.skills.filter(s => s.category === activeSkillCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Top Banner indicating single-file HTML feature */}
      <div className="bg-indigo-600 text-white text-xs sm:text-sm py-2 px-4 shadow-sm flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Trang Portfolio được đóng gói đầy đủ: xem trực tiếp hoặc tải ngay file HTML duy nhất (kèm CSS & JS).</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setShowExportModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white font-medium px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Xem / Tải file HTML</span>
            </button>
            <a 
              href="/portfolio.html" 
              target="_blank" 
              rel="noreferrer"
              className="hidden md:inline-flex bg-indigo-900/60 hover:bg-indigo-900 text-white font-medium px-2.5 py-1 rounded text-xs items-center gap-1 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Mở portfolio.html</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <a href="#about" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 dark:text-white group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-extrabold shadow-sm group-hover:scale-105 transition-transform">
              {data.personal.fullName.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="leading-tight tracking-tight">{data.personal.fullName}</span>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {data.personal.status}
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Giới thiệu</a>
            <a href="#skills" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Kỹ năng</a>
            <a href="#experience" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Kinh nghiệm & Học vấn</a>
            <a href="#projects" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Dự án</a>
            <a href="#contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Liên hệ</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Chuyển chế độ sáng / tối"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setShowEditModal(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
              title="Chỉnh sửa thông tin hồ sơ của bạn"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa hồ sơ</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải HTML Độc lập</span>
            </button>

            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Liên hệ</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 dark:text-slate-200 font-medium"
            >
              Giới thiệu bản thân
            </a>
            <a 
              href="#skills" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 dark:text-slate-200 font-medium"
            >
              Kỹ năng & Chuyên môn
            </a>
            <a 
              href="#experience" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 dark:text-slate-200 font-medium"
            >
              Kinh nghiệm & Học vấn
            </a>
            <a 
              href="#projects" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 dark:text-slate-200 font-medium"
            >
              Dự án nổi bật
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 dark:text-slate-200 font-medium"
            >
              Thông tin liên hệ
            </a>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowEditModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                <Edit3 className="w-4 h-4" />
                Chỉnh sửa thông tin hồ sơ
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowExportModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold"
              >
                <Download className="w-4 h-4" />
                Xuất file HTML đơn lẻ
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* HERO / GIỚI THIỆU BẢN THÂN (ABOUT ME) */}
        <section id="about" className="py-16 sm:py-24 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Text & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>{data.personal.status}</span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                    {data.personal.fullName}
                  </h1>
                  <p className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                    {data.personal.title}
                  </p>
                </div>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  {data.personal.bio}
                </p>

                {/* Key stats row */}
                <div className="grid grid-cols-3 gap-4 pt-2 pb-2 border-y border-slate-200 dark:border-slate-800/80">
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                      {data.personal.yearsOfExperience}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Năm kinh nghiệm
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                      {data.personal.completedProjects}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Dự án hoàn thành
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                      {data.personal.satisfactionRate}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Hài lòng đánh giá
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Liên hệ trao đổi</span>
                  </a>

                  <button
                    onClick={copyEmail}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Đã sao chép email!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-400" />
                        <span>Sao chép email</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowExportModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-indigo-500" />
                    <span>Tải file HTML duy nhất</span>
                  </button>
                </div>

                {/* Social Quick Links */}
                <div className="flex items-center gap-3 pt-2 text-slate-500 dark:text-slate-400 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider">Kết nối:</span>
                  <a
                    href={data.personal.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={data.personal.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${data.personal.email}`}
                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                    title="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <span className="text-xs flex items-center gap-1 text-slate-400 ml-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {data.personal.location}
                  </span>
                </div>
              </div>

              {/* Right Column: Visual Avatar Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative">
                  {/* Decorative frame backdrop */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-md opacity-25 dark:opacity-40 -rotate-1"></div>
                  
                  <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200 dark:border-slate-800 shadow-xl">
                    <img
                      src={data.personal.avatarUrl}
                      alt={data.personal.fullName}
                      className="w-72 h-72 sm:w-80 sm:h-80 object-cover rounded-2xl shadow-inner"
                      onError={(e) => {
                        // Fallback avatar if external image fails
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80";
                      }}
                    />

                    {/* Floating Info Badge 1 */}
                    <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 shadow-lg flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Chuyên môn chính</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">Clean & Modern Web</div>
                      </div>
                    </div>

                    {/* Floating Info Badge 2 */}
                    <div className="absolute -top-3 -left-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl py-2 px-3 shadow-lg flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{data.personal.location}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* PHẦN KỸ NĂNG (SKILLS) */}
        <section id="skills" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
                Kỹ năng & Chuyên môn
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Hệ Thống Năng Lực Kỹ Thuật
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                Được tôi luyện qua hàng nghìn giờ viết mã, thiết kế kiến trúc và giải quyết các bài toán sản phẩm thực tế.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {[
                { id: 'all', label: 'Tất cả kỹ năng' },
                { id: 'frontend', label: 'Frontend' },
                { id: 'backend', label: 'Backend & Database' },
                { id: 'tools', label: 'Công cụ & DevOps' },
                { id: 'softskills', label: 'Kỹ năng mềm' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveSkillCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeSkillCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Skill Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSkills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          {skill.name}
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden my-3">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-700"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>

                    {skill.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {skill.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center text-[11px] text-slate-400">
                    <span className="capitalize font-medium">
                      Phân loại: {skill.category === 'softskills' ? 'Kỹ năng mềm' : skill.category}
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {skill.level >= 90 ? 'Chuyên gia' : skill.level >= 80 ? 'Thành thạo' : 'Vững vàng'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Skills Summary Bar */}
            <div className="mt-12 p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Sẵn sàng thích ứng công nghệ mới
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Ngoài các kỹ năng trên, tôi luôn chủ động học hỏi nhanh các thư viện, framework và công nghệ theo yêu cầu dự án.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowEditModal(true)}
                className="shrink-0 text-xs font-semibold px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                + Bổ sung thêm kỹ năng của bạn
              </button>
            </div>

          </div>
        </section>

        {/* PHẦN HỌC VẤN & KINH NGHIỆM (EDUCATION & EXPERIENCE) */}
        <section id="experience" className="py-20 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
                Lộ trình phát triển
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Học Vấn & Kinh Nghiệm
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                Dấu mốc học tập, chứng chỉ chuyên nghiệp và các cột mốc cống hiến tại các tổ chức.
              </p>
            </div>

            {/* Switch Tabs */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700">
                <button
                  onClick={() => setTimelineTab('experience')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    timelineTab === 'experience'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Kinh nghiệm làm việc ({data.experiences.length})</span>
                </button>
                <button
                  onClick={() => setTimelineTab('education')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    timelineTab === 'education'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Học vấn & Chứng chỉ ({data.education.length})</span>
                </button>
              </div>
            </div>

            {/* Timeline View */}
            {timelineTab === 'experience' ? (
              <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 sm:before:left-8 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-12 sm:pl-18 group">
                    {/* Timeline Node */}
                    <div className="absolute left-2.5 sm:left-5.5 top-1.5 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-slate-50 dark:border-slate-950 bg-indigo-600 shadow-sm group-hover:scale-125 transition-transform"></div>

                    {/* Card */}
                    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                          {exp.period}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {exp.location}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                        {exp.role}
                      </h3>
                      
                      <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-indigo-500" />
                        <span>{exp.company}</span>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        {exp.description}
                      </p>

                      {/* Accomplishments */}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <div className="mb-4 space-y-2">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Thành tích nổi bật:
                          </div>
                          <ul className="space-y-1.5">
                            {exp.highlights.map((item, i) => (
                              <li key={i} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                        {exp.techStack.map((tech, i) => (
                          <span
                            key={i}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 sm:before:left-8 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {data.education.map((edu) => (
                  <div key={edu.id} className="relative pl-12 sm:pl-18 group">
                    {/* Timeline Node */}
                    <div className="absolute left-2.5 sm:left-5.5 top-1.5 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-slate-50 dark:border-slate-950 bg-violet-600 shadow-sm group-hover:scale-125 transition-transform"></div>

                    {/* Card */}
                    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-violet-50 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 border border-violet-200/50 dark:border-violet-800/50">
                          {edu.period}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {edu.location}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                        {edu.degree}
                      </h3>

                      <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-violet-500" />
                        <span>{edu.institution}</span>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                        {edu.description}
                      </p>

                      {edu.honors && (
                        <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                          <Award className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>{edu.honors}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* PHẦN DỰ ÁN NỔI BẬT (PROJECTS) */}
        <section id="projects" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
                Sản phẩm thực tế
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Dự Án Tiêu Biểu
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                Một số dự án tiêu biểu minh chứng cho chất lượng mã nguồn và sự đầu tư tỉ mỉ về trải nghiệm.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-lg hover:border-indigo-500 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        <Terminal className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50">
                        Hoàn thành
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {proj.title}
                    </h3>

                    <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                      {proj.subtitle}
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {proj.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {proj.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Xem chi tiết</span>
                        </a>
                      )}
                      {proj.github && (
                        <a
                          href={proj.github}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Source Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* PHẦN THÔNG TIN LIÊN HỆ (CONTACT) */}
        <section id="contact" className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
                Hợp tác & Kết nối
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Thông Tin Liên Hệ
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
                Tôi luôn sẵn sàng đón nhận cơ hội nghề nghiệp, dự án freelance hoặc đơn giản là trò chuyện về công nghệ.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Direct Contact Info Cards */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Email Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-indigo-400 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Hộp thư điện tử</div>
                      <a href={`mailto:${data.personal.email}`} className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600">
                        {data.personal.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
                    title="Sao chép email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Phone / Zalo */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-indigo-400 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Số điện thoại / Zalo</div>
                      <a href={`tel:${data.personal.phone.replace(/[^0-9+]/g, '')}`} className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-emerald-600">
                        {data.personal.phone}
                      </a>
                    </div>
                  </div>
                  <a
                    href={`tel:${data.personal.phone.replace(/[^0-9+]/g, '')}`}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                    title="Gọi ngay"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Location */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Khu vực làm việc</div>
                    <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {data.personal.location}
                    </div>
                    <div className="text-xs text-slate-500">Sẵn sàng làm việc Remote hoặc On-site</div>
                  </div>
                </div>

                {/* Social Channels */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm">
                  <div className="text-xs text-slate-400 font-medium mb-3">Mạng xã hội & Kênh cá nhân</div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={data.personal.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-all"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                    <a
                      href={data.personal.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-all"
                    >
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Right Column: Contact Message Form */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/80 shadow-lg">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Gửi tin nhắn trực tiếp
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Điền biểu mẫu bên dưới, tôi sẽ phản hồi lại bạn trong vòng 24 giờ làm việc.
                  </p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Họ và tên của bạn <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Ví dụ: Hoàng Minh Tuấn"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Địa chỉ Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="tuan.hoang@company.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Chủ đề dự án / Mục đích liên hệ
                    </label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="Trao đổi dự án phát triển website..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Nội dung tin nhắn <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Mô tả tóm tắt nhu cầu, thời gian hoặc câu hỏi của bạn..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Gửi tin nhắn trực tiếp</span>
                  </button>

                  {contactSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        <strong>Tin nhắn đã được tiếp nhận!</strong> Hệ thống đang chuyển tiếp thông tin tới hòm thư cá nhân của bạn.
                      </div>
                    </div>
                  )}
                </form>
              </div>

            </div>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-center text-sm text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-xs sm:text-sm">
            <a href="#about" className="hover:text-indigo-600 transition-colors">Giới thiệu</a>
            <a href="#skills" className="hover:text-indigo-600 transition-colors">Kỹ năng</a>
            <a href="#experience" className="hover:text-indigo-600 transition-colors">Kinh nghiệm & Học vấn</a>
            <a href="#projects" className="hover:text-indigo-600 transition-colors">Dự án</a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors">Liên hệ</a>
            <button onClick={() => setShowExportModal(true)} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer">
              Xuất file HTML đơn lẻ
            </button>
          </div>

          <p className="text-xs">
            © {new Date().getFullYear()} Bản quyền thuộc về <strong className="text-slate-800 dark:text-slate-200">{data.personal.fullName}</strong>. Thiết kế hiện đại, tinh giản và đóng gói hoàn chỉnh trong 1 file HTML duy nhất.
          </p>
        </div>
      </footer>

      {/* MODAL: XUẤT FILE HTML DUY NHẤT (SINGLE-FILE HTML EXPORT) */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Xuất File HTML Duy Nhất (Single File)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bao gồm toàn bộ HTML + CSS + JavaScript trong một file độc lập, không cần cài đặt Node.js.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 space-y-2">
                <p className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Đã tạo mã nguồn HTML độc lập hoàn chỉnh!
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-xs">
                  File này hoạt động trực tiếp khi nhấp đúp mở bằng bất kỳ trình duyệt nào (Chrome, Edge, Safari, Firefox), có sẵn chế độ sáng/tối, bộ lọc kỹ năng, form liên hệ, responsive trên điện thoại.
                </p>
              </div>

              {/* Code Preview box */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-mono">portfolio.html</span>
                  <span>100% Standalone (Tự túc CSS & JS)</span>
                </div>
                <div className="p-3 bg-slate-900 text-slate-300 font-mono text-xs rounded-xl overflow-x-auto max-h-48 border border-slate-800 select-all">
                  <pre>{generateSingleHtml(data).slice(0, 800)}...{"\n"}/* và toàn bộ các phần Giới thiệu, Kỹ năng, Học vấn, Kinh nghiệm, Liên hệ */</pre>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={downloadSingleHtml}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải file portfolio.html về máy</span>
                </button>

                <button
                  onClick={copyHtmlCode}
                  className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {copiedHtml ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600">Đã sao chép mã nguồn!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>Sao chép toàn bộ mã HTML</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <a
                  href="/portfolio.html"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Mở trực tiếp file /portfolio.html tĩnh trong tab mới
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: CHỈNH SỬA THÔNG TIN NHANH (LIVE PROFILE EDITOR) */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Tùy Chỉnh Thông Tin Hồ Sơ
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Cập nhật họ tên, tiêu đề, email, số điện thoại... Thông tin sẽ đồng bộ vào cả giao diện và file HTML tải về.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveData(data);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={data.personal.fullName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personal: { ...data.personal, fullName: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chức danh / Nghề nghiệp
                  </label>
                  <input
                    type="text"
                    value={data.personal.title}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personal: { ...data.personal, title: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.personal.email}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personal: { ...data.personal, email: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={data.personal.phone}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personal: { ...data.personal, phone: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Địa điểm làm việc
                  </label>
                  <input
                    type="text"
                    value={data.personal.location}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personal: { ...data.personal, location: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Trạng thái công việc
                  </label>
                  <input
                    type="text"
                    value={data.personal.status}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personal: { ...data.personal, status: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Đoạn văn Giới thiệu bản thân (Bio)
                </label>
                <textarea
                  rows={3}
                  value={data.personal.bio}
                  onChange={(e) =>
                    setData({
                      ...data,
                      personal: { ...data.personal, bio: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Khôi phục mẫu mặc định
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
