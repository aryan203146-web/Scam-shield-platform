import { useCallback, useRef } from 'react';

export function useSpeech() {
  const synthRef = useRef(window.speechSynthesis);

  const speak = useCallback((text, enabled = true) => {
    if (!synthRef.current || !enabled) return;

    // Cancel any current speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a clear, standard english voice
    const voices = synthRef.current.getVoices();
    // Prefer Google US English or standard system voices
    const preferredVoice = voices.find(
      (v) => 
        v.name.includes('Google US English') || 
        v.name.includes('Samantha') || 
        v.name.includes('Daniel') ||
        v.lang === 'en-US' ||
        v.lang === 'en-GB'
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Set speaking rate slightly slower for better elderly comprehensibility
    utterance.rate = 0.85; 
    utterance.pitch = 1.0;

    synthRef.current.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, []);

  return { speak, stop };
}
