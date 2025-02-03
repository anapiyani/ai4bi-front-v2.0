import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const Icons = {
	Radio: () => {
		return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M15.2402 8.29492C15.732 8.78127 16.1221 9.35883 16.3883 9.99456C16.6545 10.6303 16.7915 11.3117 16.7915 11.9999C16.7915 12.6881 16.6545 13.3696 16.3883 14.0053C16.1221 14.641 15.732 15.2186 15.2402 15.7049" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M8.55123 15.7049C8.05946 15.2186 7.66934 14.641 7.40317 14.0053C7.137 13.3696 7 12.6881 7 11.9999C7 11.3117 7.137 10.6303 7.40317 9.99456C7.66934 9.35883 8.05946 8.78127 8.55123 8.29492" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M18.0703 5.5C19.8111 7.22409 20.789 9.56214 20.789 12C20.789 14.4379 19.8111 16.7759 18.0703 18.5" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M5.5117 18.5C3.7709 16.7759 2.79297 14.4379 2.79297 12C2.79297 9.56214 3.7709 7.22409 5.5117 5.5" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
		</svg>
	},
	Info: () => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 16V11H11.5M11.5 16H12.5" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M12 8.5V8" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<circle cx="12" cy="12" r="9" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	MicrophoneOn: () => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M8 21H16" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M12 18V21" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M16 6.42857C16 4.53502 14.2091 3 12 3C9.79086 3 8 4.53502 8 6.42857V11.5714C8 13.465 9.79086 15 12 15C14.2091 15 16 13.465 16 11.5714V6.42857Z" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M5 11C5 14.866 8.134 18 12 18C15.866 18 19 14.866 19 11" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	MicrophoneOff: () => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.6">
			<path d="M8 21H16" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M12 18V21" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M16 6.42857C16 4.53502 14.2091 3 12 3C9.79086 3 8 4.53502 8 6.42857V11.5714C8 13.465 9.79086 15 12 15C14.2091 15 16 13.465 16 11.5714V6.42857Z" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M5 11C5 14.866 8.134 18 12 18C15.866 18 19 14.866 19 11" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			<line x1="5" y1="5" x2="19" y2="19" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
		</svg>
		)
	},
	SmallMicrophoneOn: () => {
		return (
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M5.33203 14H10.6654" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
							<path d="M8 12V14" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
							<path d="M10.6654 4.28571C10.6654 3.02335 9.47146 2 7.9987 2C6.52594 2 5.33203 3.02335 5.33203 4.28571V7.71429C5.33203 8.97665 6.52594 10 7.9987 10C9.47146 10 10.6654 8.97665 10.6654 7.71429V4.28571Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
							<path d="M3.33203 7.33325C3.33203 9.91059 5.42136 11.9999 7.9987 11.9999C10.576 11.9999 12.6654 9.91059 12.6654 7.33325" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
		)
	},
	smallMicrophoneOff: () => {
		return (
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M5.33203 14H10.6654" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								<path d="M8 12V14" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								<path d="M5.33333 7.71429V4.28571C5.33333 3.02335 6.52724 2 8 2C8.87238 2 9.64692 2.35907 10.1334 2.91418M3.33333 7.33333C3.33333 8.03086 3.48637 8.69264 3.76069 9.28693M12.6667 7.33333C12.6667 9.91067 10.5773 12 8 12C6.88112 12 5.8542 11.6062 5.05028 10.9497M2 14L5.05028 10.9497M14 2L10.6667 5.33333M10.6667 5.33333V7.71429C10.6667 8.97665 9.47276 10 8 10C7.41524 10 6.87445 9.83867 6.43489 9.56511M10.6667 5.33333L6.43489 9.56511M6.43489 9.56511L5.05028 10.9497" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	HeaderClose: () => {
		return (
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M11 1.00004L1 11M0.999958 1L10.9999 11" stroke="#F8FAFC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Close: () => {
		return (
			<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M13.5 4.50004L4.5 13.5M4.49996 4.5L13.4999 13.5" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Data: () => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M6 16.5H8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M3 14.7C3 14.0373 3.44772 13.5 4 13.5H20C20.5523 13.5 21 14.0373 21 14.7V18.3C21 18.9627 20.5523 19.5 20 19.5H4C3.44772 19.5 3 18.9627 3 18.3V14.7Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M3 5.7C3 5.03726 3.44772 4.5 4 4.5H20C20.5523 4.5 21 5.03726 21 5.7V9.3C21 9.96274 20.5523 10.5 20 10.5H4C3.44772 10.5 3 9.96274 3 9.3V5.7Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M6 7.5H8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Results: () => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M15 9.42857V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V13.2857M15 9.42857V21M15 9.42857H19C20.1046 9.42857 21 10.324 21 11.4286V19C21 20.1046 20.1046 21 19 21H15M15 21H9M9 21V13.2857M9 21H5C3.89543 21 3 20.1046 3 19V15.2857C3 14.1811 3.89543 13.2857 5 13.2857H9" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Exit: () => {
		return (
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M13.333 12.9168L16.2497 10.0002L13.333 7.0835" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M11.2465 17.5H5.41667C4.49619 17.5 3.75 16.5406 3.75 15.3571V4.64286C3.75 3.45939 4.49619 2.5 5.41667 2.5H11.25" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M7.91699 9.99658H16.2503" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	SearchInput: () => {
		return (
			<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12.6704 12.6899L14.9805 15M14.3138 8.68583C14.3138 11.826 11.7767 14.3717 8.64714 14.3717C5.51752 14.3717 2.98047 11.826 2.98047 8.68583C2.98047 5.54563 5.51752 3 8.64714 3C11.7767 3 14.3138 5.54563 14.3138 8.68583Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Menu: () => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M4.5 17.5H19.5" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M4.5 12H19.5" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M4.5 6.5H19.5" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Dots: ({ fill, className }: { fill?: string, className?: string }) => {
		return (
			<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
				<path d="M16 12.25V11.75" stroke={fill || "#64748B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M12 12.25V11.75" stroke={fill || "#64748B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M8 12.25V11.75" stroke={fill || "#64748B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Pin: ({ className, fill }: { className?: string, fill?: string }) => {
		return (
			<svg className={className} width="16" height="16" viewBox="0 0 16 16" fill={fill} xmlns="http://www.w3.org/2000/svg">
				<path fillRule="evenodd" clipRule="evenodd" d="M9.71398 1.87542C9.97433 1.61507 10.3964 1.61507 10.6568 1.87542L14.8529 6.07156C15.1133 6.33191 15.1133 6.75402 14.8529 7.01437C14.5926 7.27471 14.1705 7.27471 13.9101 7.01437L13.8098 6.91405L9.75753 11.4579L10.2115 11.9119C10.4718 12.1722 10.4718 12.5944 10.2115 12.8547C9.95114 13.1151 9.52903 13.1151 9.26868 12.8547L7.03863 10.6247L3.80077 13.8087C3.53824 14.0668 3.11615 14.0633 2.85799 13.8007C2.59983 13.5382 2.60338 13.1161 2.8659 12.858L6.09579 9.68181L3.87364 7.45967C3.61329 7.19932 3.61329 6.77721 3.87364 6.51686C4.13399 6.25651 4.5561 6.25651 4.81645 6.51686L5.27041 6.97082L9.8143 2.91854L9.71398 2.81823C9.45363 2.55788 9.45363 2.13577 9.71398 1.87542ZM10.7586 3.86289L6.21476 7.91517L8.81318 10.5136L12.8655 5.9697L10.7586 3.86289Z" fill={fill}/>
			</svg>
		)
	},
	Edit: () => {
		return (
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M5.86725 13.466C5.52548 13.8079 5.06186 14 4.57843 14H2V11.4376C2 10.9547 2.19169 10.4915 2.53296 10.1498M5.86725 13.466L2.53296 10.1498M5.86725 13.466L12.5161 6.81416M2.53296 10.1498L9.1884 3.48642M9.1884 3.48642L10.1392 2.5345C10.8508 1.82202 12.0054 1.82181 12.7173 2.53401L13.4682 3.28521C14.1794 3.99678 14.1794 5.15014 13.4682 5.86172L12.5161 6.81416M9.1884 3.48642L12.5161 6.81416" stroke="#020617" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Reply: () => {
		return (
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fillRule="evenodd" clipRule="evenodd" d="M6.64503 3.52764C6.38417 3.26781 5.96206 3.26864 5.70223 3.52951L2.86165 6.38136C2.60254 6.6415 2.60254 7.06217 2.86165 7.3223L5.70223 10.1742C5.96206 10.435 6.38417 10.4359 6.64503 10.176C6.9059 9.91619 6.90673 9.49408 6.6469 9.23321L4.93896 7.5185H8.20355C10.2981 7.5185 12.0007 9.22396 12.0007 11.3333C12.0007 11.7015 12.2991 12 12.6673 12C13.0355 12 13.334 11.7015 13.334 11.3333C13.334 8.49256 11.0395 6.18516 8.20355 6.18516H4.93896L6.6469 4.47045C6.90673 4.20959 6.9059 3.78748 6.64503 3.52764Z" fill="#020617"/>
			</svg>
		)
	},
	Forward: ({ fill }: { fill?: string }) => {
		return (
			<svg width="16" height="16" viewBox="0 0 16 16" fill={fill} xmlns="http://www.w3.org/2000/svg">
				<path fillRule="evenodd" clipRule="evenodd" d="M7.5286 4.19526C7.78894 3.93491 8.21105 3.93491 8.4714 4.19526L10.8047 6.5286C11.0651 6.78894 11.0651 7.21105 10.8047 7.4714L8.4714 9.80474C8.21105 10.0651 7.78894 10.0651 7.5286 9.80474C7.26825 9.54439 7.26825 9.12228 7.5286 8.86193L8.72386 7.66667H6.33333C4.67648 7.66667 3.33333 9.00981 3.33333 10.6667C3.33333 11.0349 3.03486 11.3333 2.66667 11.3333C2.29848 11.3333 2 11.0349 2 10.6667C2 8.27343 3.9401 6.33333 6.33333 6.33333H8.72386L7.5286 5.13807C7.26825 4.87772 7.26825 4.45561 7.5286 4.19526ZM10.8619 4.19526C11.1223 3.93491 11.5444 3.93491 11.8047 4.19526L14.1381 6.5286C14.3984 6.78894 14.3984 7.21105 14.1381 7.4714L11.8047 9.80474C11.5444 10.0651 11.1223 10.0651 10.8619 9.80474C10.6016 9.54439 10.6016 9.12228 10.8619 8.86193L12.7239 7L10.8619 5.13807C10.6016 4.87772 10.6016 4.45561 10.8619 4.19526Z" fill={fill ? fill : "#020617"}/>
			</svg>
		)
	},
	Delete: () => {
		return (
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M4.19141 5.71429L4.95331 13.3333H11.0485L11.8105 5.71429" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M9 10.3333V7" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M7 10.3333V7" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M3.04688 4.1905H6.09449M6.09449 4.1905L6.3492 3.17166C6.4234 2.87488 6.69005 2.66669 6.99596 2.66669H9.00255C9.30846 2.66669 9.57512 2.87489 9.64931 3.17166L9.90402 4.1905M6.09449 4.1905H9.90402M9.90402 4.1905H12.9516" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Checks: ({ fill }: { fill?: string }) => {
		return (
			<svg width="18" height="18" viewBox="0 0 18 18" fill={fill} xmlns="http://www.w3.org/2000/svg">
				<path fillRule="evenodd" clipRule="evenodd" d="M13.3682 5.26322C13.568 5.50109 13.5372 5.85591 13.2993 6.05572L7.53006 10.9019L8.19911 11.6044L15.8302 5.1943C16.068 4.99449 16.4229 5.02534 16.6227 5.26322C16.8225 5.50109 16.7916 5.85591 16.5538 6.05572L8.51805 12.8057C8.29059 12.9968 7.95379 12.978 7.74892 12.7629L6.66696 11.6269L5.26358 12.8057C5.03613 12.9968 4.69932 12.978 4.49446 12.7629L1.28017 9.38794C1.06593 9.16298 1.07461 8.80693 1.29957 8.59269C1.52453 8.37844 1.88058 8.38712 2.09483 8.61208L4.94465 11.6044L5.88959 10.8106L4.53464 9.38794C4.32039 9.16298 4.32907 8.80693 4.55403 8.59269C4.779 8.37844 5.13504 8.38712 5.34929 8.61208L6.75268 10.0856L12.5757 5.1943C12.8136 4.99449 13.1684 5.02534 13.3682 5.26322Z" fill={fill} />
			</svg>
		)
	},
	Reply_small_blue: () => {
		return (
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fillRule="evenodd" clipRule="evenodd" d="M6.64308 3.52764C6.38222 3.26781 5.96011 3.26864 5.70027 3.52951L2.85969 6.38136C2.60059 6.6415 2.60059 7.06217 2.85969 7.3223L5.70027 10.1742C5.96011 10.435 6.38222 10.4359 6.64308 10.176C6.90395 9.91619 6.90478 9.49408 6.64495 9.23321L4.93701 7.5185H8.2016C10.2962 7.5185 11.9987 9.22396 11.9987 11.3333C11.9987 11.7015 12.2972 12 12.6654 12C13.0336 12 13.332 11.7015 13.332 11.3333C13.332 8.49256 11.0375 6.18516 8.2016 6.18516H4.93701L6.64495 4.47045C6.90478 4.20959 6.90395 3.78748 6.64308 3.52764Z" fill="#0891B2"/>
			</svg>
		)
	},
	Edit_small_blue: () => {
		return (
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M5.86725 13.466C5.52548 13.8079 5.06186 14 4.57843 14H2V11.4376C2 10.9547 2.19169 10.4915 2.53296 10.1498M5.86725 13.466L2.53296 10.1498M5.86725 13.466L12.5161 6.81416M2.53296 10.1498L9.1884 3.48642M9.1884 3.48642L10.1392 2.5345C10.8508 1.82202 12.0054 1.82181 12.7173 2.53401L13.4682 3.28521C14.1794 3.99678 14.1794 5.15014 13.4682 5.86172L12.5161 6.81416M9.1884 3.48642L12.5161 6.81416" stroke="#0891B2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Globe: () => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3M12 21C14.7614 21 15.9413 15.837 15.9413 12C15.9413 8.16303 14.7614 3 12 3M12 21C9.23858 21 8.05895 15.8369 8.05895 12C8.05895 8.16307 9.23858 3 12 3M3.49988 8.99998C10.1388 8.99998 13.861 8.99998 20.4999 8.99998M3.49988 15C10.1388 15 13.861 15 20.4999 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Check: () => {
		return (
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M4 9.0839L5.07079 10.2317C5.66129 10.8647 5.95654 11.1811 6.28742 11.281C6.57803 11.3688 6.88698 11.3453 7.16393 11.2143C7.47925 11.0652 7.73236 10.7069 8.23858 9.99041L12 4.6665" stroke="#020617" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Choose_files: () => {
		return (
			<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M2.88281 7.66773L7.18674 3.52094C11.2583 -0.407306 17.8709 5.65307 13.6338 9.74112L8.29962 14.8876C5.5368 17.5532 1.04964 13.4408 3.92485 10.6667L9.18225 5.59434C10.6364 4.19139 12.998 6.35581 11.4848 7.81583L7.11767 12" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Select_chat: () => {
		return (
			<svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M28 19.25V18.375M21 19.25V18.375M14 19.25V18.375M3.5 19.25C3.5 25.8497 3.5 27.3995 6.06282 29.4497C7.17668 30.3408 8.58561 30.8446 10.5 31.1295V36.75C14.3495 34.5407 16.6084 31.5 21 31.5C29.2496 31.5 33.3744 31.5 35.9372 29.4497C38.5 27.3995 38.5 25.8497 38.5 19.25C38.5 12.6503 38.5 9.35051 35.9372 7.30025C33.3744 5.25 29.2496 5.25 21 5.25C12.7504 5.25 8.62563 5.25 6.06282 7.30025C3.5 9.35051 3.5 12.6503 3.5 19.25Z" stroke="#0E7490" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Bell: () => {
		return (
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g id="bell">
					<path id="Vector" d="M5.76172 12.2451C6.1809 13.2805 6.71395 14 7.99979 14C9.28563 14 9.81868 13.2805 10.2379 12.2451" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
					<path id="Vector_2" d="M12.554 6.83738C12.554 4.36975 10.9136 2 8.01193 2C5.11027 2 3.46986 4.36975 3.46986 6.83738C3.46986 7.83841 2.81132 8.60693 2.25814 9.4099C-0.228613 13.3907 16.1293 13.2119 13.7657 9.4099C13.2125 8.60693 12.554 7.83841 12.554 6.83738Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				</g>
			</svg>
		)
	},
	UnPin: () => {
		return (
			<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fillRule="evenodd" clipRule="evenodd" d="M3.42296 3.21168C3.69958 2.93506 4.14807 2.93506 4.4247 3.21168L14.9429 13.7299C15.2195 14.0065 15.2195 14.455 14.9429 14.7316C14.6663 15.0083 14.2178 15.0083 13.9412 14.7316L3.42296 4.21342C3.14634 3.9368 3.14634 3.4883 3.42296 3.21168Z" fill="#64748B"/>
				<path fillRule="evenodd" clipRule="evenodd" d="M5.60599 7.90155L5.60046 7.90648L5.11813 7.42415C4.84151 7.14753 4.39302 7.14753 4.1164 7.42415C3.83977 7.70078 3.83978 8.14927 4.1164 8.42589L6.47742 10.7869L3.04567 14.1616C2.76674 14.4359 2.76298 14.8844 3.03727 15.1633C3.31156 15.4422 3.76004 15.446 4.03897 15.1717L7.47919 11.7887L9.84862 14.1581C10.1252 14.4347 10.5737 14.4347 10.8504 14.1581C11.127 13.8815 11.127 13.433 10.8504 13.1564L10.368 12.674L10.373 12.6685L9.36959 11.6651L9.36465 11.6707L6.60383 8.90986L6.60936 8.90492L5.60599 7.90155ZM10.0779 10.8709L11.0813 11.8742L12.0257 10.8152L11.0224 9.81185L10.0779 10.8709ZM8.46266 7.25214L7.40363 8.19659L6.40026 7.19322L7.45928 6.24877L8.46266 7.25214ZM11.7307 9.01759L13.6702 6.8428L11.4317 4.60431L9.25692 6.54381L8.25355 5.54044L10.4283 3.60094L10.3218 3.49436C10.0451 3.21774 10.0451 2.76924 10.3218 2.49262C10.5984 2.216 11.0469 2.216 11.3235 2.49262L15.7819 6.95102C16.0585 7.22764 16.0585 7.67613 15.7819 7.95275C15.5053 8.22937 15.0568 8.22938 14.7802 7.95275L14.6736 7.84617L12.7341 10.021L11.7307 9.01759Z" fill="#64748B"/>
			</svg>

		)
	},
	Upload: ({ className }: { className?: string }) => {
		return (
			<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={cn('lucide lucide-upload', className)}
			>
				<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
				<polyline points='17 8 12 3 7 8' />
				<line x1='12' x2='12' y1='3' y2='15' />
			</svg>
		)
	},
	PDF: ({ className, size }: { className?: string, size?: number }) => {
		return (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width={size || 24}
				height={size || 24}
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
				className={cn('lucide lucide-file-text', className)}
			>
				<path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' />
				<path d='M14 2v4a2 2 0 0 0 2 2h4' />
				<path d='M10 9H8' />
				<path d='M16 13H8' />
				<path d='M16 17H8' />
			</svg>
		)
	},
	Image_Small: ({ fill }: { fill?: string }) => {
		return (
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M4.33203 5.33333C4.33203 6.06971 4.92898 6.66667 5.66536 6.66667C6.40174 6.66667 6.9987 6.06971 6.9987 5.33333C6.9987 4.59695 6.40174 4 5.66536 4C4.92898 4 4.33203 4.59695 4.33203 5.33333Z" stroke={fill} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M13.952 6.65986C9.5446 6.05481 5.74458 9.32682 6.0005 13.6667" stroke={fill} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M2 8.71042C3.85291 8.45387 5.51657 9.34966 6.41571 10.7773" stroke={fill} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M2 8C2 5.17157 2 3.75736 2.87868 2.87868C3.75736 2 5.17157 2 8 2C10.8284 2 12.2426 2 13.1213 2.87868C14 3.75736 14 5.17157 14 8C14 10.8284 14 12.2426 13.1213 13.1213C12.2426 14 10.8284 14 8 14C5.17157 14 3.75736 14 2.87868 13.1213C2 12.2426 2 10.8284 2 8Z" stroke={fill} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	ImageIcon: ({ className }: { className?: string }) => {
		return (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
				className={cn('lucide lucide-image', className)}
			>
				<rect width='18' height='18' x='3' y='3' rx='2' ry='2' />
				<circle cx='9' cy='9' r='2' />
				<path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' />
			</svg>
		)
	},
	Trash: ({ className }: { className?: string }) => {
		return (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
				className={cn('lucide lucide-trash', className)}
			>
				<path d='M3 6h18' />
				<path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
				<path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
			</svg>
		)
	},
	Video: ({ className, fill, size }: { className?: string, fill?: string, size?: number }) => {
		return (
			<svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
				<path d="M13.2423 10.7093C13.9141 11.2573 14.25 11.5313 14.25 12C14.25 12.4687 13.9141 12.7427 13.2423 13.2907C13.0568 13.442 12.8729 13.5845 12.7038 13.7032C12.5555 13.8073 12.3876 13.915 12.2137 14.0208C11.5435 14.4283 11.2083 14.6321 10.9078 14.4065C10.6072 14.1809 10.5799 13.7085 10.5252 12.7638C10.5098 12.4967 10.5 12.2348 10.5 12C10.5 11.7652 10.5098 11.5033 10.5252 11.2362C10.5799 10.2915 10.6072 9.81913 10.9078 9.5935C11.2083 9.36787 11.5435 9.57166 12.2137 9.97924C12.3876 10.085 12.5555 10.1927 12.7038 10.2968C12.8729 10.4155 13.0568 10.558 13.2423 10.7093Z" stroke={fill} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M3 12C3 7.75736 3 5.63604 4.31802 4.31802C5.63604 3 7.75736 3 12 3C16.2426 3 18.364 3 19.682 4.31802C21 5.63604 21 7.75736 21 12C21 16.2426 21 18.364 19.682 19.682C18.364 21 16.2426 21 12 21C7.75736 21 5.63604 21 4.31802 19.682C3 18.364 3 16.2426 3 12Z" stroke={fill} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	AnimatedPencil: ({ className }: { className?: string }) => {
		return (
			<motion.svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className={className}
				animate={{ x: [0, 2, -2, 2, 0] }} 
				transition={{
					duration: 2, 
					repeat: Infinity, 
					ease: "easeInOut", 
				}}
			>
				<path
					d="M3.33203 17.5H16.6654"
					stroke="#64748B"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M4.72306 10.9894C4.36762 11.3453 4.16797 11.8278 4.16797 12.3308V15H6.85347C7.35698 15 7.83985 14.7999 8.19581 14.4437L16.1124 6.52262C16.8532 5.7814 16.8532 4.57998 16.1124 3.83876L15.3303 3.05626C14.5889 2.31438 13.3863 2.31461 12.6451 3.05677L4.72306 10.9894Z"
					stroke="#64748B"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</motion.svg>
		);
	},
	ChatMicrophone: ({ className, size }: { className?: string, size?: number }) => {
		return (
			<svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
				<path d="M8 21H16" stroke="white" strokeWidth="1.5" 	strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M12 18V21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M16 6.42857C16 4.53502 14.2091 3 12 3C9.79086 3 8 4.53502 8 6.42857V11.5714C8 13.465 9.79086 15 12 15C14.2091 15 16 13.465 16 11.5714V6.42857Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M5 11C5 14.866 8.134 18 12 18C15.866 18 19 14.866 19 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Send: ({ className, size }: { className?: string, size?: number }) => {
		return (
			<svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
				<path d="M14 9.99997L11 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M20.2876 3.03102C20.7105 2.88301 21.117 3.28951 20.9689 3.7124L15.0436 20.6419C14.8836 21.099 14.247 21.125 14.0503 20.6824L10.8314 13.44C10.7777 13.319 10.6809 13.2223 10.5599 13.1685L3.31758 9.94971C2.87501 9.75302 2.90099 9.11633 3.35811 8.95633L20.2876 3.03102Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Pause: ({ className, size }: { className?: string, size?: number }) => {
		return (
			<svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
				<path d="M15.5 6.5H14.5C13.9477 6.5 13.5 6.94772 13.5 7.5V17.5C13.5 18.0523 13.9477 18.5 14.5 18.5H15.5C16.0523 18.5 16.5 18.0523 16.5 17.5V7.5C16.5 6.94772 16.0523 6.5 15.5 6.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M9 6.5H8C7.44772 6.5 7 6.94772 7 7.5V17.5C7 18.0523 7.44772 18.5 8 18.5H9C9.55228 18.5 10 18.0523 10 17.5V7.5C10 6.94772 9.55228 6.5 9 6.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	Play: ({ className, size }: { className?: string, size?: number }) => {
		return (
			<svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" 	className={className}>
				<path d="M14.5814 9.40221C16.1938 10.7175 17 11.3752 17 12.5C17 13.6248 16.1938 14.2825 14.5814 15.5978C14.1363 15.9609 13.6948 16.3028 13.2892 16.5876C12.9333 16.8375 12.5302 17.096 12.1129 17.3498C10.5043 18.328 9.69999 18.8171 8.97862 18.2756C8.25725 17.7341 8.19169 16.6005 8.06057 14.3332C8.02349 13.6921 8 13.0635 8 12.5C8 11.9365 8.02349 11.308 8.06057 10.6668C8.19169 8.39953 8.25725 7.26591 8.97862 6.7244C9.69999 6.18288 10.5043 6.67198 12.1129 7.65019C12.5302 7.90395 12.9333 8.16246 13.2892 8.41238C13.6948 8.69725 14.1363 9.03911 14.5814 9.40221Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" 	strokeLinejoin="round"/>
			</svg>
		)
	},
	Chat_Trash: ({ className, size }: { className?: string, size?: number }) => {
		return (
			<svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
				<path d="M6.28516 8.57141L7.42801 20H16.5709L17.7137 8.57141" stroke="red" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M13.5 15.5V10.5" stroke="red" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M10.5 15.5V10.5" stroke="red" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M4.57031 6.28571H9.14174M9.14174 6.28571L9.5238 4.75746C9.6351 4.3123 10.0351 4 10.4939 4H13.5038C13.9627 4 14.3627 4.3123 14.474 4.75746L14.856 6.28571M9.14174 6.28571H14.856M14.856 6.28571H19.4275" stroke="red" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	}
}

export default Icons