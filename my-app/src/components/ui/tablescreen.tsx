// src/components/ui/MysteryTableScene.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

type DreamStatus = "done" | "partial" | "notYet" | "forgot";
type LikeAns = "yes" | "change" | "unsure";
type LikeSelfAns = "yes" | "notReally" | "trying";

// 1. ★★★ ทำให้ Type มีความเฉพาะเจาะจงมากขึ้น ★★★
const tablePhases = [
  { id: "table", type: "initial" as const },
  { id: "notebook", type: "message" as const, duration: 3.5, text: (name: string) => `คุณเจอสมุดตอนเด็กที่เคยเขียนไว้... สวัสดี ${name}` },
  { id: "today", type: "input" as const, text: () => `วันนี้เป็นไงบ้าง?`, placeholder: "บอกเราได้เลย..." },
  {
    id: "dream",
    type: "choice-dream" as const, // แก้ Type
    text: (name: string) => `สิ่งที่ตอนเด็ก ${name} อยากทำ ตอนนี้ได้ทำบ้างหรือยัง?`,
    options: [
      { key: "done", text: "ได้ทำแล้วทั้งหมด" }, { key: "partial", text: "ทำไปบ้างแล้ว" },
      { key: "notYet", text: "ยังไม่ได้เริ่ม" }, { key: "forgot", text: "ลืมไปแล้ว" },
    ],
  },
  {
    id: "stillLike",
    type: "choice-stillLike" as const, // แก้ Type
    text: (name:string, happyThing: string) => `ไม่เจอกันนาน โตขึ้นเยอะเลย<br/>ยังชอบ “${happyThing}” อยู่หรือเปล่า?`,
    options: [
      { key: "yes", text: "ยังคงชอบมาก" }, { key: "change", text: "เฉยๆ" },
      { key: "unsure", text: "ไม่แน่ใจแล้ว" },
    ],
  },
  {
    id: "likeSelf",
    type: "choice-likeSelf" as const, // แก้ Type
    text: () => `งั้นขอถามหน่อยจิ<br/>ยังชอบตัวเองตอนนี้มั้ย?`,
    options: [
      { key: "yes", text: "ชอบสิ" }, { key: "notReally", text: "ไม่เเน่ใจ" },
      { key: "trying", text: "ไม่อะ" },
    ],
  },
];

type Props = {
  tableImgSrc: string;
  userName: string;
  happyThing: string;
  onFinish?: (answer: { howToday: string; dreamStatus: DreamStatus; likeNow: LikeAns; likeSelf: LikeSelfAns; }) => void;
};

