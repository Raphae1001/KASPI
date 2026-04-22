import React, { useState, useEffect, useCallback } from "react";
import {
  Menu,
  X,
  Instagram,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ChevronRight,
  Globe,
  Utensils,
  Users,
  Sun,
  Moon,
  Star,
  Leaf,
  Heart,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { translations } from "../data/translations";
import ReservationForm from "../components/ReservationForm";

const IMAGES = {
  hero: "https://raw.createusercontent.com/9ec26927-a86b-4100-945d-3ab59433ae5c/",
  spread:
    "https://raw.createusercontent.com/2492fdbc-1c14-463e-b596-fcde12178467/",
  evening:
    "https://raw.createusercontent.com/b4aec4a4-aaa0-4ca0-8453-de78774093e1/",
  dishes: [
    "https://raw.createusercontent.com/c26aa1e8-15ca-415c-838d-9ead848cade7/",
    "https://raw.createusercontent.com/0a21ed55-4ff2-4a35-8683-aacb593fed51/",
    "https://raw.createusercontent.com/15b7913b-ee03-419e-b51d-45c475f5a4a9/",
    "https://raw.createusercontent.com/5ce650c8-de51-43f1-b899-ac970837d9d6/",
    "https://raw.createusercontent.com/82362b9f-ea7b-4ec4-a430-9357c83dd84c/",
    "https://raw.createusercontent.com/2467c4d0-9faf-4820-a733-647e2fe99d54/",
  ],
};

const ATMOSPHERE_IMAGES = [IMAGES.hero, IMAGES.spread, IMAGES.evening];

export default function KaspiLandingPage() {
  const [lang, setLang] = useState("en");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "he" : "en"));
  }, []);

  const isRtl = t.dir === "rtl";

  const scrollToSection = useCallback((id) => {
    setIsMenuOpen(false);
    if (typeof document !== "undefined") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#FDFCF8] text-[#2D2D2D] font-roboto`}
      dir={t.dir}
    >
      {/* ========== HEADER ========== */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 shadow-lg shadow-black/5 py-3"
            : "bg-gradient-to-b from-black/40 to-transparent py-5"
        }`}
        style={
          scrolled
            ? {
                WebkitBackdropFilter: "blur(20px)",
                backdropFilter: "blur(20px)",
              }
            : {}
        }
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-10">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-crimson-text font-bold text-lg ${
                  scrolled
                    ? "bg-[#1D4ED8] text-white"
                    : "bg-white/20 text-white border border-white/30"
                }`}
              >
                K
              </div>
              <span
                className={`text-2xl font-crimson-text font-bold ${
                  scrolled ? "text-[#1D4ED8]" : "text-white"
                }`}
              >
                Kaspi
              </span>
            </a>
            <nav className="hidden lg:flex gap-8">
              {["about", "menu", "atmosphere", "reservation", "contact"].map(
                (section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`text-sm font-medium transition-colors hover:opacity-100 ${
                      scrolled
                        ? "text-gray-600 hover:text-[#1D4ED8]"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {section === "reservation"
                      ? t.nav.book
                      : t.nav[section] || section}
                  </button>
                ),
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                scrolled
                  ? "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  : "border border-white/30 text-white hover:bg-white/10"
              }`}
            >
              <Globe size={14} />
              {lang === "en" ? "עב" : "EN"}
            </button>
            <button
              onClick={() => scrollToSection("reservation")}
              className={`hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                scrolled
                  ? "bg-[#1D4ED8] text-white hover:bg-[#1E40AF] shadow-lg shadow-blue-200/50"
                  : "bg-white text-[#1D4ED8] hover:bg-blue-50"
              }`}
            >
              <CalendarDays size={16} />
              {t.nav.book}
            </button>
            <button
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X
                  size={24}
                  className={scrolled ? "text-gray-800" : "text-white"}
                />
              ) : (
                <Menu
                  size={24}
                  className={scrolled ? "text-gray-800" : "text-white"}
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl py-8 px-6 flex flex-col gap-2 mobile-menu-enter">
            {["about", "menu", "atmosphere", "reservation", "contact"].map(
              (section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-lg font-medium py-3 px-4 rounded-xl hover:bg-gray-50 text-left transition-colors"
                  style={{ textAlign: isRtl ? "right" : "left" }}
                >
                  {section === "reservation"
                    ? t.nav.book
                    : t.nav[section] || section}
                </button>
              ),
            )}
            <button
              onClick={() => scrollToSection("reservation")}
              className="bg-[#1D4ED8] text-white py-4 rounded-xl font-bold mt-4 flex items-center justify-center gap-2"
            >
              <CalendarDays size={20} />
              {t.nav.book}
            </button>
          </div>
        )}
      </header>

      {/* ========== HERO ========== */}
      <section className="relative h-screen min-h-[700px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.hero}
            className="w-full h-full object-cover"
            alt="Kaspi storefront Tel Aviv"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pb-20 md:pb-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-0.5 bg-[#60A5FA]"></div>
              <span className="text-[#93C5FD] text-sm font-bold tracking-[0.2em] uppercase">
                Tel Aviv
              </span>
            </div>
            <h1 className="text-7xl md:text-9xl font-crimson-text font-bold text-white mb-6 leading-[0.9]">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-light mb-10 max-w-lg leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection("reservation")}
                className="bg-[#1D4ED8] text-white px-8 py-4 rounded-full font-bold hover:bg-[#1E40AF] transition-all shadow-2xl shadow-blue-900/30 flex items-center gap-2 group"
              >
                {t.hero.cta_book}
                <ArrowRight
                  size={18}
                  className={`transition-transform group-hover:translate-x-1 ${isRtl ? "rotate-180 group-hover:-translate-x-1" : ""}`}
                />
              </button>
              <button
                onClick={() => scrollToSection("menu")}
                className="bg-white/15 text-white border border-white/25 px-8 py-4 rounded-full font-bold hover:bg-white/25 transition-all"
                style={{
                  WebkitBackdropFilter: "blur(10px)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {t.hero.cta_menu}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-white/60 rounded-full scroll-indicator"></div>
          </div>
        </div>
      </section>

      {/* ========== ABOUT ========== */}
      <section id="about" className="py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#DBEAFE] rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30"></div>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={IMAGES.spread}
                className="w-full h-[550px] object-cover"
                alt="Mediterranean spread at Kaspi"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-white px-6 py-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 z-20">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Leaf size={24} />
              </div>
              <div>
                <p className="font-bold text-sm text-[#1a1a1a]">
                  {t.about.badge_taste}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t.about.badge_vibe}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-0.5 bg-[#1D4ED8]"></div>
              <span className="text-[#1D4ED8] font-bold tracking-[0.15em] uppercase text-xs">
                {t.nav.about}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-crimson-text font-bold mb-8 leading-tight text-[#1a1a1a]">
              {t.about.title}
            </h2>
            <p className="text-lg text-gray-500 leading-[1.8] mb-10">
              {t.about.content}
            </p>

            <div className="grid grid-cols-2 gap-5">
              {[
                {
                  icon: <Sun size={20} />,
                  text: t.about.sunny,
                  color: "text-amber-500",
                  bg: "bg-amber-50",
                },
                {
                  icon: <Moon size={20} />,
                  text: t.about.cozy,
                  color: "text-indigo-500",
                  bg: "bg-indigo-50",
                },
                {
                  icon: <Users size={20} />,
                  text: t.about.group,
                  color: "text-emerald-500",
                  bg: "bg-emerald-50",
                },
                {
                  icon: <Heart size={20} />,
                  text: t.about.neighborhood,
                  color: "text-rose-500",
                  bg: "bg-rose-50",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div
                    className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center ${item.color} transition-transform group-hover:scale-110`}
                  >
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm text-gray-700">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== SIGNATURE DISHES ========== */}
      <section id="menu" className="py-28 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-0.5 bg-[#1D4ED8]"></div>
              <span className="text-[#1D4ED8] font-bold tracking-[0.15em] uppercase text-xs">
                {t.nav.menu}
              </span>
              <div className="w-10 h-0.5 bg-[#1D4ED8]"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-crimson-text font-bold mb-6 text-[#1a1a1a]">
              {t.dishes.title}
            </h2>
            <p className="text-gray-500 text-lg">{t.dishes.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.dishes.items.map((dish, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100/80"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={IMAGES.dishes[idx]}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div
                    className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full text-sm font-bold text-[#1D4ED8] shadow-md"
                    style={{
                      WebkitBackdropFilter: "blur(8px)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {dish.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-crimson-text font-bold mb-2 text-[#1a1a1a]">
                    {dish.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ATMOSPHERE ========== */}
      <section id="atmosphere" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-0.5 bg-[#1D4ED8]"></div>
              <span className="text-[#1D4ED8] font-bold tracking-[0.15em] uppercase text-xs">
                {t.nav.atmosphere}
              </span>
              <div className="w-10 h-0.5 bg-[#1D4ED8]"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-crimson-text font-bold text-[#1a1a1a]">
              {t.atmosphere.title}
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {t.atmosphere.moods.map((mood, idx) => (
              <div
                key={idx}
                className={`relative group overflow-hidden rounded-3xl ${
                  idx === 1 ? "lg:row-span-1" : ""
                } h-[420px] lg:h-[520px]`}
              >
                <img
                  src={ATMOSPHERE_IMAGES[idx]}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  alt={mood.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-crimson-text font-bold text-white mb-2">
                    {mood.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {mood.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY KASPI ========== */}
      <section className="py-28 bg-[#1D4ED8] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full -mr-64 -mt-64 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-300/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-0.5 bg-white/40"></div>
                <span className="text-white/60 font-bold tracking-[0.15em] uppercase text-xs">
                  Kaspi
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-crimson-text font-bold mb-12 leading-tight">
                {t.why.title}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.why.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-white/10 hover:bg-white/15 p-5 rounded-2xl transition-all group cursor-default"
                    style={{
                      WebkitBackdropFilter: "blur(6px)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                      <ChevronRight
                        size={16}
                        className={isRtl ? "rotate-180" : ""}
                      />
                    </div>
                    <p className="font-medium text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-72 h-72 md:w-80 md:h-80">
                <div className="absolute inset-0 border-2 border-white/20 rounded-full spin-slow"></div>
                <div className="absolute inset-6 border border-white/10 rounded-full"></div>
                <div
                  className="absolute inset-12 bg-white/10 rounded-full flex items-center justify-center text-center"
                  style={{
                    WebkitBackdropFilter: "blur(8px)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div>
                    <p className="text-5xl md:text-6xl font-crimson-text font-bold mb-1">
                      100%
                    </p>
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-200">
                      {t.why.badge}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== RESERVATION ========== */}
      <section
        id="reservation"
        className="py-28 bg-[#FDFCF8] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full -mr-64 -mt-64 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: info + image */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-0.5 bg-[#1D4ED8]"></div>
                <span className="text-[#1D4ED8] font-bold tracking-[0.15em] uppercase text-xs">
                  {t.nav.book}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-crimson-text font-bold mb-6 text-[#1a1a1a]">
                {t.reservation.title}
              </h2>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                {t.reservation.subtitle}
              </p>
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={IMAGES.evening}
                  className="w-full h-[380px] object-cover"
                  alt="Kaspi evening atmosphere"
                />
              </div>
            </div>

            {/* Right: form */}
            <div>
              <div className="lg:hidden text-center mb-10">
                <h2 className="text-3xl font-crimson-text font-bold mb-3 text-[#1a1a1a]">
                  {t.reservation.title}
                </h2>
                <p className="text-gray-500">{t.reservation.subtitle}</p>
              </div>
              <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8 md:p-10">
                <ReservationForm t={t} isRtl={isRtl} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PRACTICAL INFO ========== */}
      <section id="contact" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] rounded-[32px] p-8 md:p-16 border border-blue-100/50 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/40 rounded-full -mr-40 -mt-40 blur-3xl"></div>

            <div className="grid lg:grid-cols-2 gap-16 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-0.5 bg-[#1D4ED8]"></div>
                  <span className="text-[#1D4ED8] font-bold tracking-[0.15em] uppercase text-xs">
                    {t.nav.contact}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-crimson-text font-bold mb-12 text-[#1a1a1a]">
                  {t.info.title}
                </h2>

                <div className="space-y-8">
                  {[
                    {
                      icon: <MapPin size={24} />,
                      label: t.info.address_label,
                      value: t.info.address,
                    },
                    {
                      icon: <Clock size={24} />,
                      label: t.info.hours_label,
                      value: t.info.hours,
                      multiline: true,
                    },
                    {
                      icon: <Phone size={24} />,
                      label: t.info.phone_label,
                      value: t.info.phone,
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-5">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#1D4ED8] shrink-0 border border-blue-50">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                          {item.label}
                        </p>
                        <p
                          className={`text-lg font-medium text-[#1a1a1a] ${item.multiline ? "whitespace-pre-line leading-relaxed" : ""}`}
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 flex flex-wrap gap-4">
                  <a
                    href="https://wa.me/97231234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#25D366] text-white px-7 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-green-200/30"
                  >
                    <MessageCircle size={22} />
                    {t.info.reservation}
                  </a>
                  <a
                    href="https://instagram.com/kaspi_tlv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white px-7 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg"
                  >
                    <Instagram size={22} />
                    @kaspi_tlv
                  </a>
                </div>
              </div>

              <div className="h-[350px] lg:h-auto bg-gray-100 rounded-3xl overflow-hidden shadow-inner relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13515.658605481714!2d34.7731!3d32.0741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4b9f36e4f3f3%3A0x6b7b7b7b7b7b7b7b!2sDizengoff%20St%2C%20Tel%20Aviv-Yafo!5e0!3m2!1sen!2sil!4v1234567890123"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                  title="Kaspi Map"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-16 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1D4ED8] rounded-full flex items-center justify-center font-crimson-text font-bold text-lg">
                K
              </div>
              <span className="text-2xl font-crimson-text font-bold">
                Kaspi
              </span>
            </div>

            <p className="text-gray-500 text-sm">
              {t.footer.made_with} ✦ {t.footer.rights}
            </p>

            <div className="flex gap-4">
              <a
                href="https://instagram.com/kaspi_tlv"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://wa.me/97231234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ========== ANIMATIONS ========== */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        .mobile-menu-enter {
          animation: slideDown 0.3s ease-out forwards;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .spin-slow {
          animation: spin 25s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .scroll-indicator {
          animation: scrollBounce 2s ease-in-out infinite;
        }

        @keyframes scrollBounce {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          50% {
            transform: translateY(8px);
            opacity: 1;
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
