import { useState, useEffect, useRef } from "react";
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
  Zap, 
  Send,
  LogIn,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import backgroundVideo from "@assets/Header Minimal (1)_1754338987422.mp4";

type Mode = "text" | "voice" | "mira" | "detector";

export default function Home() {
  const [activeMode, setActiveMode] = useState<Mode>("text");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [latency, setLatency] = useState(12);
  const [messages, setMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: Date}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const modes = [
    { id: "text" as Mode, label: "TEXT", icon: MessageSquare },
    { id: "voice" as Mode, label: "VOICE", icon: Mic },
    { id: "mira" as Mode, label: "MIRA", icon: Bot },
    { id: "detector" as Mode, label: "AI DETECTOR", icon: Shield },
  ];

  // Random latency animation
  useEffect(() => {
    const updateLatency = () => {
      // Generate random number between 6 and 36
      const newLatency = Math.floor(Math.random() * (36 - 6 + 1)) + 6;
      setLatency(newLatency);
      
      // Set next random interval between 1.5 and 6 seconds
      const nextInterval = Math.random() * (6000 - 1500) + 1500;
      setTimeout(updateLatency, nextInterval);
    };

    // Start the first update after a random initial delay
    const initialDelay = Math.random() * 2000 + 1000;
    const timeoutId = setTimeout(updateLatency, initialDelay);

    return () => clearTimeout(timeoutId);
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // API function for sending messages to Mira
  async function sendMessageToMira(message: string): Promise<string> {
    try {
      const response = await fetch("https://AskMira-Backend-Text.replit.app/api/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      if (data.reply) {
        return data.reply;
      } else if (data.error) {
        return "❌ Error: " + data.error;
      } else {
        return "❌ Unknown error occurred.";
      }
    } catch (error) {
      return "❌ Network error: Unable to reach Mira backend.";
    }
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim() && activeMode === "text" && !isLoading) {
      const userMessage = inputMessage.trim();
      const userMessageObj = {
        id: Date.now().toString(),
        text: userMessage,
        isUser: true,
        timestamp: new Date()
      };
      
      // Add user message and clear input
      setMessages(prev => [...prev, userMessageObj]);
      setInputMessage("");
      setIsLoading(true);
      
      try {
        // Get AI response
        const reply = await sendMessageToMira(userMessage);
        const aiMessageObj = {
          id: (Date.now() + 1).toString(),
          text: reply,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessageObj]);
      } catch (error) {
        const errorMessageObj = {
          id: (Date.now() + 1).toString(),
          text: "❌ Failed to send message. Please try again.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessageObj]);
      } finally {
        setIsLoading(false);
      }
    } else if (inputMessage.trim() && activeMode !== "text") {
      console.log("Sending message for mode:", activeMode, inputMessage);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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
          futuristic-sidebar
          ${sidebarCollapsed && !sidebarOpen ? 'sidebar-collapsed' : ''}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
          fixed md:relative 
          z-40 
          w-80 md:w-70 
          flex flex-col 
          h-full 
          transition-all duration-300 ease-in-out
        `}
      >
        {/* Collapse Button - Hidden on mobile */}
        <Button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="collapse-btn hidden md:flex w-8 h-8 p-0 rounded-md border-0 bg-[#17191b]"
          data-testid="button-collapse-sidebar"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="collapse-btn-icon h-4 w-4" style={{ color: "var(--askmira-primary)" }} />
          ) : (
            <PanelLeftClose className="collapse-btn-icon h-4 w-4" style={{ color: "var(--askmira-primary)" }} />
          )}
        </Button>

        {/* Status indicator */}
        <div className="sidebar-status-indicator"></div>

        {/* Main Content - wrapped for collapse animation */}
        <div className="sidebar-content flex flex-col h-full">
          {/* Header Section */}
          <div className="p-4 pt-16 md:pt-6">
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-[var(--askmira-primary)] rounded-full animate-pulse"></div>
                <span className="text-xs font-mono tracking-wider text-[var(--askmira-primary)] opacity-70">
                  NEURAL CHAT SYSTEM
                </span>
              </div>
              <div className="text-xs font-mono text-[var(--askmira-text-muted)] opacity-50 mb-4">[INTERFACE_v0.01]</div>
            </div>

            {/* New Chat Button */}
            <Button 
              className="neural-chat-btn w-full flex items-center justify-center gap-2 px-4 py-3 font-medium rounded-lg border-0 bg-[#17191b]"
              onClick={() => {
                console.log("New chat created");
                setSidebarOpen(false);
              }}
              data-testid="button-new-chat"
            >
              <Plus className="h-4 w-4" style={{ color: "var(--askmira-primary)" }} />
              <span style={{ color: "var(--askmira-primary)" }}>New Neural Session</span>
            </Button>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-4">
            <div className="relative neural-search rounded-lg">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
                style={{ color: "var(--askmira-text-muted)" }} 
              />
              <Input
                type="text"
                placeholder="▶ Search neural paths..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg placeholder:text-[var(--askmira-text-muted)] border-0 bg-transparent font-mono text-sm"
                style={{ 
                  color: "rgba(255, 255, 255, 0.8)",
                  letterSpacing: '0.5px'
                }}
                data-testid="input-search"
              />
            </div>
          </div>

          {/* Chat List Area */}
          <div className="flex-1 px-4">
            <div className="chat-list-empty p-6 text-center">
              <div className="mb-3">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-[var(--askmira-primary)] to-transparent opacity-20"></div>
              </div>
              <div className="text-xs font-mono tracking-wider" style={{ color: "var(--askmira-text-muted)" }}>
                NO ACTIVE SESSIONS
              </div>
              <div className="text-xs font-mono mt-1 opacity-50" style={{ color: "var(--askmira-text-muted)" }}>
                Initialize new connection
              </div>
            </div>
          </div>

          {/* Sign In Button */}
          <div className="p-4">
            <Button 
              className="neural-signin-btn w-full font-semibold py-3 rounded-lg border-0 transition-all duration-300 hover:scale-105"
              onClick={() => {
                console.log("Sign in clicked");
                setSidebarOpen(false);
              }}
              data-testid="button-signin"
              style={{
                background: "linear-gradient(135deg, rgba(0, 214, 172, 1) 0%, rgba(0, 180, 144, 1) 100%)",
                border: "1px solid rgba(0, 214, 172, 0.5)",
                boxShadow: "0 4px 25px rgba(0, 214, 172, 0.4), 0 0 20px rgba(0, 214, 172, 0.2)",
                color: "white"
              }}
            >
              <LogIn 
                className="mr-2 h-4 w-4" 
                style={{ color: "white" }} 
              />
              <span style={{ color: "white" }}>
                Neural Authentication
              </span>
            </Button>
          </div>

          {/* Footer Status */}
          <div className="px-4 pb-3">
            <div className="text-xs font-mono text-center text-[var(--askmira-text-muted)] opacity-30">
              STATUS: OPERATIONAL
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-10 z-0"
          src={backgroundVideo}
        />
        
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col h-full">
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
        <div className="flex-1 px-4 sm:px-8">
          {activeMode === "text" ? (
            /* Chat Messages Area for Text Mode */
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div 
                      className="askmira-upload-area w-full max-w-3xl h-56 sm:h-72 flex flex-col items-center justify-center relative group"
                      onClick={() => console.log("Upload area clicked")}
                    >
                      {/* Neural connection grid background */}
                      <div className="neural-connection-grid"></div>
                      
                      {/* Floating particles */}
                      <div className="floating-particles"></div>
                      
                      {/* Main content */}
                      <div className="relative z-10 flex flex-col items-center justify-center">
                        <div className="relative mb-6">
                          <Zap 
                            className="h-16 w-16 sm:h-20 sm:w-20 transition-all duration-500 group-hover:scale-110" 
                            style={{ 
                              color: "var(--askmira-primary)",
                              filter: "drop-shadow(0 0 20px rgba(0, 212, 170, 0.4))"
                            }} 
                          />
                          {/* Icon glow effect */}
                          <div className="absolute inset-0 h-16 w-16 sm:h-20 sm:w-20 bg-[var(--askmira-primary)] rounded-full opacity-20 blur-xl animate-pulse"></div>
                        </div>
                        
                        <div className="text-center space-y-2">
                          <p className="text-xs sm:text-sm font-mono tracking-wider opacity-60" style={{ 
                            color: "var(--askmira-text-muted)",
                            letterSpacing: "1px"
                          }}>INITIALIZE CONNECTION OR UPLOAD DATA PACKAGE</p>
                        </div>
                      </div>
                      
                      {/* Corner accent lines */}
                      <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-[var(--askmira-primary)] opacity-30 transition-opacity duration-300 group-hover:opacity-60"></div>
                      <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-[var(--askmira-primary)] opacity-30 transition-opacity duration-300 group-hover:opacity-60"></div>
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-[var(--askmira-primary)] opacity-30 transition-opacity duration-300 group-hover:opacity-60"></div>
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-[var(--askmira-primary)] opacity-30 transition-opacity duration-300 group-hover:opacity-60"></div>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-lg font-mono text-sm ${
                          message.isUser 
                            ? 'bg-gradient-to-r from-[var(--askmira-primary)] to-[rgba(0,212,170,0.8)] text-white' 
                            : 'bg-[rgba(26,26,26,0.6)] border border-[rgba(0,212,170,0.2)] text-[var(--askmira-text)]'
                        }`}
                        style={{
                          backdropFilter: 'blur(10px)',
                          boxShadow: message.isUser 
                            ? '0 4px 15px rgba(0, 212, 170, 0.3)' 
                            : '0 4px 15px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))
                )}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-3 rounded-lg bg-[rgba(26,26,26,0.6)] border border-[rgba(0,212,170,0.2)]">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[var(--askmira-primary)] rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-[var(--askmira-primary)] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-[var(--askmira-primary)] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>
            </div>
          ) : (
            /* Upload Area for Other Modes */
            <div className="flex items-center justify-center h-full">
              <div 
                className="askmira-upload-area w-full max-w-3xl h-56 sm:h-72 flex flex-col items-center justify-center relative group"
                onClick={() => console.log("Upload area clicked")}
              >
                {/* Neural connection grid background */}
                <div className="neural-connection-grid"></div>
                
                {/* Floating particles */}
                <div className="floating-particles"></div>
                
                {/* Main content */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="relative mb-6">
                    <Zap 
                      className="h-16 w-16 sm:h-20 sm:w-20 transition-all duration-500 group-hover:scale-110" 
                      style={{ 
                        color: "var(--askmira-primary)",
                        filter: "drop-shadow(0 0 20px rgba(0, 212, 170, 0.4))"
                      }} 
                    />
                    {/* Icon glow effect */}
                    <div className="absolute inset-0 h-16 w-16 sm:h-20 sm:w-20 bg-[var(--askmira-primary)] rounded-full opacity-20 blur-xl animate-pulse"></div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-xs sm:text-sm font-mono tracking-wider opacity-60" style={{ 
                      color: "var(--askmira-text-muted)",
                      letterSpacing: "1px"
                    }}>INITIALIZE CONNECTION OR UPLOAD DATA PACKAGE</p>
                  </div>
                </div>
                
                {/* Corner accent lines */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-[var(--askmira-primary)] opacity-30 transition-opacity duration-300 group-hover:opacity-60"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-[var(--askmira-primary)] opacity-30 transition-opacity duration-300 group-hover:opacity-60"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-[var(--askmira-primary)] opacity-30 transition-opacity duration-300 group-hover:opacity-60"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-[var(--askmira-primary)] opacity-30 transition-opacity duration-300 group-hover:opacity-60"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6">
          <div className="max-w-4xl mx-auto relative">
            {/* Status Bar */}
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center space-x-3">
              </div>
              <div className="text-xs font-mono text-[var(--askmira-text-muted)] opacity-50">
                [SECURE_CHANNEL]
              </div>
            </div>

            {/* Input Container */}
            <div className="futuristic-input-container rounded-xl">
              <div className="neural-grid"></div>
              
              {/* Data stream indicator */}
              <div className="data-stream">
                &gt;&gt; DATA_STREAM_ACTIVE
              </div>

              <Input
                type="text"
                placeholder="Enter neural transmission"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="askmira-input w-full pl-6 sm:pl-8 pr-12 sm:pr-14 py-4 sm:py-5 rounded-lg text-sm sm:text-lg placeholder:text-[var(--askmira-text-muted)] font-mono tracking-wide border-0 bg-transparent"
                style={{ 
                  letterSpacing: '0.5px',
                  textShadow: '0 0 15px rgba(0, 212, 170, 0.4)'
                }}
              />
              
              <div className="status-dots">
                <div className="status-dot"></div>
                <div className="status-dot"></div>
                <div className="status-dot"></div>
              </div>
              
              {/* Enhanced corner indicators */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[var(--askmira-primary)] opacity-40 transition-all duration-300 group-hover:opacity-80"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[var(--askmira-primary)] opacity-40 transition-all duration-300 group-hover:opacity-80"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[var(--askmira-primary)] opacity-40 transition-all duration-300 group-hover:opacity-80"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[var(--askmira-primary)] opacity-40 transition-all duration-300 group-hover:opacity-80"></div>
            </div>

            {/* Connection Status Footer */}
            <div className="flex items-center justify-center mt-3 space-x-4 text-xs font-mono text-[var(--askmira-text-muted)] opacity-40">
              <span>LATENCY: {latency}ms</span>
              <span>•</span>
              <span>ENCRYPTION: AES-256</span>
              <span>•</span>
              <span>BANDWIDTH: ∞</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
