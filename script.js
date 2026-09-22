const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const menuBtn = $("#menuBtn"), nav = $("#nav");
menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
$$(".nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

const sections = $$("section[id]");
const navLinks = $$(".nav a");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, {rootMargin:"-35% 0px -55% 0px"});
sections.forEach(s => observer.observe(s));

const modalBackdrop = $("#modalBackdrop"), modalContent = $("#modalContent");
$("#modalClose").onclick = () => modalBackdrop.classList.remove("show");
modalBackdrop.addEventListener("click", e => { if(e.target === modalBackdrop) modalBackdrop.classList.remove("show"); });
document.addEventListener("keydown", e => { if(e.key === "Escape") modalBackdrop.classList.remove("show"); });

function openProject(key){
  const common = {
    langzai: {
      title:"LANGZAI", sub:"LANGUAGE EXPERIENCE",
      text:"Konsep aplikasi web bertema futuristik untuk eksplorasi bahasa, teks, dan ide. Demo di bawah adalah simulasi UI interaktif yang berjalan lokal.",
      demo:`<div class="chat-demo"><div class="terminal-bar"><i></i><i></i><i></i><span>langzai://assistant</span></div><div id="chatLog" style="padding:18px;color:#b9c9de;min-height:120px"><b style="color:#00eaff">LANGZAI:</b> Halo! Ketik kalimat untuk mendapatkan respons simulasi.</div><div style="display:flex;gap:8px"><input id="langInput" style="flex:1;background:#030a20;color:white;border:1px solid #14518d;padding:12px;border-radius:7px" placeholder="Tulis sesuatu..."><button class="btn primary" id="langSend">SEND</button></div></div>`
    },
    desainhub: {
      title:"DESAINHUB", sub:"CREATIVE SHOWCASE",
      text:"Ruang showcase desain dengan filter kategori. Klik kategori untuk memfilter koleksi.",
      demo:`<div class="design-demo"><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:15px"><button class="detail-btn filter" data-filter="all">ALL</button><button class="detail-btn filter" data-filter="ui">UI</button><button class="detail-btn filter" data-filter="poster">POSTER</button><button class="detail-btn filter" data-filter="logo">LOGO</button></div><div id="designItems" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">${["ui","poster","logo","ui","poster","logo"].map((x,i)=>`<div class="ditem" data-cat="${x}" style="height:90px;border:1px solid ${i%2?"#ff00e6":"#00eaff"};display:grid;place-items:center;background:linear-gradient(135deg,#06133a,#18052d);color:#fff;font-weight:900">${x.toUpperCase()} ${i+1}</div>`).join("")}</div></div>`
    },
    gamehub: {
      title:"GAME HUB", sub:"NEON CLICKER",
      text:"Mini-game playable langsung di browser. Klik target neon sebanyak mungkin dalam 15 detik.",
      demo:`<div style="text-align:center"><div id="score" style="font-size:18px;color:#9db0d0">SCORE: <b style="color:#00eaff">0</b> · TIME: <b style="color:#ff00e6">15</b></div><div id="gameArea" style="height:300px;margin-top:15px;border:1px solid #14518d;position:relative;overflow:hidden;background:radial-gradient(circle,#101c49,#020717)"><button id="target" style="position:absolute;width:55px;height:55px;border-radius:50%;border:2px solid #00eaff;background:#ff00e6;box-shadow:0 0 25px #00eaff;cursor:pointer;display:none">✦</button><div id="gameMsg" style="position:absolute;inset:0;display:grid;place-items:center;color:#a8bad5">Tekan START untuk bermain</div></div><button class="btn primary" id="startGame" style="margin-top:15px">START GAME</button></div>`
    },
    portfolio: {
      title:"WEBSITE PORTOFOLIO", sub:"CYBERPUNK SYSTEM",
      text:"Portofolio ini dibangun sebagai single-page website dengan HTML, CSS, dan JavaScript murni. Navigasi, modal proyek, pengaturan, form kontak, responsive menu, dan mini-game semuanya aktif.",
      demo:`<div class="modal-demo"><b style="color:#00eaff">SYSTEM CHECK</b><p>✓ Responsive layout<br>✓ Smooth navigation<br>✓ Project modals<br>✓ Settings panel<br>✓ Contact mailto<br>✓ Neon Clicker mini-game<br>✓ No framework required</p></div>`
    }
  };
  const p = common[key];
  modalContent.innerHTML = `<span class="eyebrow">04 / PROJECT ACCESS</span><h2>${p.title} <span>// ${p.sub}</span></h2><p>${p.text}</p>${p.demo}`;
  modalBackdrop.classList.add("show");
  if(key==="langzai") setupLangzai();
  if(key==="desainhub") setupDesign();
  if(key==="gamehub") setupGame();
}
$$(".project").forEach(card => card.querySelector("button").addEventListener("click", () => openProject(card.dataset.project)));

