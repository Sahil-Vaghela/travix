import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Search,
  Loader2,
  Hotel,
  Utensils,
  ExternalLink,
  Youtube,
  ChevronRight,
  ChevronDown,
  Train,
  Info,
  Menu,
  X,
  Compass,
  Sparkles,
  Mountain,
  Landmark,
  Trees,
  Globe,
  Zap,
  Heart,
  Cloud,
  ArrowRight,
  Star,
  MessageSquare,
  User,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import travelData from "./data/travelData.json";
import { AIResponse, UnifiedTravelResponse } from "./types";

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const pathParts = location.pathname.split("/");

  const isTransparent = location.pathname === "/" && pathParts.length === 1;
  const menuItems = [
    { label: "HOME", path: "/" },
    { label: "RESTAURANTS", path: "/restaurants" },
    { label: "HOTELS", path: "/hotels" },
    { label: "TRANSPORTATION", path: "/transportation" },
    { label: "REVIEWS", path: "/reviews" },
    { label: "ABOUT", path: "/about" },
  ];

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl transition-all duration-500 ${isTransparent ? "bg-transparent" : "bg-white"} backdrop-blur-xl border border-white/20 rounded-full shadow-2xl`}
    >
      <div className="px-6 lg:px-10">
        <div className="flex justify-between h-16 items-center">
          {/* Left Side: Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0 })}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-travel-sunset rounded-lg flex items-center justify-center text-white neon-glow-orange group-hover:rotate-12 transition-transform">
              <Compass size={18} />
            </div>
            <h1
              className={`text-xl font-serif italic tracking-tight ${isTransparent ? "text-white" : "text-slate-900"}`}
            >
              Travix
            </h1>
          </Link>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 text-[10px] font-bold tracking-[0.2em] transition-all rounded-full ${
                    isActive
                      ? "bg-travel-sunset text-white neon-glow-orange"
                      : !isTransparent
                        ? "text-slate-700 hover:text-slate-900"
                        : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                  {!isActive && (
                    <motion.div
                      className="absolute bottom-1 left-4 right-4 h-0.5 bg-travel-teal origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side: Removed Sign In */}
          <div className="hidden md:block w-[80px]"></div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full transition-colors ${isTransparent ? "text-white bg-white/10" : "text-slate-900 bg-slate-100"}`}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white/90 backdrop-blur-2xl border-t border-white/20 overflow-hidden rounded-b-[2rem]"
          >
            <div className="px-6 pt-4 pb-8 space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-[10px] font-bold tracking-[0.2em] text-slate-500 hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const PageHeader = ({
  title,
  subtitle,
  centered = false,
}: {
  title: string;
  subtitle?: string;
  icon?: any;
  centered?: boolean;
}) => (
  <div className={`mb-16 ${centered ? "text-center" : ""}`}>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-6xl font-serif italic mb-4 text-slate-900"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-slate-500 text-sm tracking-[0.2em] font-medium uppercase"
      >
        {subtitle}
      </motion.p>
    )}
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: 96 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className={`mt-6 h-1 bg-travel-sunset rounded-full ${centered ? "mx-auto" : ""}`}
    />
  </div>
);

// --- Page Views ---

