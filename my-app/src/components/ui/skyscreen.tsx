// src/components/ui/SkyMessageScene.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import VideoBackground from "../ui/VideoBackground";

/* --------------------------------------------
   Flow
   intro (5 s) → form → empathy → finale (3 s)
   → food (จำได้ / ไม่ได้) → happy (textarea)
--------------------------------------------- */

type Props = {
  videoSrc: string;
  userName: string;
  onDone?: (data: {
    msgToPast: string;
    foodRemember: "yes" | "no";
    happyThing: string;
  }) => void;
};

type Phase = "intro" | "form" | "empathy" | "finale" | "food" | "happy";

export default function SkyMessageScene({ videoSrc, userName, onDone }: Props) {
  /* ---------- state ---------- */
  const [phase, setPhase] = useState<Phase>("intro");
  const [msgToPast, setMsgToPast] = useState("");
  const [foodRemember, setFoodRemember] = useState<"yes" | "no" | null>(null);
  const [happyThing, setHappyThing] = useState("");

  /* ---------- refs ---------- */
  const refs = {
    intro: useRef<HTMLDivElement | null>(null),
    form: useRef<HTMLDivElement | null>(null),
    empathy: useRef<HTMLDivElement | null>(null),
    finale: useRef<HTMLDivElement | null>(null),
    food: useRef<HTMLDivElement | null>(null),
    noMsg: useRef<HTMLParagraphElement | null>(null),
    happy: useRef<HTMLDivElement | null>(null),
  };

  /* ---------- bg video memo ---------- */
  const bg = useMemo(
    () => (
      <VideoBackground
        videoSrc={videoSrc}
        onVideoReady={() => {}}
      />
    ),
    [videoSrc]
  );

  /* ---------- fade-in on every phase ---------- */
  useEffect(() => {
    const el = refs[phase]?.current;
    if (el)
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" }
      );
  }, [phase]);

  /* ---------- timed transitions ---------- */
  useEffect(() => {
  if (phase === "intro") {
    // โค้ดส่วนนี้จะเปลี่ยน phase จาก "intro" ไปเป็น "form" หลังจาก 5000ms (5 วินาที)
    const t = setTimeout(() => setPhase("form"), 5000);
    return () => clearTimeout(t);
  }
    if (phase === "finale") {
      const t = setTimeout(() => setPhase("food"), 5000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  /* ---------- fade-in comforting msg ---------- */
  useEffect(() => {
    if (phase === "food" && foodRemember === "no" && refs.noMsg.current)
      gsap.fromTo(
        refs.noMsg.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
  }, [phase, foodRemember]);

  /* ---------- call onDone after happy ---------- */
  const handleFinish = () => {
    if (onDone) onDone({ msgToPast, foodRemember: foodRemember!, happyThing });
  };

  /* ---------- helpers ---------- */
  const btn = {
    base: {
      padding: "0.9rem 2.2rem",
      borderRadius: 40,
      border: "1px solid rgba(255,255,255,.5)",
      background: "rgba(255,255,255,.25)",
      color: "#fff",
      fontSize: "1rem",
      fontWeight: 700,
      cursor: "pointer",
    } as React.CSSProperties,
  };

  /* ---------- render ---------- */
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 70,
        pointerEvents: ["form", "empathy", "food", "happy"].includes(phase)
          ? "auto"
          : "none",
      }}
    >
      {bg}

      {/* -------- INTRO -------- */}
      {phase === "intro" && (
        <div
          ref={refs.intro}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "clamp(1.6rem,4vw,2.6rem)",
              color: "#fff",
              textShadow: "2px 2px 6px #000",
              textAlign: "center",
            }}
          >
            คุณกำลังเข้าสู่ท้องฟ้าอันสดใส
          </p>
        </div>
      )}

      {/* -------- FORM -------- */}
      {phase === "form" && (
        <div
          ref={refs.form}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "0 6vw",
            color: "#fff",
          }}
        >
          <p
            style={{
              fontSize: "clamp(1.2rem,3.8vw,2rem)",
              marginBottom: "1.5rem",
              textShadow: "2px 2px 6px #000",
            }}
          >
            คุณมองรอบๆ เห็นตัวเองในอดีตที่กำลังเศร้า
            <br />
            อยากบอกอะไรกับตัวเองมั้ย?
          </p>
          <textarea
            value={msgToPast}
            onChange={(e) => setMsgToPast(e.target.value)}
            rows={4}
            placeholder="พิมพ์ข้อความถึงตัวเอง..."
            style={{
              width: "100%",
              maxWidth: 600,
              padding: "1rem",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,.5)",
              background: "rgba(0,0,0,.35)",
              color: "#fff",
              marginBottom: "1.5rem",
            }}
          />
          <button
            style={btn.base}
            disabled={!msgToPast.trim()}
            onClick={() => setPhase("empathy")}
          >
            ส่งข้อความ
          </button>
        </div>
      )}

      {/* -------- EMPATHY -------- */}
      {phase === "empathy" && (
        <div
          ref={refs.empathy}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "0 6vw",
            color: "#fff",
          }}
        >
          <p
            style={{
              fontSize: "clamp(1.3rem,4vw,2.2rem)",
              marginBottom: "2rem",
              textShadow: "2px 2px 6px #000",
            }}
          >
            เราเข้าใจ&nbsp;{userName}&nbsp;นะ &nbsp;{userName}&nbsp;เก่งมาก ๆ
            เลย
            <br />
            แตะที่หัวใจสิ 💖
          </p>
          <button
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,.25)",
              color: "#FF6B6B",
              fontSize: "2.4rem",
              cursor: "pointer",
            }}
            onClick={() => setPhase("finale")}
          >
            ❤️
          </button>
        </div>
      )}

      {/* -------- FINALE -------- */}
      {phase === "finale" && (
        
        <div
          ref={refs.finale}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "clamp(1.4rem,4vw,2.4rem)",
              color: "#fff",
              textShadow: "2px 2px 6px #000",
              textAlign: "center",
              lineHeight: 1.6,
              padding: "0 6vw",
            }}
          >
            หากในใจ&nbsp;{userName}&nbsp;มีท้องฟ้าที่มืดครึ้ม
            <br />
            ให้เราช่วยเปลี่ยนเป็นท้องฟ้าที่สดใสให้นะ
          </p>
        </div>
      )}

      {/* -------- FOOD -------- */}
      {phase === "food" && (
        <div
          ref={refs.food}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "0 6vw",
            color: "#fff",
          }}
        >
          <p
            style={{
              fontSize: "clamp(1.3rem,4vw,2.2rem)",
              marginBottom: "2rem",
              textShadow: "2px 2px 6px #000",
            }}
          >
            จำได้มั้ยตอนเด็ก ๆ&nbsp;{userName}&nbsp;ชอบกินอะไร?
          </p>

          <div style={{ display: "flex", gap: "3rem", marginBottom: "2rem" }}>
            <label
              style={{ display: "flex", gap: "0.8rem", cursor: "pointer" }}
            >
              <input
                type="radio"
                checked={foodRemember === "yes"}
                onChange={() => setFoodRemember("yes")}
              />
              จำได้
            </label>

            <label
              style={{ display: "flex", gap: "0.8rem", cursor: "pointer" }}
            >
              <input
                type="radio"
                checked={foodRemember === "no"}
                onChange={() => setFoodRemember("no")}
              />
              จำไม่ได้
            </label>
          </div>

          {foodRemember === "no" && (
            <p
              ref={refs.noMsg}
              style={{
                fontSize: "clamp(1.1rem,3.5vw,1.8rem)",
                textShadow: "2px 2px 6px #000",
                marginBottom: "2rem",
              }}
            >
              ไม่เป็นไรนะ ค่อย ๆ นึกไปด้วยกันนะ 🤍
            </p>
          )}

          {foodRemember && (
            <button style={btn.base} onClick={() => setPhase("happy")}>
              ต่อไป
            </button>
          )}
        </div>
      )}

      {/* -------- HAPPY -------- */}
      {phase === "happy" && (
        <div
          ref={refs.happy}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "0 6vw",
            color: "#fff",
          }}
        >
          <p
            style={{
              fontSize: "clamp(1.3rem,4vw,2.2rem)",
              marginBottom: "1.5rem",
              textShadow: "2px 2px 6px #000",
            }}
          >
            แล้วตอนเด็ก&nbsp;{userName}&nbsp;มีความสุขกับเรื่องใดมากที่สุด?
          </p>

          <textarea
            value={happyThing}
            onChange={(e) => setHappyThing(e.target.value)}
            rows={4}
            placeholder="บอกเราหน่อย..."
            style={{
              width: "100%",
              maxWidth: 600,
              padding: "1rem",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,.5)",
              background: "rgba(0,0,0,.35)",
              color: "#fff",
              marginBottom: "1.5rem",
            }}
          />

          <button
            style={btn.base}
            disabled={!happyThing.trim()}
            onClick={handleFinish}
          >
            ส่งต่อความสุข
          </button>
        </div>
      )}
    </div>
  );
}
