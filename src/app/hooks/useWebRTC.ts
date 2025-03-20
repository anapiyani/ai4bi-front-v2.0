"use client"
import { useEffect, useRef, useState } from 'react'
import { getCookie } from '../api/service/cookie'

interface UseWebRTCProps {
  room: string
  isMicrophoneOn: boolean
}

export const useWebRTC = ({ room, isMicrophoneOn }: UseWebRTCProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteAudios, setRemoteAudios] = useState<HTMLAudioElement[]>([])
  const [transcription, setTranscription] = useState<{
    time: string
    text: string
    user_id: string
    name: string
    mic_on: boolean
    username: string
  }[]>([])

  const speakingUsers = useRef<Map<string, boolean>>(new Map())
  const connectedUsers = useRef<Map<string, any>>(new Map())
  const [isRTCNotConnected, setIsRTCNotConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const peerRef = useRef<RTCPeerConnection | null>(null)

  useEffect(() => {
    if (!localStream) return

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = isMicrophoneOn
    })
  }, [isMicrophoneOn, localStream])

  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          event: 'mic_status',
          data: JSON.stringify({ mic_on: isMicrophoneOn })
        })
      )
    }
  }, [isMicrophoneOn])

  const updateAudioElements = () => {
    connectedUsers.current.forEach((user) => {
      const audio = document.createElement('audio')
      audio.srcObject = user.stream
      audio.autoplay = true
      audio.controls = true
      setRemoteAudios((prev) => [...prev, audio])
    })
  }

  const closeRTCConnection = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }

  useEffect(() => {
    let isUnmounting = false

    const start = async () => {
      try {
        let stream;
        try {
          stream = await navigator.mediaDevices?.getUserMedia({
            audio: true,
            video: false
          });
        } catch (err) {
          stream = new MediaStream();
        }

        if (isUnmounting) return
        setLocalStream(stream)

        const ws = new WebSocket(
          `wss://rtc.ai4bi.kz/websocket?room=${encodeURIComponent(room || 'default')}`
        )
        wsRef.current = ws

        ws.onopen = () => {
          console.log('WebSocket for RTC connection established')
          ws.send(
            JSON.stringify({
              event: 'auth',
              data: `Bearer ${getCookie('access_token')}`
            })
          )
        }

        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: 'ping' }))
          }
        }, 30000)

        const peerConnection = new RTCPeerConnection({
          iceTransportPolicy: 'relay',
          iceServers: [
            { urls: 'stun:rtc.ai4bi.kz:3478' },
            {
              urls: 'turn:rtc.ai4bi.kz:5349?transport=udp',
              username: 'test',
              credential: 'test123'
            },
            {
              urls: 'turn:rtc.ai4bi.kz:5349?transport=tcp',
              username: 'test',
              credential: 'test123'
            }
          ]
        })
        peerRef.current = peerConnection

        stream
          ?.getAudioTracks()
          .forEach((track) => peerConnection.addTrack(track, stream))

        isMicrophoneOn
          ? localStream?.getAudioTracks().forEach((track) => (track.enabled = true))
          : localStream?.getAudioTracks().forEach((track) => (track.enabled = false))

        peerConnection.ontrack = (event) => {
          if (event.track.kind !== 'audio') return

          const audio = document.createElement('audio')
          audio.srcObject = event.streams[0]
          audio.autoplay = true
          audio.controls = true

          setRemoteAudios((prev) => [...prev, audio])

          event.streams[0].onremovetrack = () => {
            setRemoteAudios((prev) => prev.filter((a) => a !== audio))
          }
        }

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            ws.send(
              JSON.stringify({
                event: 'candidate',
                data: JSON.stringify(event.candidate)
              })
            )
          }
        }

        ws.onmessage = async (message) => {
          const msg = JSON.parse(message.data)
          if (!msg) return

          switch (msg.event) {
            case 'user_connected':
              console.log('User connected', msg.user.user_id)
              break

            case 'users_updated':
              console.log('Users updated', msg)
              connectedUsers.current.clear()
              msg.users.forEach((user: any) => {
                connectedUsers.current.set(user.user_id, {
                  ...user,
                  mic_on: user.mic_on
                })
              })
              updateAudioElements()
              break

            case 'offer':
              console.log('Offer received', msg)
              await peerConnection.setRemoteDescription(JSON.parse(msg.data))
              const answer = await peerConnection.createAnswer()
              await peerConnection.setLocalDescription(answer)
              ws.send(
                JSON.stringify({
                  event: 'answer',
                  data: JSON.stringify(answer)
                })
              )
              break

            case 'candidate':
              await peerConnection.addIceCandidate(JSON.parse(msg.data))
              console.log('Candidate added', msg)
              break

            case 'python_response':
              Array.from(connectedUsers.current.values()).forEach((user) => {
                if (user.user_id === msg.user_id) {
                  let parsedData = null
                  try {
                    parsedData = JSON.parse(msg.text)
                  } catch (err) {
                    /* Not JSON or parsing failed */
                  }

                  if (parsedData && typeof parsedData === 'object') {
                    const { speaking } = parsedData
                    speakingUsers.current.set(user.user_id, speaking === true)
                  } else {
                    setTranscription((prev) => [
                      ...prev,
                      {
                        text: msg.text,
                        user_id: user.user_id,
                        name: user.name,
                        mic_on: user.mic_on,
                        username: user.username,
                        time: new Date().toLocaleTimeString()
                      }
                    ])
                  }
                }
              })
              break

            case 'python_binary_response':
              console.log('Audio Server binary response from user', msg)
              break
          }
        }

        ws.onclose = () => {
          console.log('WebSocket closed')
          clearInterval(pingInterval)
          setIsRTCNotConnected(true)
        }

        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          setIsRTCNotConnected(true)
        }
      } catch (err) {
        console.log('Error starting RTC connection', err)
        setIsRTCNotConnected(true)
      }
    }

    start()

    return () => {
      isUnmounting = true
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      if (peerRef.current) {
        peerRef.current.close()
        peerRef.current = null
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [room])

  /**
   * Returns:
   * - localStream: The user's own audio stream.
   * - remoteAudios: An array of <audio> elements attached to remote streams.
   * - transcription: Array of transcribed text segments from all connected users.
   * - speakingUsers: ref that keeps track of which users are currently speaking (boolean).
   * - connectedUsers: ref that keeps track of connected users in the meeting.
   */
  return {
    localStream,
    remoteAudios,
    transcription,
    speakingUsers,
    connectedUsers,
    isRTCNotConnected,
    closeRTCConnection
  }
}
