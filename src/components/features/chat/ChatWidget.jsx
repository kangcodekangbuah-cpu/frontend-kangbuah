// src/components/features/Chat/ChatWidget.jsx

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./ChatWidget.css";

// --- Helper Functions ---
// Fungsi untuk mengambil token dari localStorage
const getToken = () => localStorage.getItem("token");

// Fungsi untuk mendapatkan user ID dari token
const getUserIdFromToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded.sub; 
    } catch (error) {
        console.error("Token tidak valid:", error);
        return null;
    }
};

export default function ChatWidget({isLoggedIn}) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [roomId, setRoomId] = useState(null); 
    const [isLoading, setIsLoading] = useState(false); 
    const messagesEndRef = useRef(null);
    const customerId = getUserIdFromToken();

    // Auto-scroll ke pesan terakhir
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleOpenChat = async () => {
        // Balikkan state isOpen
        setIsOpen(prev => !prev);

        // Jika widget akan dibuka (state sebelumnya adalah false)
        // dan user sudah login, maka fetch data terbaru.
        if (!isOpen && isLoggedIn) {
            setIsLoading(true);
            setMessages([]); // Kosongkan pesan lama agar tidak ada flash content
            try {
                const token = getToken();
                
                // 1. Buat atau dapatkan room chat
                const roomResponse = await axios.post("http://localhost:3000/chat/create-room", 
                    { customerId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const currentRoomId = roomResponse.data.data.room_id;
                setRoomId(currentRoomId);

                // 2. Ambil riwayat pesan terbaru untuk room tersebut
                const messagesResponse = await axios.get(`http://localhost:3000/chat/messages/${currentRoomId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // 3. Format pesan untuk UI
                const formattedMessages = messagesResponse.data.data.map(msg => ({
                    id: msg.message_id,
                    role: msg.user_id === customerId ? 'user' : 'admin',
                    content: msg.message_content,
                    time: new Date(msg.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                }));
                setMessages(formattedMessages);

            } catch (error) {
                console.error("Gagal memulai chat:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSendMessage = async () => {
        const trimmedMessage = newMessage.trim();
        if (trimmedMessage === "" || !roomId) return;

        const sentMessage = {
            id: Date.now(), // ID sementara untuk UI
            role: "user",
            content: trimmedMessage,
            time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        };
        
        // Optimistic UI Update: Tampilkan pesan langsung
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage("");

        // Kirim pesan ke backend
        try {
            await axios.post("http://localhost:3000/chat/send", {
                roomId: roomId,
                senderId: customerId,
                message: trimmedMessage,
            }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
        } catch (error) {
            console.error("Gagal mengirim pesan:", error);
            // TODO: Handle jika pesan gagal terkirim (misal, tandai pesan dengan ikon error)
        }
    };

    // Jangan render widget sama sekali jika pengguna belum login
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