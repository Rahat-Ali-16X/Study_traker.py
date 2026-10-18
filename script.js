const $=s=>document.querySelector(s),p2=n=>String(n).padStart(2,'0'),fmt=s=>p2(s/3600|0)+':'+p2(s%3600/60|0)+':'+p2(s%60);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dk=d=>d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
const SUBJ={Python:'#00ff9d','AI/ML':'#b66dff',Maths:'#ffb020',Physics:'#00d9ff',English:'#ff4d8d',Other:'#8aa0b8'};
const QUOTES=[['The expert in anything was once a beginner.','Helen Hayes'],['Learning never exhausts the mind.','Leonardo da Vinci'],['The beautiful thing about learning is that no one can take it away from you.','B.B. King'],['An investment in knowledge pays the best interest.','Benjamin Franklin'],['Education is the most powerful weapon you can use to change the world.','Nelson Mandela'],['The more that you read, the more things you will know.','Dr. Seuss'],['Success is the sum of small efforts repeated day in and day out.','Robert Collier'],['Believe you can and you’re halfway there.','Theodore Roosevelt']];
const PLAN=[['Week 1–2','Python Basics','#00ff9d','🐍',['Variables & Data Types','If/Else Conditions','Loops (for, while)','Functions & Modules']],['Week 3–4','Python Intermediate','#00d9ff','⚙️',['Lists, Tuples, Dicts','File Handling','OOP Concepts','Error Handling']],['Week 5–6','AI Foundations','#b66dff','🤖',['What is AI/ML?','NumPy & Pandas Basics','Data Visualization','Intro to scikit-learn']],['Week 7–8','Mini Projects','#ff5a36','🚀',['Simple Calculator','Student Grade Tracker','Basic Chatbot','ML Digit Recognizer']]];
const RES=[['Python Docs','python.org','🐍'],['CS50P (Harvard)','cs50.harvard.edu','🎓'],['Kaggle Learn','kaggle.com/learn','🤖'],['W3Schools Python','w3schools.com','📖']];
const RANKS=['CADET','PILOT','NAVIGATOR','COMMANDER','ADMIRAL'];
const KEY='forge_study_v2';
const def=()=>({v:2,nid:3,goals:[{id:1,text:'Complete Python Chapter 3',done:false,subject:'Python'},{id:2,text:'Watch ML intro video',done:false,subject:'AI/ML'}],sessions:[],plan:{},timer:{subject:'Python',target:25,base:0,start:null}});
function load(){try{const j=JSON.parse(localStorage.getItem(KEY));if(j&&j.v===2)return j}catch(e){}return def()}
let S=load(),tab='home',open=null,adding=false,wipe=false;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const Q=QUOTES[Math.random()*QUOTES.length|0];

/* ── CORE LOGIC ── */
// Elapsed time comes from timestamps, not from counting interval ticks, so it stays exact when the tab sleeps.
const el=()=>{const T=S.timer;return Math.floor(T.base+(T.start?(Date.now()-T.start)/1000:0))};
const logged=(day)=>S.sessions.filter(s=>!day||s.day===day).reduce((a,s)=>a+s.sec,0);
function streak(){const d=new Set(S.sessions.map(s=>s.day)),x=new Date();let n=0;if(!d.has(dk(x)))x.setDate(x.getDate()-1);while(d.has(dk(x))){n++;x.setDate(x.getDate()-1)}return n}
const xp=()=>Math.floor(logged()/60)+S.goals.filter(g=>g.done).length*15;
let AC;
function unlock(){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
function beep(){try{[660,880,1320].forEach((f,i)=>{const t=AC.currentTime+i*.18,o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.2,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+.2)});navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('show'),2400)}
function toggle(){unlock();const T=S.timer;if(T.start){T.base=el();T.start=null}else T.start=Date.now();save();render()}
function discard(){const T=S.timer;T.base=0;T.start=null;save();render();toast('SESSION DISCARDED')}
function finish(auto){const T=S.timer,e=auto?T.target*60:Math.min(el(),T.target*60);
 if(e>=60){S.sessions.push({id:S.nid++,subject:T.subject,sec:e,day:dk(new Date())});toast(auto?'⚡ SESSION COMPLETE · +'+(e/60|0)+' XP':'LOGGED · '+fmt(e))}else toast('UNDER 1 MIN · NOT LOGGED');
 T.base=0;T.start=null;save();if(auto)beep();render()}
