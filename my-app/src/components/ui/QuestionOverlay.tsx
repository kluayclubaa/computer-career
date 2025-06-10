import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { questions as questionsData } from '../../data/questionsData';

// Definisikan tipe untuk opsi pertanyaan untuk keamanan tipe
type QuestionOption = {
  text: string;
  scores: { [key: string]: number };
};

type QuestionOverlayProps = {
  storyIntro: string | null;
  questions: typeof questionsData;
  onAnswer: (selectedOption: QuestionOption) => void;
  onOverlayComplete: (type: 'intro' | 'questions') => void;
};

const QuestionOverlay = ({ storyIntro, questions, onAnswer, onOverlayComplete }: QuestionOverlayProps) => {
  const storyIntroRef = useRef<HTMLParagraphElement>(null);
  // Mengganti ref dari container menjadi wrapper untuk elemen-elemen pertanyaan
  const questionWrapperRef = useRef<HTMLDivElement>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [showStoryIntro, setShowStoryIntro] = useState(!!storyIntro);

  // Efek untuk animasi intro cerita (tidak ada perubahan di sini)
  useEffect(() => {
    if (showStoryIntro && storyIntroRef.current && storyIntro) {
      gsap.fromTo(
        storyIntroRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 1 }
      );
      gsap.to(storyIntroRef.current, {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: 'power2.in',
        delay: 6, // Memberi waktu lebih lama untuk membaca
        onComplete: () => {
          setShowStoryIntro(false);
          onOverlayComplete('intro');
          setCurrentQuestionIndex(0);
        }
      });
    } else if (!storyIntro) {
      setShowStoryIntro(false);
      setCurrentQuestionIndex(0);
    }
  }, [storyIntro, onOverlayComplete]);

  // --- PERUBAHAN UTAMA: EFEK ANIMASI UNTUK PERTANYAAN & JAWABAN ---
  useEffect(() => {
    if (currentQuestionIndex !== -1 && questionWrapperRef.current) {
      // Ambil semua elemen yang akan dianimasikan
      const wrapper = questionWrapperRef.current;
      const storyText = wrapper.querySelector('.question-story');
      const questionText = wrapper.querySelector('.question-text');
      const optionButtons = wrapper.querySelectorAll('.option-button');

      // Gunakan timeline GSAP untuk mengontrol urutan animasi
      const tl = gsap.timeline();
      
      // Animasikan elemen-elemen agar "melayang" masuk
      tl.fromTo(wrapper, { opacity: 0 }, { opacity: 1, duration: 0.5 })
        .fromTo(storyText, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 
            '+=0.2' // Mulai 0.2 detik setelah wrapper muncul
        )
        .fromTo(questionText, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.5' // Mulai sedikit setelah cerita muncul
        )
        .fromTo(optionButtons, 
            { opacity: 0, y: 20 }, 
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.6, 
              ease: 'power3.out',
              // stagger membuat setiap tombol muncul satu per satu
              stagger: 0.15 
            },
            '-=0.4' // Mulai sedikit setelah pertanyaan muncul
        );
    }
  }, [currentQuestionIndex]);

  const handleAnswer = (option: QuestionOption) => {
    if (!questionWrapperRef.current) return;

    // Animasikan semua elemen pertanyaan agar menghilang bersamaan
    gsap.to(questionWrapperRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        onAnswer(option);
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prevIndex => {
            // Reset posisi Y sebelum pertanyaan berikutnya muncul
            gsap.set(questionWrapperRef.current, { y: 0 });
            return prevIndex + 1;
          });
        } else {
          onOverlayComplete('questions');
        }
      }
    });
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      padding: '20px', // Tambahkan padding agar tidak terlalu mepet ke tepi layar
      pointerEvents: showStoryIntro || currentQuestionIndex === -1 ? 'none' : 'auto',
      zIndex: 20
    }}>
      {showStoryIntro && storyIntro && (
        <p ref={storyIntroRef} style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          maxWidth: '80%',
          lineHeight: '1.5',
          opacity: 0,
          fontFamily: 'Georgia, serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)' // Bayangan teks lebih tebal
        }}>
          {storyIntro}
        </p>
      )}

      {/* --- PERUBAHAN UTAMA: MENGHILANGKAN BINGKAI DAN MENGGUNAKAN WRAPPER BARU --- */}
      {!showStoryIntro && currentQuestion && (
        <div 
          ref={questionWrapperRef} 
          style={{
            width: '90%',
            maxWidth: '800px', // Lebarkan sedikit agar teks lebih nyaman dibaca
            textAlign: 'center',
            opacity: 0, // Mulai dengan transparan untuk dianimasikan
          }}
        >
          {/* Tambahkan className agar bisa ditarget oleh GSAP */}
          <p className="question-story" style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontStyle: 'italic', textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
            {currentQuestion.story}
          </p>
          <h2 className="question-text" style={{ fontSize: '2.2rem', marginBottom: '3rem', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
            {currentQuestion.question}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                // Tambahkan className agar bisa ditarget oleh GSAP
                className="option-button" 
                onClick={() => handleAnswer(option)}
                style={{
                  padding: '15px 30px',
                  fontSize: '1.2rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)', // Sedikit lebih gelap agar kontras
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '50px', // Membuat tombol menjadi lebih bulat (pill shape)
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                  width: '100%',
                  maxWidth: '500px', // Batasi lebar tombol
                  opacity: 0, // Mulai dengan transparan
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionOverlay;