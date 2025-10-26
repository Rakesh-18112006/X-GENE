import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import api from "../services/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI health assistant. I'm here to help you with health advice, answer questions about your wellness journey, and provide personalized recommendations. How can I assist you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await api.post("/chat/message", {
        message: input,
      });

      const data = await res.data;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "Sorry, I could not generate a response.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content:
          "There was an issue connecting to the health assistant. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    "What should I eat for better heart health?",
    "How can I improve my sleep quality?",
    "What exercises are best for beginners?",
    "Tips for managing stress?",
  ];

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-2"
        >
          AI Health Assistant
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#a0a3bd]"
        >
          Get personalized health advice powered by AI
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Window */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00d9ff] to-[#0099ff] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-[#00d9ff] to-[#0099ff] text-white"
                          : "bg-[#1a1c24] border border-[#2a2d3a]"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="w-10 h-10 bg-[#1a1c24] border border-[#2a2d3a] rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00d9ff] to-[#0099ff] rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-[#1a1c24] border border-[#2a2d3a] px-4 py-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#00d9ff] rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-[#00d9ff] rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-[#00d9ff] rounded-full animate-pulse delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-[#2a2d3a] p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your health..."
                  className="flex-1 px-4 py-3 bg-[#1a1c24] border border-[#2a2d3a] rounded-lg text-white placeholder-[#6b6f8a] focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 transition-all duration-300"
                />
                <Button
                  variant="primary"
                  onClick={handleSend}
                  disabled={!input.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions and Features */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#00d9ff]" />
              <h3 className="font-bold">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInput(action)}
                  className="w-full text-left px-3 py-2 bg-[#1a1c24] hover:bg-[#20222d] border border-[#2a2d3a] hover:border-[#00d9ff]/50 rounded-lg text-sm text-[#a0a3bd] hover:text-white transition-all duration-300"
                >
                  {action}
                </motion.button>
              ))}
            </div>
          </Card>

          <Card glass>
            <h3 className="font-bold mb-3">AI Features</h3>
            <ul className="space-y-2 text-sm text-[#a0a3bd]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#00d9ff] rounded-full mt-2 flex-shrink-0" />
                <span>Personalized health advice</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#00d9ff] rounded-full mt-2 flex-shrink-0" />
                <span>Symptom analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#00d9ff] rounded-full mt-2 flex-shrink-0" />
                <span>Wellness recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#00d9ff] rounded-full mt-2 flex-shrink-0" />
                <span>24/7 availability</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