const locked=()=>{const T=S.timer;if(T.start||el()>0){toast('LOCKED · FINISH OR DISCARD FIRST');return true}};
function setT(m){if(locked()){render();return}m=Math.round(m);S.timer.target=m>=1?Math.min(m,180):25;save();render()}
function tick(){const T=S.timer,tot=T.target*60,e=el();
 if(T.start&&e>=tot){finish(true);return}
 const m=$('#tm');if(m){const r=Math.max(tot-e,0);m.textContent=p2(r/60|0)+':'+p2(r%60);$('#pg').setAttribute('stroke-dashoffset',2*Math.PI*96*(1-Math.min(e/tot,1)));$('#st').textContent=T.start?'● CORE ACTIVE':e?'‖ PAUSED':'STANDBY';$('#sb').textContent='ELAPSED '+fmt(e)}
 $('#clk').textContent=p2(new Date().getHours())+':'+p2(new Date().getMinutes())}

/* ── VIEWS ── */
const mi=g=>`<div class="mi${g.done?' dn':''}"><button class="ck" data-a="tg" data-id="${g.id}" aria-label="Toggle">${g.done?'✓':''}</button><div><p>${esc(g.text)}</p><span class="tag" style="--c:${SUBJ[g.subject]||SUBJ.Other}">${esc(g.subject)}</span></div><button class="x" data-a="del" data-id="${g.id}" aria-label="Delete">✕</button></div>`;
const V={
home(){const h=new Date().getHours(),lv=Math.floor(xp()/100)+1,x=xp()%100,dn=S.goals.filter(g=>g.done).length;
return `<div class="hd"><small>${h<12?'GOOD MORNING':h<17?'GOOD AFTERNOON':'GOOD EVENING'}, PILOT</small><h1>COMMAND<br>CENTER</h1><p class="mu">UP Board Class 10 · Python & AI</p></div>
<div class="p q"><p>“${esc(Q[0])}”</p><b>— ${esc(Q[1])}</b></div>
<div class="g3"><div class="p st" style="--k:var(--c3)"><b>${fmt(logged(dk(new Date())))}</b><small>TODAY</small></div><div class="p st" style="--k:#ffb020"><b>${streak()}d</b><small>STREAK</small></div><div class="p st" style="--k:var(--c2)"><b>${dn}/${S.goals.length}</b><small>MISSIONS</small></div></div>
<div class="p"><div class="row"><span>LVL ${lv} · ${RANKS[Math.min((lv-1)/3|0,4)]}</span><span>${x}/100 XP</span></div><div class="bar"><i style="width:${x}%"></i></div></div>
<div class="p"><h3>ACTIVE MISSIONS</h3>${S.goals.length?S.goals.slice(0,3).map(mi).join(''):'<p class="mu">No missions yet. Open the Missions tab.</p>'}${S.goals.length>3?`<p class="mu" style="margin-top:8px">+${S.goals.length-3} more in Missions →</p>`:''}</div>
<button class="btn" data-a="tab" data-v="timer">ENGAGE FOCUS CORE ▶</button>`},
timer(){const T=S.timer,C=2*Math.PI*96,col=SUBJ[T.subject],e=el(),lk=e>0||T.start;
return `<div class="hd"><small>FOCUS CORE</small><h1>DEEP WORK</h1></div>
<div class="chips">${Object.keys(SUBJ).slice(0,5).map(k=>`<button class="chip${k===T.subject?' on':''}" data-a="subj" data-v="${k}" style="--c:${SUBJ[k]}">${k}</button>`).join('')}</div>
<div class="ring"><svg viewBox="0 0 240 240"><circle class="tk${T.start?' spin':''}" cx="120" cy="120" r="112"/><circle class="tr" cx="120" cy="120" r="96"/><circle class="in" cx="120" cy="120" r="80"/><circle id="pg" cx="120" cy="120" r="96" transform="rotate(-90 120 120)" stroke="${col}" style="color:${col}" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg><div class="ct"><b id="tm" style="font-weight:400">--:--</b><span id="st"></span><em id="sb"></em></div></div>
<div class="pre" style="${lk?'opacity:.45':''}">${[15,25,45,60].map(m=>`<button class="${T.target===m?'on':''}" data-a="pre" data-v="${m}">${m}m</button>`).join('')}<input id="cu" type="number" min="1" max="180" value="${T.target}"><span class="mu">min</span></div>
<div class="ctl"><button class="rb" data-a="reset" aria-label="Discard">↺</button><button class="go${T.start?' on':''}" data-a="go" aria-label="Start or pause">${T.start?'❚❚':'▶'}</button><button class="rb" data-a="fin" aria-label="Finish and log">✓</button></div>
${S.sessions.length?`<div class="p"><h3>RECENT LOGS</h3>${S.sessions.slice(-4).reverse().map(s=>`<div class="row" style="color:var(--tx)"><span style="color:${SUBJ[s.subject]}">● ${esc(s.subject)}</span><span>${fmt(s.sec)}</span><span class="mu">${s.day.slice(5)}</span></div>`).join('')}</div>`:''}`},
goals(){const pe=S.goals.filter(g=>!g.done),dn=S.goals.filter(g=>g.done);
return `<div class="hd"><small>${dn.length}/${S.goals.length} COMPLETE</small><h1>MISSIONS</h1></div>
<div class="bar" style="margin-bottom:16px"><i style="width:${S.goals.length?dn.length/S.goals.length*100:0}%"></i></div>
${adding?`<div class="p"><h3>NEW MISSION</h3><input id="ng" maxlength="80" placeholder="What do you want to achieve?"><select id="ns">${Object.keys(SUBJ).map(k=>`<option>${k}</option>`).join('')}</select><div class="g2" style="margin:0"><button class="btn" data-a="add">ADD</button><button class="btn ghost" data-a="cancel">CANCEL</button></div></div>`:`<button class="btn" data-a="new" style="margin-bottom:16px">＋ NEW MISSION</button>`}
${pe.length?`<div class="p"><h3>PENDING</h3>${pe.map(mi).join('')}</div>`:''}${dn.length?`<div class="p"><h3>COMPLETED ✓</h3>${dn.map(mi).join('')}</div>`:''}${S.goals.length?'':'<p class="mu" style="text-align:center;padding:30px">No missions yet. Add your first one.</p>'}`},
plan(){return `<div class="hd"><small>8-WEEK PYTHON & AI</small><h1>ROADMAP</h1></div>`+PLAN.map((m,i)=>{const n=m[4].filter((_,j)=>S.plan[i+'-'+j]).length,pc=n/4*100;
return `<div class="p mod${open===i?' open':''}" style="--c:${m[2]}"><button data-a="mod" data-v="${i}"><span style="font-size:24px">${m[3]}</span><div style="flex:1"><small style="color:${m[2]};font:700 11px Orbitron;letter-spacing:1px">${m[0]}</small><p style="font-weight:700;font-size:17px">${m[1]}</p></div><span class="mu" style="font:12px 'Share Tech Mono'">${n}/4</span><span class="ar">›</span></button><div class="bar"><i style="width:${pc}%;background:${m[2]};box-shadow:0 0 8px ${m[2]}"></i></div>${open===i?`<div class="tasks">${m[4].map((t,j)=>`<button class="pl${S.plan[i+'-'+j]?' dn':''}" data-a="pt" data-v="${i}-${j}"><span class="ck">${S.plan[i+'-'+j]?'✓':''}</span><span>${t}</span></button>`).join('')}</div>`:''}</div>`}).join('')+
`<div class="p"><h3>FREE RESOURCES</h3>${RES.map(r=>`<div class="pl"><span>${r[2]}</span><div><p>${r[0]}</p><span class="mu" style="font-size:12px">${r[1]}</span></div></div>`).join('')}</div>`},
stats(){const sub={};S.sessions.forEach(s=>sub[s.subject]=(sub[s.subject]||0)+s.sec);const mx=Math.max(...Object.values(sub),1);
const wk=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return{l:'SMTWTFS'[d.getDay()],m:Math.round(logged(dk(d))/60),t:i===6}}),wm=Math.max(...wk.map(w=>w.m),1);
return `<div class="hd"><small>PERFORMANCE DATA</small><h1>TELEMETRY</h1></div>
<div class="g2">${[['TOTAL TIME',fmt(logged()),'var(--c1)'],['DAY STREAK',streak()+' 🔥','#ffb020'],['SESSIONS',S.sessions.length,'var(--c3)'],['MISSIONS',S.goals.filter(g=>g.done).length+'/'+S.goals.length,'var(--c2)']].map(a=>`<div class="p st" style="--k:${a[2]}"><b style="font-size:19px">${a[1]}</b><small>${a[0]}</small></div>`).join('')}</div>
<div class="p"><h3>LAST 7 DAYS · MIN</h3><div class="ch">${wk.map(w=>`<div class="${w.t?'t':''}"><span>${w.m||''}</span><i style="height:${w.m/wm*80}%"></i><span>${w.l}</span></div>`).join('')}</div></div>
<div class="p"><h3>SUBJECT BREAKDOWN</h3>${Object.keys(sub).length?Object.entries(sub).map(([k,v])=>`<div class="sb" style="--c:${SUBJ[k]||SUBJ.Other}"><div class="row" style="color:var(--tx)"><span>${esc(k)}</span><span style="color:var(--c)">${fmt(v)}</span></div><div class="bar"><i style="width:${v/mx*100}%"></i></div></div>`).join(''):'<p class="mu">Complete a focus session to see your breakdown.</p>'}</div>
<div class="p" style="text-align:center"><p style="font-size:26px">🚀</p><p style="font-weight:700">Keep going, future developer!</p><p class="mu" style="font-size:12px;letter-spacing:1px">CLASS 10 → IIT/NIT → DREAM JOB</p></div>
<button class="btn ghost" data-a="wipe" style="${wipe?'color:var(--c2);border-color:var(--c2)':''}">${wipe?'TAP AGAIN TO WIPE ALL DATA':'RESET ALL DATA'}</button>`}};

