const $=s=>document.querySelector(s),p2=n=>String(n).padStart(2,'0'),fmt=s=>p2(s/3600|0)+':'+p2(s%3600/60|0)+':'+p2(s%60);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dk=d=>d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
const lnk=u=>{u=String(u).trim();return /^https?:\/\//i.test(u)?u:'https://'+u};
const DS={Chemistry:'#00ff9d',Biology:'#9dff00',SST:'#ffb020',Hindi:'#ff4d8d',Maths:'#00d9ff',Physics:'#b66dff',English:'#ff7a45',Other:'#8aa0b8'};
const QUOTES=[[`The expert in anything was once a beginner.`,`Helen Hayes`],[`Learning never exhausts the mind.`,`Leonardo da Vinci`],[`An investment in knowledge pays the best interest.`,`Benjamin Franklin`],[`Success is the sum of small efforts repeated day in and day out.`,`Robert Collier`],[`It does not matter how slowly you go as long as you do not stop.`,`Confucius`],[`We are what we repeatedly do. Excellence, then, is not an act, but a habit.`,`Will Durant`],[`Well begun is half done.`,`Aristotle`],[`Genius is one percent inspiration and ninety-nine percent perspiration.`,`Thomas Edison`],[`The only way to do great work is to love what you do.`,`Steve Jobs`],[`Education is the most powerful weapon which you can use to change the world.`,`Nelson Mandela`],[`I have no special talent. I am only passionately curious.`,`Albert Einstein`],[`The more that you read, the more things you will know.`,`Dr. Seuss`],[`Do what you can, with what you have, where you are.`,`Theodore Roosevelt`],[`Fall seven times, stand up eight.`,`Japanese proverb`],[`A journey of a thousand miles begins with a single step.`,`Lao Tzu`],[`Discipline is the bridge between goals and accomplishment.`,`Jim Rohn`],[`What you do every day matters more than what you do once in a while.`,`Gretchen Rubin`],[`Small deeds done are better than great deeds planned.`,`Peter Marshall`],[`You don’t have to be great to start, but you have to start to be great.`,`Zig Ziglar`],[`The beautiful thing about learning is that no one can take it away from you.`,`B.B. King`],[`Believe you can and you’re halfway there.`,`Theodore Roosevelt`],[`Knowing is not enough; we must apply.`,`Goethe`],[`Nothing in life is to be feared, it is only to be understood.`,`Marie Curie`],[`Energy and persistence conquer all things.`,`Benjamin Franklin`],[`Dream big. Start small. Act now.`,`Robin Sharma`],[`Focus on being productive instead of busy.`,`Tim Ferriss`],[`Live as if you were to die tomorrow. Learn as if you were to live forever.`,`Mahatma Gandhi`],[`Intelligence plus character — that is the goal of true education.`,`Martin Luther King Jr.`]];
const RANKS=['CADET','PILOT','NAVIGATOR','COMMANDER','ADMIRAL'];
const KEY='forge_study_v3';

/* ── DEFAULT DATA (everything here is editable in the app) ── */
function def(){let n=1;
 const T=a=>a.map(t=>({id:n++,t,done:false})),M=(week,title,subj,icon,tasks)=>({id:n++,week,title,subj,icon,tasks:T(tasks)}),R=(icon,name,url)=>({id:n++,icon,name,url});
 const plan=[M('Week 1–2','Chemistry Basics','Chemistry','🧪',['Chemical Reactions & Equations','Acids, Bases & Salts','Metals & Non-metals','Carbon & its Compounds']),M('Week 3–4','Biology Core','Biology','🧬',['Life Processes','Control & Coordination','How do Organisms Reproduce?','Heredity & Evolution']),M('Week 5–6','Social Science','SST','🌍',['History: Nationalism','Geography: Resources','Civics: Democracy','Economics: Development']),M('Week 7–8','Hindi','Hindi','📝',['Vyakaran (Grammar)','Gadya Khand','Kavya Khand','Patra & Nibandh'])];
 const res=[R('📚','NCERT Books','ncert.nic.in'),R('🎓','DIKSHA','diksha.gov.in'),R('🧠','Khan Academy','khanacademy.org'),R('🏫','UP Board','upmsp.edu.in')];
 const goals=[{id:n++,text:'Revise Chemical Reactions & Equations',done:false,subject:'Chemistry'},{id:n++,text:'Read Life Processes chapter',done:false,subject:'Biology'}];
 return{v:3,nid:n,subj:{...DS},goals,sessions:[],plan,res,daily:60,timer:{subject:'Chemistry',target:25,base:0,start:null,brk:0}}}
function norm(j){const d=def();j.subj=j.subj||d.subj;j.subj.Other=j.subj.Other||DS.Other;j.goals=j.goals||[];j.sessions=j.sessions||[];j.plan=Array.isArray(j.plan)?j.plan:d.plan;j.res=j.res||d.res;j.daily=j.daily||60;j.timer=j.timer||d.timer;j.timer.brk=j.timer.brk||0;if(!j.subj[j.timer.subject])j.timer.subject='Other';return j}
function load(){try{const j=JSON.parse(localStorage.getItem(KEY));if(j&&j.v===3)return norm(j);
 // one-time migration from v2: keep time logs, streak, daily target and valid missions; old Python/AI/ML data is dropped or moved to "Other"
 const o=JSON.parse(localStorage.getItem('forge_study_v2'));
 if(o&&o.v===2){const n=def(),ok=k=>n.subj[k]?k:'Other';n.nid+=(o.nid||0);
  n.sessions=(o.sessions||[]).map(s=>({...s,subject:ok(s.subject)}));n.daily=o.daily||60;
  n.goals=n.goals.concat((o.goals||[]).filter(g=>n.subj[g.subject]).map(g=>({...g,id:n.nid++})));
  n.timer={...o.timer,brk:o.timer.brk||0,subject:ok(o.timer.subject)};return n}}catch(e){}return def()}
let S=load(),tab='home',open=null,adding=false,wipe=false,ed=false;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const col=k=>S.subj[k]||S.subj.Other;
const dayN=()=>{const n=new Date();return Math.floor((Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())-Date.UTC(n.getFullYear(),0,0))/864e5)};
const quote=()=>QUOTES[dayN()%QUOTES.length];

