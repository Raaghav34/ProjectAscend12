import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Globe, 
  Instagram, 
  Mail, 
  Menu, 
  X,
  Award,
  ChevronRight,
  User,
  Star,
  CheckCircle,
  Send,
  Loader2,
  Sparkles,
  Mic2,
  Heart
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Links ---
const INSTAGRAM_LINK = "https://www.instagram.com/theproject.ascend?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

// --- AI Chatbot Implementation ---
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "Hello! I'm the Project Ascend AI assistant. How can I help you learn about our student-led movement today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: "You are the official AI assistant for Project Ascend. Project Ascend is a global student-led initiative providing free training in public speaking, English communication, and diplomacy to empower underserved youth. You are helpful, professional, and encouraging. Key people: Abel (Project Director), Iqra (Academic Director). Active chapters: Qatar, India, Sri Lanka. Keep responses concise and mission-oriented.",
        }
      });

      const botResponse = response.text || "I'm having trouble connecting. Feel free to message us on Instagram @theproject.ascend!";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "I encountered an error. Please try again or reach out to us directly!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-lexend">
      {isOpen ? (
        <div className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-[3rem] shadow-2xl border-4 border-royal-blue/10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-royal-blue p-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-2xl">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-black uppercase text-xs tracking-widest">Ascend AI</h3>
                <p className="text-[10px] opacity-80">Empowering Youth</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 paper-texture custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[2rem] text-sm font-medium ${
                  msg.role === 'user' 
                  ? 'bg-royal-blue text-white rounded-tr-none shadow-md' 
                  : 'bg-cream-dark text-navy rounded-tl-none border border-navy/5 shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-cream-dark p-4 rounded-[2rem] rounded-tl-none border border-navy/5">
                  <Loader2 className="animate-spin text-royal-blue" size={18} />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-navy/5 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask a question..."
              className="flex-grow px-6 py-4 rounded-full bg-cream-dark border border-navy/10 focus:outline-none focus:border-royal-blue/30 text-sm font-bold shadow-inner"
            />
            <button onClick={sendMessage} className="bg-royal-blue text-white p-4 rounded-full hover:bg-navy transition-all shadow-lg active:scale-95">
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-royal-blue text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all border-4 border-white animate-float"
        >
          <MessageCircle size={32} />
        </button>
      )}
    </div>
  );
};

// --- Core UI Components ---

const Logo: React.FC<{ className?: string; noShadow?: boolean }> = ({ className = "w-12 h-12", noShadow = false }) => (
  <div className={`${className} flex items-center justify-center rounded-full bg-royal-blue ${noShadow ? '' : 'shadow-lg'} relative group overflow-hidden`}>
    <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
    <div className="flex flex-col items-center justify-center p-2 text-white">
      <Globe size={className.includes('w-32') ? 64 : 24} className="group-hover:scale-110 transition-transform" />
      {className.includes('w-32') && (
        <span className="text-[10px] font-black mt-2 leading-none uppercase tracking-tighter">Project Ascend</span>
      )}
    </div>
  </div>
);

