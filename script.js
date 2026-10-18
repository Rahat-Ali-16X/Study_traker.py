const $=s=>document.querySelector(s),p2=n=>String(n).padStart(2,'0'),fmt=s=>p2(s/3600|0)+':'+p2(s%3600/60|0)+':'+p2(s%60);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dk=d=>d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
const SUBJ={Python:'#00ff9d','AI/ML':'#b66dff',Hindi:'#ff5a36',Science:'#00d9ff',Maths:'#ffb020',SST:'#38bdf8',English:'#ff4d8d',Other:'#8aa0b8'};
const QUOTES=[[`The expert in anything was once a beginner.`,`Helen Hayes`],[`Learning never exhausts the mind.`,`Leonardo da Vinci`],[`An investment in knowledge pays the best interest.`,`Benjamin Franklin`],[`Success is the sum of small efforts repeated day in and day out.`,`Robert Collier`],[`It does not matter how slowly you go as long as you do not stop.`,`Confucius`],[`We are what we repeatedly do. Excellence, then, is not an act, but a habit.`,`Will Durant`],[`Well begun is half done.`,`Aristotle`],[`Genius is one percent inspiration and ninety-nine percent perspiration.`,`Thomas Edison`],[`The only way to do great work is to love what you do.`,`Steve Jobs`],[`Education is the most powerful weapon which you can use to change the world.`,`Nelson Mandela`],[`I have no special talent. I am only passionately curious.`,`Albert Einstein`],[`The more that you read, the more things you will know.`,`Dr. Seuss`],[`Do what you can, with what you have, where you are.`,`Theodore Roosevelt`],[`Fall seven times, stand up eight.`,`Japanese proverb`],[`A journey of a thousand miles begins with a single step.`,`Lao Tzu`],[`Discipline is the bridge between goals and accomplishment.`,`Jim Rohn`],[`What you do every day matters more than what you do once in a while.`,`Gretchen Rubin`],[`Small deeds done are better than great deeds planned.`,`Peter Marshall`],[`You don’t have to be great to start, but you have to start to be great.`,`Zig Ziglar`],[`The beautiful thing about learning is that no one can take it away from you.`,`B.B. King`],[`Believe you can and you’re halfway there.`,`Theodore Roosevelt`],[`Knowing is not enough; we must apply.`,`Goethe`],[`Nothing in life is to be feared, it is only to be understood.`,`Marie Curie`],[`Energy and persistence conquer all things.`,`Benjamin Franklin`],[`Dream big. Start small. Act now.`,`Robin Sharma`],[`Focus on being productive instead of busy.`,`Tim Ferriss`],[`Live as if you were to die tomorrow. Learn as if you were to live forever.`,`Mahatma Gandhi`],[`Intelligence plus character — that is the goal of true education.`,`Martin Luther King Jr.`]];

const DEF_PLAN=()=>[
  {id:101,wk:'Week 1–2',title:'Python Basics',col:'#00ff9d',ico:'🐍',tasks:[{id:201,t:'Variables & Data Types',dn:false},{id:202,t:'If/Else Conditions',dn:false},{id:203,t:'Loops (for, while)',dn:false},{id:204,t:'Functions & Modules',dn:false}]},
  {id:102,wk:'Week 3–4',title:'Python Intermediate',col:'#00d9ff',ico:'⚙️',tasks:[{id:205,t:'Lists, Tuples, Dicts',dn:false},{id:206,t:'File Handling',dn:false},{id:207,t:'OOP Concepts',dn:false},{id:208,t:'Error Handling',dn:false}]},
  {id:103,wk:'Week 5–6',title:'AI Foundations',col:'#b66dff',ico:'🤖',tasks:[{id:209,t:'What is AI/ML?',dn:false},{id:210,t:'NumPy & Pandas Basics',dn:false},{id:211,t:'Data Visualization',dn:false},{id:212,t:'Intro to scikit-learn',dn:false}]},
  {id:104,wk:'Week 7–8',title:'Mini Projects',col:'#ff5a36',ico:'🚀',tasks:[{id:213,t:'Simple Calculator',dn:false},{id:214,t:'Student Grade Tracker',dn:false},{id:215,t:'Basic Chatbot',dn:false},{id:216,t:'ML Digit Recognizer',dn:false}]}
];
const COLS=['#00ff9d','#00d9ff','#b66dff','#ff5a36','#ffb020','#ff4d8d'];
const RES=[['Python Docs','python.org','🐍'],['CS50P (Harvard)','cs50.harvard.edu','🎓'],['Kaggle Learn','kaggle.com/learn','🤖'],['W3Schools Python','w3schools.com','📖']];
const RANKS=['CADET','PILOT','NAVIGATOR','COMMANDER','ADMIRAL'];
const KEY='forge_study_v2';

