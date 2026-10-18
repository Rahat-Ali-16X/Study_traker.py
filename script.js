import { useState, useEffect, useRef } from "react";

const QUOTES = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Education is the most powerful weapon you can use to change the world.", author: "Nelson Mandela" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
];

const LEARNING_PLAN = [
  {
    week: "Week 1–2",
    topic: "Python Basics",
    color: "#4CAF50",
    tasks: ["Variables & Data Types", "If/Else Conditions", "Loops (for, while)", "Functions & Modules"],
  },
  {
    week: "Week 3–4",
    topic: "Python Intermediate",
    color: "#2196F3",
    tasks: ["Lists, Tuples, Dicts", "File Handling", "OOP Concepts", "Error Handling"],
  },
  {
    week: "Week 5–6",
    topic: "AI Foundations",
    color: "#9C27B0",
    tasks: ["What is AI/ML?", "NumPy & Pandas Basics", "Data Visualization", "Intro to scikit-learn"],
  },
  {
    week: "Week 7–8",
    topic: "Mini Projects",
    color: "#FF5722",
    tasks: ["Simple Calculator", "Student Grade Tracker", "Basic Chatbot", "ML Digit Recognizer"],
  },
];

const SUBJECTS = ["Python", "AI/ML", "Maths", "Physics", "English", "Other"];