const Button: React.FC<{ 
  variant?: 'primary' | 'outline' | 'navy'; 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}> = ({ variant = 'primary', children, className = '', onClick, type = "button" }) => {
  const baseStyles = "px-8 py-3.5 rounded-full font-extrabold transition-all duration-300 transform active:scale-95 text-center tracking-tight uppercase text-xs";
  const variants = {
    primary: "bg-royal-blue text-white hover:bg-navy shadow-[6px_6px_0px_rgba(0,0,128,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
    navy: "bg-navy text-white hover:bg-royal-blue shadow-[6px_6px_0px_rgba(65,105,225,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
    outline: "border-2 border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white bg-white/50 backdrop-blur-sm"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const SectionHeading: React.FC<{ children: React.ReactNode; subtitle?: string; light?: boolean }> = ({ children, subtitle, light }) => (
  <div className="mb-16 text-center relative">
    <h2 className={`text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic ${light ? 'text-white' : 'text-royal-blue'} high-contrast-shadow`}>
      {children}
    </h2>
    {subtitle && (
      <p className={`text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed ${light ? 'text-blue-100' : 'text-navy opacity-70'}`}>
        {subtitle}
      </p>
    )}
    <div className={`h-2 w-32 mx-auto mt-8 rounded-full ${light ? 'bg-white/20' : 'bg-royal-blue/20'}`}></div>
  </div>
);

const CollageCard: React.FC<{ children: React.ReactNode; className?: string; rotation?: string; tape?: boolean }> = ({ children, className = '', rotation = 'rotate-1', tape = true }) => (
  <div className={`paper-texture bg-white p-10 shadow-xl border border-navy/5 relative ${rotation} collage-card ${className} ${tape ? 'tape-effect' : ''}`}>
    {children}
  </div>
);

// --- Page Sections ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-cream/95 backdrop-blur-lg py-3 shadow-md border-b border-navy/5' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo className="w-12 h-12 md:w-14 md:h-14" />
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black text-navy tracking-tighter uppercase leading-none">Project Ascend</span>
              <span className="text-[10px] font-bold text-royal-blue uppercase tracking-widest leading-none mt-1">International</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-10">
            {['About', 'Programs', 'Impact', 'Team'].map((item) => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="text-navy hover:text-royal-blue transition-all font-black text-xs uppercase tracking-[0.2em] relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-royal-blue hover:after:w-full after:transition-all">
                {item}
              </button>
            ))}
            <Button className="py-3 px-8 text-xs" onClick={() => scrollTo('contact')}>Join Movement</Button>
          </div>

          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-navy p-2 bg-white/50 rounded-xl border border-navy/5 shadow-sm">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-40 pb-24 md:pt-60 md:pb-48 overflow-hidden paper-texture">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="flex justify-center mb-12">
          <div className="p-4 bg-white rounded-full shadow-[0_30px_60px_rgba(0,0,128,0.15)] border-8 border-royal-blue/5 animate-float">
            <Logo className="w-32 h-32 md:w-56 md:h-56" />
          </div>
        </div>
        
        <div className="inline-block px-6 py-2.5 mb-10 rounded-full bg-white shadow-sm border border-navy/5 text-royal-blue font-black text-[10px] uppercase tracking-[0.3em] rotate-1">
          Student-Led • Global Impact
        </div>
        
        <h1 className="text-7xl md:text-[9.5rem] font-black text-royal-blue mb-8 tracking-tighter leading-[0.85] uppercase italic high-contrast-shadow">
          PROJECT <br/> ASCEND
        </h1>
        
        <p className="text-xl md:text-3xl text-navy max-w-4xl mx-auto mb-14 leading-relaxed font-light high-contrast-shadow">
          Empowering youth through <span className="font-black border-b-8 border-royal-blue/20">communication</span>, <span className="font-black border-b-8 border-royal-blue/20">diplomacy</span>, and action.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Button className="text-sm px-14 py-5" variant="primary" onClick={scrollToContact}>Join as Volunteer</Button>
          <Button className="text-sm px-14 py-5" variant="outline" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>Learn Our Vision</Button>
        </div>
      </div>
    </section>
  );
};

