import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <div className="App">
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                        </Routes>
                    </BrowserRouter>
                    <Toaster
                        position="bottom-right"
                        theme="dark"
                        toastOptions={{
                            style: {
                                background: "var(--surface-solid)",
                                border: "1px solid var(--border-strong)",
                                color: "var(--text)",
                            },
                        }}
                    />
                </div>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