const def=()=>({v:2,nid:500,goals:[{id:1,text:'Complete Python Chapter 3',done:false,subject:'Python'},{id:2,text:'Watch ML intro video',done:false,subject:'AI/ML'}],sessions:[],mods:DEF_PLAN(),timer:{subject:'Python',target:25,base:0,start:null,brk:0}});

function migrate(j){
  if(!Array.isArray(j.mods)){
    j.mods=DEF_PLAN();
    if(j.plan){j.mods.forEach((m,i)=>m.tasks.forEach((t,k)=>{if(j.plan[i+'-'+k])t.dn=true}));delete j.plan}
  }
  j.nid=Math.max(j.nid||500,500);
  return j;
}
function load(){try{const j=JSON.parse(localStorage.getItem(KEY));if(j&&j.v===2)return migrate(j)}catch(e){}return def()}

let S=load(),tab='home',open=null,adding=false,wipe=false,pForm=null,pCol=COLS[0];
S.daily=S.daily||60;S.timer.brk=S.timer.brk||0;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const dayN=()=>{const n=new Date();return Math.floor((Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())-Date.UTC(n.getFullYear(),0,0))/864e5)};
const quote=()=>QUOTES[dayN()%QUOTES.length];

/* ── CORE LOGIC ── */
const el=()=>{const T=S.timer;return Math.floor(T.base+(T.start?(Date.now()-T.start)/1000:0))};
const tgt=()=>(S.timer.brk||S.timer.target)*60;
const logged=(day)=>S.sessions.filter(s=>!day||s.day===day).reduce((a,s)=>a+s.sec,0);
function streak(){const d=new Set(S.sessions.map(s=>s.day)),x=new Date();let n=0;if(!d.has(dk(x)))x.setDate(x.getDate()-1);while(d.has(dk(x))){n++;x.setDate(x.getDate()-1)}return n}
const xp=()=>Math.floor(logged()/60)+S.goals.filter(g=>g.done).length*15+S.mods.reduce((a,m)=>a+m.tasks.filter(t=>t.dn).length*10,0);

let AC,WL;
async function wl(on){try{if(on&&navigator.wakeLock)WL=await navigator.wakeLock.request('screen');else if(WL){await WL.release();WL=null}}catch(e){}}
function unlock(){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
function beep(){try{[660,880,1320].forEach((f,i)=>{const t=AC.currentTime+i*.18,o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.2,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+.2)});navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('show'),2400)}
function toggle(){unlock();const T=S.timer;if(T.start){T.base=el();T.start=null;wl(0)}else{T.start=Date.now();wl(1)}save();render()}
function discard(){const T=S.timer;T.base=0;T.start=null;T.brk=0;wl(0);save();render();toast('SESSION DISCARDED')}
function finish(auto){const T=S.timer,e=auto?tgt():Math.min(el(),tgt());
 if(T.brk){T.brk=0;toast(auto?'BREAK OVER · READY TO FOCUS':'BREAK SKIPPED')}
 else if(e>=60){S.sessions.push({id:S.nid++,subject:T.subject,sec:e,day:dk(new Date())});const n=S.sessions.filter(s=>s.day===dk(new Date())).length;if(auto)T.brk=n%4?5:15;toast(auto?'⚡ SESSION COMPLETE · +'+(e/60|0)+' XP · BREAK READY':'LOGGED · '+fmt(e))}
 else toast('UNDER 1 MIN · NOT LOGGED');
 T.base=0;T.start=null;save();if(auto)beep();wl(0);render()}
