// src/components/ui/QuestionOverlay.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export type DayChoice = "วันที่มีเเดดร่ำไรอ่อนๆ" | "วันที่มีรุ้งกินน้ำหลังฝนตก" | "วันที่อากาศปลอดโปร่งฟ้าโปร่งใส" | "วันที่มีเเสงเเดดจ้ามีนกบินมา";

type QuestionOverlayProps = {
  userName: string;
  storyIntro?: string;
  onOverlayComplete: (choice: DayChoice, userStory: string, tired: number) => void;
};

const baseStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  padding: 20,
  zIndex: 20,
  boxSizing: "border-box",
};

const msg: React.CSSProperties = {
  fontSize: "clamp(1.3rem,4vw,2.3rem)",
  textAlign: "center",
  lineHeight: 1.6,
  maxWidth: "90%",
  textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
};

const card: React.CSSProperties = {
  width: "90%",
  maxWidth: 650,
  textAlign: "center",
  backdropFilter: "blur(6px)",
  background: "rgba(0,0,0,0.45)",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: 20,
  padding: "2.2rem 1.8rem",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.9rem 1rem",
  borderRadius: 40,
  border: "1px solid rgba(255,255,255,.4)",
  background: "rgba(255,255,255,.15)",
  color: "white",
  fontSize: "1rem",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "transform .25s ease",
};

const QuestionOverlay = ({
  userName,
  storyIntro = "สวัสดีคนเก่ง",
  onOverlayComplete,
}: QuestionOverlayProps) => {
  const introRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const holidayRef = useRef<HTMLParagraphElement>(null);
  const restRef = useRef<HTMLParagraphElement>(null);
  const choiceRef = useRef<HTMLDivElement>(null);

  type Phase = "intro" | "form" | "holiday" | "rest" | "choice";
  
  const [phase, setPhase] = useState<Phase>("intro");
  const [userStory, setUserStory] = useState("");
  const [tired, setTired] = useState(5);

  /* ---------- util: วันหยุด (แก้เป็น true ทดสอบ) ---------- */
  const isHoliday = true;

  /* ---------- helper animation ---------- */
  const fadeIn = (el: Element | null, dur = 1) =>
    el &&
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: dur, ease: "power2.out" }
    );
  const fadeOut = (
    el: Element | null,
    dur = 1,
    delay = 3,
    onComplete?: () => void
  ) =>
    el &&
    gsap.to(el, {
      opacity: 0,
      y: -30,
      duration: dur,
      ease: "power2.in",
      delay,
      onComplete,
    });

  /* ---------- intro ---------- */
  useEffect(() => {
    if (phase === "intro") {
      fadeIn(introRef.current, 1.3);
      fadeOut(introRef.current, 1, 4, () => setPhase("form"));
    }
  }, [phase]);

  /* ---------- form ---------- */
  useEffect(() => {
    if (phase === "form") fadeIn(formRef.current, 1);
  }, [phase]);

  const handleSubmit = () => {
    fadeOut(formRef.current, 0.6, 0, () =>
      setPhase(isHoliday ? "holiday" : "rest")
    );
  };

  /* ---------- holiday ---------- */
  useEffect(() => {
    if (phase === "holiday") {
      fadeIn(holidayRef.current, 1.2);
      fadeOut(holidayRef.current, 1, 3, () => setPhase("rest"));
    }
  }, [phase]);

  /* ---------- rest ---------- */
  useEffect(() => {
    if (phase === "rest") {
      fadeIn(restRef.current, 1.2);
      fadeOut(restRef.current, 1, 3, () => setPhase("choice"));
    }
  }, [phase]);

  /* ---------- choice ---------- */
  useEffect(() => {
    if (phase === "choice") fadeIn(choiceRef.current, 1);
  }, [phase]);

  const dayChoices: DayChoice[] = ["วันที่มีเเดดร่ำไรอ่อนๆ", "วันที่มีรุ้งกินน้ำหลังฝนตก", "วันที่อากาศปลอดโปร่งฟ้าโปร่งใส", "วันที่มีเเสงเเดดจ้ามีนกบินมา"];

   const handleChoiceClick = (choice: DayChoice) => {
    // เรียก onOverlayComplete พร้อมกับข้อมูลทั้งหมด
    onOverlayComplete(choice, userStory, tired);
  };

  /* ---------- render ---------- */
  return (
    <div style={baseStyle}>
      {/* ---------- intro ---------- */}
      {phase === "intro" && (
        <p ref={introRef} style={msg}>
          {storyIntro}
        </p>
      )}

      {/* ---------- form ---------- */}
      {phase === "form" && (
        <div ref={formRef} style={card}>
          <h2
            style={{
              fontSize: "clamp(1.4rem,4.2vw,2rem)",
              marginBottom: "1.3rem",
            }}
          >
            มีอะไรอยากเล่าไหม&nbsp;นีโม่พร้อมรับฟัง
          </h2>

          <textarea
            value={userStory}
            onChange={(e) => setUserStory(e.target.value)}
            placeholder="พิมพ์เล่าได้เต็มที่เลย..."
            rows={4}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              resize: "vertical",
              marginBottom: "1.5rem",
              boxSizing: "border-box",
            }}
          />

          <label style={{ display: "block", marginBottom: ".6rem" }}>
            เหนื่อยมั้ย&nbsp;(<strong>{tired}</strong>)
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={tired}
            onChange={(e) => setTired(Number(e.target.value))}
            style={{ width: "100%" }}
          />

          <button
            onClick={handleSubmit}
            style={{
              ...buttonStyle,
              marginTop: "2rem",
              background: "#fff",
              color: "#1a1a1a",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            ส่งต่อความรู้สึก
          </button>
        </div>
      )}

      {/* ---------- holiday ---------- */}
      {phase === "holiday" && (
        <p ref={holidayRef} style={msg}>
          วันนี้เป็นวันหยุดของ&nbsp;{userName}
        </p>
      )}

      {/* ---------- rest ---------- */}
      {phase === "rest" && (
        <p ref={restRef} style={msg}>
          ตอนนี้&nbsp;{userName}&nbsp;ได้โอกาสพักผ่อนจากทุกเรื่อง
        </p>
      )}

      {/* ---------- choice ---------- */}
      {phase === "choice" && (
        <div ref={choiceRef} style={card}>
          <h2
            style={{
              fontSize: "clamp(1.4rem,4vw,2rem)",
              marginBottom: "1.6rem",
            }}
          >
            &nbsp;{userName}&nbsp;อยากให้วันนี้<br/>เป็นวันแบบไหน?
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
            }}
          >
            {dayChoices.map((choice) => (
              <button
                key={choice}
                style={buttonStyle}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
               onClick={() => handleChoiceClick(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionOverlay;
