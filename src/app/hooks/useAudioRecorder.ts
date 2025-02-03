"use client";
import { useRef, useState } from "react"
import { UploadMediaResponse } from '../types/types'
import { useUploadMedia } from './useUploadMedia'

interface UseAudioRecorderProps {
  handleTypingChat: (status: "typing" | "recording" | "stopped") => void;
  // Add this callback:
  onSendAudio?: (id: string) => void;
  chatId: string;
}

export function useAudioRecorder({ handleTypingChat, onSendAudio, chatId }: UseAudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const recordingTimeoutRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<number | null>(null);

  const {
    mutate: uploadMedia,
  } = useUploadMedia()

  const handleStartRecording = async () => {
    try {
      handleTypingChat("recording");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
      });

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
      });

      recorder.start();
      startTimeRef.current = Date.now();
      setRecordingDuration(0);

      if (recordingTimeoutRef.current) {
        window.clearTimeout(recordingTimeoutRef.current);
      }
      recordingTimeoutRef.current = window.setTimeout(() => {
        console.warn("Stopped automatically after 4 minutes.");
        handleStopAndSend();
      }, 240000);

      durationIntervalRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          const now = Date.now();
          const elapsed = now - startTimeRef.current;
          setRecordingDuration(elapsed);
        }
      }, 1000);

      setMediaRecorder(recorder);
      setMediaStream(stream);
      setAudioChunks([]);
      setIsRecording(true);
      setIsPaused(false);
      setAudioBlob(null);
    } catch (error) {
      console.error("Error starting recording:", error);
      handleTypingChat("stopped");
    }
  };

  const handleStopAndSend = () => {
    if (!mediaRecorder) return;

    if (recordingTimeoutRef.current) {
      window.clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    if (durationIntervalRef.current) {
      window.clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    mediaRecorder.addEventListener("stop", () => {
      const endTime = Date.now();
      const totalTime = startTimeRef.current ? endTime - startTimeRef.current : 0;
      setRecordingDuration(totalTime);

      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      setAudioBlob(audioBlob);
      const audioFile = new File([audioBlob], "audio.wav", { type: "audio/wav" });

      uploadMedia({ chat_id: chatId, files: [audioFile] }, {
        onSuccess: (data: UploadMediaResponse | UploadMediaResponse[]) => {
          if (Array.isArray(data)) {
            data.forEach((item) => {
              onSendAudio?.(item.uuid);
            });
          } else {
            onSendAudio?.(data.uuid);
          }
        },
      });

      mediaStream?.getTracks().forEach((track) => track.stop());
      setMediaRecorder(null);
      setMediaStream(null);
      setAudioChunks([]);
      setIsRecording(false);
      setIsPaused(false);
      startTimeRef.current = null;
      handleTypingChat("stopped");
    });

    mediaRecorder.stop();
  };

  const handleStopRecording = () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setMediaRecorder(null);
    setMediaStream(null);
    setAudioChunks([]);
    setIsRecording(false);
    setIsPaused(false);
    setAudioBlob(null);
    handleTypingChat("stopped");
  };

  const handlePauseResume = () => {
    if (!mediaRecorder) return;
    if (isPaused) {
      mediaRecorder.resume();
      setIsPaused(false);
      durationIntervalRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          const now = Date.now();
          const elapsed = now - startTimeRef.current;
          setRecordingDuration(elapsed);
        }
      }, 1000);
    } else {
      mediaRecorder.pause();
      setIsPaused(true);
      if (durationIntervalRef.current) {
        window.clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    }
  };

  return {
    isRecording,
    isPaused,
    recordingDuration,
    handleStartRecording,
    handleStopAndSend,
    handleStopRecording,
    handlePauseResume,
    mediaStream,
    audioBlob,
  };
}

export default useAudioRecorder;