const locked=()=>{const T=S.timer;if(T.start||el()>0||T.brk){toast('LOCKED · FINISH OR DISCARD FIRST');return true}};
function setT(m){if(locked()){render();return}m=Math.round(m);S.timer.target=m>=1?Math.min(m,180):25;save();render()}
function tick(){const T=S.timer,tot=tgt(),e=el();
 if(T.start&&e>=tot){finish(true);return}
 const r=Math.max(tot-e,0);document.title=T.start?p2(r/60|0)+':'+p2(r%60)+' · FORGE//STUDY':'FORGE//STUDY';const m=$('#tm');if(m){m.textContent=p2(r/60|0)+':'+p2(r%60);$('#pg').setAttribute('stroke-dashoffset',2*Math.PI*96*(1-Math.min(e/tot,1)));$('#st').textContent=T.start?(T.brk?'☾ RECHARGING':'● CORE ACTIVE'):e?'‖ PAUSED':T.brk?'☾ BREAK READY':'STANDBY';$('#sb').textContent='ELAPSED '+fmt(e)}
 const c=$('#clk');if(c)c.textContent=p2(new Date().getHours())+':'+p2(new Date().getMinutes())}

/* ── VIEWS ── */
const mi=g=>`<div class="mi${g.done?' dn':''}"><button class="ck" data-a="tg" data-id="${g.id}" aria-label="Toggle">${g.done?'✓':''}</button><div><p>${esc(g.text)}</p><span class="tag" style="--c:${SUBJ[g.subject]||SUBJ.Other}">${esc(g.subject)}</span></div><button class="x" data-a="del" data-id="${g.id}" aria-label="Delete">✕</button></div>`;
function best(){const ds=[...new Set(S.sessions.map(s=>s.day))].sort();let b=0,c=0,p=null;for(const d of ds){const t=new Date(d+'T00:00:00');c=p&&Math.round((t-p)/864e5)===1?c+1:1;p=t;b=Math.max(b,c)}return b}
function heat(){const t=new Date(),s=new Date(t),gm=S.daily*60;s.setDate(t.getDate()-t.getDay()-28);let h='';for(let i=0;i<35;i++){const d=new Date(s);d.setDate(s.getDate()+i);const k=dk(d),v=logged(k),l=k>dk(t)?0:v>=gm?3:v>=gm/2?2:v>0?1:0;h+=`<i class="h${l}${k===dk(t)?' td':''}" title="${k}"></i>`}return `<div class="hm">${h}</div>`}

