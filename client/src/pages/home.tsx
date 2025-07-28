import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Keyboard, 
  Mic, 
  Bot, 
  SearchCheck, 
  Brain, 
  Briefcase, 
  Send,
  LogIn
} from "lucide-react";

type Mode = "text" | "voice" | "mira" | "detector" | "neural";

export default function Home() {
  const [activeMode, setActiveMode] = useState<Mode>("text");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputMessage, setInputMessage] = useState("");

  const modes = [
    { id: "text" as Mode, label: "TEXT", icon: Keyboard },
    { id: "voice" as Mode, label: "VOICE", icon: Mic },
    { id: "mira" as Mode, label: "MIRA", icon: Bot },
    { id: "detector" as Mode, label: "AI DETECTOR", icon: SearchCheck },
    { id: "neural" as Mode, label: "NEURAL LINK", icon: Brain },
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
      {/* Sidebar */}
      <div className="w-70 flex flex-col" style={{ 
        backgroundColor: "var(--askmira-dark-200)", 
        borderRight: "1px solid var(--askmira-dark-100)" 
      }}>
        {/* New Chat Button */}
        <div className="p-4">
          <Button 
            className="askmira-sidebar-btn w-full flex items-center justify-center gap-2 px-4 py-3 font-medium"
            style={{ backgroundColor: "var(--askmira-dark-100)" }}
            onClick={() => console.log("New chat created")}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: "var(--askmira-text-muted)" }} />
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
            onClick={() => console.log("Sign in clicked")}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center py-6">
          <h1 className="text-4xl font-bold" style={{ color: "var(--askmira-primary)" }}>
            AskMira
          </h1>
        </div>

        {/* Toggle Buttons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {modes.map((mode) => {
            const IconComponent = mode.icon;
            const isActive = activeMode === mode.id;
            
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`askmira-toggle-btn ${isActive ? 'active' : ''}`}
                style={{
                  color: isActive ? "var(--askmira-primary)" : "var(--askmira-text-muted)",
                  borderColor: isActive ? "var(--askmira-primary)" : "var(--askmira-border)",
                  backgroundColor: isActive ? "rgba(0, 212, 170, 0.2)" : "transparent"
                }}
              >
                <IconComponent className="mr-2 h-4 w-4" />
                {mode.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div 
            className="askmira-upload-area w-full max-w-2xl h-64 flex flex-col items-center justify-center"
            onClick={() => console.log("Upload area clicked")}
          >
            <Briefcase className="h-16 w-16 mb-4" style={{ color: "var(--askmira-text-muted)" }} />
            <p className="text-lg" style={{ color: "var(--askmira-text-muted)" }}>
              Initialize Neural Connection or Upload Data Package
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto relative">
            <Input
              type="text"
              placeholder="Enter neural data transmission..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="askmira-input w-full pl-6 pr-16 py-4 rounded-2xl text-lg placeholder:text-[var(--askmira-text-muted)]"
            />
            <Button
              onClick={handleSendMessage}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-3 rounded-xl transition-all duration-200 hover:opacity-90"
              style={{ 
                backgroundColor: "var(--askmira-primary)", 
                color: "var(--askmira-dark-400)" 
              }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
