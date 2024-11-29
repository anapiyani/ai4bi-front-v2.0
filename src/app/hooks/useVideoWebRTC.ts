import { useCallback, useEffect, useRef, useState } from 'react'
import socket from '../socket'
import ACTIONS from '../socket/actions'

export const LOCAL_VIDEO = 'LOCAL_VIDEO';

const useVideoWebRTC = (roomId: string) => {
	const [clients, setClients] = useState<string[]>([]);
	const addNewClient = useCallback((newClient: string, cb: () => void) => {
		setClients(list => {
			if (list.includes(newClient)) return list;
			return [...list, newClient];
		});
		cb();
	}, [clients, setClients]);

	const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
	const localStream = useRef<MediaStream | null>(null);
	const peerMediaElements = useRef<Record<string, HTMLVideoElement | null>>(
		{
			[LOCAL_VIDEO]: null,
		}
	);

	// it is used to handle the peer connections and the media streams
	useEffect(() => {
		// it is used to handle the new peer connections
		const handleNewPeer = async ({ peerId, createOffer }: { peerId: string, createOffer: boolean }) => {
			// if the peer is already connected, return a warning
			if (peerId in peerConnections.current) {
				return console.warn('Peer already connected');
			}
			// create a new peer connection
			peerConnections.current[peerId] = new RTCPeerConnection({
				iceServers: [
					{
						urls: 'stun:stun.l.google.com:19302', // Google STUN server for testing
					},
				],
			});
			// handle the ice candidates
			peerConnections.current[peerId].onicecandidate = (event) => {
				if (event.candidate) {
					socket.emit(ACTIONS.RELAY_ICE, { // send the ice candidate to the server
						peerId, 
						candidate: event.candidate,
					});
				}
			}

			// handle the remote stream
			let tracksNumber = 0;
			peerConnections.current[peerId].ontrack = ({streams: [remoteStream]}) => {
				tracksNumber++;
				if (tracksNumber === 2) {
					addNewClient(peerId, () => {
						// set the remote stream to the peer media element
						if (peerMediaElements.current[peerId]) {
							peerMediaElements.current[peerId]!.srcObject = remoteStream;
						} else {
							// fix long in case if too many clients
							let settled = false;
							const interval = setInterval(() => {
								if (peerMediaElements.current[peerId]) {
									peerMediaElements.current[peerId]!.srcObject = remoteStream;
									clearInterval(interval);
									settled = true;
								}
								// if the peer media element is settled, clear the interval
								if (settled) {
									clearInterval(interval);
								}
							}, 1000);
						}
					});
				}
			}

			// add the local stream to the peer connection
			localStream.current?.getTracks().forEach(track => {
				peerConnections.current[peerId].addTrack(track, localStream.current!); 
			});	

			// create an offer if the peer is the creator of the room	
			if (createOffer) {
				const offer = await peerConnections.current[peerId].createOffer();
				await peerConnections.current[peerId].setLocalDescription(offer);
				socket.emit(ACTIONS.RELAY_SDP, {
					peerId,
					sessionDescription: offer,
				});
			}
		}

		// listen to the new peer connections
		socket.on(ACTIONS.ADD_PEER, handleNewPeer);

		// clean up the socket listeners
		return () => {
			socket.off(ACTIONS.ADD_PEER);
		}

	}, []);

	// it is used to handle the session descriptions
	useEffect(() => {
		// set the remote media
		const setRemoteMedia = async ({peerId, sessionDescription}: {peerId: string, sessionDescription: RTCSessionDescription}) => {
			// set the remote description
			await peerConnections.current[peerId].setRemoteDescription(sessionDescription);
			// if the session description is an offer, create an answer
			if (sessionDescription.type === 'offer') {
				const answer = await peerConnections.current[peerId].createAnswer();
				await peerConnections.current[peerId].setLocalDescription(answer);
				socket.emit(ACTIONS.RELAY_SDP, {
					peerId,
					sessionDescription: answer,
				});
			}
		}
		// listen to the session descriptions
		socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);	

		return () => {
			socket.off(ACTIONS.SESSION_DESCRIPTION);
		}
	}, []);

	useEffect(() => {
		socket.on(ACTIONS.ICE_CANDIDATE, ({peerId, candidate}: {peerId: string, candidate: RTCIceCandidate}) => {
			peerConnections.current[peerId].addIceCandidate(
				new RTCIceCandidate(candidate)
			);
		});

		return () => {
			socket.off(ACTIONS.ICE_CANDIDATE);
		}
	}, []);

	useEffect(() => {
		const handleRemovePeer = ({peerId}: {peerId: string}) => {
			if (peerId in peerConnections.current) {
				peerConnections.current[peerId].close();
				delete peerConnections.current[peerId];

				setClients(list => list.filter(id => id !== peerId));
			}
		}

		socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

		return () => {
			socket.off(ACTIONS.REMOVE_PEER);
		}
	}, []);

	useEffect(() => {
		const startCapture = async () => {
			localStream.current = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});

			addNewClient(LOCAL_VIDEO, () => {	
				const localVideoElement = peerMediaElements.current[LOCAL_VIDEO];

				if (localVideoElement) {
					localVideoElement.srcObject = localStream.current;
					localVideoElement.volume = 0;
					localVideoElement.play();
				}
			});
		}

		startCapture().then(() => {
			socket.emit(ACTIONS.JOIN, { room: roomId });
		})
		.catch(console.error);

		return () => {
			localStream.current?.getTracks().forEach((track: MediaStreamTrack) => track.stop());

			socket.emit(ACTIONS.LEAVE);
		}
	}, [roomId]);

	const provideMediaRef = useCallback((peerId: string, node: HTMLVideoElement | null) => {
		peerMediaElements.current[peerId] = node;
	}, []);

	return { clients, provideMediaRef };
}

export default useVideoWebRTC;