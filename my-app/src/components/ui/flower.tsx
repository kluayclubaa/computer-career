"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import VideoBackground from "../ui/VideoBackground"; // ปรับ path ตามจริง

/* ----------------------------------------------------
  FlowerScene
  Flow: gift → askColor → askFeeling → giftAll → onComplete
  All transitions now use LONGER durations + smoother ease.
-----------------------------------------------------*/

type FlowerSceneProps = {
  userName: string;
  onComplete: (color: string, feeling: string) => void;
};

type Phase = "gift" | "askColor" | "askFeeling" | "giftAll";

const colors = ["แดง", "ชมพู", "เขียว", "ขาว", "ม่วง", "น้ำเงิน"] as const;
const feelings = ["ความรัก", "ความอ่อนโยนเอาใจใส่", "ความบริสุทธิ", "ความลึกลับ", "ความสงบเงียบ", "ความสบายใจ"] as const;

const FlowerScene = ({ userName, onComplete }: FlowerSceneProps) => {
  const [phase, setPhase] = useState<Phase>("gift");
  const [pickedColor, setPickedColor] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);

  /* ---------- helper animations ---------- */
  const fadeIn = (el: Element | null, d = 1.4) =>
    el && gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: d, ease: "power3.out" });
  const fadeOut = (el: Element | null, d = 1.2, delay = 0) =>
    el && gsap.to(el, { opacity: 0, y: -40, duration: d, delay, ease: "power3.in" });

  /* ---------- phase animations ---------- */
  useEffect(() => {
    if (!containerRef.current) return;

    if (phase === "gift") {
      fadeIn(imgRef.current, 1.6);
      gsap.fromTo(
        heartRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.6, ease: "elastic.out(1,0.6)", delay: 0.4 }
      );
    }

    if (phase === "askColor" || phase === "askFeeling") {
      fadeIn(cardRef.current, 1.6);
    }

    if (phase === "giftAll") {
      fadeIn(cardRef.current, 1.6);
      /* อยู่แสดงข้อความไว้ 5s แล้วยิง onComplete */
      const t = setTimeout(() => onComplete(pickedColor, pickedFeeling.current), 5000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  /* store feeling pick in ref for callback */
  const pickedFeeling = useRef<string>("");

  /* ---------- handlers ---------- */
  const handleColorPick = (c: string) => {
    setPickedColor(c);
    fadeOut(cardRef.current, 1.2);
    setTimeout(() => setPhase("askFeeling"), 1400);
  };

  const handleFeelingPick = (f: string) => {
    pickedFeeling.current = f;
    fadeOut(cardRef.current, 1.2);
    setTimeout(() => setPhase("giftAll"), 1400);
  };

  /* ---------- memo video background so it never re‑mounts ---------- */
  const gardenVideo = useMemo(
    () => (
      <VideoBackground key="flowerBg" videoSrc="/garden.mp4" audioSrc="" onVideoReady={() => {}} />
    ),
    []
  );

  /* ---------- render ---------- */
  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        background: phase === "gift" ? "#000" : "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
        zIndex: 60,
      }}
    >
      {phase === "gift" && (
        <>
          <h2
            style={{ fontSize: "clamp(1.6rem,5vw,3rem)", marginBottom: "1.6rem", textShadow: "2px 2px 6px #000" }}
          >
            อะนี่ดอกไม้ให้&nbsp;{userName}
          </h2>
          <img
            ref={imgRef}
            src="/flower/1.png"
            alt="flower"
            style={{ maxWidth: "55vw", width: 280, borderRadius: 20, boxShadow: "0 4px 20px rgba(255,255,255,0.25)", marginBottom: "1.8rem" }}
          />
          <p style={{ fontSize: "clamp(1rem,3vw,1.4rem)", marginBottom: "2.2rem", lineHeight: 1.6 }}>
            รู้มั้ย&nbsp;มันเหมาะกับ&nbsp;{userName}&nbsp;มาก
          </p>
          <button
            ref={heartRef}
            onClick={() => setPhase("askColor")}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "2.2rem",
              color: "#FF6B6B",
              cursor: "pointer",
            }}
          >
            ❤️
          </button>
        </>
      )}

      {phase !== "gift" && gardenVideo}

      {(phase === "askColor" || phase === "askFeeling" || phase === "giftAll") && (
        <div
          ref={cardRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 5vw",
            textAlign: "center",
          }}
        >
          {phase === "askColor" && (
            <>
              <p style={{ fontSize: "clamp(1.4rem,4vw,2.2rem)", marginBottom: "2.4rem", textShadow: "2px 2px 6px #0006" }}>
                ถ้า&nbsp;Nemo&nbsp;ให้ดอกไม้&nbsp;{userName}
                <br />อยากได้ดอกไม้สีอะไร?
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
                  gap: "1.2rem",
                  width: "100%",
                  maxWidth: 620,
                }}
              >
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleColorPick(c)}
                    style={{
                      padding: "1rem 1.2rem",
                      borderRadius: 38,
                      border: "1px solid rgba(255,255,255,0.5)",
                      background: "rgba(0,0,0,0.35)",
                      color: "white",
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}

          {phase === "askFeeling" && (
            <>
              <p style={{ fontSize: "clamp(1.4rem,4vw,2.2rem)", marginBottom: "2.4rem", textShadow: "2px 2px 6px #0006" }}>
                เมื่อคุณเห็นดอกไม้ที่ตัวเองเลือก<br />ทำให้รู้สึกอย่างไร?
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
                  gap: "1.2rem",
                  width: "100%",
                  maxWidth: 700,
                }}
              >
                {feelings.map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFeelingPick(f)}
                    style={{
                      padding: "1rem 1.2rem",
                      borderRadius: 38,
                      border: "1px solid rgba(255,255,255,0.5)",
                      background: "rgba(0,0,0,0.35)",
                      color: "white",
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </>
          )}

          {phase === "giftAll" && (
            <p style={{ fontSize: "clamp(1.4rem,4vw,2.2rem)", textShadow: "2px 2px 6px #0006" }}>
              อะนี่&nbsp;Nemo&nbsp;ให้ทุกสีเลย!<br />
              เราให้พิเศษเพราะ&nbsp;{userName}&nbsp;เป็นคนที่มีค่ามากเลยนะ 💐
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FlowerScene;
