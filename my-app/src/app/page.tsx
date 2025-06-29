// app/JourneyPage.tsx
"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import html2canvas from "html2canvas";
import gsap from "gsap";

import VideoBackground from "../components/ui/VideoBackground";
import QuestionOverlay, { DayChoice } from "../components/ui/QuestionOverlay";
import HomePage from "../components/ui/Homepage";
import ContactInfoPage from "../components/ui/contact";
import FlowerScene from "@/components/ui/flower";
import SkyMessageScene from "@/components/ui/skyscreen";
import MysteryTableScene from "@/components/ui/tablescreen";
import SelfComparisonScene from "@/components/ui/selfscreen";
import ChildJourneyScene from "@/components/ui/child";
import NemoMessageScene from "@/components/ui/NemoMessageScene";

/* ---------- types ---------- */
type UserData = { name: string; age: string };
type ContactData = { helpNeeded: "yes" | "no"; lineId: string; phone: string };
type Scene =
  | "home"
  | "contact"
  | "introVideo"
  | "wake"
  | "result"
  | "flower"
  | "skyMessage"
  | "Table"
  | "Self"
  | "ChildJourney"
  | "NemoMessage";
type WakePhase = "awake" | "sky" | "garden";

type SkyData = {
  msgToPast: string;
  foodRemember: "yes" | "no";
  happyThing: string;
};

type NemoData = { 
  tiredChoice: string; 
  ventMsg: string; 
  lessonMsg: string; 
};

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
   const [nemoData, setNemoData] = useState<NemoData | null>(null);

  /* share */
  const [isSharing, setIsSharing] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const [skyData, setSkyData] = useState<SkyData | null>(null);

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
      gsap.fromTo(
        "#wake-msg",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 }
      );
      gsap.to("#wake-msg", { opacity: 0, y: -30, duration: 1, delay: 2.5 });
      t = setTimeout(() => setWakePhase("sky"), 3000);
    }

    if (wakePhase === "sky") {
      gsap.fromTo(
        "#sky-msg",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 }
      );
      gsap.to("#sky-msg", { opacity: 0, y: -30, duration: 1, delay: 4 });
      t = setTimeout(() => setWakePhase("garden"), 3000);
    }

    if (wakePhase === "garden") {
      gsap.fromTo(
        "#garden-msg",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 }
      );
      t = setTimeout(() => setScene("flower"), 3000);
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

  const wakeBg = useMemo(
    () => (
      <VideoBackground
        key="wakeBg"
        videoSrc="/wake.mp4"
        audioSrc="/wake-sound.mp3"
        onVideoReady={() => {}}
      />
    ),
    []
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
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, "image/png")
      );
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
            {wakeBg}

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
                  แล้ววันนี้เป็นวันที่&nbsp;{userData?.name}&nbsp;ต้องการ…
                  <br />
                  ช่างแปลกแฮะ&nbsp;ท้องฟ้าดูไม่มืดครึ้มเลย
                </p>
              )}

              {wakePhase === "garden" && (
                <p
                  id="garden-msg"
                  style={{
                    fontSize: "clamp(1.4rem,4vw,2.4rem)",
                    color: "#E0F7FA",
                    textShadow: "2px 2px 6px #000",
                    textAlign: "center",
                    lineHeight: 1.5,
                    padding: "0 5vw",
                  }}
                >
                  คุณกําลังเดินไปที่สวนหลังบ้าน
                  <br />
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
                    การเริ่มต้นใหม่ในชีวิต<br/> ไม่ว่าจะร้ายหรือดีทุกอย่างเป็นบทเรียนเองนะ <br/> เเล้วพายุจะผ่านไป
                  </p>

                </div>
              </div>
            )}
          </>
        );
      case "flower":
        return (
          <FlowerScene
            userName={userData!.name}
            onComplete={(color, feeling) => {
              console.log("picked:", color, feeling);
              setScene("skyMessage");
            }}
          />
        );
      case "skyMessage":
        return (
          <SkyMessageScene
            videoSrc="/train.mp4"
            userName={userData!.name}
            onDone={(data) => {
              setSkyData(data); // ← เก็บค่ามาไว้
              setScene("Table"); // ไปฉากโต๊ะ
            }}
          />
        );
      case "Table":
        return (
          <MysteryTableScene
            tableImgSrc="/table/1.png"
            userName={userData!.name}
            happyThing={skyData!.happyThing} // ค่าที่ได้จาก SkyMessageScene
            onFinish={(ans) => {
              console.log(ans); // { howToday, dreamStatus, likeNow }
              setScene("Self");
            }}
          />
        );
      case "Self":
        return (
          <SelfComparisonScene
            userName={userData!.name}
            childImg="/child/1.png"
            onChoose={(ans) => {
              console.log(ans);
              setScene("ChildJourney");
            }}
          />
        );
      case "ChildJourney":
        return (
          <ChildJourneyScene
            onComplete={(data) => {
              console.log(data);
              setScene("NemoMessage");
            }}
          />
        );
        case "NemoMessage":
        return (
          <NemoMessageScene
            onComplete={(data) => {
              console.log("Nemo messages complete:", data);
              setNemoData(data); 
              setScene("result"); 
            }}
          />
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
