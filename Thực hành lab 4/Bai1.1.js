const nameInput = document.getElementById("name")
const scoreInput = document.getElementById("score")
const addBtn = document.getElementById("addBtn")
const tableBody = document.getElementById("tableBody")
const stats = document.getElementById("stats")

let students = []

function rank(score){
if(score >= 8.5) return "Giỏi"
if(score >= 7) return "Khá"
if(score >= 5) return "Trung bình"
return "Yếu"
}

function renderTable(){

 tableBody.innerHTML = ""

 students.forEach((sv,index)=>{

 const tr = document.createElement("tr")

 if(sv.score < 5) tr.classList.add("low")

 tr.innerHTML = `
 <td>${index+1}</td>
 <td>${sv.name}</td>
 <td>${sv.score}</td>
 <td>${rank(sv.score)}</td>
 <td><button data-index="${index}" class="delete">Xóa</button></td>
 `

 tableBody.appendChild(tr)

 })

 updateStats()
}

function updateStats(){

 const total = students.length

 const avg = students.reduce((sum,s)=>sum+s.score,0)/(total||1)

 stats.textContent = `Tổng SV: ${total} | Điểm TB: ${avg.toFixed(2)}`
}

addBtn.addEventListener("click",()=>{

 const name = nameInput.value.trim()
 const score = Number(scoreInput.value)

 if(name === ""){
 alert("Tên không được rỗng")
 return
 }

 if(isNaN(score) || score<0 || score>10){
 alert("Điểm phải từ 0-10")
 return
 }

 students.push({name,score})

 renderTable()

 nameInput.value=""
 scoreInput.value=""
 nameInput.focus()

})

scoreInput.addEventListener("keyup",(e)=>{
 if(e.key === "Enter") addBtn.click()
})

tableBody.addEventListener("click",(e)=>{

 if(e.target.classList.contains("delete")){

 const index = e.target.dataset.index
 students.splice(index,1)
 renderTable()

 }

})