"use client";
import { useState } from "react";

const questions = [
  {
    id: "age",
    question: "What's your age range?",
    options: ["35–40", "41–45", "46–50", "51–55", "55+"],
  },
  {
    id: "pattern",
    question: "Where are you noticing thinning?",
    options: ["All over (diffuse)", "Crown / top of head", "Temples & hairline", "Part widening", "Multiple areas"],
  },
  {
    id: "trigger",
    question: "What do you suspect is the trigger?",
    options: ["Hormonal / perimenopause", "Stress", "Postpartum", "Medication side effect", "Nutrition / deficiency", "No idea"],
  },
  {
    id: "texture",
    question: "How would you describe your hair?",
    options: ["Fine & straight", "Medium & wavy", "Coarse & curly", "Coily / kinky", "Mixed texture"],
  },
  {
    id: "scalp",
    question: "What's your scalp like?",
    options: ["Oily", "Dry & tight", "Flaky / dandruff", "Itchy", "Normal"],
  },
  {
    id: "duration",
    question: "How long has this been happening?",
    options: ["Under 3 months", "3–6 months", "6–12 months", "1–2 years", "2+ years"],
  },
];

const ETSY_LINK = "https://etsy.me/3POSLxO";

export default function HairRevivalTool() {
  const [step, setStep] = useState(0); // 0 = intro, 1-6 = questions, 7 = loading, 8 = results
  const [answers, setAnswers] = useState({});
  const [protocol, setProtocol] = useState("");
  const [error, setError] = useState("");

  const totalSteps = questions.length;
  const currentQ = questions[step - 1];
  const progress = step > 0 && step <= totalSteps ? (step / totalSteps) * 100 : 0;

  const handleAnswer = (value) => {
    const updated = { ...answers, [currentQ.id]: value };
    setAnswers(updated);
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      generateProtocol(updated);
    }
  };

  const generateProtocol = async (data) => {
    setStep(7);
    setError("");
    const prompt = `You are a natural hair recovery specialist helping women over 35 dealing with hair thinning. Based on the following profile, create a warm, specific, and actionable 90-day hair revival protocol.

Profile:
- Age range: ${data.age}
- Thinning pattern: ${data.pattern}
- Suspected trigger: ${data.trigger}
- Hair texture: ${data.texture}
- Scalp condition: ${data.scalp}
- Duration of thinning: ${data.duration}

Write a personalized 90-day protocol with these exact sections:
1. **What's Likely Happening** (2-3 sentences explaining their specific situation warmly but honestly)
2. **Your Topical Routine** (specific oils, application method, frequency — tailored to their texture and scalp)
3. **Supplement Priorities** (top 3-4 supplements with dosage guidance, specific to their trigger)
4. **90-Day Phase Plan** (Phase 1: Days 1-30, Phase 2: Days 31-60, Phase 3: Days 61-90 — what to focus on each phase)
5. **What to Track** (3-4 specific measurable things to photograph or note monthly)
6. **When to See a Doctor** (specific flags based on their situation)

Keep the tone warm, direct, and expert — like a knowledgeable friend who has been through this. No fluff. No disclaimers. Real actionable guidance. Format with clear headers using **bold** for section titles.`;

    try {
      const response = await fetch("/api/protocol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: data }),
      });
      const result = await response.json();
      const text = result.protocol || "";
      setProtocol(text);
      setStep(8);
    } catch (e) {
      setError("Something went wrong generating your protocol. Please try again.");
      setStep(6);
    }
  };

  const formatProtocol = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <h3 key={i} style={{ color: "#2c1810", fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", marginTop: "1.4rem", marginBottom: "0.4rem" }}>{line.replace(/\*\*/g, "")}</h3>;
      }
      const parts = line.split(/\*\*(.*?)\*\*/g);
      if (parts.length > 1) {
        return (
          <p key={i} style={{ marginBottom: "0.5rem", lineHeight: "1.7" }}>
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: "#2c1810" }}>{p}</strong> : p)}
          </p>
        );
      }
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} style={{ marginBottom: "0.5rem", lineHeight: "1.7" }}>{line}</p>;
    });
  };

  const styles = {
    wrap: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fdf6ee 0%, #f5e6d3 50%, #ede0d0 100%)",
      fontFamily: "'Lora', Georgia, serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "2rem 1rem",
    },
    card: {
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(12px)",
      borderRadius: "20px",
      boxShadow: "0 8px 40px rgba(80,40,10,0.12)",
      maxWidth: "620px",
      width: "100%",
      padding: "2.5rem 2rem",
      border: "1px solid rgba(180,120,60,0.15)",
    },
    brand: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "0.8rem",
      letterSpacing: "0.18em",
      color: "#a0714f",
      textTransform: "uppercase",
      marginBottom: "1.2rem",
    },
    headline: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "2rem",
      color: "#2c1810",
      lineHeight: "1.3",
      marginBottom: "0.8rem",
    },
    sub: {
      color: "#7a5c45",
      fontSize: "1rem",
      lineHeight: "1.7",
      marginBottom: "2rem",
    },
    btn: {
      background: "linear-gradient(135deg, #c17f4e, #9a5c30)",
      color: "#fff",
      border: "none",
      borderRadius: "50px",
      padding: "0.9rem 2.2rem",
      fontSize: "1rem",
      fontFamily: "'Lora', serif",
      cursor: "pointer",
      boxShadow: "0 4px 16px rgba(160,90,40,0.25)",
      transition: "transform 0.15s, box-shadow 0.15s",
      display: "inline-block",
    },
    questionText: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "1.35rem",
      color: "#2c1810",
      marginBottom: "1.5rem",
      lineHeight: "1.4",
    },
    optionBtn: {
      display: "block",
      width: "100%",
      textAlign: "left",
      background: "rgba(255,255,255,0.7)",
      border: "1.5px solid rgba(180,120,60,0.25)",
      borderRadius: "12px",
      padding: "0.85rem 1.2rem",
      marginBottom: "0.7rem",
      fontFamily: "'Lora', serif",
      fontSize: "0.97rem",
      color: "#3d2010",
      cursor: "pointer",
      transition: "all 0.18s",
    },
    progressBar: {
      height: "4px",
      background: "rgba(180,120,60,0.15)",
      borderRadius: "4px",
      marginBottom: "2rem",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg, #c17f4e, #9a5c30)",
      borderRadius: "4px",
      transition: "width 0.4s ease",
    },
    etsyBox: {
      marginTop: "2.5rem",
      background: "linear-gradient(135deg, #2c1810, #4a2c18)",
      borderRadius: "16px",
      padding: "1.8rem",
      textAlign: "center",
      color: "#fff",
    },
    etsyTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "1.2rem",
      marginBottom: "0.6rem",
      color: "#f5d9b8",
    },
    etsyBtn: {
      background: "linear-gradient(135deg, #e8a96e, #c17f4e)",
      color: "#2c1810",
      border: "none",
      borderRadius: "50px",
      padding: "0.8rem 2rem",
      fontSize: "0.95rem",
      fontFamily: "'Lora', serif",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "1rem",
      display: "inline-block",
      textDecoration: "none",
    },
    loadingWrap: {
      textAlign: "center",
      padding: "2rem 0",
    },
    spinner: {
      width: "48px",
      height: "48px",
      border: "3px solid rgba(180,120,60,0.2)",
      borderTop: "3px solid #c17f4e",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 1.2rem",
    },
  };

  return (
    <div style={styles.wrap}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        .opt-btn:hover { background: rgba(193,127,78,0.12) !important; border-color: #c17f4e !important; transform: translateX(4px); }
        .start-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(160,90,40,0.35) !important; }
      `}</style>

      <div style={styles.card} className="fade-in">
        <p style={styles.brand}>✦ Natural Hair Revival</p>

        {/* INTRO */}
        {step === 0 && (
          <>
            <h1 style={styles.headline}>Your Personalized<br />Hair Recovery Protocol</h1>
            <p style={styles.sub}>
              Answer 6 questions about your hair, scalp, and situation. We'll generate a free 90-day protocol tailored specifically to you — not generic advice, your actual plan.
            </p>
            <p style={{ ...styles.sub, fontSize: "0.88rem", opacity: 0.75, marginBottom: "1.8rem" }}>
              Takes 2 minutes. No email required.
            </p>
            <button style={styles.btn} className="start-btn" onClick={() => setStep(1)}>
              Build My Protocol →
            </button>
          </>
        )}

        {/* QUESTIONS */}
        {step >= 1 && step <= totalSteps && (
          <>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
            <p style={{ fontSize: "0.8rem", color: "#a0714f", marginBottom: "0.5rem", fontFamily: "'Lora', serif" }}>
              Question {step} of {totalSteps}
            </p>
            <p style={styles.questionText}>{currentQ.question}</p>
            {currentQ.options.map((opt) => (
              <button
                key={opt}
                style={styles.optionBtn}
                className="opt-btn"
                onClick={() => handleAnswer(opt)}
              >
                {opt}
              </button>
            ))}
          </>
        )}

        {/* LOADING */}
        {step === 7 && (
          <div style={styles.loadingWrap} className="fade-in">
            <div style={styles.spinner} />
            <p style={{ ...styles.questionText, fontSize: "1.1rem" }}>
              Building your personal protocol…
            </p>
            <p style={{ color: "#a0714f", fontSize: "0.9rem" }}>
              Analyzing your pattern, triggers, and texture
            </p>
          </div>
        )}

        {/* RESULTS */}
        {step === 8 && protocol && (
          <div className="fade-in">
            <p style={styles.brand}>✦ Your 90-Day Protocol</p>
            <div style={{ color: "#3d2010", fontSize: "0.96rem" }}>
              {formatProtocol(protocol)}
            </div>

            <div style={styles.etsyBox}>
              <p style={styles.etsyTitle}>Your protocol is only as good as your ability to track it.</p>
              <p style={{ fontSize: "0.9rem", color: "#e8c9a0", lineHeight: "1.6", marginBottom: "1rem" }}>
                The <strong>Natural Hair Revival Workbook</strong> is the 90-day printable tracking system built to run alongside any hair recovery protocol — including yours.
              </p>
              <div style={{ textAlign: "left", fontSize: "0.85rem", color: "#e8c9a0", lineHeight: "1.8", marginBottom: "0.5rem" }}>
                <p style={{ margin: "0 0 0.3rem" }}>📋 Weekly shedding + scalp condition log</p>
                <p style={{ margin: "0 0 0.3rem" }}>📸 Monthly photo comparison template</p>
                <p style={{ margin: "0 0 0.3rem" }}>💊 Supplement tracker (fill in your own stack)</p>
                <p style={{ margin: "0 0 0.3rem" }}>🧴 Topical routine log (fill in your own products)</p>
                <p style={{ margin: "0 0 0.3rem" }}>📝 Monthly "what changed" reflection pages</p>
                <p style={{ margin: "0" }}>📅 Full 90-day progress journal</p>
              </div>
              <p style={{ fontSize: "0.82rem", color: "#c9a07a", lineHeight: "1.5", marginTop: "0.8rem" }}>
                Print once. Use it for the full 90 days. No customization needed — it's designed to work with whatever protocol you're following.
              </p>
              <a href={ETSY_LINK} target="_blank" rel="noopener noreferrer" style={styles.etsyBtn}>
                Get the Workbook on Etsy →
              </a>
            </div>

            <button
              style={{ ...styles.btn, marginTop: "1.5rem", background: "transparent", color: "#a0714f", border: "1.5px solid #c17f4e", boxShadow: "none" }}
              onClick={() => { setStep(0); setAnswers({}); setProtocol(""); }}
            >
              ← Start Over
            </button>
          </div>
        )}

        {error && (
          <p style={{ color: "#c0392b", marginTop: "1rem", fontSize: "0.9rem" }}>{error}</p>
        )}
      </div>

      <p style={{ marginTop: "1.5rem", fontSize: "0.78rem", color: "#b8967a", textAlign: "center", maxWidth: "400px" }}>
        This tool provides wellness guidance based on your inputs. It is not medical advice. For persistent or severe hair loss, please consult a physician.
      </p>
    </div>
  );
}
