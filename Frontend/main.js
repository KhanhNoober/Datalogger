import './style.css'
import { eventSource } from './tempandhumid.js'
import { test, realTimeRFID } from './rfid.js'

const membersList = document.getElementById('member-list')

// Path: rfid.js
test
  .then(res => res.json())
  .then(data => {
    data.forEach(member => {
    const div = document.createElement('div')
    div.className = 'member-list-row'
    div.id = member.id
    div.innerHTML = `
      <div>${member.data.name}</div>
      <div>${member.data.rfid}</div>
      <div>${member.data.lastCheck}</div>
      <div>${member.data.status}</div>
    `
    membersList.appendChild(div)
  })
})

realTimeRFID.onmessage = e => {
    console.log(e);
    const data = JSON.parse(e.data)
    const member = document.getElementById(e.lastEventId)
    member.innerHTML = `
      <div>${data.name}</div>
      <div>${data.rfid}</div>
      <div>${data.lastCheck}</div>
      <div>${data.status}</div>
    `
}


// Path: tempandhumid.js
eventSource.onopen = e => {
  console.log('open: ', e)
}

eventSource.onerror = e => {
  console.log('error: ', e)
}

//date temp and humid
const date = document.getElementById('date')
const temp = document.getElementById('temp')
const humid = document.getElementById('humid')

date.innerText = new Date().toLocaleString('en-US', {timeZone: "Asia/Ho_Chi_Minh"})

eventSource.onmessage = e => {
  const data = e.data.split(',')
  humid.innerText = ', ' + data[0] + '%'
  temp.innerText = data[1] + '°C'
};