import './style.css'
import { eventSource } from './tempandhumid.js'
import { datalog ,realTimeDatalog } from './rfid.js'

const membersList = document.getElementById('member-list')

// Path: rfid.js
let datalogs = []

datalog
  .then(res => res.json())
  .then(data => {
    data.forEach(member => datalogs.push(member.data))
}).then(() => {
    datalogs.sort((a, b) => {
        let tempA = new Date(a.data.lastCheck)
        let tempB = new Date(b.data.lastCheck)
        return tempA.getTime() - tempB.getTime()
    })
    datalogs.forEach(member => {
        const tempMember = document.createElement('div')
        tempMember.className = 'member-list-row'
        tempMember.innerHTML = `
            <div style="color: var(--white)">${member.data.name}</div>
            <div style="color: var(--white)">${member.data.rfid}</div>
            <div style="color: var(--white)">${member.data.lastCheck}</div>
            <div style="color: var(--white)">${member.data.status}</div>
        `
        membersList.appendChild(tempMember)
    })
})




realTimeDatalog.onmessage = e => {
  console.log(e);
  const data = JSON.parse(e.data)
  const member = document.createElement(`div`)
  member.className = 'member-list-row'
  member.innerHTML = `
    <div style="color: var(--white)">${data.name}</div>
    <div style="color: var(--white)">${data.rfid}</div>
    <div style="color: var(--white)">${data.lastCheck}</div>
    <div style="color: var(--white)">${data.status}</div>
  `
  membersList.appendChild(member)
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