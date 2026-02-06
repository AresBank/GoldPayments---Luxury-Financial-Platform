
import React, { useState, useRef, useEffect } from 'react';
import type { Transaction } from '../types';
import { callGemini } from '../services/geminiService';
import { ChatIcon, SendIcon, CloseIcon } from './icons/Icons';

interface ChatbotProps {
  transactions: Transaction[];
}

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ transactions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const botResponse = await callGemini(input, transactions);
            const botMessage: Message = { sender: 'bot', text: botResponse };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Gemini API call failed:", error);
            const errorMessage: Message = { sender: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if(isOpen && messages.length === 0) {
            setTimeout(() => {
                 setMessages([{ sender: 'bot', text: "Hello! How can I help you with your finances today?" }]);
            }, 500);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-yellow-400 text-gray-900 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform"
                aria-label="Toggle Financial Assistant"
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-gray-800 rounded-2xl shadow-2xl flex flex-col border border-yellow-500/20 animate-fade-in-up">
                    <header className="p-4 bg-gray-900/50 rounded-t-2xl border-b border-yellow-500/20">
                        <h3 className="font-bold text-yellow-400 text-lg text-center">Financial Assistant</h3>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-yellow-400 text-gray-900 rounded-br-none' : 'bg-gray-700 text-white rounded-bl-none'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-2 rounded-2xl bg-gray-700 text-white rounded-bl-none">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t border-yellow-500/20">
                        <div className="flex items-center bg-gray-700 rounded-full p-1">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about your spending..."
                                className="flex-1 bg-transparent px-4 py-2 text-white outline-none placeholder-gray-400"
                            />
                            <button onClick={handleSend} disabled={isLoading} className="bg-yellow-400 rounded-full w-9 h-9 flex items-center justify-center text-gray-900 disabled:bg-gray-500">
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
