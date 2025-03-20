export const convertTo24HourFormat = (time: string) => {
	let hours = time.substring(0, 2);
	let minutes = time.substring(3, 5);
	let period = time.substring(8, 10);
	
	let hourInt= parseInt(hours);
	if (period === 'AM') {
		if (hours === '12') {
			hours = '00'; 
		}
	} 
	else { 
		if (hours !== '12') {
			hours = String(hourInt+ 12); 
		}
	}
	return hours + ':' + minutes;
}