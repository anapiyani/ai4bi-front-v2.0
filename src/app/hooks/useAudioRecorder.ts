"use client";
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { useRef, useState } from "react"
import { UploadMediaResponse } from '../types/types'
import { useUploadMedia } from './useUploadMedia'


type OutputFormat = 'mp3' | 'wav';
interface UseAudioRecorderProps {
  handleTypingChat: (status: "typing" | "recording" | "stopped") => void;
  onSendAudio?: (id: string, type: "audio") => void;
  chatId: string;
  outputFormat?: OutputFormat;
}

export function useAudioRecorder({ handleTypingChat, onSendAudio, chatId, outputFormat = 'mp3' }: UseAudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const audioChunksRef = useRef<Blob[]>([]); 
  const startTimeRef = useRef<number | null>(null);
  const recordingTimeoutRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<number | null>(null);
  const ffmpegRef = useRef(new FFmpeg());

  const { mutate: uploadMedia } = useUploadMedia()

  const handleStartRecording = async () => {
    try {
      handleTypingChat("recording");
      
      audioChunksRef.current = []; 

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
      });

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data); 
        }
      });

      recorder.start();
      startTimeRef.current = Date.now();
      setRecordingDuration(0);

      recordingTimeoutRef.current = window.setTimeout(() => {
        handleStopAndSend();
      }, 240000);

      durationIntervalRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          setRecordingDuration(Date.now() - startTimeRef.current);
        }
      }, 1000);

      setMediaRecorder(recorder);
      setMediaStream(stream);
      setIsRecording(true);
      setIsPaused(false);
      setAudioBlob(null);
    } catch (error) {
      console.error("Error starting recording:", error);
      handleTypingChat("stopped");
      setIsRecording(false);
      setIsPaused(false);
      setMediaRecorder(null);
      setMediaStream(null);
      setAudioBlob(null);
    }
  };

  const convertAudio = async (webmBlob: Blob): Promise<Blob> => {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }

    // Write WebM file to FFmpeg's virtual file system
    await ffmpeg.writeFile('input.webm', await fetchFile(webmBlob));

    // Run conversion command based on output format
    const outputFile = `output.${outputFormat}`;
    await ffmpeg.exec([
      '-i', 'input.webm',
      '-vn',              // Disable video recording
      '-ar', '44100',     // Set audio sampling rate
      '-ac', '2',         // Set audio channels
      '-b:a', '192k',     // Set audio bitrate
      outputFile
    ]);


    const data = await ffmpeg.readFile(outputFile);
    return new Blob([data], { 
      type: outputFormat === 'mp3' ? 'audio/mpeg' : 'audio/wav' 
    });
  };

  const handleStopAndSend = () => {
    if (!mediaRecorder) return;

    mediaRecorder.addEventListener("stop", async () => {
      try {
        const webmBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        
        const convertedBlob = await convertAudio(webmBlob);
        
        const fileExtension = outputFormat === 'mp3' ? 'mp3' : 'wav';
        const audioFile = new File(
          [convertedBlob], 
          `audio.${fileExtension}`, 
          { type: convertedBlob.type }
        );

        uploadMedia({ chat_id: chatId, files: [audioFile] }, {
          onSuccess: (data: UploadMediaResponse | UploadMediaResponse[]) => {
            if (Array.isArray(data)) {
              data.forEach((item) => onSendAudio?.(item.uuid, "audio"));
            } else {
              onSendAudio?.(data.uuid, "audio");
            }
          },
        });

        mediaStream?.getTracks().forEach((track) => track.stop());
        setMediaRecorder(null);
        setMediaStream(null);
        setIsRecording(false);
        setAudioBlob(null);
        setIsPaused(false);
        setRecordingDuration(0);
        audioChunksRef.current = [];
        startTimeRef.current = null;
        handleTypingChat("stopped");
      } catch (error) {
        console.error('Error processing audio:', error);
      }
    }, { once: true });

    window.clearTimeout(recordingTimeoutRef.current!);
    window.clearInterval(durationIntervalRef.current!);
    mediaRecorder.stop();
  };


  const handleStopRecording = () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setMediaRecorder(null);
    setMediaStream(null);
    setIsRecording(false);
    setIsPaused(false);
    setAudioBlob(null);
    setRecordingDuration(0);
    audioChunksRef.current = [];
    startTimeRef.current = null;
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