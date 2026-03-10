import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

const Auth = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        // After auth, navigate to the home page (Books / Finance)
        navigate('/finance');
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            background: "#E9F4FF",
            fontFamily: "Inter, sans-serif"
        }}>
            {/* Left Side - Form */}
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
                position: "relative",
                background: "#FFFFFF",
                boxShadow: "20px 0 50px rgba(25, 91, 172, 0.05)"
            }}>

                <div style={{
                    position: "absolute",
                    top: "40px",
                    left: "40px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer"
                }} onClick={() => navigate('/')}>
                    <div style={{ padding: '8px', background: '#E3F2FD', borderRadius: '8px', color: '#195BAC' }}>
                        <Wallet size={24} />
                    </div>
                    <span style={{ fontSize: "20px", fontWeight: "800", color: "#195BAC" }}>Books & Finance</span>
                </div>

                <div style={{ maxWidth: "400px", width: "100%" }}>
                    <div style={{ marginBottom: "40px" }}>
                        <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#1A1A2E", marginBottom: "12px" }}>
                            {isLogin ? "Welcome back" : "Create an account"}
                        </h1>
                        <p style={{ fontSize: "16px", color: "#546E7A" }}>
                            {isLogin
                                ? "Enter your details to access your account."
                                : "Start managing your finances beautifully."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {!isLogin && (
                            <div>
                                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#546E7A", marginBottom: "8px", letterSpacing: "0.5px" }}>FULL NAME</label>
                                <div style={{ position: "relative" }}>
                                    <User size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#90A4AE" }} />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        style={{
                                            width: "100%", padding: "14px 16px 14px 44px", borderRadius: "12px",
                                            border: "2px solid #E3F2FD", fontSize: "15px", outline: "none",
                                            transition: "border-color 0.3s", boxSizing: "border-box"
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = "#195BAC"}
                                        onBlur={(e) => e.target.style.borderColor = "#E3F2FD"}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#546E7A", marginBottom: "8px", letterSpacing: "0.5px" }}>EMAIL ADDRESS</label>
                            <div style={{ position: "relative" }}>
                                <Mail size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#90A4AE" }} />
                                <input
                                    type="email"
                                    placeholder="you@email.com"
                                    required
                                    style={{
                                        width: "100%", padding: "14px 16px 14px 44px", borderRadius: "12px",
                                        border: "2px solid #E3F2FD", fontSize: "15px", outline: "none",
                                        transition: "border-color 0.3s", boxSizing: "border-box"
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = "#195BAC"}
                                    onBlur={(e) => e.target.style.borderColor = "#E3F2FD"}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", fontWeight: "600", color: "#546E7A", marginBottom: "8px", letterSpacing: "0.5px" }}>
                                <span>PASSWORD</span>
                                {isLogin && <span style={{ color: "#195BAC", cursor: "pointer", textTransform: "none" }}>Forgot password?</span>}
                            </label>
                            <div style={{ position: "relative" }}>
                                <Lock size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#90A4AE" }} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: "100%", padding: "14px 16px 14px 44px", borderRadius: "12px",
                                        border: "2px solid #E3F2FD", fontSize: "15px", outline: "none",
                                        transition: "border-color 0.3s", boxSizing: "border-box"
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = "#195BAC"}
                                    onBlur={(e) => e.target.style.borderColor = "#E3F2FD"}
                                />
                            </div>
                        </div>

                        <button type="submit" style={{
                            width: "100%", padding: "16px", background: "linear-gradient(135deg, #195BAC 0%, #1E88E5 100%)",
                            color: "#FFFFFF", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700",
                            cursor: "pointer", marginTop: "10px", boxShadow: "0 8px 25px rgba(25, 91, 172, 0.3)",
                            display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", transition: "transform 0.2s"
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                            {isLogin ? "Sign In" : "Create Account"} <ArrowRight size={20} />
                        </button>
                    </form>

                    <div style={{ marginTop: "30px", textAlign: "center", fontSize: "15px", color: "#546E7A" }}>
                        {isLogin ? "Don't have an account? " : "Already a user? "}
                        <span
                            onClick={toggleMode}
                            style={{ color: "#195BAC", fontWeight: "700", cursor: "pointer" }}
                        >
                            {isLogin ? "Create a new one" : "Sign in"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Side - Visual */}
            <div style={{
                flex: 1.2,
                display: "none",
                '@media (min-width: 900px)': {
                    display: "flex" // Would typically be handled by a CSS media query, let's use a simpler inline style hack or just show it depending on screen, actually inline styles don't support media queries. I'll add a style tag.
                },
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "60px",
                background: "linear-gradient(135deg, #195BAC 0%, #1E88E5 100%)",
                position: "relative",
                overflow: "hidden"
            }} className="desktop-visual">
                <style>{`
                    @media (max-width: 900px) {
                        .desktop-visual { display: none !important; }
                    }
                `}</style>

                {/* Decorative circles */}
                <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(60px)" }} />
                <div style={{ position: "absolute", bottom: "-100px", left: "-100px", width: "500px", height: "500px", background: "rgba(255,255,255,0.08)", borderRadius: "50%", filter: "blur(80px)" }} />

                <div style={{ position: "relative", zIndex: 10, color: "#FFFFFF", maxWidth: "500px" }}>
                    <div style={{ marginBottom: "40px", display: "flex", gap: "10px" }}>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: i === 0 ? "#FFFFFF" : "rgba(255,255,255,0.3)" }} />
                        ))}
                    </div>
                    <h2 style={{ fontSize: "48px", fontWeight: "800", lineHeight: "1.2", marginBottom: "24px" }}>
                        Master your <br />financial future.
                    </h2>
                    <p style={{ fontSize: "18px", opacity: 0.9, lineHeight: "1.6", marginBottom: "40px" }}>
                        Join thousands of users who are taking control of their money with our intelligent dashboard.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {[
                            "Smart budget recommendations",
                            "Real-time expense tracking",
                            "Bank-level security & encryption"
                        ].map((item, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.1)", padding: "16px 24px", borderRadius: "16px", backdropFilter: "blur(10px)" }}>
                                <CheckCircle2 size={24} color="#4CAF50" />
                                <span style={{ fontSize: "16px", fontWeight: "500" }}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
