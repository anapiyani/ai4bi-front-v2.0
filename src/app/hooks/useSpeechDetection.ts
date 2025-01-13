"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
// For a local user for now
export function useSpeechDetection(isMicrophoneOn: boolean, setUserStream: (stream: MediaStream | null) => void) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const animationFrame = useRef<number | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const detectSound = useCallback(() => {
    if (!analyser.current || !dataArray.current) return;

    analyser.current.getByteFrequencyData(dataArray.current);
    const average = dataArray.current.reduce((a, b) => a + b) / dataArray.current.length;
    
    if (average > 30) {
      setIsSpeaking(true);
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }
      speakingTimeoutRef.current = setTimeout(() => setIsSpeaking(false), 500);
    }

    animationFrame.current = requestAnimationFrame(detectSound);
  }, []);

  const cleanupAudio = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }
    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
      speakingTimeoutRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setUserStream(null);
    setIsSpeaking(false);
  }, [setUserStream]);

  useEffect(() => {
    if (isMicrophoneOn) {
      const setupAudio = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;
          const context = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContext.current = context;
          const source = context.createMediaStreamSource(stream);
          const analyserNode = context.createAnalyser();
          analyser.current = analyserNode;
          source.connect(analyserNode);
          analyserNode.fftSize = 256;
          dataArray.current = new Uint8Array(analyserNode.frequencyBinCount);
          setUserStream(stream);
          detectSound();
        } catch (err) {
          console.error("Error accessing the microphone", err);
        }
      };

      setupAudio();
    } else {
      cleanupAudio();
    }

    return cleanupAudio;
  }, [isMicrophoneOn, detectSound, cleanupAudio, setUserStream]);

  return isSpeaking;
};


