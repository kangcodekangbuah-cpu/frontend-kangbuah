import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminHeader from "../../../components/features/Admin/AdminHeader"
import "./AdminChat.css";
import { toast } from "react-toastify";
import apiClient from "../../../services/api";
import { useAuthStore } from "../../../store/authStore";
import LoadingSpinner from "../../../components/ui/Layout/LoadingSpinner";

export default function AdminChat() {
    const router = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [store, setStore] = useState({});
    const [text, setText] = useState("");
    const endRef = useRef(null);
    const currentUserId = useAuthStore((state) => state.user?.sub);
    const username = useAuthStore((state) => state.user?.username);
    const role = useAuthStore((state) => state.user?.role);
    const authStatus = useAuthStore((state) => state.authStatus);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (authStatus === 'loading') {
            return;
        }

        if (authStatus === 'unauthenticated') {
            toast.warn("Anda harus login untuk mengakses halaman ini.");

            const timer = setTimeout(() => {
                router("/", { replace: true });
            }, 1500);
            return () => clearTimeout(timer);

        } else if (authStatus === 'authenticated' && role !== "ADMIN") {
            toast.error("Anda tidak memiliki hak akses admin.");
            router("/", { replace: true });
        }
    }, [router, role, authStatus]);


    useEffect(() => {
        if (authStatus !== 'authenticated' || !currentUserId || role !== 'ADMIN') {
            return;
        }

        const fetchContacts = async () => {
            setIsLoading(true);
            try {
                const res = await apiClient.get(`/chat/list/${currentUserId}`);

                setContacts(res.data.data);
                if (res.data.data.length > 0) {
                    setActiveId(res.data.data[0].room_id);
                }
            } catch (error) {
                console.error("Gagal mengambil daftar chat:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContacts();
    }, [currentUserId, role, authStatus]);

    useEffect(() => {
        if (!activeId) return;

        const fetchMessages = async () => {
            try {
                const res = await apiClient.get(`/chat/messages/${activeId}`);

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
        if (!msg || !activeId || !currentUserId || !username) return;

        const newMessage = {
            text: msg,
            at: new Date().toISOString(),
            senderId: currentUserId,
            senderName: username,
            senderRole: 'ADMIN'
        };

        setStore(prevStore => ({
            ...prevStore,
            [activeId]: [...(prevStore[activeId] || []), newMessage]
        }));
        setText("");

        try {
            await apiClient.post(`/chat/send`, {
                roomId: activeId,
                senderId: currentUserId,
                message: msg
            });
        } catch (error) {
            console.error("Gagal mengirim pesan:", error);
            toast.error("Gagal mengirim pesan")
        }
    };

    const activeContact = useMemo(() => {
        if (!Array.isArray(contacts)) return null;
        return contacts.find((c) => c.id === activeId);
    }, [contacts, activeId]);

    if (authStatus === 'loading') {
        return (
            <>
                <AdminHeader />
                <LoadingSpinner text="Mengecek autentikasi..." />
            </>
        );
    }

    if (role !== 'ADMIN') {
        return (
            <>
                <AdminHeader />
                <LoadingSpinner text="Memverifikasi hak akses..." />
            </>
        );
    }

    if (isLoading) {
        return (
            <>
                <AdminHeader />
                <LoadingSpinner text="Memuat percakapan..." />
            </>
        );
    }

    return (
        <div className="admin-chat-pagel">
            <AdminHeader />

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
                                    <div className="avatar lg">{activeContact?.name?.slice(0, 1)}</div>
                                    <div>
                                        <div className="name">{activeContact?.name}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="messages">
                                {messages.map((m, idx) => {
                                    const isMe = m.senderId === currentUserId;
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
                        <section className="thread-placeholder">
                            <p>Pilih percakapan untuk memulai.</p>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}