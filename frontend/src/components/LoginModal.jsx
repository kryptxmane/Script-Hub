import React, { useState } from "react";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import { Lock, User, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function LoginModal({ open, onClose }) {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);
        try {
            const u = await login(username, password);
            toast.success(`Welcome back, ${u.username}`);
            onClose();
            setUsername("");
            setPassword("");
        } catch (error) {
            const detail = error?.response?.data?.detail;
            setErr(typeof detail === "string" ? detail : "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Admin Login" testId="login-modal">
            <p className="text-sm t-dim mb-5">
                Sign in as admin to edit script links on each video.
            </p>
            <form onSubmit={submit} className="space-y-3" data-testid="login-form">
                <div className="relative">
                    <User
                        size={15}
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--text-soft)" }}
                    />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="vx-input pl-11"
                        required
                        autoComplete="username"
                        data-testid="login-username-input"
                    />
                </div>
                <div className="relative">
                    <Lock
                        size={15}
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--text-soft)" }}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="vx-input pl-11"
                        required
                        autoComplete="current-password"
                        data-testid="login-password-input"
                    />
                </div>
                {err && (
                    <div
                        className="text-sm px-3 py-2 rounded-lg"
                        style={{
                            background: "rgba(244,63,94,0.12)",
                            color: "var(--danger)",
                            border: "1px solid rgba(244,63,94,0.25)",
                        }}
                        data-testid="login-error"
                    >
                        {err}
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-neon w-full mt-2"
                    data-testid="login-submit-btn"
                >
                    <ShieldCheck size={15} /> {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>
        </Modal>
    );
}
