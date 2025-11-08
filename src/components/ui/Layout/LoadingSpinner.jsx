import React from 'react';

export default function LoadingSpinner({ text = "Memuat..." }) {
    return (
        <>
            <style>
                {`
          .loading-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
            background-color: #f9f9f9;
            gap: 20px;
          }

          .spinner {
            width: 48px;
            height: 48px;
            border: 5px solid #e0e0e0; 
            border-top-color: #16a34a; 
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .spinner-text {
            color: #555;
            font-size: 1rem;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>

            <div className="loading-container">
                <div className="spinner"></div>
                <p className="spinner-text">{text}</p>
            </div>
        </>
    );
}