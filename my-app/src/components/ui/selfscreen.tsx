// src/components/ui/SelfComparisonScene.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Choice = "past" | "now";

type Props = {
  userName?: string;
  childImg: string;
  onChoose?: (choice: Choice) => void;
};

// 1. กำหนดโครงสร้างของแต่ละ Phase ให้เป็นระเบียบใน Array
const scenePhases = [
  { id: "msg1", type: "message", text: (name: string) => `เราเข้าใจความรู้สึกของ ${name} นะ ไม่ว่าเธอจะเจอเรื่องอะไรมา` },
  { id: "msg2", type: "messageWithImage", text: () => `แต่รู้มั้ย ถ้าเทียบกับเมื่อก่อน…` },
  { id: "msg3", type: "message", text: () => `ตอนเธอยังเด็ก อายุน้อยกว่านี้…` },
  { id: "msg4", type: "message", text: () => `เธอเก่งขึ้นมาก ๆ เลยนะที่เติบโตมาได้ขนาดนี้<br/>นีโม่ภูมิใจในตัวเธอมาก ๆ เลยนะ` },
  { id: "question", type: "question", text: () => `แล้วเธอชอบตัวเองตอนไหนมากกว่า?` },
  { id: "end1", type: "message", text: () => `ตอนนี้เธอกำลังอยู่กับตัวเองวัยเด็กของเธอเองนะ` },
  { id: "end2", type: "message", text: () => `หลังจากนี้ โปรดใจดีอ่อนโยนกับเด็กคนนี้หน่อยนะ` },
];

export default function SelfComparisonScene({
  userName = "เธอ",
  childImg,
  onChoose,
}: Props) {
  // 2. ใช้ Index ในการควบคุม Phase และใช้ Ref แค่ตัวเดียว
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [picked, setPicked] = useState<Choice | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  const calculateReadTime = (text: string) => {
    const words = text.split(' ').length;
    return Math.max(3.5, Math.min(words / 2.5, 8));
  };

  // 3. useEffect หลักสำหรับจัดการ Animation Timeline
  useEffect(() => {
    const currentPhase = scenePhases[phaseIndex];
    const sceneElement = sceneRef.current;
    if (!sceneElement) return;

    const tl = gsap.timeline();

    // Fade In
    tl.fromTo(
      sceneElement,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
    );

    // ถ้าเป็น message ให้เล่นต่อไปอัตโนมัติ
    if (currentPhase.type.startsWith("message")) {
      const readTime = calculateReadTime(currentPhase.text(userName));
      tl.to(sceneElement, {
        opacity: 0,
        y: -30,
        duration: 1.5,
        ease: "power3.in",
        delay: readTime,
      });
      tl.call(handleAdvance);
    }
    
    // ถ้าเป็น question หรือขั้นตอนสุดท้าย จะรอ user action
    // (phase สุดท้ายจะรอให้ onChoose ทำงาน)

    return () => {
      tl.kill();
    };
  }, [phaseIndex]);
  
  // 4. สร้างฟังก์ชันสำหรับจัดการการเปลี่ยน Phase
  const handleAdvance = () => {
    if (phaseIndex === scenePhases.length - 1) {
        // เมื่อถึง Phase สุดท้าย ให้เรียก onChoose
        if (picked && onChoose) {
            onChoose(picked);
        }
    } else {
      setPhaseIndex(prev => prev + 1);
    }
  };
  
  const handleChoice = (choice: Choice) => {
    setPicked(choice);
    // ทำ animation fade-out แล้วค่อยเปลี่ยน phase
    gsap.to(sceneRef.current, {
        opacity: 0,
        y: -30,
        duration: 1.0,
        ease: "power3.in",
        onComplete: () => {
          setPhaseIndex(prev => prev + 1); // ไปที่ end1
        }
    });
  };


  const pStyle: React.CSSProperties = { fontSize: "clamp(1.3rem,4vw,2.2rem)", color: "#fff", textAlign: "center", textShadow: "2px 2px 6px #000", lineHeight: 1.7, marginBottom: "1rem" };
  const btnStyle: React.CSSProperties = { padding: "0.85rem 2.2rem", borderRadius: 40, border: "1px solid rgba(255,255,255,.5)", background: "rgba(255,255,255,.25)", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" };

  // 5. ทำให้ JSX สะอาดขึ้นโดยการ render จาก Array
  const currentPhase = scenePhases[phaseIndex];

  const renderContent = () => {
    switch(currentPhase.type) {
        case "message":
            return <p style={pStyle} dangerouslySetInnerHTML={{ __html: currentPhase.text(userName) }} />;
        
        case "messageWithImage":
            return (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.6rem" }}>
                    <img src={childImg} alt="child" style={{ maxWidth: "55vw", width: 280, borderRadius: 20, boxShadow: "0 6px 20px rgba(0,0,0,.6)" }}/>
                    <p style={pStyle}>{currentPhase.text(userName)}</p>
                </div>
            );

        case "question":
            return (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
                    <p style={pStyle}>{currentPhase.text(userName)}</p>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button style={btnStyle} onClick={() => handleChoice("past")}>ชอบตอนเด็ก</button>
                        <button style={btnStyle} onClick={() => handleChoice("now")}>ชอบตอนนี้</button>
                    </div>
                </div>
            );

        default:
            return null;
    }
  }

  return (
    <div
      style={{
        position: "absolute", inset: 0, background: "#000", display: "flex",
        flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: "0 6vw", textAlign: "center", zIndex: 90,
      }}
    >
        <div ref={sceneRef} key={phaseIndex} style={{ width: '100%', opacity: 0 }}>
            {renderContent()}
        </div>
    </div>
  );
}