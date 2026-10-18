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
