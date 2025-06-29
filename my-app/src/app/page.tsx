// app/JourneyPage.tsx
"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import html2canvas from "html2canvas";
import gsap from "gsap";

// Import components
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

// ★ Import a function for saving data to Firebase
import { saveDataToFirebase } from "@/lib/firebase";

/* ---------- types ---------- */
// Data types from each component
type UserData = { name: string; age: string };
type ContactData = { helpNeeded: "yes" | "no"; lineId: string; phone: string };
type QuestionOverlayData = { userStory: string; tired: number, dayChoice: DayChoice };
type FlowerData = { color: string; feeling: string };
type SkyData = { msgToPast: string; foodRemember: "yes" | "no"; happyThing: string };
type TableData = { howToday: string; dreamStatus: any; likeNow: any; likeSelf: any; };
type SelfChoice = { selfChoice: "past" | "now" };
type ChildJourneyData = { ageGuess: string; difficult: string; reflectMsg: string; gratitudeMsg: string; apologyMsg: string; };
type NemoData = { tiredChoice: string; ventMsg: string; lessonMsg: string; };


// ★ Create a type that combines all the data.
export type AllUserData = {
  user?: UserData;
  contact?: ContactData;
  questionOverlay?: QuestionOverlayData;
  flower?: FlowerData;
  sky?: SkyData;
  table?: TableData;
  self?: SelfChoice;
  childJourney?: ChildJourneyData;
  nemo?: NemoData;
};


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
  // ★ Use a single state to collect all data.
  const [allUserData, setAllUserData] = useState<AllUserData>({});

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
    const userData = { name, age };
    setAllUserData(prev => ({ ...prev, user: userData }));
    setScene("contact");
  }, []);

  const handleContactComplete = useCallback((data: ContactData) => {
    setAllUserData(prev => ({ ...prev, contact: data }));
    setScene("introVideo");
  }, []);

  const handleQuestionOverlayComplete = useCallback((data: QuestionOverlayData) => {
    setAllUserData(prev => ({ ...prev, questionOverlay: data }));
    setWakePhase("awake");
    setScene("wake");
  }, []);

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
            {allUserData.user && (
              <QuestionOverlay
                userName={allUserData.user.name}
                onOverlayComplete={(dayChoice, userStory, tired) => {
                  // ★ Collect data from QuestionOverlay
                  const questionData = { dayChoice, userStory, tired };
                  setAllUserData(prev => ({...prev, questionOverlay: questionData}));
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
                  ตอนนี้&nbsp;{allUserData.user?.name}&nbsp;กำลังตื่นจากที่นอน
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
                  แล้ววันนี้เป็นวันที่&nbsp;{allUserData.user?.name}&nbsp;ต้องการ…
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
            {allUserData.user && (
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
                    นีโม่ขอฮีลให้&nbsp;{allUserData.user.name}
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
            userName={allUserData.user!.name}
            onComplete={(color, feeling) => {
              // ★ Collect data from FlowerScene
              setAllUserData(prev => ({ ...prev, flower: { color, feeling } }));
              setScene("skyMessage");
            }}
          />
        );
      case "skyMessage":
        return (
          <SkyMessageScene
            videoSrc="/train.mp4"
            userName={allUserData.user!.name}
            onDone={(data) => {
              // ★ Collect data from SkyMessageScene
              setAllUserData(prev => ({ ...prev, sky: data }));
              setScene("Table");
            }}
          />
        );
      case "Table":
        return (
          <MysteryTableScene
            tableImgSrc="/table/1.png"
            userName={allUserData.user!.name}
            happyThing={allUserData.sky!.happyThing}
            onFinish={(ans) => {
              // ★ Collect data from MysteryTableScene
              setAllUserData(prev => ({ ...prev, table: ans }));
              setScene("Self");
            }}
          />
        );
      case "Self":
        return (
          <SelfComparisonScene
            userName={allUserData.user!.name}
            childImg="/child/1.png"
            onChoose={(ans) => {
              // ★ Collect data from SelfComparisonScene
              setAllUserData(prev => ({ ...prev, self: { selfChoice: ans } }));
              setScene("ChildJourney");
            }}
          />
        );
      case "ChildJourney":
        return (
          <ChildJourneyScene
            onComplete={(data) => {
              // ★ Collect data from ChildJourneyScene
              setAllUserData(prev => ({ ...prev, childJourney: data }));
              setScene("NemoMessage");
            }}
          />
        );
      case "NemoMessage":
        return (
          <NemoMessageScene
            onComplete={(data) => {
              // ★ Collect data from NemoMessageScene and trigger saving
              const finalData = { ...allUserData, nemo: data };
              setAllUserData(finalData);

              // ★★★ Save all collected data to Firebase ★★★
              console.log("Saving all data to Firebase:", finalData);
              saveDataToFirebase(finalData).then(result => {
                if(result.success) {
                  console.log("Successfully saved data with ID:", result.id)
                } else {
                  console.error("Failed to save data:", result.error);
                }
              });

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