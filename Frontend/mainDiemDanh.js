import './style.css'
import { eventSource } from './tempandhumid.js'
import { diemdanh, realTimeRFID } from './rfid.js'

const membersList = document.getElementById('member-list')

// Path: rfid.js
diemdanh
  .then(res => res.json())
  .then(data => {
    data.forEach(member => {
    const div = document.createElement('div')
    div.className = 'member-list-row'
    div.id = member.id
    div.innerHTML = `
      <div style="color: var(--white)">${member.data.name}</div>
      <div style="color: var(--white)">${member.data.rfid}</div>
      <div style="color: var(--white)">${member.data.lastCheck}</div>
      <div style="color: var(--white)">${member.data.status}</div>
    `
    membersList.appendChild(div)
  })
})

realTimeRFID.onmessage = e => {
    console.log(e);
    const data = JSON.parse(e.data)
    const member = document.getElementById(e.lastEventId)
    member.innerHTML = `
      <div style="color: var(--white)">${data.name}</div>
      <div style="color: var(--white)">${data.rfid}</div>
      <div style="color: var(--white)">${data.lastCheck}</div>
      <div style="color: var(--white)">${data.status}</div>
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

setInterval(() => {
  date.innerText = new Date().toLocaleString('en-US', {timeZone: "Asia/Ho_Chi_Minh"})
}, 1000)

eventSource.onmessage = e => {
  const data = e.data.split(',')
  humid.innerText = ', ' + data[0] + '%'
  temp.innerText = data[1] + '°C'
};