const NAV=[['home','⌂','HOME'],['timer','◔','FOCUS'],['goals','◎','MISSIONS'],['plan','⌬','ROADMAP'],['stats','▥','TELEMETRY']];
function render(){$('#app').innerHTML='<div class="view">'+V[tab]()+'</div>';
 $('#nav').innerHTML=NAV.map(n=>`<button class="${n[0]===tab?'on':''}" data-a="tab" data-v="${n[0]}"><span>${n[1]}</span>${n[2]}</button>`).join('');
 if(tab==='goals'&&adding){const i=$('#ng');i&&i.focus()}tick()}

/* ── EVENTS ── */
function addGoal(){const t=$('#ng').value.trim();if(!t){toast('ENTER A MISSION FIRST');return}S.goals.push({id:S.nid++,text:t,done:false,subject:$('#ns').value});adding=false;save();render()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,v=b.dataset.v,id=+b.dataset.id,T=S.timer;
 if(a==='tab'){tab=v;adding=false;scrollTo(0,0);render();return}
 if(a==='tg'){const g=S.goals.find(x=>x.id===id);g.done=!g.done}
 else if(a==='del')S.goals=S.goals.filter(x=>x.id!==id);
 else if(a==='new'){adding=true}else if(a==='cancel'){adding=false}else if(a==='add'){addGoal();return}
 else if(a==='subj'){if(locked())return;T.subject=v}
 else if(a==='pre'){setT(+v);return}
 else if(a==='go'){toggle();return}else if(a==='reset'){discard();return}else if(a==='fin'){finish(false);return}
 else if(a==='mod')open=open===+v?null:+v;
 else if(a==='pt')S.plan[v]=!S.plan[v];
 else if(a==='wipe'){if(!wipe){wipe=true;render();setTimeout(()=>{if(wipe){wipe=false;tab==='stats'&&render()}},3000);return}wipe=false;S=def();toast('SYSTEM RESET')}
 save();render()});
document.addEventListener('change',e=>{if(e.target.id==='cu')setT(parseInt(e.target.value))});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='ng')addGoal()});
document.addEventListener('visibilitychange',tick);

/* ── STARFIELD ── */
const cv=$('#bg'),cx=cv.getContext('2d');let W,H,st=[];
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight;st=Array.from({length:70},()=>({x:Math.random()*W,y:Math.random()*H,z:Math.random()*.8+.2}))}
function fr(){cx.clearRect(0,0,W,H);for(const s of st){s.y+=s.z*.18;if(s.y>H)s.y=0;cx.fillStyle='rgba(160,230,255,'+s.z*.7+')';cx.fillRect(s.x,s.y,s.z*1.8,s.z*1.8)}if(!matchMedia('(prefers-reduced-motion:reduce)').matches)requestAnimationFrame(fr)}
addEventListener('resize',rs);rs();fr();
render();setInterval(tick,250);