const ItineraryOnlyView = ({ data }: { data: UnifiedTravelResponse }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const getMapsUrl = (name: string, city: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + city)}`;
  const getYoutubeUrl = (name: string, city: string) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " " + city + " travel guide")}`;

  return (
    <div className="space-y-32">
      <section className="relative">
        <PageHeader
          title={`Journey through ${data.city}`}
          subtitle="Your day-by-day curated experience."
        />

        {/* Timeline Experience */}
        <div className="relative pl-8 md:pl-16 space-y-12">
          {/* Vertical Glowing Line */}
          <div className="absolute left-[15px] md:left-[31px] top-4 bottom-4 w-1 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="w-full h-full bg-travel-sky"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2 }}
            />
          </div>

          {data.itinerary.map((day) => (
            <div key={day.day} className="relative">
              {/* Day Badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="absolute -left-[33px] md:-left-[49px] top-0 w-12 h-12 rounded-full bg-travel-sky flex items-center justify-center text-white font-serif italic text-xl neon-glow z-10"
              >
                {day.day}
              </motion.div>

              <div className="glass rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                <button
                  onClick={() =>
                    setExpandedDay(expandedDay === day.day ? null : day.day)
                  }
                  className="w-full px-8 py-8 flex items-center justify-between hover:bg-white/50 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-serif italic text-2xl text-slate-900">
                      Day {day.day} Exploration
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedDay === day.day ? 180 : 0 }}
                  >
                    <ChevronDown size={24} className="text-slate-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedDay === day.day && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-10 space-y-12 pt-4">
                        {day.places.map((place, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="grid md:grid-cols-[1fr_380px] gap-10 items-center group"
                          >
                            <div className="space-y-6">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-travel-sky/10 flex items-center justify-center text-travel-sky shrink-0">
                                  <Sparkles size={20} />
                                </div>
                                <div>
                                  <h3 className="text-3xl font-serif italic mb-2 text-slate-900">
                                    {place.place_name}
                                  </h3>
                                  <div className="flex items-center gap-2 text-[10px] text-travel-sunset font-bold uppercase tracking-[0.2em] mb-4">
                                    <Calendar size={12} />
                                    Best Time: {place.best_time_to_visit}
                                  </div>
                                  <p className="text-slate-500 leading-relaxed font-medium">
                                    {place.short_description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-6 pl-14">
                                <a
                                  href={getMapsUrl(place.place_name, data.city)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 hover:text-travel-teal transition-colors"
                                >
                                  <MapPin size={14} /> View on Maps
                                </a>
                                <a
                                  href={getYoutubeUrl(
                                    place.place_name,
                                    data.city,
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 hover:opacity-70 transition-opacity"
                                >
                                  <Youtube size={14} /> Watch Guide
                                </a>
                              </div>
                            </div>
                            <div className="aspect-[16/10] rounded-[2rem] overflow-hidden bg-slate-100 relative shadow-2xl group-hover:neon-glow transition-all duration-500">
                              <motion.img
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.8 }}
                                src={
                                  place.image_url ||
                                  `https://source.unsplash.com/800x600/?${encodeURIComponent(place.place_name + " " + data.city)}`
                                }
                                alt={place.place_name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-20">
        <section>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-travel-teal/10 flex items-center justify-center text-travel-teal">
              <Hotel size={24} />
            </div>
            <h2 className="text-4xl font-serif italic text-slate-900">
              Recommended Stays
            </h2>
          </div>
          <div className="space-y-8">
            {data.hotels
              .flatMap((c) => c.hotels)
              .map((hotel, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -10 }}
                  className="glass p-8 rounded-[2.5rem] flex justify-between items-center group shadow-lg"
                >
                  <div className="flex items-center gap-6">
                    <div>
                      <h3 className="font-serif italic text-2xl text-slate-900 mb-1">
                        {hotel.hotel_name}
                      </h3>
                      <div className="flex items-center gap-4">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                          {hotel.area}
                        </p>
                        <div className="flex text-travel-sunset">
                          {[...Array(5)].map((_, i) => (
                            <Sparkles key={i} size={10} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 bg-travel-teal/10 rounded-full text-travel-teal">
                          {hotel.why_good}
                        </span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={getMapsUrl(hotel.hotel_name, data.city)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-full bg-slate-50 text-slate-400 group-hover:bg-travel-sky group-hover:text-white transition-all neon-glow"
                  >
                    <ExternalLink size={18} />
                  </a>
                </motion.div>
              ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-travel-sunset/10 flex items-center justify-center text-travel-sunset">
              <Utensils size={24} />
            </div>
            <h2 className="text-4xl font-serif italic text-slate-900">
              Culinary Gems
            </h2>
          </div>
          <div className="space-y-8">
            {data.restaurants
              .flatMap((c) => c.restaurants)
              .map((rest, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -10 }}
                  className="glass p-8 rounded-[2.5rem] flex justify-between items-center group shadow-lg"
                >
                  <div className="flex items-center gap-6">
                    <div>
                      <h3 className="font-serif italic text-2xl text-slate-900 mb-1">
                        {rest.restaurant_name}
                      </h3>
                      <div className="flex items-center gap-4">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                          {rest.cuisine}
                        </p>
                        <div className="flex text-travel-sunset">
                          {[...Array(5)].map((_, i) => (
                            <Sparkles key={i} size={10} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 bg-travel-sunset/10 rounded-full text-travel-sunset">
                          {rest.why_visit}
                        </span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={getMapsUrl(rest.restaurant_name, data.city)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-full bg-slate-50 text-slate-400 group-hover:bg-travel-sky group-hover:text-white transition-all neon-glow"
                  >
                    <ExternalLink size={18} />
                  </a>
                </motion.div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const RestaurantsView = ({ data }: { data: UnifiedTravelResponse }) => {
  const getMapsUrl = (name: string, city: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + city)}`;
  return (
    <div className="space-y-24">
      <PageHeader
        title={`Best Eats in ${data.city}`}
        subtitle="Discover the culinary delights of the city."
        centered
      />
      <div className="grid gap-24">
        {data.restaurants.map((cat, idx) => (
          <section key={idx}>
            <div className="flex items-center gap-8 mb-12">
              <h3 className="text-3xl font-serif italic text-slate-900 whitespace-nowrap">
                {cat.category_name}
              </h3>
              <div className="w-full h-px bg-slate-200" />
            </div>
            <div className="grid sm:grid-cols-2 gap-10">
              {cat.restaurants.map((rest, rIdx) => (
                <motion.div
                  key={rIdx}
                  whileHover={{ y: -10 }}
                  className="glass p-10 rounded-[3rem] shadow-xl group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-travel-sunset/5 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-150" />
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <h4 className="font-serif italic text-3xl text-slate-900">
                        {rest.restaurant_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-[10px] text-travel-sunset font-bold uppercase tracking-[0.2em]">
                          {rest.cuisine}
                        </span>
                      </div>
                    </div>
                    <a
                      href={getMapsUrl(rest.restaurant_name, data.city)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-full bg-slate-50 text-slate-400 group-hover:bg-travel-sky group-hover:text-white transition-all neon-glow"
                    >
                      <MapPin size={20} />
                    </a>
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed relative z-10">
                    {rest.why_visit}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

const HotelsView = ({ data }: { data: UnifiedTravelResponse }) => {
  const getMapsUrl = (name: string, city: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + city)}`;
  return (
    <div className="space-y-24">
      <PageHeader
        title={`Where to Stay in ${data.city}`}
        subtitle="Handpicked accommodations for every traveler."
        centered
      />
      <div className="grid gap-24">
        {data.hotels.map((cat, idx) => (
          <section key={idx}>
            <div className="flex items-center gap-8 mb-12">
              <h3 className="text-3xl font-serif italic text-slate-900 whitespace-nowrap">
                {cat.category_name}
              </h3>
              <div className="w-full h-px bg-slate-200" />
            </div>
            <div className="grid sm:grid-cols-2 gap-10">
              {cat.hotels.map((hotel, hIdx) => (
                <motion.div
                  key={hIdx}
                  whileHover={{ y: -10 }}
                  className="glass p-10 rounded-[3rem] shadow-xl group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-travel-teal/5 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-150" />
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <h4 className="font-serif italic text-3xl text-slate-900">
                        {hotel.hotel_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-[10px] text-travel-teal font-bold uppercase tracking-[0.2em]">
                          {hotel.area}
                        </span>
                      </div>
                    </div>
                    <a
                      href={getMapsUrl(hotel.hotel_name, data.city)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-full bg-slate-50 text-slate-400 group-hover:bg-travel-sky group-hover:text-white transition-all neon-glow"
                    >
                      <MapPin size={20} />
                    </a>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500 bg-slate-50/50 p-5 rounded-[1.5rem] font-medium relative z-10">
                    <Info size={18} className="text-travel-teal shrink-0" />
                    <span>{hotel.why_good}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

const RailwayView = () => {
  const transports = [
    {
      name: "Indian Railways",
      icon: Train,
      desc: "Official IRCTC portal for train bookings.",
      link: "https://www.irctc.co.in/nget/train-search",
      color: "bg-slate-800",
      glow: "neon-glow",
    },
    {
      name: "Flights",
      icon: Globe,
      desc: "Book domestic and international flights.",
      link: "https://www.google.com/flights",
      color: "bg-travel-sky",
      glow: "neon-glow",
    },
    {
      name: "Uber",
      icon: MapPin,
      desc: "Reliable rides for city travel.",
      link: "https://www.uber.com/in/en/",
      color: "bg-slate-900",
      glow: "neon-glow-white",
    },
    {
      name: "Ola",
      icon: Compass,
      desc: "Quick and easy cab bookings.",
      link: "https://www.olacabs.com/",
      color: "bg-lime-500",
      glow: "neon-glow-green",
    },
  ];

  return (
    <div className="space-y-24">
      <PageHeader
        title="Transport & Bookings"
        subtitle="Everything you need to get moving."
        centered
      />
      <div className="grid sm:grid-cols-2 gap-10">
        {transports.map((t, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -15, scale: 1.02 }}
            className="glass rounded-[3.5rem] p-12 shadow-xl flex flex-col items-center group transition-all duration-500"
          >
            <div
              className={`w-24 h-24 ${t.color} rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl group-hover:${t.glow} transition-all duration-500 text-white`}
            >
              <t.icon size={36} />
            </div>
            <h3 className="text-3xl font-serif italic text-slate-900 mb-4">
              {t.name}
            </h3>
            <p className="text-slate-500 text-base mb-10 flex-grow font-medium leading-relaxed">
              {t.desc}
            </p>
            <a
              href={t.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 bg-slate-50 text-slate-900 px-8 py-5 rounded-2xl text-[11px] font-bold tracking-[0.2em] hover:bg-travel-sky hover:text-white transition-all duration-500 shadow-inner"
            >
              BOOK NOW <ExternalLink size={14} />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AboutView = () => {
  const data = {
    site_name: "Travix",
    description: "AI powered Indian travel planning tool.",
    features: [
      "Smart day wise itinerary",
      "Restaurant discovery",
      "Hotel discovery",
      "Google Maps navigation links",
      "Travel video suggestions",
    ],
    how_to_use: [
      "Enter city name",
      "Select number of days",
      "Generate itinerary",
      "Explore hotels and restaurants",
      "Use railway page for booking trains",
    ],
  };
  return (
    <div className="space-y-32 relative">
      {/* World Map Watermark */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1000 500" className="w-full h-full scale-150">
          <path
            d="M100,100 Q200,50 300,100 T500,100 T700,100 T900,100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M100,200 Q200,150 300,200 T500,200 T700,200 T900,200"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M100,300 Q200,250 300,300 T500,300 T700,300 T900,300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>

      <section className="text-center max-w-4xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl md:text-8xl font-serif italic text-slate-900 mb-8 leading-tight">
            The Future of <span className="text-travel-sunset">Discovery</span>
          </h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            {data.description} Travix isn't just a travel planner. It's your
            personal AI concierge, designed to turn every trip into a cinematic
            adventure.
          </p>
        </motion.div>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass p-12 rounded-[3.5rem] shadow-xl"
        >
          <h3 className="text-3xl font-serif italic mb-10 text-slate-900">
            Key Features
          </h3>
          <ul className="space-y-8">
            {data.features.map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-6 text-slate-600 font-medium group"
              >
                <div className="w-3 h-3 rounded-full bg-travel-sunset group-hover:neon-glow-orange transition-all" />
                {f}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-travel-sky opacity-10 blur-[80px] -mr-32 -mt-32" />
          <h3 className="text-3xl font-serif italic mb-10 relative z-10">
            How to Use
          </h3>
          <div className="space-y-6 relative z-10">
            {data.how_to_use.map((step, i) => (
              <div key={i} className="flex gap-8 group">
                <span className="text-4xl font-serif italic text-travel-sunset leading-none group-hover:text-travel-sunset transition-colors">
                  0{i + 1}
                </span>
                <p className="text-base text-slate-300 leading-relaxed font-medium">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- Main App Logic ---

const ReviewsView = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Arjun Mehta",
      rating: 5,
      comment:
        "The AI itinerary for Varanasi was spot on! Saved me hours of planning.",
      date: "2 days ago",
      avatar: "https://picsum.photos/seed/arjun/100/100",
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      rating: 4,
      comment:
        "Loved the restaurant recommendations in Jaipur. The palace tour was also very well organized.",
      date: "1 week ago",
      avatar: "https://picsum.photos/seed/sarah/100/100",
    },
    {
      id: 3,
      name: "Priya Sharma",
      rating: 5,
      comment:
        "Travix made my solo trip to Rishikesh so much easier. Highly recommend the spiritual trail!",
      date: "2 weeks ago",
      avatar: "https://picsum.photos/seed/priya/100/100",
    },
  ]);

  const [newReview, setNewReview] = useState({
    name: "",
    comment: "",
    rating: 5,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const review = {
      id: reviews.length + 1,
      ...newReview,
      date: "Just now",
      avatar: `https://picsum.photos/seed/${newReview.name}/100/100`,
    };

    setReviews([review, ...reviews]);
    setNewReview({ name: "", comment: "", rating: 5 });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-24 py-12">
      <section className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full bg-travel-sunset/10 text-travel-sunset text-[10px] font-bold tracking-[0.2em] uppercase"
        >
          Community Feedback
        </motion.div>
        <h2 className="text-6xl font-serif italic text-slate-900">
          Traveler <span className="text-travel-sunset">Stories</span>
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Read about the experiences of fellow explorers who used Travix to plan
          their perfect Indian getaway.
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-[2.5rem] border border-white/40 shadow-xl hover:shadow-2xl transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{review.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                      {review.date}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < review.rating
                          ? "text-travel-sunset fill-travel-sunset"
                          : "text-slate-200"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed italic">
                "{review.comment}"
              </p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-[3rem] border border-white/50 shadow-2xl sticky top-32"
          >
            <h3 className="text-xl font-serif italic text-slate-900 mb-6">
              Share Your Experience
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                  className="w-full bg-white/50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-travel-sunset outline-none transition-all text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">
                  Rating
                </label>
                <div className="flex gap-2 ml-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() =>
                        setNewReview({ ...newReview, rating: num })
                      }
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={20}
                        className={
                          num <= newReview.rating
                            ? "text-travel-sunset fill-travel-sunset"
                            : "text-slate-200"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">
                  Your Review
                </label>
                <textarea
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="w-full bg-white/50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-travel-sunset outline-none transition-all text-sm resize-none"
                  placeholder="Tell us about your trip..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-travel-sunset text-white rounded-2xl py-4 font-bold text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg neon-glow-orange"
              >
                <Send size={16} /> SUBMIT REVIEW
              </button>
              {submitted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-emerald-600 text-[10px] font-bold tracking-widest uppercase"
                >
                  Thank you for your feedback!
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const PageContainer = () => {
  const { city: cityParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<UnifiedTravelResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState(cityParam || "");
  const [days, setDays] = useState("3");

  // ⭐ NEW EFFECT 1 (cityParam change)
  useEffect(() => {
    if (!cityParam) return;

    const formattedCity =
      cityParam.charAt(0).toUpperCase() + cityParam.slice(1).toLowerCase();

    setCity(formattedCity);
  }, [cityParam]);

useEffect(() => {
  if (!cityParam) return;

  fetchData(cityParam, days);
}, [cityParam, days]);

  const fetchData = async (targetCity, _targetDays) => {
    setLoading(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const cityKey = Object.keys(travelData).find(
      (c) => c.trim().toLowerCase() === targetCity.trim().toLowerCase(),
    );

    const cityData = cityKey ? travelData[cityKey] : null;

    if (cityData && cityData["3"]) {
      const fullPlan = cityData["3"];

      const filteredPlan = {
        ...fullPlan,
        itinerary: fullPlan.itinerary.slice(0, Number(_targetDays)),
      };

      setData(filteredPlan);
    } else {
      setData(null);
      setError("City travel data not available");
    }

    setLoading(false);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!city) return;

    const formattedCity =
      city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    const path = location.pathname;
    if (path.startsWith("/restaurants")) {
      navigate(`/restaurants/${formattedCity}`);
    } else if (path.startsWith("/hotels")) {
      navigate(`/hotels/${formattedCity}`);
    } else if (path.startsWith("/transportation")) {
      navigate(`/transportation/${formattedCity}`);
    } else {
      navigate(`/${formattedCity}`);
    }
  };

  const renderContent = () => {
    if (location.pathname.startsWith("/transportation"))
      return (
        <div className="max-w-7xl mx-auto px-6 py-24">
          <RailwayView />
        </div>
      );
    if (location.pathname === "/about")
      return (
        <div className="max-w-7xl mx-auto px-6 py-24">
          <AboutView />
        </div>
      );
    if (location.pathname === "/reviews")
      return (
        <div className="max-w-7xl mx-auto px-6 py-24">
          <ReviewsView />
        </div>
      );

    if (loading)
      return (
        <div className="flex flex-col items-center justify-center py-48 space-y-6">
          <Loader2
            className="animate-spin text-[#d4af37]"
            size={64}
            strokeWidth={1}
          />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8c8574]">
            Curating your journey...
          </p>
        </div>
      );
    if (error)
      return (
        <div className="text-center py-48 text-red-500 font-serif italic text-2xl">
          {error}
        </div>
      );

    if (!data) {
      const isInitialHome = location.pathname === "/" && !data;

      if (isInitialHome)
        return (
          <div className="space-y-0">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
              {/* Cinematic Background */}
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
                  alt="Travel Adventure"
                  className="w-full h-full object-cover scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-50" />
              </div>

              {/* Animated Elements */}
              <div className="absolute inset-0 pointer-events-none z-10">
                {/* Floating Clouds */}
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute top-20 left-0 opacity-20"
                >
                  <Cloud size={120} className="text-white" />
                </motion.div>
                <motion.div
                  animate={{ x: ["100%", "-100%"] }}
                  transition={{
                    duration: 80,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute top-40 right-0 opacity-10"
                >
                  <Cloud size={180} className="text-white" />
                </motion.div>

                {/* Airplane Trail */}
                <svg className="absolute inset-0 w-full h-full">
                  <motion.path
                    d="M-100,200 Q400,100 1200,300"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="10,10"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </svg>

                {/* Glowing Pins */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-1/3 left-1/4 text-travel-sunset neon-glow-orange"
                >
                  <MapPin size={32} />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute top-1/2 right-1/4 text-travel-sunset neon-glow-orange"
                >
                  <MapPin size={32} />
                </motion.div>
              </div>

              <div className="relative z-20 container mx-auto px-6 text-center pt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-4xl mx-auto space-y-16"
                >
                  <h1 className="text-6xl md:text-8xl font-serif italic text-white leading-tight drop-shadow-2xl">
                    Your Next Adventure, <br />
                    Perfectly Planned.
                  </h1>

                  <div className="glass p-4 rounded-[3rem] shadow-2xl max-w-3xl mx-auto border border-white/30 backdrop-blur-2xl">
                    <form
                      onSubmit={handleSearch}
                      className="flex flex-col md:flex-row items-center gap-4"
                    >
                      <div className="flex-1 relative w-full group">
                        <MapPin
                          className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-travel-sky transition-colors"
                          size={18}
                        />
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Where to next?"
                          className="w-full bg-white/80 rounded-full pl-14 pr-6 py-5 text-slate-900 placeholder:text-slate-400 outline-none text-sm font-medium focus:ring-2 focus:ring-travel-sunset transition-all"
                        />
                      </div>
                      <div className="w-px h-8 bg-slate-200 hidden md:block" />
                      <div className="md:w-40 relative w-full group">
                        <Calendar
                          className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-travel-sky transition-colors"
                          size={18}
                        />
                        <select
                          value={days}
                          onChange={(e) => setDays(e.target.value)}
                          className="w-full bg-white/80 rounded-full pl-14 pr-6 py-5 text-slate-900 outline-none text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-travel-sunset transition-all"
                        >
                          {[1, 2, 3, 4, 5].map((d) => (
                            <option
                              key={d}
                              value={d}
                              className="text-slate-900"
                            >
                              {d} {d === 1 ? "Day" : "Days"}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="bg-travel-sunset text-white hover:scale-105 active:scale-95 rounded-full px-10 py-5 font-bold text-[11px] tracking-[0.2em] uppercase transition-all shadow-xl neon-glow-orange flex items-center justify-center gap-3 w-full md:w-auto"
                      >
                        Generate Trip <ArrowRight size={16} />
                      </button>
                    </form>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="py-48 bg-gradient-to-t from-white-500 to-[#dadef5]-500 relative overflow-hidden">
              <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-32 space-y-6">
                  <h2 className="text-6xl font-serif italic text-slate-900">
                    How It Works
                  </h2>
                  <div className="w-24 h-1 bg-travel-sunset mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-3 gap-20 relative">
                  {/* Connector Path */}
                  <div className="absolute top-1/2 left-0 w-full h-px border-t-2 border-dashed border-slate-200 -z-10 hidden md:block" />

                  {[
                    {
                      num: "01",
                      title: "ENTER DESTINATION",
                      desc: "Tell us where you want to go.",
                      icon: <MapPin size={32} />,
                    },
                    {
                      num: "02",
                      title: "CHOOSE DURATION",
                      desc: "Select how many days you'll explore.",
                      icon: <Calendar size={32} />,
                    },
                    {
                      num: "03",
                      title: "GET SMART PLAN",
                      desc: "Our AI crafts your perfect itinerary.",
                      icon: <Sparkles size={32} />,
                    },
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                      className="glass p-12 rounded-[3.5rem] text-center space-y-8 group hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="w-24 h-24 bg-travel-sky rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-2xl group-hover:neon-glow transition-all duration-500">
                        {step.icon}
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-[11px] font-bold tracking-[0.3em] text-travel-sky uppercase">
                          Step {step.num}
                        </h3>
                        <h4 className="text-2xl font-serif italic text-slate-900">
                          {step.title}
                        </h4>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                          {step.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Travel Inspiration Section */}
            <section className="py-48 bg-slate-50 relative">
              <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                  <div className="space-y-6">
                    <h2 className="text-6xl font-serif italic text-slate-900">
                      Cinematic{" "}
                      <span className="text-travel-sunset">Destinations</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium">
                      Curated for your wanderlust
                    </p>
                  </div>
                  <button className="text-[11px] font-bold tracking-[0.3em] uppercase text-slate-900 border-b-2 border-travel-sunset pb-2 hover:text-travel-sunset transition-colors">
                    EXPLORE ALL
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                  {[
                    {
                      name: "Varanasi",
                      tag: "HISTORIC WONDER",
                      img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=800",
                    },
                    {
                      name: "Kerala",
                      tag: "NATURE RETREAT",
                      img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800",
                    },
                    {
                      name: "Jaipur",
                      tag: "ROYAL HERITAGE",
                      img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800",
                    },
                    {
                      name: "Goa",
                      tag: "BEACH PARADISE",
                      img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800",
                    },
                  ].map((place, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative h-[550px] rounded-[3.5rem] overflow-hidden cursor-pointer shadow-2xl hover:neon-glow transition-all duration-500"
                      onClick={() => {
                        setCity(place.name);
                        handleSearch();
                      }}
                    >
                      <img
                        src={place.img}
                        alt={place.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                      <div className="absolute bottom-12 left-12 text-white">
                        <p className="text-10px font-bold uppercase tracking-[0.4em] text-travel-sunset mb-4">
                          {place.tag}
                        </p>
                        <h4 className="text-4xl font-serif italic">
                          {place.name}
                        </h4>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Experience Category Section */}
            <section className="py-48 bg-white">
              <div className="container mx-auto px-6">
                <div className="text-center mb-32 space-y-6">
                  <h2 className="text-6xl font-serif italic text-slate-900">
                    Choose Your <span className="text-travel-sunset">Mood</span>
                  </h2>
                  <div className="w-24 h-1 bg-travel-sunset mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
                  {[
                    { label: "ADVENTURE", icon: Zap },
                    { label: "FOOD", icon: Utensils },
                    { label: "CULTURE", icon: Sparkles },
                    { label: "NATURE", icon: Trees },
                  ].map((cat, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -15 }}
                      className="group flex flex-col items-center space-y-8 cursor-pointer"
                    >
                      <div className="w-32 h-32 glass rounded-[2.5rem] flex items-center justify-center transition-all duration-500 group-hover:bg-travel-sky group-hover:text-white group-hover:scale-110 shadow-xl group-hover:neon-glow">
                        <cat.icon size={48} strokeWidth={1} />
                      </div>
                      <span className="text-[12px] font-bold tracking-[0.4em] text-slate-400 group-hover:text-slate-900 transition-colors">
                        {cat.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );

      const isDataDependentPage = ["restaurants", "hotels"].some((p) =>
        location.pathname.startsWith("/" + p),
      );
      if (isDataDependentPage) {
        const pageType = location.pathname.includes("restaurants")
          ? "Restaurants"
          : "Hotels";
        return (
          <div className="max-w-4xl mx-auto px-6 py-48 text-center space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-6xl font-serif italic text-slate-900">
                Find the Best{" "}
                <span className="text-travel-sunset">{pageType}</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                Enter a city name to discover curated {pageType.toLowerCase()}{" "}
                recommendations for your next journey.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass p-4 rounded-[3rem] shadow-2xl border border-white/30 backdrop-blur-2xl max-w-2xl mx-auto"
            >
              <form
                onSubmit={handleSearch}
                className="flex flex-col md:flex-row items-center gap-4"
              >
                <div className="flex-1 relative w-full group">
                  <MapPin
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-travel-sky transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city (e.g. Jaipur)"
                    className="w-full bg-white/80 rounded-full pl-14 pr-6 py-5 text-slate-900 placeholder:text-slate-400 outline-none text-sm font-medium focus:ring-2 focus:ring-travel-sunset transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-travel-sunset text-white rounded-full px-10 py-5 font-bold text-[11px] tracking-[0.2em] uppercase transition-all shadow-xl neon-glow-orange flex items-center justify-center gap-3 w-full md:w-auto hover:scale-105 active:scale-95"
                >
                  SEARCH <Search size={16} />
                </button>
              </form>
            </motion.div>
          </div>
        );
      }

      return null;
    }

    return (
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {switchContent()}
      </div>
    );
  };

  const switchContent = () => {
    if (!data) return null;
    const path = location.pathname;
    const travelResponse = data as UnifiedTravelResponse;

    if (path.startsWith("/hotels")) {
      return <HotelsView data={travelResponse} />;
    }
    if (path.startsWith("/restaurants")) {
      return <RestaurantsView data={travelResponse} />;
    }
    if (path === "/reviews") {
      return <ReviewsView />;
    }

    return <ItineraryOnlyView data={travelResponse} />;
  };

  const showSearch =
    data &&
    !location.pathname.startsWith("/transportation") &&
    !location.pathname.startsWith("/about") &&
    !location.pathname.startsWith("/reviews");

  return (
    <div className="w-full">
      {showSearch && (
        <div className="max-w-7xl mx-auto px-6 pt-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[3rem] shadow-2xl border border-white/30 backdrop-blur-2xl mb-16"
          >
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="space-y-4">
                <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                  <MapPin size={14} className="text-travel-sunset" />{" "}
                  Destination City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Jaipur, Varanasi"
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 focus:ring-2 focus:ring-travel-sunset outline-none transition-all text-sm font-medium"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                  <Calendar size={14} className="text-travel-sunset" /> Duration
                  (Days)
                </label>
                <select
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 focus:ring-2 focus:ring-travel-sunset outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5].map((d) => (
                    <option key={d} value={d}>
                      {d} {d === 1 ? "Day" : "Days"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-travel-sunset hover:scale-[1.02] active:scale-[0.98] text-white rounded-2xl py-5 px-8 font-bold text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl neon-glow-orange"
                >
                  <Search size={18} /> UPDATE PLAN
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {renderContent()}
    </div>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-white py-4 relative overflow-hidden">
    {/* Decorative background element */}
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-travel-sunset rounded-lg flex items-center justify-center text-white neon-glow-orange">
              <Compass size={18} />
            </div>
            <h2 className="text-3xl font-serif italic tracking-tight">
              Travix
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Crafted with love for the curious traveler. Discover the soul of
            India through our AI-powered journeys.
          </p>
          <div className="flex gap-4">
            {["INSTAGRAM", "TWITTER", "FACEBOOK"].map((social) => (
              <a
                key={social}
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-travel-sky transition-all duration-300 group"
              >
                <Globe
                  size={16}
                  className="text-slate-400 group-hover:text-white"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[11px] font-bold tracking-[0.4em] uppercase text-slate-500">
            Quick Links
          </h3>
          <ul className="space-y-5">
            {["Our Story", "Destinations", "Travel Guides"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-sm text-slate-400 hover:text-travel-sky transition-colors font-medium"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-[11px] font-bold tracking-[0.4em] uppercase text-slate-500">
            Support
          </h3>
          <ul className="space-y-5">
            {["Help Center", "Privacy Policy", "Contact Us"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-sm text-slate-400 hover:text-travel-sky transition-colors font-medium"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-[11px] font-bold tracking-[0.4em] uppercase text-slate-500">
            Newsletter
          </h3>
          <p className="text-sm text-slate-400 font-medium">
            Join our community of explorers.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-travel-sky flex-1 transition-all"
            />
            <button className="bg-travel-sunset p-4 rounded-2xl hover:scale-105 transition-all neon-glow-orange">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[10px] font-bold tracking-[0.4em] text-slate-600 uppercase">
          TRAVIX &copy; 2026 — ALL RIGHTS RESERVED
        </p>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-slate-600">
          MADE WITH{" "}
          <Heart size={12} className="text-travel-sunset fill-travel-sunset" />{" "}
          BY TRAVELERS
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-travel-sky/30 relative overflow-x-hidden">
        {/* Global Decorative Shapes */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] -left-20 w-96 h-96 bg-travel-sky/5 blur-[100px] rounded-full"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -10, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] -right-20 w-[500px] h-[500px] bg-travel-sunset/5 blur-[120px] rounded-full"
          />
        </div>

        <Navbar />
        <main className="min-h-[80vh]">
          <Routes>
            <Route path="/" element={<PageContainer />} />
            <Route path="/:city" element={<PageContainer />} />
            <Route path="/restaurants" element={<PageContainer />} />
            <Route path="/restaurants/:city" element={<PageContainer />} />
            <Route path="/hotels" element={<PageContainer />} />
            <Route path="/hotels/:city" element={<PageContainer />} />
            <Route path="/transportation" element={<PageContainer />} />
            <Route path="/transportation/:city" element={<PageContainer />} />
            <Route path="/reviews" element={<PageContainer />} />
            <Route path="/about" element={<PageContainer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