const About = () => (
  <section id="about" className="py-32 bg-cream-dark/50 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 gap-16">
        <div className="relative">
          <div className="absolute -inset-6 bg-royal-blue/5 rounded-[4rem] -rotate-1"></div>
          <CollageCard rotation="rotate-0" className="!p-16 !rounded-[3rem] border-none shadow-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/3 text-center lg:text-left relative">
                <div className="p-12 bg-royal-blue/10 rounded-[2.5rem] inline-block mb-10 rotate-3 border-4 border-white shadow-xl">
                  <Globe size={120} className="text-royal-blue" />
                </div>
              </div>
              <div className="lg:w-2/3">
                <h3 className="text-4xl font-black text-royal-blue italic uppercase mb-6 tracking-tighter">OUR MISSION</h3>
                <p className="text-3xl md:text-4xl font-black text-navy leading-[1.15] tracking-tight italic uppercase">
                  Project Ascend brings <span className="text-royal-blue">free training</span> to underserved communities, connecting youth across borders to lead and uplift together.
                </p>
              </div>
            </div>
          </CollageCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <CollageCard rotation="rotate-[-1.5deg]" className="!p-12 !bg-navy !text-white !rounded-[3rem] border-none shadow-2xl">
            <h3 className="text-4xl font-black tracking-tighter italic uppercase mb-8">HOW IT WORKS</h3>
            <ul className="space-y-6">
              {[
                "Build training modules",
                "Run free workshops",
                "Promote diplomatic dialogue"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-5 text-xl font-bold">
                  <div className="w-6 h-6 rounded-full bg-royal-blue flex items-center justify-center">
                    <ChevronRight size={14} />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CollageCard>

          <CollageCard rotation="rotate-[1.5deg]" className="!p-12 !bg-white !rounded-[3rem] border-2 border-royal-blue/5 shadow-2xl">
            <h3 className="text-4xl font-black tracking-tighter italic uppercase text-navy mb-8">OUR IMPACT</h3>
            <div className="space-y-4">
              {[
                "Multiple country chapters",
                "Trained global volunteers",
                "Hundreds of students reached"
              ].map((item, i) => (
                <div key={i} className="p-5 bg-cream-dark rounded-2xl font-black uppercase text-sm tracking-widest text-navy/80 flex items-center gap-4">
                  <CheckCircle size={18} className="text-royal-blue" />
                  {item}
                </div>
              ))}
            </div>
          </CollageCard>
        </div>
      </div>
    </div>
  </section>
);

const Programs = () => (
  <section id="programs" className="py-32">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading subtitle="Programs built for real-world impact.">CORE PROGRAMS</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { icon: <Mic2 />, title: "The Speaker's Lab", desc: "Workshops on rhetoric and confidence." },
          { icon: <Globe />, title: "Global Dialogues", desc: "Cross-border cultural exchange." },
          { icon: <Award />, title: "Leadership Hub", desc: "Training for local chapter leaders." }
        ].map((item, i) => (
          <div key={i} className="group p-12 rounded-[3rem] bg-cream-dark border border-navy/5 hover:bg-royal-blue transition-all duration-500">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-royal-blue mb-10 shadow-md group-hover:bg-navy group-hover:text-white transition-all">
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 36 })}
            </div>
            <h3 className="text-3xl font-black text-navy mb-5 group-hover:text-white uppercase">{item.title}</h3>
            <p className="text-navy/60 group-hover:text-white/80 font-bold">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Impact = () => (
  <section id="impact" className="py-40 bg-navy text-white relative overflow-hidden paper-texture">
    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
      <h2 className="text-6xl md:text-8xl font-black mb-20 tracking-tighter uppercase italic leading-[0.9]">NUMBERS <br/> THAT <br/> INSPIRE</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-4xl mx-auto">
        <div className="p-10 bg-white/5 rounded-[3rem] backdrop-blur-sm border border-white/10">
          <span className="text-7xl font-black block text-royal-blue mb-4">3+</span>
          <span className="text-xs uppercase tracking-widest font-bold">Countries Active</span>
        </div>
        <div className="p-10 bg-white/5 rounded-[3rem] backdrop-blur-sm border border-white/10">
          <span className="text-7xl font-black block text-royal-blue mb-4">500+</span>
          <span className="text-xs uppercase tracking-widest font-bold">Students Trained</span>
        </div>
        <div className="p-10 bg-white/5 rounded-[3rem] backdrop-blur-sm border border-white/10">
          <span className="text-7xl font-black block text-royal-blue mb-4">100%</span>
          <span className="text-xs uppercase tracking-widest font-bold">Student Led</span>
        </div>
      </div>
      <div className="mt-24 p-12 bg-royal-blue rounded-[3rem] shadow-2xl border-2 border-white/10 max-w-2xl mx-auto rotate-1">
        <p className="text-2xl font-bold italic">"Project Ascend found my voice when I felt I had none. It's about bridging gaps and building futures."</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Star size={24} className="fill-white" />
          <span className="text-sm font-black uppercase tracking-widest">— Participant, Global Chapter</span>
        </div>
      </div>
    </div>
  </section>
);

const Team = () => {
  // Moved Rohit above Raaghav to satisfy "move rohit name up and raaghav down"
  const leadership = [
    { role: "Project Director", name: "Abel" },
    { role: "Academic Director", name: "Iqra" },
    { role: "Operations Head", name: "Dhanvin" },
    { role: "Partnership Development Director", name: "Rohit" },
    { role: "Marketing Head", name: "Raaghav" },
    { role: "Media and Communications Head", name: "Achwin" }
  ];

  return (
    <section id="team" className="py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <SectionHeading subtitle="Student-led, passion-driven.">THE TEAM</SectionHeading>
        <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
          {leadership.map((m, i) => (
            <div key={i} className="group flex flex-col items-center w-64 p-10 bg-white rounded-[3rem] shadow-lg border border-navy/5 transition-all duration-500 hover:-translate-y-4">
              <div className="w-24 h-24 bg-royal-blue/10 rounded-full flex items-center justify-center text-royal-blue mb-6 group-hover:bg-royal-blue group-hover:text-white transition-all">
                <User size={48} />
              </div>
              <h4 className="text-2xl font-black text-navy uppercase mb-2 group-hover:text-royal-blue transition-colors">{m.name}</h4>
              <span className="text-[10px] font-black text-royal-blue uppercase tracking-widest">{m.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const InstagramPreview = () => (
  <div className="w-full mt-6 flex flex-col items-center">
    <a 
      href={INSTAGRAM_LINK} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-full max-w-xs bg-white rounded-2xl shadow-xl overflow-hidden border border-navy/5 group hover:scale-[1.02] transition-transform duration-300"
    >
      {/* IG Header */}
      <div className="flex items-center p-3 gap-3 border-b border-navy/5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            <Globe size={16} className="text-royal-blue" />
          </div>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-black leading-none text-navy">theproject.ascend</span>
          <span className="text-[8px] font-bold text-navy/40">Global Youth Movement</span>
        </div>
      </div>
      
      {/* IG Body / Preview Image */}
      <div className="aspect-square bg-cream-dark relative overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470&auto=format&fit=crop" 
          alt="Youth community" 
          className="object-cover w-full h-full opacity-90 group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-royal-blue/10 mix-blend-multiply"></div>
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg">
           <Instagram size={20} className="text-royal-blue" />
        </div>
      </div>
      
      {/* IG Footer */}
      <div className="p-4 bg-white text-left">
        <div className="flex gap-4 mb-3">
          <Heart size={18} className="text-navy/60" />
          <MessageCircle size={18} className="text-navy/60" />
          <Send size={18} className="text-navy/60" />
        </div>
        <p className="text-[10px] font-bold text-navy/80 leading-relaxed">
          <span className="font-black">theproject.ascend</span> Empowering the next generation... <span className="text-royal-blue">#YouthRising</span>
        </p>
      </div>
    </a>
    <Button 
      variant="navy" 
      className="mt-6 !py-2.5 !px-6 text-[10px]"
      onClick={() => window.open(INSTAGRAM_LINK, '_blank')}
    >
      Follow Movement
    </Button>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-32 bg-cream-dark/50 relative paper-texture">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <CollageCard rotation="rotate-0" tape={false} className="!p-16 !rounded-[4rem] border-none flex flex-col items-center text-center">
            <h3 className="text-5xl font-black text-navy uppercase italic mb-6 tracking-tighter">OUR SOCIALS.</h3>
            <p className="text-navy/60 font-bold mb-10 max-w-sm">Join our growing community and stay updated with our latest global impact stories.</p>
            <InstagramPreview />
          </CollageCard>
          
          <CollageCard rotation="rotate-1" className="!p-16 !bg-royal-blue !text-white !border-none !rounded-[4rem]">
            <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-12">SEND MESSAGE</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-8 py-5 rounded-3xl bg-white/10 border-2 border-white/10 text-white placeholder:text-white/40 focus:bg-white/20 focus:outline-none transition-all font-bold" 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-8 py-5 rounded-3xl bg-white/10 border-2 border-white/10 text-white placeholder:text-white/40 focus:bg-white/20 focus:outline-none transition-all font-bold" 
              />
              <textarea 
                placeholder="Your Message..." 
                rows={4} 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-8 py-5 rounded-3xl bg-white/10 border-2 border-white/10 text-white placeholder:text-white/40 focus:bg-white/20 focus:outline-none transition-all font-bold resize-none"
              ></textarea>
              <Button type="submit" variant="outline" className="w-full !border-white !text-white hover:!bg-white hover:!text-royal-blue py-6 text-xl">
                Send Application
              </Button>
            </form>
          </CollageCard>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-24 bg-white border-t border-navy/5">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <Logo className="w-24 h-24 mx-auto mb-10" />
      <h2 className="text-4xl font-black uppercase mb-6 tracking-tighter italic">PROJECT ASCEND</h2>
      <div className="flex justify-center gap-8 mb-12">
        <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="p-4 bg-royal-blue/5 rounded-2xl text-royal-blue hover:bg-royal-blue hover:text-white transition-all">
          <Instagram size={28} />
        </a>
        <div className="p-4 bg-royal-blue/5 rounded-2xl text-royal-blue">
          <Globe size={28} />
        </div>
        <div className="p-4 bg-royal-blue/5 rounded-2xl text-royal-blue">
          <Star size={28} />
        </div>
      </div>
      <p className="text-navy/40 font-bold italic max-w-md mx-auto mb-10">"A global student-led initiative empowering the next generation of leaders through communication and action."</p>
      <div className="pt-10 border-t border-navy/5 text-[10px] font-black text-navy/30 uppercase tracking-[0.5em]">
        &copy; {new Date().getFullYear()} Project Ascend International. All Rights Reserved.
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen paper-texture select-none">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Programs />
        <Impact />
        <Team />
        <Contact />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}
