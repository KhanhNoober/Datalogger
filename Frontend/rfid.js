export const test = fetch('http://localhost:3000/rfid')

export const realTimeRFID = new EventSource('http://localhost:3000/rfid/realtime')