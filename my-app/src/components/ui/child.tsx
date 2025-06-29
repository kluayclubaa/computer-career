"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// โครงสร้างข้อมูลของแต่ละเฟส
const journeyPhases = [
  {
    phase: "age",
    type: "choice",
    text: "คิดว่าเด็กคนนี้กี่ขวบ?",
    options: ["3-6 ปี", "6-12 ปี", "12-15 ปี", "15-20 ปี"],
  },
  {
    phase: "difficulty",
    type: "choice",
    text: "คิดว่าโตขึ้นมันยากมั้ย?",
    options: ["ยาก", "ไม่เลย"],
  },
  {
    phase: "reflect",
    type: "input",
    text: "โตมาขนาดนี้คุณผ่านอะไรมาบ้าง?",
    placeholder: "ใส่ข้อความ...",
  },
  {
    phase: "gratitude",
    type: "input",
    text: "สิ่งที่อยากขอบคุณกับตัวเองที่ผ่านมา",
    placeholder: "ใส่ข้อความ...",
  },
  {
    phase: "apology",
    type: "input",
    text: "สิ่งที่อยากขอโทษกับเด็กคนนี้ที่เป็นคุณในอดีต",
    placeholder: "ใส่ข้อความ...",
  },
];

type Props = {
  onComplete?: (data: {
    ageGuess: string;
    difficult: string;
    reflectMsg: string;
    gratitudeMsg: string;
    apologyMsg: string;
  }) => void;
};

export default function ChildJourneyScene({ onComplete }: Props) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [ageGuess, setAgeGuess] = useState<string>("");
  const [difficult, setDifficult] = useState<string>("");
  const [reflectMsg, setReflectMsg] = useState("");
  const [gratitudeMsg, setGratitudeMsg] = useState("");
  const [apologyMsg, setApologyMsg] = useState("");

  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sceneRef.current) {
      gsap.fromTo(
        sceneRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
      );
    }
  }, [phaseIndex]);

  const handleAdvance = () => {
    gsap.to(sceneRef.current, {
      opacity: 0,
      y: -30,
      duration: 1.0,
      ease: "power3.in",
      onComplete: () => {
        if (phaseIndex < journeyPhases.length - 1) {
          setPhaseIndex(phaseIndex + 1);
        }
      },
    });
  };

  const handleComplete = () => {
     if (onComplete) {
       gsap.to(sceneRef.current, {
        opacity: 0,
        y: -30,
        duration: 1.0,
        ease: "power3.in",
        onComplete: () => {
            onComplete({ ageGuess, difficult, reflectMsg, gratitudeMsg, apologyMsg });
        }
       });
     }
  }

  const pStyle: React.CSSProperties = {
    fontSize: "clamp(1.3rem,4vw,2rem)", color: "#fff", textAlign: "center",
    padding: "0 2rem", textShadow: "2px 2px 6px #000", marginBottom: "1.5rem",
  };
  const btnStyle: React.CSSProperties = {
    padding: "0.8rem 1.5rem", borderRadius: 30, border: "1px solid rgba(255,255,255,0.5)",
    background: "rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", margin: "0.5rem",
  };
  const inputStyle: React.CSSProperties = {
    width: "80%", maxWidth: 500, padding: "1rem", borderRadius: 12, border: "1px solid rgba(255,255,255,0.5)",
    background: "rgba(255,255,255,0.15)", color: "#fff", marginBottom: "1rem", resize: "vertical",
  };

  const currentPhaseData = journeyPhases[phaseIndex];

  const renderCurrentPhase = () => {
    // --- เปลี่ยนมา switch ที่ type แทน ---
    switch (currentPhaseData.type) {
      case "choice":
        // ภายใน case นี้ TypeScript รู้ว่า currentPhaseData.options มีอยู่จริง
        return (
          <>
            <p style={pStyle}>{currentPhaseData.text}</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
              {currentPhaseData.options?.map((option) => (
                <button key={option} style={btnStyle} onClick={() => {
                  if (currentPhaseData.phase === 'age') setAgeGuess(option);
                  if (currentPhaseData.phase === 'difficulty') setDifficult(option);
                  handleAdvance();
                }}>
                  {option}
                </button>
              ))}
            </div>
          </>
        );

      case "input": {
        // ภายใน case นี้ TypeScript รู้ว่า currentPhaseData.placeholder มีอยู่จริง
        let message, setMessage, handleAction;
        
        if(currentPhaseData.phase === 'reflect') {
            message = reflectMsg;
            setMessage = setReflectMsg;
            handleAction = handleAdvance;
        } else if (currentPhaseData.phase === 'gratitude') {
            message = gratitudeMsg;
            setMessage = setGratitudeMsg;
            handleAction = handleAdvance;
        } else { // apology
            message = apologyMsg;
            setMessage = setApologyMsg;
            handleAction = handleComplete;
        }

        return (
          <>
            <p style={pStyle}>{currentPhaseData.text}</p>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} style={inputStyle} placeholder={currentPhaseData.placeholder} />
            <button style={btnStyle} disabled={!message.trim()} onClick={handleAction}>❤️</button>
          </>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 100, overflow: "hidden" }}>
      <div ref={sceneRef} key={phaseIndex} style={{ textAlign: "center", width: "90%", maxWidth: "700px", opacity: 0 }}>
        {renderCurrentPhase()}
      </div>
    </div>
  );
}