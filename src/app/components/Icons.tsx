
const Icons = {
	Radio: () => {
		return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M15.2402 8.29492C15.732 8.78127 16.1221 9.35883 16.3883 9.99456C16.6545 10.6303 16.7915 11.3117 16.7915 11.9999C16.7915 12.6881 16.6545 13.3696 16.3883 14.0053C16.1221 14.641 15.732 15.2186 15.2402 15.7049" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M8.55123 15.7049C8.05946 15.2186 7.66934 14.641 7.40317 14.0053C7.137 13.3696 7 12.6881 7 11.9999C7 11.3117 7.137 10.6303 7.40317 9.99456C7.66934 9.35883 8.05946 8.78127 8.55123 8.29492" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M18.0703 5.5C19.8111 7.22409 20.789 9.56214 20.789 12C20.789 14.4379 19.8111 16.7759 18.0703 18.5" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M5.5117 18.5C3.7709 16.7759 2.79297 14.4379 2.79297 12C2.79297 9.56214 3.7709 7.22409 5.5117 5.5" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
	},
	Info: () => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 16V11H11.5M11.5 16H12.5" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M12 8.5V8" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<circle cx="12" cy="12" r="9" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		)
	},
	Audio: () => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M8 21H16" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M12 18V21" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M16 6.42857C16 4.53502 14.2091 3 12 3C9.79086 3 8 4.53502 8 6.42857V11.5714C8 13.465 9.79086 15 12 15C14.2091 15 16 13.465 16 11.5714V6.42857Z" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M5 11C5 14.866 8.134 18 12 18C15.866 18 19 14.866 19 11" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		)
	},
	HeaderClose: () => {
		return (
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M11 1.00004L1 11M0.999958 1L10.9999 11" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		)
	},
	Close: () => {
		return (
			<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M13.5 4.50004L4.5 13.5M4.49996 4.5L13.4999 13.5" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		)
	},
	Data: () => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M6 16.5H8" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M3 14.7C3 14.0373 3.44772 13.5 4 13.5H20C20.5523 13.5 21 14.0373 21 14.7V18.3C21 18.9627 20.5523 19.5 20 19.5H4C3.44772 19.5 3 18.9627 3 18.3V14.7Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M3 5.7C3 5.03726 3.44772 4.5 4 4.5H20C20.5523 4.5 21 5.03726 21 5.7V9.3C21 9.96274 20.5523 10.5 20 10.5H4C3.44772 10.5 3 9.96274 3 9.3V5.7Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M6 7.5H8" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		)
	},
	Results: () => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M15 9.42857V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V13.2857M15 9.42857V21M15 9.42857H19C20.1046 9.42857 21 10.324 21 11.4286V19C21 20.1046 20.1046 21 19 21H15M15 21H9M9 21V13.2857M9 21H5C3.89543 21 3 20.1046 3 19V15.2857C3 14.1811 3.89543 13.2857 5 13.2857H9" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		)
	},
	Exit: () => {
		return (
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M13.333 12.9168L16.2497 10.0002L13.333 7.0835" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M11.2465 17.5H5.41667C4.49619 17.5 3.75 16.5406 3.75 15.3571V4.64286C3.75 3.45939 4.49619 2.5 5.41667 2.5H11.25" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M7.91699 9.99658H16.2503" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		)
	},
	SearchInput: () => {
		return (
			<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12.6704 12.6899L14.9805 15M14.3138 8.68583C14.3138 11.826 11.7767 14.3717 8.64714 14.3717C5.51752 14.3717 2.98047 11.826 2.98047 8.68583C2.98047 5.54563 5.51752 3 8.64714 3C11.7767 3 14.3138 5.54563 14.3138 8.68583Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		)
	},
	Menu: () => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M4.5 17.5H19.5" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M4.5 12H19.5" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M4.5 6.5H19.5" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		)
	},
	Dots: () => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M16 12.25V11.75" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M12 12.25V11.75" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8 12.25V11.75" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		)
	}
}

export default Icons