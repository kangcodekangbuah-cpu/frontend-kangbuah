// src/components/features/Chat/ChatWidget.jsx

import { useState, useEffect, useRef } from "react";
import "./ChatWidget.css";
import { useAuthStore } from "../../../store/authStore";
import apiClient from "../../../services/api";


export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [roomId, setRoomId] = useState(null); 
    const [isLoading, setIsLoading] = useState(false); 
    const messagesEndRef = useRef(null);
    const customerId = useAuthStore((state) => state.user?.sub);
    const isLoggedIn = useAuthStore((state) => !!state.user);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleOpenChat = async () => {
        setIsOpen(prev => !prev);

        if (!isOpen && isLoggedIn) {
            setIsLoading(true);
            setMessages([]);
            try {
                const roomResponse = await apiClient.post("/chat/create-room",
                    { customerId }
                );

                const currentRoomId = roomResponse.data.data.room_id;
                setRoomId(currentRoomId);

                const messagesResponse = await apiClient.get(`/chat/messages/${currentRoomId}`);

                const formattedMessages = messagesResponse.data.data.map(msg => ({
                    id: msg.message_id,
                    role: msg.user_id === customerId ? 'user' : 'admin',
                    content: msg.message_content,
                    time: new Date(msg.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                }));
                setMessages(formattedMessages);

            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                   setIsOpen(false);
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSendMessage = async () => {
        const trimmedMessage = newMessage.trim();
        if (trimmedMessage === "" || !roomId) return;

        const sentMessage = {
            id: Date.now(),
            role: "user",
            content: trimmedMessage,
            time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        };
        
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage("");

        try {
            await apiClient.post("/chat/send", {
                roomId: roomId,
                senderId: customerId,
                message: trimmedMessage,
            });
        } catch (error) {
            console.error("Gagal mengirim pesan:", error);
            // TODO: Handle jika pesan gagal terkirim
        }
    };

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="floating-chat">
            <button className="chat-toggle-btn" onClick={handleOpenChat}>
                {isOpen ? "✕" : "💬"}
            </button>

            {isOpen && (
                <div className="chat-popup">
                    <div className="chat-popup-header">
                        <h4>Konsultasi</h4>
                        <button className="chat-close-btn" onClick={() => setIsOpen(false)}>×</button>
                    </div>
                    <div className="chat-messages">
                        {isLoading ? (
                            <div className="loading-chat">Memuat percakapan...</div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className={`message ${msg.role}-message`}>
                                    <div className="message-content">{msg.content}</div>
                                    <div className="message-time">{msg.time}</div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            placeholder="Ketik pesan..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            disabled={isLoading}
                        />
                        <button className="send-btn" onClick={handleSendMessage} disabled={isLoading}>Kirim</button>
                    </div>
                </div>
            )}
        </div>
    );
}