function setupLangzai(){
  const input=$("#langInput"), send=$("#langSend"), log=$("#chatLog");
  function sendMsg(){
    const v=input.value.trim(); if(!v) return;
    log.innerHTML += `<div style="margin-top:12px"><b style="color:#ff00e6">YOU:</b> ${escapeHtml(v)}</div><div style="margin-top:7px"><b style="color:#00eaff">LANGZAI:</b> Mode simulasi aktif — ide kamu terdeteksi dan siap dikembangkan.</div>`;
    input.value=""; input.focus();
  }
  send.onclick=sendMsg; input.addEventListener("keydown",e=>{if(e.key==="Enter")sendMsg()});
}
function setupDesign(){
  $$(".filter").forEach(b=>b.onclick=()=>$$(".ditem").forEach(x=>x.style.display=(b.dataset.filter==="all"||x.dataset.cat===b.dataset.filter)?"grid":"none"));
}
function setupGame(){
  const target=$("#target"), area=$("#gameArea"), msg=$("#gameMsg"), start=$("#startGame"), scoreEl=$("#score b"), timeEl=$("#score").querySelectorAll("b")[1];
  let score=0,time=15,timer;
  function move(){ target.style.left=Math.random()*(area.clientWidth-65)+"px"; target.style.top=Math.random()*(area.clientHeight-65)+"px"; }
  target.onclick=()=>{score++;scoreEl.textContent=score;move()};
  start.onclick=()=>{
    clearInterval(timer);score=0;time=15;scoreEl.textContent=0;timeEl.textContent=time;msg.style.display="none";target.style.display="block";move();start.disabled=true;
    timer=setInterval(()=>{time--;timeEl.textContent=time;if(time<=0){clearInterval(timer);target.style.display="none";msg.style.display="grid";msg.textContent=`TIME UP — SCORE ${score}`;start.disabled=false}},1000);
  };
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}

const settingsPanel=$("#settingsPanel");
$("#settingsBtn").onclick=()=>settingsPanel.classList.toggle("show");
$("#settingsClose").onclick=()=>settingsPanel.classList.remove("show");
$("#glowRange").oninput=e=>document.documentElement.style.setProperty("--glow",e.target.value/100);
$("#gridToggle").onchange=e=>document.body.classList.toggle("no-grid",!e.target.checked);
$("#motionToggle").onchange=e=>document.body.classList.toggle("reduced",e.target.checked);

$("#contactForm").addEventListener("submit", e=>{
  e.preventDefault();
  const name=$("#name").value.trim(), email=$("#email").value.trim(), message=$("#message").value.trim();
  const subject=encodeURIComponent("Pesan dari Portofolio Gilang Bae - "+name);
  const body=encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\n${message}`);
  $("#formStatus").textContent="Membuka aplikasi email...";
  window.location.href=`mailto:gilangbae7321@gmail.com?subject=${subject}&body=${body}`;
});
