import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminHeader from "../../../components/features/Admin/AdminHeader"
import { jwtDecode } from "jwt-decode";
import "./AdminChat.css";
import { toast } from "react-toastify";
import axios from "axios";

const getUserInfoFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return {
            id: decoded.sub,
            name: decoded.username,
            role: decoded.role
        }
    } catch (error) {
        console.error("Token decode error:", error);
        return error;
    }
};

export default function AdminChat() {
    const router = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [activeId, setActiveId] = useState(null); // Mulai dari null karena belum ada kontak yang dipilih
    const [store, setStore] = useState({}); // { [contactId]: Message[] }
    const [text, setText] = useState("");
    const endRef = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const currentUser = getUserInfoFromToken();
    const currentUserId = currentUser?.id;


    useEffect(() => {
        if (!currentUser) {
            router("/login", { replace: true });
        } else if (currentUser.role !== 'ADMIN') {
            router("/catalog", { replace: true });
        }
    }, [router, currentUser]);


    useEffect(() => {
        if (!currentUserId) return;

        const fetchContacts = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`http://localhost:3000/chat/list/${currentUserId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // PERBAIKAN: Hapus .data kedua. res.data sudah merupakan array.
                setContacts(res.data.data);
                if (res.data.length > 0) {
                    setActiveId(res.data.data[0].id);
                }
            } catch (error) {
                console.error("Gagal mengambil daftar chat:", error);
            }
        };
        fetchContacts();
    }, [currentUserId]);

    useEffect(() => {
        if (!activeId) return;

        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`http://localhost:3000/chat/messages/${activeId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // PERBAIKAN: Hapus .data kedua. res.data sudah merupakan array.
                const formattedMessages = res.data.data.map(msg => ({
                    text: msg.message_content,
                    at: msg.timestamp,
                    senderId: msg.user_id,
                    senderName: msg.users.username,
                    senderRole: msg.users.role
                }));

                setStore(prevStore => ({ ...prevStore, [activeId]: formattedMessages }));
            } catch (error) {
                console.error("Gagal mengambil pesan:", error);
            }
        };
        fetchMessages();
    }, [activeId]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [store, activeId]);

    const messages = useMemo(() => store[activeId] || [], [store, activeId]);

    // --- Functions ---
    const send = async () => {
        const msg = text.trim();
        if (!msg || !activeId || !currentUser) return;

        const newMessage = {
            text: msg,
            at: new Date().toISOString(),
            senderId: currentUser.id,
            senderName: currentUser.username,
            senderRole: 'ADMIN'
        };
        // Optimistic UI update: langsung tampilkan pesan di layar
        setStore(prevStore => ({
            ...prevStore,
            [activeId]: [...(prevStore[activeId] || []), newMessage]
        }));
        setText("");

        try {
            const token = localStorage.getItem("token");
            await axios.post(`http://localhost:3000/chat/send`, {
                roomId: activeId,
                senderId: currentUserId,
                message: msg
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Gagal mengirim pesan:", error);
            toast.error("Gagal mengirim pesan")
        }
    };

    // Dapatkan detail kontak yang sedang aktif
    const activeContact = useMemo(() => {
        return contacts.find((c) => c.id === activeId);
    }, [contacts, activeId]);

    return (
        <div className="admin-chat-pagel">
            {/* 1. Menggunakan komponen AdminHeader */}
            <AdminHeader setIsLoggedIn={setIsLoggedIn} />

            <main className="chat-main">
                <div className="maxw chat-layout">
                    <aside className="sidebar">
                        <div className="sidebar-head">Percakapan</div>
                        <div className="contact-list">
                            {contacts.map((c) => (
                                <button
                                    key={c.id}
                                    className={`contact ${activeId === c.id ? "active" : ""}`}
                                    onClick={() => setActiveId(c.id)}
                                >
                                    <div className="avatar">{c.name.slice(0, 1)}</div>
                                    <div className="meta">
                                        <div className="name">{c.name}</div>
                                        <div className="last">{c.last}</div>
                                    </div>
                                    {c.unread > 0 && <span className="badge">{c.unread}</span>}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* 2. Tampilkan chat thread hanya jika ada kontak yang dipilih */}
                    {activeId && activeContact ? (
                        <section className="thread">
                            <div className="thread-head">
                                <div className="contact-title">
                                    <div className="avatar lg">{activeContact.name.slice(0, 1)}</div>
                                    <div>
                                        <div className="name">{activeContact.name}</div>
                                        <div className="status">online</div>
                                    </div>
                                </div>
                            </div>

                            <div className="messages">
                                {messages.map((m, idx) => {
                                    const isMe = m.senderId === currentUser.id;
                                    const isAdminSender = m.senderRole === 'ADMIN';

                                    const bubbleClass = isMe ? 'sent' : isAdminSender ? 'recv-admin' : 'recv-user'

                                    return (
                                        <div key={idx} className={`bubble ${bubbleClass}`}>
                                            {!isMe && (
                                                <div className="sender-name">
                                                    {m.senderName}
                                                </div>
                                            )}
                                            <div className="text">{m.text}</div>
                                            <div className="time">
                                                {new Date(m.at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={endRef} />
                            </div>

                            <div className="composer">
                                <input
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Tulis pesan..."
                                    onKeyDown={(e) => e.key === "Enter" && send()}
                                />
                                <button className="send" onClick={send}>Kirim</button>
                            </div>
                        </section>
                    ) : (
                        // Tampilkan placeholder jika belum ada chat yang dipilih
                        <section className="thread placeholder">
                            <p>Pilih percakapan untuk memulai.</p>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}