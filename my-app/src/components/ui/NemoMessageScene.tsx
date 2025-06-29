"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

type UserJourneyData = {
  tiredChoice: string;
  ventMsg: string;
  lessonMsg: string;
};

type Props = {
  onComplete?: (data: UserJourneyData) => void;
};

const journeySteps = [
  { type: "message", text: "เชื่อนีโม่นะ สักวันนึงเด็กคนนี้จะโตในเเบบที่เธอต้องการ" },
  { type: "message", text: "ในโลกใบนี้คงไม่มีใครรู้ว่าเด็กคนนี้โตไปเจออะไรบ้าง" },
  { type: "message", text: "ให้กําลังใจเด็กคนนี้ทีนะ ^-^" },
  { type: "message", text: "ก่อนลา... เด็กคนนี้มีสิ่งที่อยากจะบอก" },
  { type: "message", text: "พี่เก่งมากเลยนะ ในสายตาผมมองพี่โคตรสุดยอดเลย" },
  { type: "choice", text: "โตขึ้นเยอะเลยพี่ เหนื่อยมั้ย?", options: ["เหนื่อย", "ไม่เท่าไหร่"] },
  { type: "message", text: "โอเคมั้ย ไหวหรือเปล่า!" },
  { type: "input", text: "ระบายได้นะพี่", placeholder: "ระบายความรู้สึกออกมาได้เลย..." },
  { type: "message", text: "มันยากมากเนอะ เข้าใจเลย กว่าจะผ่านไปได้ พี่โคตรเก่งเลย" },
  { type: "message", text: "ขอบคุณนะพี่ที่อดทนผ่านมาได้" },
  { type: "message", text: "ขอบคุณที่ผ่านมาได้จนโตขึ้นขนาดนี้ ขอบคุณที่พยายามมากนะพี่" },
  { type: "message", text: "หลังจากนี้ถ้าพี่เหนื่อย พักบ้างนะ เป็นห่วงนะ กินข้าวให้ครบมื้อ อย่ากดดันตัวเองมากไป" },
  { type: "message", text: "ถ้าไม่ไหวร้องไห้ได้นะ การร้องไห้ไม่ใช่คนแพ้เลย" },
  { type: "message", text: "พี่ไม่ได้โตในแบบที่พี่ไม่ชอบหรอก โลกมันเปลี่ยนไปเอง ไม่ต้องขอโทษนะ" },
  { type: "message", text: "บ๊ะบาย" },
  { type: "message", text: "ทุกอย่างย้อนกลับไม่ได้ แต่มันทำให้คุณมีวันนี้" },
  { type: "message", text: "ขอบคุณมากนะ ให้รางวัลตัวเองบ้าง ทุกการเติบโตมันจะเป็นบทเรียนเอง" },
  { type: "input", text: "ที่ผ่านมาของชีวิต... ให้บทเรียนอะไรบ้าง?", placeholder: "บทเรียนที่ได้เรียนรู้..." },
  { type: "message", text: "หวังว่าคุณในตอนนี้จะมีความสุขมากนะคนเก่ง" },
  { type: "message", text: "นีโม่ขอส่งกำลังใจให้เองนะ" },
  { type: "final", text: "ทานข้าวให้อร่อย นอนหลับให้เต็มอิ่ม ให้รางวัลตัวเองบ้าง เราไม่สามารถทราบความคิดใครได้ แต่เราสามารถปรับความคิดตัวเองได้นะ แคร์แค่กับคนที่เขารักเรา เอาหินจากอกมาฝากไว้ที่นีโม่ได้นะ ขอบคุณตัวเองบ้างนะ... เธอกับร่างกายเธอเก่งมาก" },
];

