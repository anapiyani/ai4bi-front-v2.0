export const finishAuction = async (auctionId: string) => {
	try {
		const response = await fetch(`https://rtc.ai4bi.kz/api/rooms/stop?room=${auctionId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		return response
	} catch (error) {
		console.error(error)
	}
}