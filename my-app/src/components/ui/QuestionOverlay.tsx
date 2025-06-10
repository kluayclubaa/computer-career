import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { questions as questionsData } from '../../data/questionsData';

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
  const questionWrapperRef = useRef<HTMLDivElement>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [showStoryIntro, setShowStoryIntro] = useState(!!storyIntro);

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
        delay: 6,
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

  useEffect(() => {
    if (currentQuestionIndex !== -1 && questionWrapperRef.current) {
      const wrapper = questionWrapperRef.current;
      const storyText = wrapper.querySelector('.question-story');
      const questionText = wrapper.querySelector('.question-text');
      const optionButtons = wrapper.querySelectorAll('.option-button');

      const tl = gsap.timeline();
      tl.fromTo(wrapper, { opacity: 0 }, { opacity: 1, duration: 0.5 })
        .fromTo(storyText, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 
          '+=0.2'
        )
        .fromTo(questionText, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(optionButtons, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.15 },
          '-=0.4'
        );
    }
  }, [currentQuestionIndex]);

  const handleAnswer = (option: QuestionOption) => {
    if (!questionWrapperRef.current) return;

    gsap.to(questionWrapperRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        onAnswer(option);
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prevIndex => {
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
      padding: '20px',
      pointerEvents: showStoryIntro || currentQuestionIndex === -1 ? 'none' : 'auto',
      zIndex: 20,
      boxSizing: 'border-box'
    }}>
      {showStoryIntro && storyIntro && (
        <p ref={storyIntroRef} style={{
          fontSize: 'clamp(1.2rem, 4vw, 2.5rem)',
          textAlign: 'center',
          maxWidth: '90%',
          lineHeight: '1.6',
          opacity: 0,
          fontFamily: 'Georgia, serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
          padding: '0 1rem',
        }}>
          {storyIntro}
        </p>
      )}

      {!showStoryIntro && currentQuestion && (
        <div 
          ref={questionWrapperRef} 
          style={{
            width: '90%',
            maxWidth: '800px',
            textAlign: 'center',
            opacity: 0,
            boxSizing: 'border-box'
          }}
        >
          <p className="question-story" style={{
            fontSize: 'clamp(1rem, 3vw, 1.4rem)',
            marginBottom: '1.5rem',
            fontStyle: 'italic',
            textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
          }}>
            {currentQuestion.story}
          </p>
          <h2 className="question-text" style={{
            fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
            marginBottom: '2rem',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
          }}>
            {currentQuestion.question}
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            width: '100%',
          }}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className="option-button" 
                onClick={() => handleAnswer(option)}
                style={{
                  padding: '12px 20px',
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                  width: '100%',
                  maxWidth: '500px',
                  opacity: 0,
                  boxSizing: 'border-box'
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