export default function NemoMessageScene({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [tiredChoice, setTiredChoice] = useState("");
  const [ventMessage, setVentMessage] = useState("");
  const [lessonMessage, setLessonMessage] = useState("");
  
  const sceneRef = useRef<HTMLDivElement>(null);
 const timelineRef = useRef<gsap.core.Timeline | null>(null);


  // ฟังก์ชันคำนวณเวลาที่ควรรออ่าน (เพื่อให้ dynamic มากขึ้น)
  const calculateReadTime = (text: string) => {
    const words = text.split(' ').length;
    const readTimeInSeconds = words / 3; // ประมาณ 3 คำต่อวินาที
    return Math.max(3.5, Math.min(readTimeInSeconds, 8)); // รออย่างน้อย 3.5 วิ แต่ไม่เกิน 8 วิ
  };

  useEffect(() => {
    const currentStepData = journeySteps[step];
    const sceneElement = sceneRef.current;
    if (!sceneElement) return;

    // สร้าง timeline ใหม่สำหรับ step นี้
    timelineRef.current = gsap.timeline();

    // 1. Fade In ข้อความปัจจุบัน
    timelineRef.current.fromTo(
      sceneElement,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
    );

    // 2. ถ้าเป็นข้อความธรรมดา ให้เล่นต่ออัตโนมัติ
    if (currentStepData.type === 'message' || currentStepData.type === 'final') {
      const readTime = calculateReadTime(currentStepData.text);
      
      // 3. Fade Out ข้อความหลังจากรออ่าน
      timelineRef.current.to(sceneElement, {
        opacity: 0,
        y: -30,
        duration: 1.5,
        ease: "power3.in",
        delay: readTime,
      });

      // 4. เรียกฟังก์ชันไป step ถัดไป
      timelineRef.current.call(handleNext);
    }
    
    // Cleanup function: หยุด timeline เมื่อ component unmount
    return () => {
      timelineRef.current?.kill();
    };
  }, [step]); // <- Effect นี้จะทำงานใหม่ทุกครั้งที่ step เปลี่ยน

  const handleNext = () => {
    if (step < journeySteps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      if (onComplete) {
        onComplete({ tiredChoice, ventMsg: ventMessage, lessonMsg: lessonMessage });
      }
    }
  };

  // Styles (เหมือนเดิม)
  const pStyle: React.CSSProperties = {
    fontSize: "clamp(1.5rem, 4vw, 2.2rem)", color: "#fff", textAlign: "center",
    padding: "0 2rem", textShadow: "2px 2px 8px #000", lineHeight: 1.5,
  };
  const btnStyle: React.CSSProperties = {
    padding: "0.8rem 1.8rem", borderRadius: 30, border: "1px solid rgba(255,255,255,0.6)",
    background: "rgba(255,255,255,0.25)", color: "#fff", cursor: "pointer", margin: "0.5rem", fontSize: '1rem',
  };
  const inputStyle: React.CSSProperties = {
    width: "80%", maxWidth: 500, padding: "1rem", borderRadius: 12, border: "1px solid rgba(255,255,255,0.5)",
    background: "rgba(255,255,255,0.15)", color: "#fff", marginBottom: "1rem", resize: "vertical", fontSize: '1rem',
  };

  const currentStepData = journeySteps[step];

  const renderStep = () => {
    switch (currentStepData.type) {
      case "choice":
        return (
          <>
            <p style={pStyle}>{currentStepData.text}</p>
            <div>
              {currentStepData.options?.map((option) => (
                <button key={option} style={btnStyle} onClick={() => {
                  setTiredChoice(option);
                  handleNext();
                }}>
                  {option}
                </button>
              ))}
            </div>
          </>
        );

      case "input":
        const isVentStep = currentStepData.text.includes("ระบาย");
        const message = isVentStep ? ventMessage : lessonMessage;
        const setMessage = isVentStep ? setVentMessage : setLessonMessage;
        return (
          <>
            <p style={pStyle}>{currentStepData.text}</p>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)}
              rows={4} style={inputStyle} placeholder={currentStepData.placeholder}/>
            <button style={btnStyle} disabled={!message.trim()} onClick={handleNext}>❤️</button>
          </>
        );
      
      // สำหรับ message และ final จะแสดงแค่ข้อความ ไม่ต้องมีปุ่ม
      case "final":
      case "message":
      default:
        return <p style={pStyle}>{currentStepData.text}</p>;
    }
  };

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 100, overflow: 'hidden' }}>
      {/* ใช้ key={step} เพื่อให้ React re-mount component และ animation เริ่มใหม่ได้ถูกต้อง */}
      <div ref={sceneRef} key={step} style={{ textAlign: 'center', width: '90%', maxWidth: '800px', opacity: 0 }}>
        {renderStep()}
      </div>
    </div>
  );
}