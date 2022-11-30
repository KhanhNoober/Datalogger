export const diemdanh = fetch('http://localhost:3000/rfid')

export const datalog = fetch('http://localhost:3000/rfid/datalog')

export const realTimeRFID = new EventSource('http://localhost:3000/rfid/realtime')

export const realTimeDatalog = new EventSource('http://localhost:3000/rfid/realtimedatalog')