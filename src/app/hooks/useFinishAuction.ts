

const finishAuction = async (auctionId: string) => {
  const response = await fetch(`https://rtc.ai4bi.kz/api/rooms/stop?room=${auctionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.json()
}

export default finishAuction