/* ── CORE LOGIC ── */
// Elapsed time comes from timestamps, not from counting interval ticks, so it stays exact when the tab sleeps.
const el=()=>{const T=S.timer;return Math.floor(T.base+(T.start?(Date.now()-T.start)/1000:0))};
const tgt=()=>(S.timer.brk||S.timer.target)*60;
const logged=(day)=>S.sessions.filter(s=>!day||s.day===day).reduce((a,s)=>a+s.sec,0);
function streak(){const d=new Set(S.sessions.map(s=>s.day)),x=new Date();let n=0;if(!d.has(dk(x)))x.setDate(x.getDate()-1);while(d.has(dk(x))){n++;x.setDate(x.getDate()-1)}return n}
const xp=()=>Math.floor(logged()/60)+S.goals.filter(g=>g.done).length*15;
let AC;
let WL;async function wl(on){try{if(on&&navigator.wakeLock)WL=await navigator.wakeLock.request('screen');else if(WL){await WL.release();WL=null}}catch(e){}}
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
 $('#clk').textContent=p2(new Date().getHours())+':'+p2(new Date().getMinutes())}

/* ── VIEWS ── */
const mi=g=>`<div class="mi${g.done?' dn':''}"><button class="ck" data-a="tg" data-id="${g.id}" aria-label="Toggle">${g.done?'✓':''}</button><div><p>${esc(g.text)}</p><span class="tag" style="--c:${col(g.subject)}">${esc(g.subject)}</span></div><button class="x" data-a="del" data-id="${g.id}" aria-label="Delete">✕</button></div>`;
function best(){const ds=[...new Set(S.sessions.map(s=>s.day))].sort();let b=0,c=0,p=null;for(const d of ds){const t=new Date(d+'T00:00:00');c=p&&Math.round((t-p)/864e5)===1?c+1:1;p=t;b=Math.max(b,c)}return b}
function heat(){const t=new Date(),s=new Date(t),gm=S.daily*60;s.setDate(t.getDate()-t.getDay()-28);let h='';for(let i=0;i<35;i++){const d=new Date(s);d.setDate(s.getDate()+i);const k=dk(d),v=logged(k),l=k>dk(t)?0:v>=gm?3:v>=gm/2?2:v>0?1:0;h+=`<i class="h${l}${k===dk(t)?' td':''}" title="${k}"></i>`}return `<div class="hm">${h}</div>`}
const V={
home(){const Q=quote(),tm=logged(dk(new Date())),gm=S.daily*60,pc=Math.min(tm/gm,1),h=new Date().getHours(),lv=Math.floor(xp()/100)+1,x=xp()%100,dn=S.goals.filter(g=>g.done).length;
return `<div class="hd"><small>${h<12?'GOOD MORNING':h<17?'GOOD AFTERNOON':'GOOD EVENING'}, PILOT</small><h1>COMMAND<br>CENTER</h1><p class="mu">UP Board Class 10 · Board Exam Prep</p></div>
<div class="p q"><h3 style="color:var(--c2)">TRANSMISSION OF THE DAY</h3><p>“${esc(Q[0])}”</p><b>— ${esc(Q[1])}</b></div>
<div class="p dg"><svg viewBox="0 0 100 100" style="color:${pc>=1?'var(--c3)':'var(--c1)'}"><circle class="tr2" cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="42" transform="rotate(-90 50 50)" stroke="currentColor" stroke-dasharray="264" stroke-dashoffset="${264*(1-pc)}"/></svg><div><h3>DAILY TARGET</h3><b>${tm/60|0}/${S.daily} MIN</b><p class="mu">${pc>=1?'Target hit. Streak secured ✓':'Study '+Math.ceil((gm-tm)/60)+' more min to secure today'}</p></div><div class="adj"><button data-a="dg" data-v="15" aria-label="More">＋</button><button data-a="dg" data-v="-15" aria-label="Less">－</button></div></div>
<div class="g3"><div class="p st" style="--k:var(--c3)"><b>${fmt(logged(dk(new Date())))}</b><small>TODAY</small></div><div class="p st" style="--k:#ffb020"><b>${streak()}d</b><small>STREAK</small></div><div class="p st" style="--k:var(--c2)"><b>${dn}/${S.goals.length}</b><small>MISSIONS</small></div></div>
<div class="p"><div class="row"><span>LVL ${lv} · ${RANKS[Math.min((lv-1)/3|0,4)]}</span><span>${x}/100 XP</span></div><div class="bar"><i style="width:${x}%"></i></div></div>
<div class="p"><h3>ACTIVE MISSIONS</h3>${S.goals.length?S.goals.slice(0,3).map(mi).join(''):'<p class="mu">No missions yet. Open the Missions tab.</p>'}${S.goals.length>3?`<p class="mu" style="margin-top:8px">+${S.goals.length-3} more in Missions →</p>`:''}</div>
<button class="btn" data-a="tab" data-v="timer">ENGAGE FOCUS CORE ▶</button>`},
timer(){const T=S.timer,C=2*Math.PI*96,c=T.brk?'#b66dff':col(T.subject),e=el(),lk=e>0||T.start||T.brk;
return `<div class="hd"><small>FOCUS CORE</small><h1>DEEP WORK</h1></div>
<div class="chips">${Object.keys(S.subj).map(k=>`<button class="chip${k===T.subject?' on':''}" data-a="subj" data-v="${esc(k)}" style="--c:${col(k)}">${esc(k)}</button>`).join('')}</div>
<div class="ring"><svg viewBox="0 0 240 240"><circle class="tk${T.start?' spin':''}" cx="120" cy="120" r="112"/><circle class="tr" cx="120" cy="120" r="96"/><circle class="in" cx="120" cy="120" r="80"/><circle id="pg" cx="120" cy="120" r="96" transform="rotate(-90 120 120)" stroke="${c}" style="color:${c}" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg><div class="ct"><b id="tm" style="font-weight:400">--:--</b><span id="st"></span><em id="sb"></em></div></div>
<div class="pre" style="${lk?'opacity:.45':''}">${[15,25,45,60].map(m=>`<button class="${T.target===m?'on':''}" data-a="pre" data-v="${m}">${m}m</button>`).join('')}<input id="cu" type="number" min="1" max="180" value="${T.target}"><span class="mu">min</span></div>
<div class="ctl"><button class="rb" data-a="reset" aria-label="Discard">↺</button><button class="go${T.start?' on':''}" data-a="go" aria-label="Start or pause">${T.start?'❚❚':'▶'}</button><button class="rb" data-a="fin" aria-label="Finish and log">✓</button></div>
${S.sessions.length?`<div class="p"><h3>RECENT LOGS</h3>${S.sessions.slice(-4).reverse().map(s=>`<div class="row" style="color:var(--tx)"><span style="color:${col(s.subject)}">● ${esc(s.subject)}</span><span>${fmt(s.sec)}</span><span class="mu">${s.day.slice(5)}</span></div>`).join('')}</div>`:''}`},
goals(){const pe=S.goals.filter(g=>!g.done),dn=S.goals.filter(g=>g.done);
return `<div class="hd"><small>${dn.length}/${S.goals.length} COMPLETE</small><h1>MISSIONS</h1></div>
<div class="bar" style="margin-bottom:16px"><i style="width:${S.goals.length?dn.length/S.goals.length*100:0}%"></i></div>
${adding?`<div class="p"><h3>NEW MISSION</h3><input id="ng" maxlength="80" placeholder="What do you want to achieve?"><select id="ns">${Object.keys(S.subj).map(k=>`<option>${esc(k)}</option>`).join('')}</select><div class="g2" style="margin:0"><button class="btn" data-a="add">ADD</button><button class="btn ghost" data-a="cancel">CANCEL</button></div></div>`:`<button class="btn" data-a="new" style="margin-bottom:16px">＋ NEW MISSION</button>`}
${pe.length?`<div class="p"><h3>PENDING</h3>${pe.map(mi).join('')}</div>`:''}${dn.length?`<div class="p"><h3>COMPLETED ✓</h3>${dn.map(mi).join('')}</div>`:''}${S.goals.length?'':'<p class="mu" style="text-align:center;padding:30px">No missions yet. Add your first one.</p>'}`},
plan(){const E=ed,so=k=>Object.keys(S.subj).map(s=>`<option${s===k?' selected':''}>${esc(s)}</option>`).join('');
return `<div class="hd"><small>${E?'EDIT MODE · AUTO-SAVES':'YOUR STUDY PLAN'}</small><h1>ROADMAP</h1></div>`+
(E?`<div class="g2"><button class="btn ghost" data-a="edt">✓ DONE</button><button class="btn" data-a="nm">＋ MODULE</button></div>`:`<button class="btn ghost" data-a="edt" style="margin-bottom:14px">✎ CUSTOMISE ROADMAP</button>`)+
(S.plan.length?'':'<p class="mu" style="text-align:center;padding:20px">No modules yet. Tap Customise, then Module.</p>')+
S.plan.map((m,i)=>{const c=col(m.subj),n=m.tasks.filter(t=>t.done).length,tot=m.tasks.length,o=E||open===m.id,
 bar=`<div class="bar"><i style="width:${tot?n/tot*100:0}%;background:${c};box-shadow:0 0 8px ${c}"></i></div>`;
 if(E)return `<div class="p mod open" style="--c:${c}"><div class="er"><input class="ic" data-f="mi" data-id="${m.id}" value="${esc(m.icon)}" maxlength="4" aria-label="Icon"><input data-f="mw" data-id="${m.id}" value="${esc(m.week)}" placeholder="Week / label"></div><input data-f="mt" data-id="${m.id}" value="${esc(m.title)}" placeholder="Module title"><select data-f="ms" data-id="${m.id}">${so(m.subj)}</select>${bar}<div class="tasks">${m.tasks.map(t=>`<div class="er"><input data-f="tt" data-id="${m.id}" data-t="${t.id}" value="${esc(t.t)}" placeholder="Topic"><button class="x" data-a="dt" data-id="${m.id}" data-t="${t.id}" aria-label="Delete topic">✕</button></div>`).join('')}<button class="btn ghost" data-a="at" data-id="${m.id}">＋ TOPIC</button></div><div class="g3" style="margin:12px 0 0"><button class="btn ghost" data-a="mu" data-id="${m.id}"${i?'':' disabled'}>↑</button><button class="btn ghost" data-a="md" data-id="${m.id}"${i<S.plan.length-1?'':' disabled'}>↓</button><button class="btn ghost" data-a="dm" data-id="${m.id}" style="color:var(--c2)">DELETE</button></div></div>`;
 return `<div class="p mod${o?' open':''}" style="--c:${c}"><button data-a="mod" data-id="${m.id}"><span style="font-size:24px">${esc(m.icon)}</span><div style="flex:1"><small style="color:${c};font:700 11px Orbitron;letter-spacing:1px">${esc(m.week)} · ${esc(m.subj)}</small><p style="font-weight:700;font-size:17px">${esc(m.title)}</p></div><span class="mu" style="font:12px 'Share Tech Mono'">${n}/${tot}</span><span class="ar">›</span></button>${bar}${o?`<div class="tasks">${tot?m.tasks.map(t=>`<button class="pl${t.done?' dn':''}" data-a="pt" data-id="${m.id}" data-t="${t.id}"><span class="ck">${t.done?'✓':''}</span><span>${esc(t.t)}</span></button>`).join(''):'<p class="mu">No topics yet. Tap Customise to add some.</p>'}</div>`:''}</div>`}).join('')+
`<div class="p"><h3>FREE RESOURCES</h3>${E?S.res.map(r=>`<div class="er"><input class="ic" data-f="ri" data-id="${r.id}" value="${esc(r.icon)}" maxlength="4" aria-label="Icon"><input data-f="rn" data-id="${r.id}" value="${esc(r.name)}" placeholder="Name"><button class="x" data-a="dr" data-id="${r.id}" aria-label="Delete">✕</button></div><input data-f="ru" data-id="${r.id}" value="${esc(r.url)}" placeholder="website.com">`).join('')+`<button class="btn ghost" data-a="ar">＋ RESOURCE</button>`:S.res.map(r=>`<a class="pl" href="${esc(lnk(r.url))}" target="_blank" rel="noopener"><span>${esc(r.icon)}</span><div><p>${esc(r.name)}</p><span class="mu" style="font-size:12px">${esc(r.url)}</span></div></a>`).join('')||'<p class="mu">No resources yet.</p>'}</div>`+
(E?`<div class="p"><h3>SUBJECTS &amp; COLOURS</h3>${Object.keys(S.subj).map(k=>`<div class="er"><input type="color" class="cl" data-f="sc" data-k="${esc(k)}" value="${S.subj[k]}" aria-label="Colour"><span style="flex:1;font-weight:700">${esc(k)}</span>${k==='Other'?'':`<button class="x" data-a="ds" data-k="${esc(k)}" aria-label="Delete subject">✕</button>`}</div>`).join('')}<div class="er"><input type="color" class="cl" id="nsc" value="#00d9ff" aria-label="Colour"><input id="nsn" maxlength="14" placeholder="New subject"><button class="x" data-a="as" aria-label="Add subject">＋</button></div></div>`:'')},
stats(){const sub={};S.sessions.forEach(s=>sub[s.subject]=(sub[s.subject]||0)+s.sec);const mx=Math.max(...Object.values(sub),1);
const wk=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return{l:'SMTWTFS'[d.getDay()],m:Math.round(logged(dk(d))/60),t:i===6}}),wm=Math.max(...wk.map(w=>w.m),1);
return `<div class="hd"><small>PERFORMANCE DATA</small><h1>TELEMETRY</h1></div>
<div class="g2">${[['TOTAL TIME',fmt(logged()),'var(--c1)'],['STREAK / BEST',streak()+' / '+best()+'d','#ffb020'],['SESSIONS',S.sessions.length,'var(--c3)'],['MISSIONS',S.goals.filter(g=>g.done).length+'/'+S.goals.length,'var(--c2)']].map(a=>`<div class="p st" style="--k:${a[2]}"><b style="font-size:19px">${a[1]}</b><small>${a[0]}</small></div>`).join('')}</div>
<div class="p"><h3>LAST 7 DAYS · MIN</h3><div class="ch">${wk.map(w=>`<div class="${w.t?'t':''}"><span>${w.m||''}</span><i style="height:${w.m/wm*80}%"></i><span>${w.l}</span></div>`).join('')}</div></div>
<div class="p"><h3>CONSISTENCY MAP · 5 WEEKS</h3><div class="hl">${[...'SMTWTFS'].map(c=>`<span>${c}</span>`).join('')}</div>${heat()}<p class="mu" style="font-size:12px;margin-top:8px">Brightest = daily target hit</p></div>
<div class="p"><h3>SUBJECT BREAKDOWN</h3>${Object.keys(sub).length?Object.entries(sub).map(([k,v])=>`<div class="sb" style="--c:${col(k)}"><div class="row" style="color:var(--tx)"><span>${esc(k)}</span><span style="color:var(--c)">${fmt(v)}</span></div><div class="bar"><i style="width:${v/mx*100}%"></i></div></div>`).join(''):'<p class="mu">Complete a focus session to see your breakdown.</p>'}</div>
<div class="p" style="text-align:center"><p style="font-size:26px">🚀</p><p style="font-weight:700">Keep going, future developer!</p><p class="mu" style="font-size:12px;letter-spacing:1px">CLASS 10 → IIT/NIT → DREAM JOB</p></div>
<div class="g2"><button class="btn ghost" data-a="exp">COPY BACKUP</button><button class="btn ghost" data-a="imp">RESTORE</button></div><button class="btn ghost" data-a="wipe" style="${wipe?'col
