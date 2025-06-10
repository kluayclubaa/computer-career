// src/app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import VideoBackground from "../components/ui/VideoBackground";
import QuestionOverlay from "../components/ui/QuestionOverlay";
import HomePage from "../components/ui/Homepage";
import { questions, careerDescriptions } from "../data/questionsData";


const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" y1="2" x2="12" y2="15"></line>
  </svg>
);

export default function JourneyPage() {
  const [currentScene, setCurrentScene] = useState('home');
  const [totalScores, setTotalScores] = useState({
    developer: 0, dataScientist: 0, uxui: 0,
    devops: 0, cybersecurity: 0, productManager: 0,
  });
  const [recommendedCareer, setRecommendedCareer] = useState<{ name: string; description: string } | null>(null);
  // --- State สำหรับจัดการสถานะการคัดลอก ---
  const [isCopied, setIsCopied] = useState(false);

  const calculateResult = useCallback(() => {
    let maxScore = -1;
    let bestCareerKey: keyof typeof careerDescriptions | '' = '';
    for (const careerKey in totalScores) {
      if (Object.prototype.hasOwnProperty.call(totalScores, careerKey)) {
        const key = careerKey as keyof typeof totalScores;
        if (totalScores[key] > maxScore) {
          maxScore = totalScores[key];
          bestCareerKey = key;
        }
      }
    }
    if (bestCareerKey) {
      setRecommendedCareer(careerDescriptions[bestCareerKey]);
    }
    setCurrentScene('result');
  }, [totalScores]);

  useEffect(() => {
    if (currentScene === 'result' && !recommendedCareer) {
      calculateResult();
    }
  }, [currentScene, recommendedCareer, calculateResult]);

  const handleStartJourney = useCallback(() => {
    setCurrentScene('introVideo');
  }, []);

  const handleVideoReady = useCallback(() => {}, []);

  const handleAnswer = useCallback((selectedOption: { scores: { [key: string]: number } }) => {
    if (selectedOption?.scores) {
      setTotalScores(prevScores => {
        const newScores = { ...prevScores };
        for (const career in selectedOption.scores) {
          if (Object.prototype.hasOwnProperty.call(selectedOption.scores, career)) {
            newScores[career as keyof typeof newScores] += selectedOption.scores[career];
          }
        }
        return newScores;
      });
    }
  }, []);

  const handleOverlayComplete = useCallback((type: 'intro' | 'questions') => {
    if (type === 'intro') setCurrentScene('questions');
    else if (type === 'questions') setCurrentScene('result');
  }, []);

  // --- ฟังก์ชันสำหรับแชร์หรือคัดลอก ---
  const handleShare = async () => {
    if (!recommendedCareer) return;

    const shareText = `ฉันค้นพบเส้นทางอาชีพสายเทคแล้ว! ผลลัพธ์ของฉันคือ "${recommendedCareer.name}" มาค้นหาเส้นทางของคุณได้เลยที่: [ใส่ URL ของเว็บคุณที่นี่]`;
    
    const shareData = {
      title: 'เส้นทางอาชีพสายเทคของฉัน',
      text: shareText,
      url: window.location.href, // หรือ URL ของเว็บคุณ
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback for desktop: copy to clipboard
      navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset afrer 2 seconds
    }
  };

  return (
    <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
      {currentScene === 'home' && <HomePage onStart={handleStartJourney} />}

      {(currentScene === 'introVideo' || currentScene === 'questions' || currentScene === 'result') && (
        <>
          <VideoBackground videoSrc="/train.mp4" audioSrc="/audio/wind_sound.mp3" onVideoReady={handleVideoReady} />

          {(currentScene === 'introVideo' || currentScene === 'questions') && (
            <QuestionOverlay
              storyIntro={currentScene === 'introVideo' ? "เสียงหวูดรถไฟดังขึ้น... สัญญาณของการเดินทางเพื่อค้นหาเส้นทางสายอาชีพของคุณกำลังจะเริ่มต้นขึ้นแล้ว..." : null}
              questions={questions}
              onAnswer={handleAnswer}
              onOverlayComplete={handleOverlayComplete}
            />
          )}

          {/* --- หน้าผลลัพธ์ที่ปรับปรุงใหม่ --- */}
          {currentScene === 'result' && recommendedCareer && (
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              color: 'white', padding: '20px', textAlign: 'center', zIndex: 50,
            }}>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                padding: 'clamp(20px, 5vw, 40px)', // Responsive padding
                borderRadius: '20px',
                maxWidth: '800px', width: '95%',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex', flexDirection: 'column', gap: '1rem',
              }}>
                <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: '#B2EBF2', textShadow: '2px 2px 4px #000' }}>
                  สถานีปลายทางของคุณคือ...
                </h2>
                <h1 style={{ fontSize: 'clamp(2rem, 7vw, 4rem)', color: '#80DEEA', textShadow: '2px 2px 6px #000', margin: '0.5rem 0' }}>
                  {recommendedCareer.name}
                </h1>
                <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', lineHeight: 1.7, color: '#E0E0E0' }}>
                  {recommendedCareer.description}
                </p>
                
                {/* --- ปุ่มแชร์ --- */}
                <button
                  onClick={handleShare}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '12px 24px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#fff',
                    backgroundColor: isCopied ? '#28a745' : 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: '2rem',
                    alignSelf: 'center',
                    minWidth: '180px'
                  }}
                  onMouseOver={(e) => { if (!isCopied) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'; }}
                  onMouseOut={(e) => { if (!isCopied) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; }}
                >
                  <ShareIcon />
                  {isCopied ? 'คัดลอกแล้ว!' : 'แชร์ผลลัพธ์'}
                </button>

                <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', fontStyle: 'italic', color: '#CFD8DC', marginTop: '1rem' }}>
                  ขอให้สนุกกับการเดินทางบนเส้นทางสายเทคของคุณ!
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}