export default function MysteryTableScene({ tableImgSrc, userName, happyThing, onFinish }: Props) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [howToday, setHowToday] = useState("");
  const [dreamStatus, setDreamStatus] = useState<DreamStatus | null>(null);
  const [likeNow, setLikeNow] = useState<LikeAns | null>(null);
  const [likeSelf, setLikeSelf] = useState<LikeSelfAns | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentPhase = tablePhases[phaseIndex];
    const sceneElement = sceneRef.current;
    if (!sceneElement) return;
    const tl = gsap.timeline();
    tl.fromTo(sceneElement, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" });
    if (currentPhase.type === "message") {
      tl.to(sceneElement, { opacity: 0, y: -30, duration: 1.5, ease: "power3.in", delay: currentPhase.duration });
      tl.call(handleAdvance);
    }
    return () => { tl.kill(); };
  }, [phaseIndex]);

  const handleAdvance = () => { if (phaseIndex < tablePhases.length - 1) { setPhaseIndex(prev => prev + 1); } };
  const handleInteraction = (callback?: () => void) => {
    gsap.to(sceneRef.current, {
      opacity: 0, y: -30, duration: 1.0, ease: "power3.in",
      onComplete: () => { if (callback) callback(); handleAdvance(); },
    });
  };
  const handleFinish = (finalAnswer: LikeSelfAns) => {
    setLikeSelf(finalAnswer);
    gsap.to(sceneRef.current, {
      opacity: 0, y: -30, duration: 1.0, ease: "power3.in",
      onComplete: () => {
        if (onFinish && dreamStatus && likeNow) {
          onFinish({ howToday, dreamStatus, likeNow, likeSelf: finalAnswer });
        }
      },
    });
  };

  const baseStyles = {
    p: { textShadow: "2px 2px 6px #000", fontSize: "clamp(1.3rem,4vw,2.1rem)", marginBottom: "2rem", lineHeight: 1.7 } as React.CSSProperties,
    btn: { padding: "0.8rem 2rem", borderRadius: 40, border: "1px solid rgba(255,255,255,.5)", background: "rgba(255,255,255,.25)", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" } as React.CSSProperties,
  };

  const currentPhase = tablePhases[phaseIndex];

  // 2. ★★★ แก้ไข switch-case ให้ตรงกับ Type ใหม่ ★★★
  const renderContent = () => {
    switch(currentPhase.type) {
      case "initial":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem", alignItems: "center" }}>
            <p style={baseStyles.p}>ระหว่างทางคุณเจอโต๊ะปริศนาที่มีผ้าคลุม</p>
            <img src={tableImgSrc} alt="Mystery Table" onClick={() => handleInteraction()} style={{ maxWidth: "60vw", width: 320, cursor: "pointer", borderRadius: 20, boxShadow: "0 6px 18px rgba(0,0,0,.5)" }} />
            <span style={{ fontSize: "clamp(1rem,3vw,1.4rem)", opacity: 0.85 }}>แตะเพื่อดูใต้ผ้าคลุม</span>
          </div>
        );
      case "message":
        return <p style={{...baseStyles.p, fontSize: "clamp(1.4rem,4vw,2.3rem)"}}>{currentPhase.text(userName)}</p>;
      case "input":
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: '100%' }}>
            <p style={baseStyles.p}>{currentPhase.text()}</p>
            <textarea value={howToday} onChange={(e) => setHowToday(e.target.value)} rows={3} placeholder={currentPhase.placeholder} style={{ width: "100%", maxWidth: 520, padding: "1rem", borderRadius: 14, border: "1px solid rgba(255,255,255,.5)", background: "rgba(255,255,255,.1)", color: "#fff" }} />
            <button style={{ ...baseStyles.btn, marginTop: "1.5rem" }} disabled={!howToday.trim()} onClick={() => handleInteraction()}>ต่อไป</button>
          </div>
        );

      // สร้าง case แยกสำหรับ choice แต่ละแบบ
      case "choice-dream":
      case "choice-stillLike":
      case "choice-likeSelf": {
        let displayText = "";
        if(currentPhase.type === 'choice-dream') displayText = currentPhase.text(userName);
        else if (currentPhase.type === 'choice-stillLike') displayText = currentPhase.text(userName, happyThing);
        else if (currentPhase.type === 'choice-likeSelf') displayText = currentPhase.text();
        
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={baseStyles.p} dangerouslySetInnerHTML={{__html: displayText}} />
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", maxWidth: '90%', width: 'auto' }}>
              {currentPhase.options.map(opt => (
                <button key={opt.key} style={baseStyles.btn} onClick={() => {
                  if (currentPhase.type === 'choice-dream') handleInteraction(() => setDreamStatus(opt.key as DreamStatus));
                  if (currentPhase.type === 'choice-stillLike') handleInteraction(() => setLikeNow(opt.key as LikeAns));
                  if (currentPhase.type === 'choice-likeSelf') handleFinish(opt.key as LikeSelfAns);
                }}>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        );
      }
      default: return null;
    }
  };

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 6vw", zIndex: 80, overflow: 'hidden' }}>
      <div ref={sceneRef} key={phaseIndex} style={{width: '100%', opacity: 0}}>
          {renderContent()}
      </div>
    </div>
  );
}