const V={
home(){const Q=quote(),tm=logged(dk(new Date())),gm=S.daily*60,pc=Math.min(tm/gm,1),h=new Date().getHours(),lv=Math.floor(xp()/100)+1,x=xp()%100,dn=S.goals.filter(g=>g.done).length;
return `<div class="hd"><small>${h<12?'GOOD MORNING':h<17?'GOOD AFTERNOON':'GOOD EVENING'}, PILOT</small><h1>COMMAND<br>CENTER</h1><p class="mu">UP Board Class 10 · Python & AI</p></div>
<div class="p q"><h3 style="color:var(--c2)">TRANSMISSION OF THE DAY</h3><p>“${esc(Q[0])}”</p><b>— ${esc(Q[1])}</b></div>
<div class="p dg"><svg viewBox="0 0 100 100" style="color:${pc>=1?'var(--c3)':'var(--c1)'}"><circle class="tr2" cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="42" transform="rotate(-90 50 50)" stroke="currentColor" stroke-dasharray="264" stroke-dashoffset="${264*(1-pc)}"/></svg><div><h3>DAILY TARGET</h3><b>${tm/60|0}/${S.daily} MIN</b><p class="mu">${pc>=1?'Target hit. Streak secured ✓':'Study '+Math.ceil((gm-tm)/60)+' more min to secure today'}</p></div><div class="adj"><button data-a="dg" data-v="15" aria-label="More">＋</button><button data-a="dg" data-v="-15" aria-label="Less">－</button></div></div>
<div class="g3"><div class="p st" style="--k:var(--c3)"><b>${fmt(logged(dk(new Date())))}</b><small>TODAY</small></div><div class="p st" style="--k:#ffb020"><b>${streak()}d</b><small>STREAK</small></div><div class="p st" style="--k:var(--c2)"><b>${dn}/${S.goals.length}</b><small>MISSIONS</small></div></div>
<div class="p"><div class="row"><span>LVL ${lv} · ${RANKS[Math.min((lv-1)/3|0,4)]}</span><span>${x}/100 XP</span></div><div class="bar"><i style="width:${x}%"></i></div></div>
<div class="p"><h3>ACTIVE MISSIONS</h3>${S.goals.length?S.goals.slice(0,3).map(mi).join(''):'<p class="mu">No missions yet. Open the Missions tab.</p>'}${S.goals.length>3?`<p class="mu" style="margin-top:8px">+${S.goals.length-3} more in Missions →</p>`:''}</div>
<button class="btn" data-a="tab" data-v="timer">ENGAGE FOCUS CORE ▶</button>`},

timer(){const T=S.timer,C=2*Math.PI*96,col=T.brk?'#b66dff':(SUBJ[T.subject]||SUBJ.Other),e=el(),lk=e>0||T.start||T.brk;
return `<div class="hd"><small>FOCUS CORE</small><h1>DEEP WORK</h1></div>
<div class="chips">${Object.keys(SUBJ).map(k=>`<button class="chip${k===T.subject?' on':''}" data-a="subj" data-v="${k}" style="--c:${SUBJ[k]}">${k}</button>`).join('')}</div>
<div class="ring"><svg viewBox="0 0 240 240"><circle class="tk${T.start?' spin':''}" cx="120" cy="120" r="112"/><circle class="tr" cx="120" cy="120" r="96"/><circle class="in" cx="120" cy="120" r="80"/><circle id="pg" cx="120" cy="120" r="96" transform="rotate(-90 120 120)" stroke="${col}" style="color:${col}" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg><div class="ct"><b id="tm" style="font-weight:400">--:--</b><span id="st"></span><em id="sb"></em></div></div>
<div class="pre" style="${lk?'opacity:.45':''}">${[15,25,45,60].map(m=>`<button class="${T.target===m?'on':''}" data-a="pre" data-v="${m}">${m}m</button>`).join('')}<input id="cu" type="number" min="1" max="180" value="${T.target}"><span class="mu">min</span></div>
<div class="ctl"><button class="rb" data-a="reset" aria-label="Discard">↺</button><button class="go${T.start?' on':''}" data-a="go" aria-label="Start or pause">${T.start?'❚❚':'▶'}</button><button class="rb" data-a="fin" aria-label="Finish and log">✓</button></div>
${S.sessions.length?`<div class="p"><h3>RECENT LOGS</h3>${S.sessions.slice(-4).reverse().map(s=>`<div class="row" style="color:var(--tx)"><span style="color:${SUBJ[s.subject]||SUBJ.Other}">● ${esc(s.subject)}</span><span>${fmt(s.sec)}</span><span class="mu">${s.day.slice(5)}</span></div>`).join('')}</div>`:''}`},

goals(){const pe=S.goals.filter(g=>!g.done),dn=S.goals.filter(g=>g.done);
return `<div class="hd"><small>${dn.length}/${S.goals.length} COMPLETE</small><h1>MISSIONS</h1></div>
<div class="bar" style="margin-bottom:16px"><i style="width:${S.goals.length?dn.length/S.goals.length*100:0}%"></i></div>
${adding?`<div class="p"><h3>NEW MISSION</h3><input id="ng" maxlength="80" placeholder="What do you want to achieve?"><select id="ns">${Object.keys(SUBJ).map(k=>`<option>${k}</option>`).join('')}</select><div class="g2" style="margin:0"><button class="btn" data-a="add">ADD</button><button class="btn ghost" data-a="cancel">CANCEL</button></div></div>`:`<button class="btn" data-a="new" style="margin-bottom:16px">＋ NEW MISSION</button>`}
${pe.length?`<div class="p"><h3>PENDING</h3>${pe.map(mi).join('')}</div>`:''}${dn.length?`<div class="p"><h3>COMPLETED ✓</h3>${dn.map(mi).join('')}</div>`:''}${S.goals.length?'':'<p class="mu" style="text-align:center;padding:30px">No missions yet. Add your first one.</p>'}`},

plan(){
  const totT=S.mods.reduce((a,m)=>a+m.tasks.length,0),dnT=S.mods.reduce((a,m)=>a+m.tasks.filter(t=>t.dn).length,0);
  const ed=pForm&&pForm!=='new'?S.mods.find(x=>x.id===pForm):null;
  return `<div class="hd"><small>${dnT}/${totT} TASKS · CUSTOM ROADMAP</small><h1>ROADMAP</h1></div>
  <div class="bar" style="margin-bottom:16px"><i style="width:${totT?dnT/totT*100:0}%"></i></div>
  ${pForm?`<div class="p"><h3>${ed?'EDIT MODULE':'NEW MODULE'}</h3>
    <div style="display:grid;grid-template-columns:1fr 70px;gap:8px;margin-bottom:8px">
      <input id="mwk" maxlength="30" placeholder="Timeline (e.g. Week 1–2)" value="${ed?esc(ed.wk):''}">
      <input id="mico" maxlength="4" placeholder="Icon" style="text-align:center" value="${ed?esc(ed.ico):'🚀'}">
    </div>
    <input id="mtit" maxlength="50" placeholder="Module Title (e.g. Python Basics)" value="${ed?esc(ed.title):''}" style="margin-bottom:10px">
    <div class="chips" style="margin-bottom:12px">${COLS.map(c=>`<button class="chip${pCol===c?' on':''}" data-a="pcol" data-v="${c}" style="--c:${c};color:${c};border-color:${pCol===c?c:'transparent'}">●</button>`).join('')}</div>
    <div class="g2" style="margin:0"><button class="btn" data-a="msave">${ed?'SAVE':'CREATE'}</button><button class="btn ghost" data-a="mcancel">CANCEL</button></div>
  </div>`:`<button class="btn" data-a="mnew" style="margin-bottom:16px">＋ NEW MODULE</button>`}
  ${S.mods.length?S.mods.map((m,i)=>{
    const n=m.tasks.filter(t=>t.dn).length,tot=m.tasks.length,pc=tot?n/tot*100:0,isOpen=open===m.id;
    return `<div class="p mod${isOpen?' open':''}" style="--c:${m.col}">
      <button data-a="mod" data-id="${m.id}">
        <span style="font-size:24px">${esc(m.ico||'📘')}</span>
        <div style="flex:1"><small style="color:${m.col};font:700 11px Orbitron;letter-spacing:1px">${esc(m.wk)}</small><p style="font-weight:700;font-size:17px">${esc(m.title)}</p></div>
        <span class="mu" style="font:12px 'Share Tech Mono'">${n}/${tot}</span><span class="ar">›</span>
      </button>
      <div class="bar"><i style="width:${pc}%;background:${m.col};box-shadow:0 0 8px${m.col}"></i></div>
      ${isOpen?`<div class="tasks">
        <div style="display:flex;gap:6px;margin:10px 0;justify-content:flex-end">
          ${i>0?`<button class="btn ghost" style="padding:4px 10px;width:auto;font-size:12px" data-a="mmv" data-id="${m.id}" data-v="-1" title="Move Up">↑</button>`:''}
          ${i<S.mods.length-1?`<button class="btn ghost" style="padding:4px 10px;width:auto;font-size:12px" data-a="mmv" data-id="${m.id}" data-v="1" title="Move Down">↓</button>`:''}
          <button class="btn ghost" style="padding:4px 10px;width:auto;font-size:12px" data-a="medit" data-id="${m.id}">✎ EDIT</button>
          <button class="btn ghost" style="padding:4px 10px;width:auto;font-size:12px;color:var(--c2)" data-a="mdel" data-id="${m.id}">✕ DELETE</button>
        </div>
        ${m.tasks.length?m.tasks.map(t=>`<div class="mi${t.dn?' dn':''}" style="align-items:center">
          <button class="ck" data-a="pt" data-id="${m.id}" data-v="${t.id}">${t.dn?'✓':''}</button>
          <div style="flex:1"><p>${esc(t.t)}</p></div>
          <button class="x" data-a="ptdel" data-id="${m.id}" data-v="${t.id}" aria-label="Delete task">✕</button>
        </div>`).join(''):'<p class="mu" style="padding:8px 0">No tasks in this module yet.</p>'}
        <div style="display:flex;gap:8px;margin-top:10px">
          <input id="nt-${m.id}" data-mid="${m.id}" maxlength="80" placeholder="Add a new topic or task..." style="flex:1;margin:0">
          <button class="btn" style="width:auto;padding:0 16px" data-a="ptadd" data-id="${m.id}">＋</button>
        </div>
      </div>`:''}
    </div>`}).join(''):'<p class="mu" style="text-align:center;padding:30px">No roadmap modules yet. Create your first module above!</p>'}
  <div class="p"><h3>FREE RESOURCES</h3>${RES.map(r=>`<div class="pl"><span>${r[2]}</span><div><p>${r[0]}</p><span class="mu" style="font-size:12px">${r[1]}</span></div></div>`).join('')}</div>
  <button class="btn ghost" data-a="mreset" style="margin-top:8px">↺ RESTORE DEFAULT ROADMAP</button>`},

stats(){const sub={};S.sessions.forEach(s=>sub[s.subject]=(sub[s.subject]||0)+s.sec);const mx=Math.max(...Object.values(sub),1);
const wk=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return{l:'SMTWTFS'[d.getDay()],m:Math.round(logged(dk(d))/60),t:i===6}}),wm=Math.max(...wk.map(w=>w.m),1);
return `<div class="hd"><small>PERFORMANCE DATA</small><h1>TELEMETRY</h1></div>
<div class="g2">${[['TOTAL TIME',fmt(logged()),'var(--c1)'],['STREAK / BEST',streak()+' / '+best()+'d','#ffb020'],['SESSIONS',S.sessions.length,'var(--c3)'],['MISSIONS',S.goals.filter(g=>g.done).length+'/'+S.goals.length,'var(--c2)']].map(a=>`<div class="p st" style="--k:${a[2]}"><b style="font-size:19px">${a[1]}</b><small>${a[0]}</small></div>`).join('')}</div>
<div class="p"><h3>LAST 7 DAYS · MIN</h3><div class="ch">${wk.map(w=>`<div class="${w.t?'t':''}"><span>${w.m||''}</span><i style="height:${w.m/wm*80}\%"></i><span>${w.l}</span></div>`).join('')}</div></div>
<div class="p"><h3>CONSISTENCY MAP · 5 WEEKS</h3><div class="hl">${[...'SMTWTFS'].map(c=>`<span>${c}</span>`).join('')}</div>${heat()}<p class="mu" style="font-size:12px;margin-top:8px">Brightest = daily target hit</p></div>
<div class="p"><h3>SUBJECT BREAKDOWN</h3>${Object.keys(sub).length?Object.entries(sub).map(([k,v])=>`<div class="sb" style="--c:${SUBJ[k]||SUBJ.Other}"><div class="row" style="color:var(--tx)"><span>${esc(k)}</span><span style="color:var(--c)">${fmt(v)}</span></div><div class="bar"><i style="width:${v/mx*100}%"></i></div></div>`).join(''):'<p class="mu">Complete a focus session to see your breakdown.</p>'}</div>
<div class="p" style="text-align:center"><p style="font-size:26px">🚀</p><p style="font-weight:700">Keep going, future developer!</p><p class="mu" style="font-size:12px;letter-spacing:1px">CLASS 10 → IIT/NIT → DREAM JOB</p></div>
<div class="g2"><button class="btn ghost" data-a="exp">COPY BACKUP</button><button class="btn ghost" data-a="imp">RESTORE</button></div><button class="btn ghost" data-a="wipe" style="${wipe?'color:var(--c2);border-color:var(--c2)':''}">${wipe?'TAP AGAIN TO WIPE ALL DATA':'RESET ALL DATA'}</button>`}};

const NAV=[['home','⌂','HOME'],['timer','◔','FOCUS'],['goals','◎','MISSIONS'],['plan','⌬','ROADMAP'],['stats','▥','TELEMETRY']];
function render(){$('#app').innerHTML='<div class="view">'+V[tab]()+'</div>';
 $('#nav').innerHTML=NAV.m
