import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Mic, 
  Bot, 
  Shield, 
  Wifi, 
  Briefcase, 
  Send,
  LogIn,
  Menu,
  X
} from "lucide-react";

type Mode = "text" | "voice" | "mira" | "detector" | "neural";

export default function Home() {
  const [activeMode, setActiveMode] = useState<Mode>("text");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const modes = [
    { id: "text" as Mode, label: "TEXT", icon: MessageSquare },
    { id: "voice" as Mode, label: "VOICE", icon: Mic },
    { id: "mira" as Mode, label: "MIRA", icon: Bot },
    { id: "detector" as Mode, label: "AI DETECTOR", icon: Shield },
    { id: "neural" as Mode, label: "NEURAL LINK", icon: Wifi },
  ];

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      console.log("Message sent:", inputMessage);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[var(--askmira-dark-300)] to-[var(--askmira-dark-400)] text-white">
      {/* Mobile Menu Button */}
      <Button
        className="fixed top-4 left-4 z-50 md:hidden p-2"
        style={{ backgroundColor: "var(--askmira-dark-200)" }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
          fixed md:relative 
          z-40 
          w-80 md:w-70 
          flex flex-col 
          h-full 
          transition-transform duration-300 ease-in-out
        `}
        style={{ 
          backgroundColor: "var(--askmira-dark-200)", 
          borderRight: "1px solid var(--askmira-dark-100)" 
        }}
      >
        {/* New Chat Button */}
        <div className="p-4 pt-16 md:pt-4">
          <Button 
            className="askmira-sidebar-btn w-full flex items-center justify-center gap-2 px-4 py-3 font-medium"
            style={{ backgroundColor: "var(--askmira-dark-100)" }}
            onClick={() => {
              console.log("New chat created");
              setSidebarOpen(false);
            }}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: "var(--askmira-text-muted)" }} />
            <Input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="askmira-input w-full pl-10 pr-4 py-2 rounded-lg placeholder:text-[var(--askmira-text-muted)] border-[var(--askmira-border)]"
            />
          </div>
        </div>

        {/* Chat List Area */}
        <div className="flex-1 px-4">
          <div className="text-center mt-8" style={{ color: "var(--askmira-text-muted)" }}>
            No chats yet
          </div>
        </div>

        {/* Sign In Button */}
        <div className="p-4">
          <Button 
            className="w-full font-semibold py-3 rounded-lg transition-all duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: "var(--askmira-primary)", 
              color: "var(--askmira-dark-400)" 
            }}
            onClick={() => {
              console.log("Sign in clicked");
              setSidebarOpen(false);
            }}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-center py-6 px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-center" style={{ color: "var(--askmira-primary)" }}>
            AskMira
          </h1>
        </div>

        {/* Toggle Buttons */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-4 mb-6 md:mb-8 px-2 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 sm:gap-2 lg:gap-4">
            {modes.map((mode) => {
              const IconComponent = mode.icon;
              const isActive = activeMode === mode.id;
              
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`
                    askmira-toggle-btn 
                    ${isActive ? 'active' : ''} 
                    whitespace-nowrap 
                    text-xs sm:text-sm 
                    px-2 sm:px-4 lg:px-6 
                    py-2 
                    flex-shrink-0
                    flex
                    items-center
                  `}
                  style={{
                    color: isActive ? "var(--askmira-primary)" : "rgba(255, 255, 255, 0.7)"
                  }}
                >
                  <IconComponent className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{mode.label}</span>
                  <span className="sm:hidden">
                    {mode.label === "AI DETECTOR" ? "AI" : 
                     mode.label === "NEURAL LINK" ? "NEURAL" : mode.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
          <div 
            className="askmira-upload-area w-full max-w-2xl h-48 sm:h-64 flex flex-col items-center justify-center"
            onClick={() => console.log("Upload area clicked")}
          >
            <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 mb-4" style={{ color: "var(--askmira-text-muted)" }} />
            <p className="text-sm sm:text-lg text-center px-4" style={{ color: "var(--askmira-text-muted)" }}>
              Initialize Neural Connection or Upload Data Package
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6">
          <div className="max-w-4xl mx-auto relative">
            <Input
              type="text"
              placeholder="Enter neural data transmission..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="askmira-input w-full pl-4 sm:pl-6 pr-12 sm:pr-16 py-3 sm:py-4 rounded-lg text-sm sm:text-lg placeholder:text-[var(--askmira-text-muted)]"
            />
            <Button
              onClick={handleSendMessage}
              className="askmira-send-btn absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-2 sm:p-3"
              style={{ 
                color: "var(--askmira-dark-400)" 
              }}
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