export default function StudyTracker() {
  const [tab, setTab] = useState("home");
  const [goals, setGoals] = useState([
    { id: 1, text: "Complete Python Chapter 3", done: false, subject: "Python" },
    { id: 2, text: "Watch ML intro video", done: false, subject: "AI/ML" },
  ]);
  const [newGoal, setNewGoal] = useState("");
  const [newGoalSubject, setNewGoalSubject] = useState("Python");
  const [sessions, setSessions] = useState([]);
  const [timer, setTimer] = useState({ running: false, seconds: 0, subject: "Python", mode: "study" });
  const [customTime, setCustomTime] = useState(25);
  const [quoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [planExpanded, setPlanExpanded] = useState(null);
  const [streak, setStreak] = useState(3);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timer.running) {
      intervalRef.current = setInterval(() => {
        setTimer((t) => ({ ...t, seconds: t.seconds + 1 }));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timer.running]);

  const fmt = (s) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const startTimer = () => setTimer((t) => ({ ...t, running: true }));
  const pauseTimer = () => setTimer((t) => ({ ...t, running: false }));
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    if (timer.seconds > 60) {
      setSessions((s) => [...s, { subject: timer.subject, seconds: timer.seconds, date: new Date().toLocaleDateString() }]);
    }
    setTimer((t) => ({ ...t, running: false, seconds: 0 }));
  };

  const setPreset = (mins) => {
    resetTimer();
    setCustomTime(mins);
  };

  const totalStudied = sessions.reduce((a, b) => a + b.seconds, 0);
  const todaySessions = sessions.filter((s) => s.date === new Date().toLocaleDateString());
  const todayTime = todaySessions.reduce((a, b) => a + b.seconds, 0);
  const completedGoals = goals.filter((g) => g.done).length;

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals((g) => [...g, { id: Date.now(), text: newGoal, done: false, subject: newGoalSubject }]);
    setNewGoal("");
    setShowAddGoal(false);
  };

  const toggleGoal = (id) => setGoals((g) => g.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const deleteGoal = (id) => setGoals((g) => g.filter((x) => x.id !== id));

  const quote = QUOTES[quoteIdx];

  const subjectColors = {
    Python: "#4CAF50", "AI/ML": "#9C27B0", Maths: "#FF9800",
    Physics: "#2196F3", English: "#F44336", Other: "#607D8B",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0F1117", display: "flex",
      justifyContent: "center", alignItems: "center",
      fontFamily: "'Nunito', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=JetBrains+Mono:wght@500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .ripple { position: relative; overflow: hidden; cursor: pointer; }
        .ripple:active::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0.12); border-radius: inherit;
          animation: rippleAnim 0.3s ease;
        }
        @keyframes rippleAnim { from { opacity: 1; } to { opacity: 0; } }
        .tab-item { transition: all 0.2s; }
        .tab-item:active { transform: scale(0.92); }
        .goal-item { animation: slideIn 0.25s ease; }
        @keyframes slideIn { from { transform: translateX(-16px); opacity: 0; } to { transform: none; opacity: 1; } }
        .card { animation: fadeUp 0.3s ease; }
        @keyframes fadeUp { from { transform: translateY(12px); opacity: 0; } to { transform: none; opacity: 1; } }
        .timer-ring { transition: stroke-dashoffset 0.5s linear; }
        .fab { transition: transform 0.2s, box-shadow 0.2s; }
        .fab:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(124,77,255,0.5); }
        input, select { outline: none; }
        .stat-card { transition: transform 0.2s; }
        .stat-card:active { transform: scale(0.97); }
        .plan-row { transition: background 0.15s; }
        .plan-row:hover { background: rgba(255,255,255,0.05) !important; }
        .subject-chip { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; }
      `}</style>

      {/* Phone shell */}
      <div style={{
        width: 390, minHeight: 780, maxHeight: 840, background: "#161920",
        borderRadius: 40, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px #2a2d38",
        display: "flex", flexDirection: "column", position: "relative",
      }}>

        {/* Status bar */}
        <div style={{ background: "#161920", padding: "12px 24px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {["▪▪▪", "📶", "🔋"].map((x, i) => (
              <span key={i} style={{ fontSize: 11, color: "#aaa" }}>{x}</span>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: "auto", background: "#161920" }}>
          {tab === "home" && <HomeTab quote={quote} streak={streak} completedGoals={completedGoals} goals={goals} todayTime={todayTime} totalStudied={totalStudied} fmt={fmt} subjectColors={subjectColors} />}
          {tab === "timer" && <TimerTab timer={timer} fmt={fmt} startTimer={startTimer} pauseTimer={pauseTimer} resetTimer={resetTimer} customTime={customTime} setCustomTime={setCustomTime} setPreset={setPreset} sessions={sessions} subjectColors={subjectColors} setTimer={setTimer} />}
          {tab === "goals" && <GoalsTab goals={goals} toggleGoal={toggleGoal} deleteGoal={deleteGoal} showAddGoal={showAddGoal} setShowAddGoal={setShowAddGoal} newGoal={newGoal} setNewGoal={setNewGoal} newGoalSubject={newGoalSubject} setNewGoalSubject={setNewGoalSubject} addGoal={addGoal} subjectColors={subjectColors} SUBJECTS={SUBJECTS} />}
          {tab === "plan" && <PlanTab planExpanded={planExpanded} setPlanExpanded={setPlanExpanded} />}
          {tab === "stats" && <StatsTab sessions={sessions} fmt={fmt} subjectColors={subjectColors} goals={goals} streak={streak} />}
        </div>

        {/* Bottom nav */}
        <div style={{
          background: "#1E2130", borderTop: "1px solid #2a2d38",
          display: "flex", padding: "8px 0 16px",
        }}>
          {[
            { id: "home", icon: "🏠", label: "Home" },
            { id: "timer", icon: "⏱", label: "Timer" },
            { id: "goals", icon: "🎯", label: "Goals" },
            { id: "plan", icon: "📚", label: "Plan" },
            { id: "stats", icon: "📊", label: "Stats" },
          ].map((t) => (
            <button key={t.id} className="tab-item ripple" onClick={() => setTab(t.id)} style={{
              flex: 1, background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              padding: "6px 0",
            }}>
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: tab === t.id ? "#7C4DFF" : "#666",
                transition: "color 0.2s",
              }}>{t.label}</span>
              {tab === t.id && (
                <div style={{ width: 20, height: 3, background: "#7C4DFF", borderRadius: 2, marginTop: 2 }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── HOME TAB ─── */
function HomeTab({ quote, streak, completedGoals, goals, todayTime, totalStudied, fmt, subjectColors }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div style={{ padding: "20px 20px 24px" }}>
      {/* Greeting */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: "#7C4DFF", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>{greeting.toUpperCase()} 👋</p>
        <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 900, lineHeight: 1.2 }}>Let's Study<br />& Grow Today!</h1>
        <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>UP Board Class 10 · Python & AI</p>
      </div>

      {/* Quote card */}
      <div className="card" style={{
        background: "linear-gradient(135deg, #7C4DFF 0%, #5C35CC 100%)",
        borderRadius: 20, padding: "18px 20px", marginBottom: 20,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ fontSize: 36, opacity: 0.15, position: "absolute", top: -8, right: 12, fontFamily: "Georgia" }}>"</div>
        <p style={{ color: "#fff", fontSize: 14, fontStyle: "italic", lineHeight: 1.5, position: "relative" }}>{quote.text}</p>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 8, fontWeight: 700 }}>— {quote.author}</p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Today", value: fmt(todayTime), icon: "⏱", color: "#4CAF50" },
          { label: "Streak", value: `${streak}d 🔥`, icon: "🔥", color: "#FF9800" },
          { label: "Goals", value: `${completedGoals}/${goals.length}`, icon: "🎯", color: "#7C4DFF" },
        ].map((s) => (
          <div key={s.label} className="stat-card card" style={{
            background: "#1E2130", borderRadius: 16, padding: "14px 10px", textAlign: "center",
            border: `1px solid ${s.color}22`,
          }}>
            <p style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</p>
            <p style={{ color: s.color, fontSize: 16, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</p>
            <p style={{ color: "#555", fontSize: 10, fontWeight: 700, marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Today's Goals preview */}
      <div className="card" style={{ background: "#1E2130", borderRadius: 20, padding: "16px" }}>
        <p style={{ color: "#fff", fontSize: 14, fontWeight: 800, marginBottom: 12 }}>📋 Today's Goals</p>
        {goals.length === 0 && <p style={{ color: "#555", fontSize: 13 }}>No goals yet. Add some!</p>}
        {goals.slice(0, 3).map((g) => (
          <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 5,
              background: g.done ? "#7C4DFF" : "transparent",
              border: g.done ? "none" : "2px solid #333",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {g.done && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
            </div>
            <span style={{ color: g.done ? "#555" : "#ddd", fontSize: 13, textDecoration: g.done ? "line-through" : "none", flex: 1 }}>{g.text}</span>
            <span className="subject-chip" style={{ background: (subjectColors[g.subject] || "#607D8B") + "22", color: subjectColors[g.subject] || "#607D8B" }}>{g.subject}</span>
          </div>
        ))}
        {goals.length > 3 && <p style={{ color: "#7C4DFF", fontSize: 12, fontWeight: 700, marginTop: 4 }}>+{goals.length - 3} more goals →</p>}
      </div>
    </div>
  );
}

/* ─── TIMER TAB ─── */
function TimerTab({ timer, fmt, startTimer, pauseTimer, resetTimer, customTime, setCustomTime, setPreset, sessions, subjectColors, setTimer }) {
  const maxSec = customTime * 60;
  const progress = Math.min(timer.seconds / maxSec, 1);
  const r = 90, circ = 2 * Math.PI * r;
  const dash = circ * (1 - progress);

  return (
    <div style={{ padding: "20px 20px 24px" }}>
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginBottom: 4 }}>⏱ Study Timer</h2>
      <p style={{ color: "#555", fontSize: 13, marginBottom: 20 }}>Focus, track, and improve.</p>

      {/* Subject picker */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["Python", "AI/ML", "Maths", "Physics", "English"].map((s) => (
          <button key={s} className="ripple" onClick={() => setTimer((t) => ({ ...t, subject: s }))} style={{
            padding: "6px 14px", borderRadius: 20,
            background: timer.subject === s ? (subjectColors[s] + "33") : "#1E2130",
            color: timer.subject === s ? subjectColors[s] : "#666",
            border: `1.5px solid ${timer.subject === s ? subjectColors[s] : "#2a2d38"}`,
            fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito', sans-serif",
          }}>{s}</button>
        ))}
      </div>

      {/* Circular timer */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <div style={{ position: "relative", width: 220, height: 220 }}>
          <svg width={220} height={220} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={110} cy={110} r={r} fill="none" stroke="#1E2130" strokeWidth={12} />
            <circle cx={110} cy={110} r={r} fill="none"
              stroke={subjectColors[timer.subject] || "#7C4DFF"}
              strokeWidth={12} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={dash}
              className="timer-ring"
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontSize: 38, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(timer.seconds)}</span>
            <span style={{ color: "#555", fontSize: 12, fontWeight: 700 }}>{timer.running ? "● STUDYING" : "PAUSED"}</span>
          </div>
        </div>
      </div>

      {/* Preset buttons */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
        {[15, 25, 45, 60].map((m) => (
          <button key={m} className="ripple" onClick={() => setPreset(m)} style={{
            padding: "6px 14px", borderRadius: 12, fontSize: 12, fontWeight: 800,
            background: customTime === m ? "#7C4DFF" : "#1E2130",
            color: customTime === m ? "#fff" : "#666",
            border: `1px solid ${customTime === m ? "#7C4DFF" : "#2a2d38"}`,
            cursor: "pointer", fontFamily: "'Nunito', sans-serif",
          }}>{m}m</button>
        ))}
        {/* Custom */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input type="number" min={1} max={180} value={customTime}
            onChange={(e) => setCustomTime(Number(e.target.value))}
            style={{
              width: 46, padding: "5px 6px", borderRadius: 10,
              background: "#1E2130", color: "#fff", border: "1px solid #2a2d38",
              fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", textAlign: "center",
            }} />
          <span style={{ color: "#555", fontSize: 11 }}>min</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
        <button className="ripple" onClick={resetTimer} style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "#1E2130", border: "1px solid #333",
          color: "#aaa", fontSize: 18, cursor: "pointer",
        }}>↺</button>
        <button className="ripple" onClick={timer.running ? pauseTimer : startTimer} style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, #7C4DFF, #5C35CC)",
          border: "none", color: "#fff", fontSize: 26, cursor: "pointer",
          boxShadow: "0 6px 20px rgba(124,77,255,0.4)",
        }}>{timer.running ? "⏸" : "▶"}</button>
        <button className="ripple" onClick={() => {}} style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "#1E2130", border: "1px solid #333",
          color: "#aaa", fontSize: 18, cursor: "pointer",
        }}>☰</button>
      </div>

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div style={{ background: "#1E2130", borderRadius: 16, padding: 14 }}>
          <p style={{ color: "#fff", fontSize: 13, fontWeight: 800, marginBottom: 10 }}>Recent Sessions</p>
          {sessions.slice(-3).reverse().map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: subjectColors[s.subject] || "#7C4DFF" }} />
                <span style={{ color: "#bbb", fontSize: 13 }}>{s.subject}</span>
              </div>
              <span style={{ color: "#7C4DFF", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{fmt(s.seconds)}</span>
              <span style={{ color: "#444", fontSize: 11 }}>{s.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── GOALS TAB ─── */
function GoalsTab({ goals, toggleGoal, deleteGoal, showAddGoal, setShowAddGoal, newGoal, setNewGoal, newGoalSubject, setNewGoalSubject, addGoal, subjectColors, SUBJECTS }) {
  const pending = goals.filter((g) => !g.done);
  const done = goals.filter((g) => g.done);

  return (
    <div style={{ padding: "20px 20px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 900 }}>🎯 Goals</h2>
          <p style={{ color: "
