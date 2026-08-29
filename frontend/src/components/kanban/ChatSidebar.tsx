'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Hash, MoreVertical, Search, MessageSquare, PhoneCall, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
    id: string;
    user: string;
    avatar: string;
    content: string;
    timestamp: string;
    isMe: boolean;
}
interface ChatSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onStartVideoCall: () => void;
    currentUser: any;
    channelName: string;
    messages: Message[];
    onSendMessage: (msg: any) => void;
}

export default function ChatSidebar({ isOpen, onClose, onStartVideoCall, currentUser, channelName, messages, onSendMessage }: ChatSidebarProps) {
    const [message, setMessage] = useState('');

    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new message arrives
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        onSendMessage({
            id: Date.now().toString(),
            user: currentUser?.name || currentUser?.email || 'User',
            avatar: currentUser?.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser?.name || 'U'}&background=random`,
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        setMessage('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
                        onClick={onClose}
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                        className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-sm flex-col overflow-hidden border-l border-white/10 bg-zinc-950/80 shadow-2xl backdrop-blur-2xl sm:w-[400px]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                                    <Hash size={20} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-white capitalize">{channelName} Team</h2>
                                    <p className="text-xs text-emerald-400 font-medium">● System Online</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={onStartVideoCall} className="h-9 w-9 rounded-full text-zinc-300 hover:bg-emerald-500/20 hover:text-emerald-400">
                                    <Video size={18} />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9 rounded-full text-zinc-400 hover:bg-white/10 hover:text-white">
                                    <X size={18} />
                                </Button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col scrollbar-thin scrollbar-thumb-white/10">
                            <div className="flex justify-center">
                                <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Today</span>
                            </div>

                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                                    <Avatar className="h-8 w-8 shrink-0 ring-2 ring-black">
                                        <AvatarImage src={msg.avatar} />
                                        <AvatarFallback>{msg.user[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className={`flex flex-col gap-1 ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-medium text-zinc-300">{msg.user}</span>
                                            <span className="text-[10px] text-zinc-500">{msg.timestamp}</span>
                                        </div>
                                        <div className={`relative max-w-[280px] rounded-2xl px-4 py-2.5 text-sm ${msg.isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white/10 text-zinc-100 rounded-tl-sm'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={endOfMessagesRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-white/5 bg-white/5 p-4">
                            <form onSubmit={handleSendMessage} className="relative flex items-center">
                                <div className="absolute left-3 flex items-center text-zinc-500">
                                    <PlusCircleIcon />
                                </div>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={`Message #${channelName.toLowerCase().replace(/\s/g, '-')}-team...`}
                                    className="w-full rounded-full border border-white/10 bg-black/40 py-3 pl-12 pr-12 text-sm text-white placeholder:text-zinc-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim()}
                                    className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white transition-transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50"
                                >
                                    <Send size={14} className="ml-0.5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Just an inline quick SVG icon since plus circle was removed from lucide import
function PlusCircleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" />
        </svg>
    );
}
