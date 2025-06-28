// src/components/ui/MysteryTableScene.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

/* ---------------------------------------------------------------
   Flow:
   table → notebook → today → dream → stillLike (3 choices) → onFinish
---------------------------------------------------------------- */

type DreamStatus = "done" | "partial" | "notYet" | "forgot";
type LikeAns = "yes" | "change" | "unsure";
type LikeSelfAns = "yes" | "notReally" | "trying";

type Props = {
  tableImgSrc: string;
  userName: string;
  happyThing: string;   // รับมาจาก Sky scene
  onFinish?: (answer: {
    howToday: string;
    dreamStatus: DreamStatus;
    likeNow: LikeAns;
     likeSelf: LikeSelfAns;
  }) => void;
};

type Phase = "table" | "notebook" | "today" | "dream" | "stillLike" | "likeSelf"; 

export default function MysteryTableScene({
  tableImgSrc,
  userName,
  happyThing,
  onFinish,
}: Props) {
  const [phase, setPhase] = useState<Phase>("table");
  const [howToday, setHowToday] = useState("");
  const [dreamStatus, setDreamStatus] = useState<DreamStatus | null>(null);
  const [likeNow, setLikeNow] = useState<LikeAns | null>(null);
  const [likeSelf, setLikeSelf] = useState<LikeSelfAns | null>(null);

  /* ---------- refs ---------- */
  const refs = {
    table: useRef<HTMLDivElement | null>(null),
    notebook: useRef<HTMLParagraphElement | null>(null),
    today: useRef<HTMLDivElement | null>(null),
    dream: useRef<HTMLDivElement | null>(null),
    stillLike: useRef<HTMLDivElement | null>(null),
    likeSelf: useRef<HTMLDivElement | null>(null),
  } as const;

  /* ---------- fade helper ---------- */
  const fadeIn = (el: Element | null) =>
    el &&
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" }
    );

  /* ---------- phase animations ---------- */
  useEffect(() => {
    fadeIn(refs[phase]?.current);
  }, [phase]);

  /* notebook auto → today */
  useEffect(() => {
    if (phase === "notebook") {
      const t = setTimeout(() => setPhase("today"), 3500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  /* call onFinish when likeNow answered */
  useEffect(() => {
    if (
      phase === "likeSelf" &&
      likeSelf && // เปลี่ยนเงื่อนไขเป็น state สุดท้าย
      dreamStatus &&
      likeNow &&
      typeof onFinish === "function"
    ) {
      onFinish({ howToday, dreamStatus, likeNow, likeSelf }); // ส่งข้อมูลทั้งหมดกลับไป
    }
  }, [phase, likeSelf, dreamStatus, likeNow, howToday, onFinish]);
 

  /* click to reveal notebook */
  const handleReveal = () => {
    const el = refs.table.current;
    if (!el) return;
    gsap.to(el, {
      opacity: 0,
      y: -40,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => setPhase("notebook"),
    });
  };

  /* ---------- styles ---------- */
  const base = {
    wrap: {
      position: "absolute" as const,
      inset: 0,
      background: "#000",
      color: "#fff",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center" as const,
      padding: "0 6vw",
      zIndex: 80,
    },
    p: { textShadow: "2px 2px 6px #000" },
    btn: {
      padding: "0.8rem 2rem",
      borderRadius: 40,
      border: "1px solid rgba(255,255,255,.5)",
      background: "rgba(255,255,255,.25)",
      color: "#fff",
      cursor: "pointer",
    } as React.CSSProperties,
  };

  return (
    <div style={base.wrap}>
      {/* TABLE */}
      {phase === "table" && (
        <div
          ref={refs.table}
          style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}
        >
          <p style={{ ...base.p, fontSize: "clamp(1.3rem,4vw,2.1rem)" }}>
            ระหว่างทางคุณเจอโต๊ะปริศนาที่มีผ้าคลุม
          </p>
          <img
            src={tableImgSrc}
            alt="Mystery Table"
            onClick={handleReveal}
            style={{ maxWidth: "60vw", width: 320, cursor: "pointer", borderRadius: 20, boxShadow: "0 6px 18px rgba(0,0,0,.5)" }}
          />
          <span
            style={{ fontSize: "clamp(1rem,3vw,1.4rem)", opacity: 0.85 }}
          >
            แตะเพื่อดูใต้ผ้าคลุม
          </span>
        </div>
      )}

      {/* NOTEBOOK */}
      {phase === "notebook" && (
        <p
          ref={refs.notebook}
          style={{
            ...base.p,
            fontSize: "clamp(1.4rem,4vw,2.3rem)",
            lineHeight: 1.6,
          }}
        >
          คุณเจอสมุดตอนเด็กที่เคยเขียนไว้&nbsp;สวัสดี&nbsp;{userName}
        </p>
      )}

      {/* TODAY */}
      {phase === "today" && (
        <div
          ref={refs.today}
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <p
            style={{
              ...base.p,
              fontSize: "clamp(1.3rem,4vw,2.1rem)",
              marginBottom: "1.5rem",
            }}
          >
            วันนี้เป็นไงบ้าง?
          </p>
          <textarea
            value={howToday}
            onChange={(e) => setHowToday(e.target.value)}
            rows={3}
            placeholder="บอกเราได้เลย..."
            style={{
              width: "100%",
              maxWidth: 520,
              padding: "1rem",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,.5)",
              background: "rgba(255,255,255,.1)",
              color: "#fff",
            }}
          />
          <button
            style={{ ...base.btn, marginTop: "1.5rem" }}
            disabled={!howToday.trim()}
            onClick={() => setPhase("dream")}
          >
            ต่อไป
          </button>
        </div>
      )}

      {/* DREAM */}
      {phase === "dream" && (
        <div
          ref={refs.dream}
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <p
            style={{
              ...base.p,
              fontSize: "clamp(1.3rem,4vw,2.1rem)",
              marginBottom: "2rem",
            }}
          >
            สิ่งที่ตอนเด็ก&nbsp;{userName}&nbsp;อยากทำ ตอนนี้ได้ทำบ้างหรือยัง?
          </p>
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              maxWidth: 430,
            }}
          >
            <button
              style={base.btn}
              onClick={() => {
                setDreamStatus("done");
                setPhase("stillLike");
              }}
            >
              ได้ทำแล้วทั้งหมด
            </button>
            <button
              style={base.btn}
              onClick={() => {
                setDreamStatus("partial");
                setPhase("stillLike");
              }}
            >
              ทำไปบ้างแล้ว
            </button>
            <button
              style={base.btn}
              onClick={() => {
                setDreamStatus("notYet");
                setPhase("stillLike");
              }}
            >
              ยังไม่ได้เริ่ม
            </button>
            <button
              style={base.btn}
              onClick={() => {
                setDreamStatus("forgot");
                setPhase("stillLike");
              }}
            >
              ลืมไปแล้ว
            </button>
          </div>
        </div>
      )}

      {/* STILL LIKE */}
      {phase === "stillLike" && (
        <div
          ref={refs.stillLike}
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <p
            style={{
              ...base.p,
              fontSize: "clamp(1.3rem,4vw,2.1rem)",
              marginBottom: "2rem",
            }}
          >
            ไม่เจอกันนาน&nbsp;โตขึ้นเยอะเลย<br />
            ยังชอบ&nbsp;“{happyThing}”&nbsp;อยู่หรือเปล่า?
          </p>
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              maxWidth: 200,
            }}
          >
            <button style={base.btn} onClick={() =>{ setLikeNow("yes"); setPhase("likeSelf"); }}>
              ยังคงชอบมาก
            </button>
            <button style={base.btn} onClick={() => { setLikeNow("change"); setPhase("likeSelf"); }}>
              เฉยๆ
            </button>
            <button style={base.btn} onClick={() => { setLikeNow("unsure"); setPhase("likeSelf"); }}>
              ไม่แน่ใจแล้ว
            </button>
          </div>
        </div>
      )}
{phase === "likeSelf" && (
  <div
    ref={refs.likeSelf}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    <p
      style={{
        ...base.p,
        fontSize: "clamp(1.3rem,4vw,2.1rem)",
        marginBottom: "2rem",
        lineHeight: 1.7,
      }}
    >
      งั้นขอถามหน่อยจิ<br />
      ยังชอบตัวเองตอนนี้มั้ย?
    </p>

    <div
      style={{
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        maxWidth: 200,
      }}
    >
      <button
        style={{ ...base.btn, whiteSpace: "nowrap" }}
        onClick={() => setLikeSelf("yes")}
      >
        ชอบสิ
      </button>

      <button
        style={{ ...base.btn, whiteSpace: "nowrap" }}
        onClick={() => setLikeSelf("notReally")}
      >
        ไม่เเน่ใจ
      </button>

      <button
        style={{ ...base.btn, whiteSpace: "nowrap" }}
        onClick={() => setLikeSelf("trying")}
      >
        ไม่อะ
      </button>
    </div>
  </div>
)}
  
    </div>
  );
}
