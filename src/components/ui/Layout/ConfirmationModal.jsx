import React from 'react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  confirmVariant = 'danger',
  isLoading = false,
}) => {
  if (!isOpen) {
    return null;
  }

  const confirmButtonClass = `btn ${
    confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary'
  }`;

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <style>
        {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1050; /* Pastikan di atas konten lain */
            opacity: 0;
            animation: modalFadeIn 0.3s forwards;
          }

          .modal-content-confirm {
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            width: 90%;
            max-width: 450px;
            overflow: hidden;
            transform: scale(0.9);
            animation: modalZoomIn 0.3s forwards;
          }

          .modal-header-confirm {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 24px;
            border-bottom: 1px solid #e9ecef;
          }

          .modal-header-confirm h3 {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
          }

          .modal-close-btn-confirm {
            background: none;
            border: none;
            font-size: 1.75rem;
            font-weight: 300;
            cursor: pointer;
            color: #6c757d;
            padding: 0;
            line-height: 1;
          }

          .modal-body-confirm {
            padding: 24px;
            font-size: 1rem;
            color: #495057;
          }

          .modal-body-confirm p {
            margin: 0;
            line-height: 1.6;
          }

          .modal-footer-confirm {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            padding: 16px 24px;
            background-color: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }

          /* Animations */
          @keyframes modalFadeIn {
            to {
              opacity: 1;
            }
          }

          @keyframes modalZoomIn {
            to {
              transform: scale(1);
            }
          }
          
          /* Styling Tombol (Sengaja tidak menggunakan class global 'btn')
            Ini agar komponen benar-benar mandiri.
            Jika Anda *sudah* punya class global 'btn', 'btn-danger', dll, 
            Anda bisa hapus styling tombol di bawah ini.
          */
          .modal-footer-confirm .btn {
            padding: 10px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            font-size: 0.95rem;
            transition: background-color 0.2s;
          }

          .modal-footer-confirm .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .modal-footer-confirm .btn-secondary {
            background-color: #6c757d;
            color: white;
            border: 1px solid #6c757d;
          }
          .modal-footer-confirm .btn-secondary:hover:not(:disabled) {
            background-color: #5a6268;
          }

          .modal-footer-confirm .btn-danger {
            background-color: #dc3545;
            color: white;
          }
          .modal-footer-confirm .btn-danger:hover:not(:disabled) {
            background-color: #c82333;
          }

          .modal-footer-confirm .btn-primary {
            background-color: #007bff;
            color: white;
          }
          .modal-footer-confirm .btn-primary:hover:not(:disabled) {
            background-color: #0069d9;
          }
        `}
      </style>

      <div className="modal-overlay" onClick={onClose}>
        
        <div className="modal-content-confirm" onClick={handleContentClick}>
          
          <div className="modal-header-confirm">
            <h3>{title}</h3>
            <button onClick={onClose} className="modal-close-btn-confirm" disabled={isLoading}>
              &times;
            </button>
          </div>

          <div className="modal-body-confirm">
            <p>{message}</p>
          </div>

          <div className="modal-footer-confirm">
            <button
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={confirmButtonClass}
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;