import React, { useState, useEffect } from 'react';

const NoteModal = ({ isOpen, onClose, onConfirm, title, initialNote = "", isLoading }) => {
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    if (isOpen) {
      setNote(initialNote || "");
    }
  }, [isOpen, initialNote]);

  if (!isOpen) return null;

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex; justify-content: center; align-items: center;
          z-index: 1050;
          opacity: 0; animation: modalFadeIn 0.3s forwards;
        }

        .modal-content-note {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          width: 90%;
          max-width: 500px; /* Sedikit lebih lebar dari confirm modal agar enak ngetik */
          overflow: hidden;
          transform: scale(0.9); animation: modalZoomIn 0.3s forwards;
          display: flex; flex-direction: column;
        }

        .modal-header-note {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #e9ecef;
        }

        .modal-header-note h3 {
          margin: 0; font-size: 1.25rem; font-weight: 600; color: #333;
        }

        .modal-close-btn {
          background: none; border: none; font-size: 1.75rem;
          font-weight: 300; cursor: pointer; color: #6c757d;
          padding: 0; line-height: 1;
        }

        .modal-body-note {
          padding: 24px;
          font-size: 1rem; color: #495057;
        }

        /* Textarea Styling - FIXED SIZE */
        .note-textarea {
          width: 100%;
          height: 150px; /* Tinggi Fix */
          resize: none; /* Tidak bisa di-resize user */
          padding: 12px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-family: inherit;
          font-size: 0.95rem;
          line-height: 1.5;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .note-textarea:focus {
          border-color: #22c55e; /* Warna fokus hijau */
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .input-label {
          display: block; margin-bottom: 8px; font-weight: 500; color: #495057;
        }

        .modal-footer-note {
          display: flex; justify-content: flex-end; gap: 12px;
          padding: 16px 24px;
          background-color: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }

        /* Tombol - Meniru style ConfirmationModal */
        .btn-modal {
          padding: 10px 20px; border: none; border-radius: 6px;
          cursor: pointer; font-weight: 500; font-size: 0.95rem;
          transition: background-color 0.2s;
        }
        .btn-modal-secondary {
          background-color: #6c757d; color: white;
        }
        .btn-modal-secondary:hover { background-color: #5a6268; }
        
        .btn-modal-primary {
          background-color: #22c55e; color: white; /* Hijau */
        }
        .btn-modal-primary:hover { background-color: #16a34a; }
        
        .btn-modal:disabled { opacity: 0.6; cursor: not-allowed; }

        @keyframes modalFadeIn { to { opacity: 1; } }
        @keyframes modalZoomIn { to { transform: scale(1); } }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content-note" onClick={handleContentClick}>
          
          <div className="modal-header-note">
            <h3>{title}</h3>
            <button onClick={onClose} className="modal-close-btn" disabled={isLoading}>
              &times;
            </button>
          </div>

          <div className="modal-body-note">
            <label className="input-label">Isi pesan:</label>
            <textarea
              className="note-textarea"
              placeholder="Tulis pesan untuk pelanggan (misal: batas waktu pembayaran, rincian tagihan, dll)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="modal-footer-note">
            <button
              onClick={onClose}
              className="btn-modal btn-modal-secondary"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              onClick={() => onConfirm(note)}
              className="btn-modal btn-modal-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default NoteModal;