"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import VideoBackground from "../ui/VideoBackground";

/* -------------------------------------------------------
   SkyMessageScene – พิมพ์ข้อความถึงตัวเอง + ให้กำลังใจ
   Flow: intro → form → empathy → finale → food
---------------------------------------------------------*/

type Props = {
  videoSrc: string;
  userName: string;
  onDone?: () => void; // callback หลังจบทุกอย่าง (optional)
};

type Phase = "intro" | "form" | "empathy" | "finale" | "food";

const SkyMessageScene = ({ videoSrc, userName, onDone }: Props) => {
  /* ---------- state ---------- */
  const [phase, setPhase] = useState<Phase>("intro");
  const [message, setMessage] = useState("");
  const [foodRemember, setFoodRemember] = useState<"yes" | "no" | null>(null);

  /* ---------- refs ---------- */
  const introRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const empathyRef = useRef<HTMLDivElement | null>(null);
  const finaleRef = useRef<HTMLDivElement | null>(null);
  const foodRef = useRef<HTMLDivElement | null>(null);
  const noMsgRef = useRef<HTMLParagraphElement | null>(null);

  /* ---------- memo bg video ---------- */
  const bgVid = useMemo(
    () => (
      <VideoBackground
        key="sky-bg"
        videoSrc={videoSrc}
        audioSrc=""
        onVideoReady={() => {}}
      />
    ),
    [videoSrc]
  );

  /* ---------- intro → form (5 s) ---------- */
  useEffect(() => {
    if (phase !== "intro") return;
    const el = introRef.current;
    if (!el) return;
    const t = setTimeout(() => {
      gsap.to(el, {
        opacity: 0,
        y: -30,
        duration: 1.2,
        ease: "power2.in",
        onComplete: () => setPhase("form"),
      });
    }, 5000);
    return () => clearTimeout(t);
  }, [phase]);

  /* ---------- fade‑in each phase ---------- */
  useEffect(() => {
    const refMap = { intro: introRef, form: formRef, empathy: empathyRef, finale: finaleRef, food: foodRef } as const;
    const el = refMap[phase].current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.6, ease: "power2.out" });
  }, [phase]);

  /* ---------- finale → food (5 s) ---------- */
  useEffect(() => {
    if (phase !== "finale") return;
    const t = setTimeout(() => setPhase("food"), 5000);
    return () => clearTimeout(t);
  }, [phase]);

  /* ---------- fade "ไม่เป็นไรนะ…" เมื่อเลือก no ---------- */
  useEffect(() => {
    if (phase !== "food" || foodRemember !== "no" || !noMsgRef.current) return;
    gsap.fromTo(noMsgRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" });
  }, [phase, foodRemember]);

  /* ---------- call onDone ---------- */
  useEffect(() => {
    if (phase !== "food" || foodRemember === null || typeof onDone !== "function") return;
    const delay = foodRemember === "yes" ? 5000 : 7000; // extra timeให้อ่านข้อความปลอบใจ
    const t = setTimeout(onDone, delay);
    return () => clearTimeout(t);
  }, [phase, foodRemember, onDone]);

  /* ---------- render ---------- */
  return (
    <div
      style={{ position: "absolute", inset: 0, zIndex: 70, pointerEvents: ["form", "empathy", "food"].includes(phase) ? "auto" : "none" }}
    >
      {bgVid}

      {/* ---------- INTRO ---------- */}
      {phase === "intro" && (
        <div ref={introRef} style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p style={{ fontSize: "clamp(1.6rem,4vw,2.6rem)", color: "#fff", textAlign: "center", textShadow: "2px 2px 6px #000" }}>
            คุณกำลังเข้าสู่ท้องฟ้าอันสดใส
          </p>
        </div>
      )}

      {/* ---------- FORM ---------- */}
      {phase === "form" && (
        <div
          ref={formRef}
          style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 6vw", textAlign: "center", color: "white" }}
        >
          <p style={{ fontSize: "clamp(1.2rem,3.8vw,2rem)", marginBottom: "1.5rem", textShadow: "2px 2px 6px #000" }}>
            คุณมองรอบๆ คุณเห็นตัวเองในอดีตที่กำลังเศร้า<br />อยากบอกอะไรกับตัวเองมั้ย?
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="พิมพ์ข้อความถึงตัวเอง..."
            rows={4}
            style={{ width: "100%", maxWidth: 600, padding: "1rem", fontSize: "1rem", borderRadius: 16, border: "1px solid rgba(255,255,255,0.5)", background: "rgba(0,0,0,0.35)", color: "white", resize: "vertical", marginBottom: "1.5rem" }}
          />
          <button
            onClick={() => setPhase("empathy")}
            disabled={!message.trim()}
            style={{ padding: "0.9rem 2.4rem", borderRadius: 40, border: "1px solid rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.2)", color: "white", fontSize: "1rem", fontWeight: 700, cursor: "pointer" }}
          >
            ส่งข้อความ
          </button>
        </div>
      )}

      {/* ---------- EMPATHY ---------- */}
      {phase === "empathy" && (
        <div
          ref={empathyRef}
          style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 6vw", color: "white" }}
        >
          <p style={{ fontSize: "clamp(1.3rem,4vw,2.2rem)", marginBottom: "2rem", textShadow: "2px 2px 6px #000" }}>
            เราเข้าใจ&nbsp;{userName}&nbsp;นะ&nbsp;{userName}&nbsp;เก่งมากๆ เลยนะ<br />เราอยากให้คนเก่งดูสิ่งนี้&nbsp;แตะที่หัวใจสิ 💖
          </p>
          <button
            onClick={() => setPhase("finale")}
            style={{ width: 90, height: 90, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.25)", color: "#FF6B6B", fontSize: "2.4rem", cursor: "pointer", transition: "transform .3s" }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            ❤️
          </button>
        </div>
      )}

      {/* ---------- FINALE ---------- */}
      {phase === "finale" && (
        <div ref={finaleRef} style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p style={{ fontSize: "clamp(1.4rem,4vw,2.4rem)", color: "#FFF", textAlign: "center", textShadow: "2px 2px 6px #000", lineHeight: 1.6, padding: "0 6vw" }}>
            หากในใจ&nbsp;{userName}&nbsp;ตอนนี้มีท้องฟ้าที่มืดครึ้ม<br />ให้เราช่วยเปลี่ยนเป็นท้องฟ้าที่สดใสให้นะ
          </p>
        </div>
      )}

      {/* ---------- FOOD ---------- */}
      {phase === "food" && (
        <div
          ref={foodRef}
          style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 6vw", color: "white" }}
        >
          <p style={{ fontSize: "clamp(1.3rem,4vw,2.2rem)", marginBottom: "2rem", textShadow: "2px 2px 6px #000" }}>
            จำได้มั้ยตอนเด็ก ๆ&nbsp;{userName}&nbsp;ชอบกินอะไร?
          </p>
          <div style={{ display: "flex", gap: "2rem", marginBottom: foodRemember === "no" ? "1.5rem" : "2.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "1.0rem", cursor: "pointer" }}>
              <input type="radio" name="foodMemory" checked={foodRemember === "yes"} onChange={() => setFoodRemember("yes")}/>
              <span>จำได้</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "1.0rem", cursor: "pointer" }}>
              <input type="radio" name="foodMemory" checked={foodRemember === "no"} onChange={() => setFoodRemember("no")}/>
              <span>จำไม่ได้</span>
            </label>
          </div>

          {/* ปลอบใจเมื่อจำไม่ได้ */}
          {foodRemember === "no" && (
            <p
              ref={noMsgRef}
              style={{ fontSize: "clamp(1.1rem,3.5vw,1.8rem)", textShadow: "2px 2px 6px #000", lineHeight: 1.6 }}
            >
              ไม่เป็นไรนะ ค่อย ๆ นึกไปด้วยกันนะ 🤍
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SkyMessageScene;
