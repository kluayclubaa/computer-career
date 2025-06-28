"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* --------------------------------------------------------------
   SelfComparisonScene – ปลอบใจ + เปรียบเทียบตัวเองอดีต/ปัจจุบัน
   Flow:
     msg1 → msg2 (+รูปเด็ก) → msg3 → msg4 → question (2 choices)
   แต่ละข้อความค้าง 4 วินาที, เฟดอิน/เอาต์นุ่มนวล

   props:
     userName   – ชื่อผู้ใช้แทรกในข้อความ (optional)
     childImg   – path รูปเด็ก (string)
     onChoose   – callback(choice) เมื่อเลือก 2 ช้อยส์
----------------------------------------------------------------*/

type Choice = "past" | "now";

type Props = {
  userName?: string;
  childImg: string;
  onChoose?: (choice: Choice) => void;
};

type Phase = "msg1" | "msg2" | "msg3" | "msg4" | "question";

const SelfComparisonScene = ({ userName = "เธอ", childImg, onChoose }: Props) => {
  const [phase, setPhase] = useState<Phase>("msg1");

  const refs = {
  msg1: useRef<HTMLDivElement>(null),
  msg2: useRef<HTMLDivElement>(null),
  msg3: useRef<HTMLDivElement>(null),
  msg4: useRef<HTMLDivElement>(null),
  question: useRef<HTMLDivElement>(null),
} as const;

  /* fade helper */
  const fadeIn = (el: Element | null) => {
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" });
  };

  /* show each phase */
  useEffect(() => {
    fadeIn(refs[phase].current);

    if (phase === "question") return; // last phase

    const timer = setTimeout(() => {
      const order: Phase[] = ["msg1", "msg2", "msg3", "msg4", "question"];
      const idx = order.indexOf(phase);
      setPhase(order[idx + 1]);
    }, 5000); // 4s each

    return () => clearTimeout(timer);
  }, [phase]);

  /* styles */
  const pStyle: React.CSSProperties = {
    fontSize: "clamp(1.3rem,4vw,2.2rem)",
    color: "#fff",
    textAlign: "center",
    textShadow: "2px 2px 6px #000",
    lineHeight: 1.7,
  };
  const btnStyle: React.CSSProperties = {
    padding: "0.85rem 2.2rem",
    borderRadius: 40,
    border: "1px solid rgba(255,255,255,.5)",
    background: "rgba(255,255,255,.25)",
    color: "#fff",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 6vw",
        textAlign: "center",
        zIndex: 90,
      }}
    >
      {/* msg1 */}
      {phase === "msg1" && (
        <div ref={refs.msg1}>
          <p style={pStyle}>
            เราเข้าใจความรู้สึกของเธอนะ ไม่ว่าเธอจะเจอเรื่องอะไรมา
          </p>
        </div>
      )}

      {/* msg2 + image */}
      {phase === "msg2" && (
        <div ref={refs.msg2} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.6rem" }}>
          <img src={childImg} alt="child" style={{ maxWidth: "55vw", width: 280, borderRadius: 20, boxShadow: "0 6px 20px rgba(0,0,0,.6)" }} />
          <p style={pStyle}>แต่รู้มั้ย ถ้าเทียบกับเมื่อก่อน…</p>
        </div>
      )}

      {/* msg3 */}
      {phase === "msg3" && (
        <div ref={refs.msg3}>
          <p style={pStyle}>ตอนเธอยังเด็ก อายุน้อยกว่านี้…</p>
        </div>
      )}

      {/* msg4 */}
      {phase === "msg4" && (
        <div ref={refs.msg4}>
          <p style={pStyle}>
            เธอเก่งขึ้นมาก ๆ เลยนะที่เติบโตมาได้ขนาดนี้<br />นีโม่ภูมิใจในตัวเธอมาก ๆ เลยนะ
          </p>
        </div>
      )}

      {/* question */}
      {phase === "question" && (
        <div ref={refs.question} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <p style={pStyle}>แล้วเธอชอบตัวเองตอนไหนมากกว่า?</p>

          <button style={btnStyle} onClick={() => onChoose?.("past")}>ตอนเด็ก</button>
          <button style={btnStyle} onClick={() => onChoose?.("now")}>ตอนนี้</button>
        </div>
      )}
    </div>
  );
};

export default SelfComparisonScene;
