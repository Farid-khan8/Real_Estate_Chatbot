import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatInterface from "./components/ChatInterface";

function App() {
    return (
        <div className="App">
            <div className="container py-4">
                <header className="text-center mb-4">
                    <h1 className="display-5 fw-bold text-primary">
                        🏠 Real Estate Analysis Chatbot
                    </h1>
                    <p className="lead text-muted">
                        Analyze real estate trends, compare localities, and get
                        market insights
                    </p>
                </header>
                <ChatInterface />
                <footer className="mt-5 pt-4 border-top text-center text-muted small">
                    <p>
                        Built with React & Django • Sample real estate data for
                        demonstration
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default App;
