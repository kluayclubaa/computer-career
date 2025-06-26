// app/JourneyPage.tsx
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import gsap from "gsap";

import VideoBackground from "../components/ui/VideoBackground";
import QuestionOverlay, { DayChoice } from "../components/ui/QuestionOverlay";
import HomePage from "../components/ui/Homepage";
import ContactInfoPage from "../components/ui/contact";

/* ---------- types ---------- */
type UserData = { name: string; age: string };
type ContactData = { helpNeeded: "yes" | "no"; lineId: string; phone: string };
type Scene = "home" | "contact" | "introVideo" | "wake" | "result";
type WakePhase = "awake" | "sky" |"garden";

/* ---------- share icon ---------- */
const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

/* ---------- component ---------- */
export default function JourneyPage() {
  /* scenes & phases */
  const [scene, setScene] = useState<Scene>("home");
  const [wakePhase, setWakePhase] = useState<WakePhase>("awake");

  /* user data */
  const [userData, setUserData] = useState<UserData | null>(null);
  const [contactData, setContactData] = useState<ContactData | null>(null);

  /* share */
  const [isSharing, setIsSharing] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  /* ---------- global fade-in when scene changes ---------- */
  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [scene]);

  /* ---------- wake-phase animation ---------- */
  useEffect(() => {
  if (scene !== "wake") return;

  let t: NodeJS.Timeout;

  if (wakePhase === "awake") {
    // ข้อความแรก
    gsap.fromTo("#wake-msg", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 });
    gsap.to("#wake-msg", { opacity: 0, y: -30, duration: 1, delay: 2.5 });

    // → ไป sky หลัง 3 วิ
    t = setTimeout(() => setWakePhase("sky"), 3000);
  }

  if (wakePhase === "sky") {
    // ข้อความฟ้า
    gsap.fromTo("#sky-msg", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 });
    gsap.to("#sky-msg", { opacity: 0, y: -30, duration: 1, delay: 4 });

    // → ไป garden หลัง 6 วิ (นับจากเข้า sky)
    t = setTimeout(() => setWakePhase("garden"), 6000);
  }

  if (wakePhase === "garden") {
    // ข้อความสวน
    gsap.fromTo("#garden-msg", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 });

    // → ไป result หลัง 5 วิ
    t = setTimeout(() => setScene("result"), 5000);
  }

  return () => clearTimeout(t);
}, [scene, wakePhase]);

  /* ---------- handlers ---------- */
  const handleStart = useCallback((name: string, age: string) => {
    setUserData({ name, age });
    setScene("contact");
  }, []);

  const handleContactComplete = useCallback(
    (data: ContactData) => {
      setContactData(data);
      setScene("introVideo");
      console.log("All collected info:", { ...userData, ...data });
    },
    [userData]
  );

  /* share button */
  const handleShare = async () => {
    if (!pageRef.current) return;
    setIsSharing(true);

    try {
      const canvas = await html2canvas(pageRef.current, {
        useCORS: true,
        allowTaint: true,
        onclone: (doc) => {
          const btn = doc.querySelector("#share-button");
          if (btn) (btn as HTMLElement).style.display = "none";
        },
      });
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
      if (!blob) throw new Error("toBlob error");

      const file = new File([blob], "my-journey.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "My Journey",
          text: "นี่คือเส้นทางการฮีลของฉัน ลองมาดูกันสิ!",
          files: [file],
        });
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "my-journey.png";
        link.click();
      }
    } catch (err) {
      console.error(err);
      navigator.clipboard.writeText("ลองมาฮีลใจกับนีโม่สิ! [ใส่ลิงก์]");
      alert("แชร์รูปไม่ได้ จึงคัดลอกข้อความให้แทนแล้วนะ");
    } finally {
      setIsSharing(false);
    }
  };

  /* ---------- scene renderer ---------- */
  const renderScene = () => {
    switch (scene) {
      case "home":
        return <HomePage onStart={handleStart} />;

      case "contact":
        return <ContactInfoPage onComplete={handleContactComplete} />;

      case "introVideo":
        return (
          <>
            <VideoBackground
              videoSrc="/garden1.mp4"
              audioSrc="/rapid-train.mp3"
              onVideoReady={() => {}}
            />
            {userData && (
              <QuestionOverlay
                userName={userData.name}
                onOverlayComplete={() => {
                  setWakePhase("awake");
                  setScene("wake");
                }}
              />
            )}
          </>
        );

      case "wake":
        return (
          <>
            <VideoBackground
              videoSrc="/wake.mp4"
              audioSrc="/wake-sound.mp3"
              onVideoReady={() => {}}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 50,
                pointerEvents: "none",
              }}
            >
              {wakePhase === "awake" && (
                <p
                  id="wake-msg"
                  style={{
                    fontSize: "clamp(1.6rem,4vw,2.6rem)",
                    color: "#FFF",
                    textShadow: "2px 2px 6px #000",
                  }}
                >
                  ตอนนี้&nbsp;{userData?.name}&nbsp;กำลังตื่นจากที่นอน
                </p>
              )}

              {wakePhase === "sky" && (
                <p
                  id="sky-msg"
                  style={{
                    fontSize: "clamp(1.4rem,4vw,2.4rem)",
                    color: "#E0F7FA",
                    textShadow: "2px 2px 6px #000",
                    textAlign: "center",
                    lineHeight: 1.5,
                    padding: "0 5vw",
                  }}
                >
                  แล้ววันนี้เป็นวันที่&nbsp;{userData?.name}&nbsp;ต้องการ…<br />
                  ช่างแปลกแฮะ&nbsp;ท้องฟ้าดูไม่มืดครึ้มเลย
                </p>
              )}

              {wakePhase === "sky" && (
                <p
                  id="sky-msg"
                  style={{
                    fontSize: "clamp(1.4rem,4vw,2.4rem)",
                    color: "#E0F7FA",
                    textShadow: "2px 2px 6px #000",
                    textAlign: "center",
                    lineHeight: 1.5,
                    padding: "0 5vw",
                  }}
                >
                  คุณกําลังเดินไปที่สวนหลังบ้าน<br />
                  บ้านที่คุณอยู่&nbsp;สวนดอกไม้สวยมากๆเลย
                </p>
              )}
            </div>
          </>
        );

      case "result":
        return (
          <>
            <VideoBackground
              videoSrc="/garden1.mp4"
              audioSrc="/rapid-train.mp3"
              onVideoReady={() => {}}
            />
            {userData && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 50,
                }}
              >
                <div
                  style={{
                    background: "rgba(0,0,0,.7)",
                    backdropFilter: "blur(10px)",
                    padding: "clamp(20px,5vw,40px)",
                    borderRadius: 20,
                    maxWidth: 700,
                    textAlign: "center",
                    color: "#E0F7FA",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "clamp(1.6rem,4vw,2.4rem)",
                      marginBottom: 16,
                    }}
                  >
                    นีโม่ขอฮีลให้&nbsp;{userData.name}
                  </h2>
                  <p style={{ fontSize: "clamp(1rem,2.4vw,1.2rem)" }}>
                    ขอให้วันนี้เป็นวันพักผ่อนที่สบายใจนะ 💙
                  </p>

                  <button
                    id="share-button"
                    disabled={isSharing}
                    onClick={handleShare}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      margin: "2rem auto 0",
                      padding: "12px 24px",
                      fontWeight: 700,
                      borderRadius: 40,
                      border: "1px solid rgba(255,255,255,.5)",
                      background: isSharing
                        ? "rgba(255,255,255,.2)"
                        : "rgba(255,255,255,.15)",
                      cursor: isSharing ? "wait" : "pointer",
                    }}
                  >
                    <ShareIcon />
                    {isSharing ? "กำลังสร้างรูป..." : "แชร์ผล"}
                  </button>
                </div>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  /* ---------- render ---------- */
  return (
    <div
      ref={pageRef}
      style={{
        position: "relative",
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      {renderScene()}
    </div>
  );
}
