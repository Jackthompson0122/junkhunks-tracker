// ── CONFIG — replace these two lines with your Supabase values ──
const SUPABASE_URL = "YOUR_PROJECT_URL_HERE";
const SUPABASE_KEY = "YOUR_ANON_KEY_HERE";
// ────────────────────────────────────────────────────────────────

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

async function dbGet(key) {
  const { data } = await db.from("junk_hunks").select("value").eq("key", key).single();
  return data ? JSON.parse(data.value) : null;
}
async function dbSet(key, val) {
  await db.from("junk_hunks").upsert({ key, value: JSON.stringify(val), updated_at: new Date().toISOString() });
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_IN_MONTH = (m,y) => new Date(y,m+1,0).getDate();
const today = new Date();
const fmt = n => "$"+Math.abs(n).toLocaleString("en-CA",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtS = n => (n<0?"-":"")+fmt(n);
const fmtN = n => n.toLocaleString("en-CA",{minimumFractionDigits:2,maximumFractionDigits:2});

const EXPENSE_CATS = ["Dump fees","Gas","U-Haul fees","Labor","Vehicle maintenance","Marketing","Insurance","Supplies","Other"];
const REVENUE_CATS = ["Residential haul","Commercial haul","Scrap/metal resale","Appliance removal","Estate cleanout","Other"];

const T = {
  bg:"#0d0f14",bgCard:"#13161f",bgInput:"#0d0f14",
  border:"rgba(255,255,255,0.07)",
  accent:"#4f8ef7",accentDark:"#2563eb",accentGlow:"rgba(79,142,247,0.15)",
  green:"#34d399",greenDim:"rgba(52,211,153,0.1)",
  red:"#f87171",redDim:"rgba(248,113,113,0.1)",
  amber:"#fbbf24",amberDim:"rgba(251,191,36,0.1)",
  purple:"#a78bfa",purpleDim:"rgba(167,139,250,0.1)",
  text:"#f1f5f9",textMuted:"#64748b",textDim:"#334155",
};
const card = {background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:10};
const inp = {fontSize:12,width:"100%",boxSizing:"border-box",padding:"4px 8px",height:30,background:T.bgInput,border:`1px solid ${T.border}`,borderRadius:6,color:T.text,outline:"none",fontFamily:"inherit"};
const sel = {background:T.bgInput,border:`1px solid ${T.border}`,borderRadius:6,color:T.text,fontSize:12,padding:"5px 8px",outline:"none",fontFamily:"inherit"};

const EXPENSE_CATS_BENCH = {
  "Dump fees":{ideal:10,max:18,tip:"Batch loads to one trip/day. Negotiate a monthly rate with your local transfer station."},
  "Gas":{ideal:6,max:10,tip:"Plan jobs by neighbourhood to cut fuel. Multi-stop routing saves 20–30 min/day."},
  "U-Haul fees":{ideal:8,max:15,tip:"Spending over $600/mo on rentals? A used box truck pays off in ~8 months."},
  "Labor":{ideal:20,max:30,tip:"Don't send 2-man crews on small single-item jobs."},
  "Vehicle maintenance":{ideal:3,max:6,tip:"Budget $150–200/mo as a reserve. Reactive repairs cost 3x more."},
  "Marketing":{ideal:5,max:10,tip:"Free channels should drive 60%+ of leads before you touch paid ads."},
  "Insurance":{ideal:3,max:5,tip:"Bundle general liability + commercial auto. Shop annually."},
  "Supplies":{ideal:1,max:3,tip:"Keep a restocking log to avoid emergency buying."},
  "Other":{ideal:2,max:4,tip:"If it recurs 2+ months, give it its own category."},
};

const DAILY_MKT = [
  {channel:"Google Business",action:"Add a fresh before/after photo to your Google Business profile.",why:"Photos drive 35% more clicks on local listings."},
  {channel:"Facebook Marketplace",action:"Post a new 'Junk Removal Available Today' service listing with your city name in the title.",why:"Active listings rank higher — refresh every 3 days."},
  {channel:"Text/SMS",action:"Text 3 past customers: 'Hey [name], need another haul? Same-day available this week.'",why:"SMS open rate is 98%. Old customers are your cheapest lead."},
  {channel:"Kijiji",action:"Renew your Kijiji listing and update the headline to include a seasonal hook.",why:"Refreshed listings jump back to the top of search results."},
  {channel:"Facebook Group",action:"Post in a local neighbourhood group: 'Anyone know someone moving or renovating? We do same-day junk hauls — free quote.'",why:"Hyper-local groups produce high-intent referrals."},
  {channel:"Google Review",action:"Text your last 2 completed jobs and ask for a Google review. Give them the direct link.",why:"Every new 5-star review lifts your Maps ranking."},
  {channel:"Instagram",action:"Post a before/after Reel of today's or yesterday's job. Use 3 local hashtags.",why:"Reels get 3x more reach than static posts."},
  {channel:"Nextdoor",action:"Create or update your business listing on Nextdoor. Add a promo for first-time neighbours.",why:"Nextdoor leads are geographically clustered — one job can produce 3 neighbours."},
  {channel:"Scrap/Resale",action:"List any metal, appliances, or reusable items from recent hauls on Facebook Marketplace.",why:"Scrap income directly offsets dump fees."},
  {channel:"Facebook Marketplace",action:"Message everyone who liked or commented on your last listing. Offer a free quote.",why:"Warm leads who already engaged are 4x more likely to book."},
  {channel:"TikTok/Reel",action:"Film a 30-sec satisfying load-up or dump run video. No editing needed — raw performs well.",why:"Organic reach on short video is still free and high for trades."},
  {channel:"Referral",action:"Text a local realtor, property manager, or renovation contractor about a referral partnership.",why:"B2B referrals produce recurring high-value jobs."},
  {channel:"Google Business",action:"Answer the 'Questions & Answers' section on your Google Business profile. Add 3 FAQs yourself.",why:"FAQs appear directly in search results and build trust."},
  {channel:"Text blast",action:"Send a broadcast to all past customers: 'Booking junk pickups this week — reply to grab a spot.'",why:"Past customers convert at 5x the rate of cold leads."},
  {channel:"Facebook Group",action:"Find a 'Moving / For Sale' group in your city. Post your services with a photo of your truck.",why:"Moving groups have high-intent people who need hauls now."},
  {channel:"Kijiji",action:"Create a second Kijiji listing targeting a different job type (e.g. 'Appliance Removal').",why:"Separate listings for each service type multiply your search visibility."},
  {channel:"Instagram Story",action:"Post a poll in your Stories: 'Most common thing we haul — old sofas or fridges?'",why:"Polls boost engagement and signal your account to new local users."},
  {channel:"Google Business",action:"Post a 'What's New' update on Google Business with a current promo or job highlight.",why:"Weekly posts keep your profile active and ranking higher."},
  {channel:"Partnership",action:"Introduce yourself to a local moving company, storage facility, or thrift store.",why:"One relationship can mean 5+ jobs/month for free."},
  {channel:"Facebook Marketplace",action:"Post a free or cheap item salvaged from a recent haul. Mention your haul service in the description.",why:"Free item posts get massive views — your service gets exposure as a bonus."},
  {channel:"Google Review",action:"Reply to every existing Google review — positive or negative. One sentence is enough.",why:"Responding to reviews improves your local SEO score."},
  {channel:"TikTok/Reel",action:"Make a '3 signs your garage needs a cleanout' tip video. Speak directly to camera — 20 seconds.",why:"Educational content gets saved and shared, extending its lifespan."},
  {channel:"SMS Promo",action:"Run a flash deal today only: '$20 off any full-load haul booked before 6pm.'",why:"Same-day urgency converts browsers into bookers."},
  {channel:"Nextdoor",action:"Ask a recent Nextdoor-area customer to recommend your business in their neighbourhood feed.",why:"Peer recommendations on Nextdoor carry more trust than ads."},
  {channel:"Facebook Group",action:"Post an educational tip: 'What we CAN'T haul — and what we can.' Include a photo.",why:"Helpful posts build authority and get you tagged when people need a haul."},
  {channel:"Instagram",action:"Post a carousel: 'Before / During / After' from one job. Three photos, no caption needed.",why:"Carousels have the highest save rate of any post format."},
  {channel:"Referral",action:"Text 2 neighbours or friends in trades: 'Send me junk leads — I'll send you renovation leads.'",why:"Trade referral networks are free and compounding."},
  {channel:"Google Business",action:"Upload 3 new job photos to Google Business. Label them with your city and service type.",why:"Businesses with 10+ photos get 35% more website clicks."},
  {channel:"Kijiji",action:"Lower your Kijiji listing price by $5, then raise it back tomorrow to refresh your position.",why:"Price edits trigger a sort re-rank on Kijiji."},
  {channel:"Scrap/Resale",action:"Research local scrap metal prices today and take in any metal from recent hauls.",why:"Scrap income can add $50–200/mo with no extra jobs booked."},
];

const PLATFORMS = [
  {name:"Google Business",desc:"Keep photos fresh. Reply to every review. Post weekly updates.",priority:"Core"},
  {name:"Facebook Marketplace",desc:"Post your service listing and renew every 3 days.",priority:"Core"},
  {name:"Facebook Groups",desc:"Join local neighbourhood, moving, and home improvement groups.",priority:"Core"},
  {name:"Kijiji",desc:"Multiple listings per service type. Refresh weekly.",priority:"High"},
  {name:"Nextdoor",desc:"One review here can produce 3+ jobs from the same street.",priority:"High"},
  {name:"Instagram / TikTok",desc:"Before/after content. Short video. No production needed.",priority:"Growth"},
];

const defaultLtvRow = () => ({newCustomers:"",repeatCustomers:"",totalJobs:"",marketingSpend:"",referralSpend:"",otherAcqSpend:"",avgJobValue:"",avgJobsPerCustomer:"",churnRate:""});

const Icon = ({name,size=14,color="currentColor"}) => {
  const icons = {
    truck: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    bar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    target: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    trend: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    megaphone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    save: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    warn: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    repeat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
    dollar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  };
  return icons[name] || null;
};

const TABS=[["calendar","Calendar",<Icon name="calendar" size={12}/>],["breakdown","Breakdown",<Icon name="bar" size={12}/>],["advisor","Advisor",<Icon name="target" size={12}/>],["ltvcac","LTV:CAC",<Icon name="trend" size={12}/>],["marketing","Marketing",<Icon name="megaphone" size={12}/>]];
const channelColor = ch => ({"Google Business":T.green,"Facebook Marketplace":"#60a5fa","Facebook Group":"#3b82f6","Kijiji":T.amber,"Nextdoor":"#34d399","Instagram":"#f472b6","TikTok/Reel":"#a78bfa","Instagram Story":"#f472b6","Google Review":T.green,"Scrap/Resale":T.amber,"Referral":"#fb923c","SMS Promo":T.red,"Text blast":"#fb923c","Partnership":"#a78bfa","Text/SMS":"#fb923c"}[ch]||T.textMuted);

const { useState, useMemo, useEffect, useCallback } = React;

function App() {
  const [month,setMonth]=useState(today.getMonth());
  const [year,setYear]=useState(today.getFullYear());
  const [tab,setTab]=useState("calendar");
  const [entries,setEntries]=useState({});
  const [addingDay,setAddingDay]=useState(null);
  const [addType,setAddType]=useState("revenue");
  const [addCat,setAddCat]=useState(REVENUE_CATS[0]);
  const [addAmt,setAddAmt]=useState("");
  const [addNote,setAddNote]=useState("");
  const [ltvData,setLtvData]=useState({});
  const [ltvYear,setLtvYear]=useState(today.getFullYear());
  const [mktMonth,setMktMonth]=useState(today.getMonth());
  const [mktYear,setMktYear]=useState(today.getFullYear());
  const [checkedDaily,setCheckedDaily]=useState({});
  const [customNotes,setCustomNotes]=useState({});
  const [mktDay,setMktDay]=useState(null);
  const [loaded,setLoaded]=useState(false);
  const [saving,setSaving]=useState(false);
  const [advAvgJob,setAdvAvgJob]=useState("275");
  const [advTargetMargin,setAdvTargetMargin]=useState("40");
  const [advWorkDays,setAdvWorkDays]=useState("22");
  const [advFixedExp,setAdvFixedExp]=useState("800");
  const [advVarPct,setAdvVarPct]=useState("35");

  useEffect(()=>{
    (async()=>{
      try {
        const [e,l,cd,cn] = await Promise.all([
          dbGet("entries"), dbGet("ltvData"), dbGet("checkedDaily"), dbGet("customNotes")
        ]);
        if(e) setEntries(e);
        if(l) setLtvData(l);
        if(cd) setCheckedDaily(cd);
        if(cn) setCustomNotes(cn);
        const prefs = JSON.parse(localStorage.getItem("jh_prefs")||"{}");
        if(prefs.month!=null) setMonth(prefs.month);
        if(prefs.year!=null) setYear(prefs.year);
        if(prefs.tab) setTab(prefs.tab);
        const adv = JSON.parse(localStorage.getItem("jh_adv")||"{}");
        if(adv.avgJob) setAdvAvgJob(adv.avgJob);
        if(adv.tm) setAdvTargetMargin(adv.tm);
        if(adv.wd) setAdvWorkDays(adv.wd);
        if(adv.fe) setAdvFixedExp(adv.fe);
        if(adv.vp) setAdvVarPct(adv.vp);
      } catch(err){ console.error(err); }
      setLoaded(true);
    })();
  },[]);

  const save = useCallback(async(key,val,local=false)=>{
    setSaving(true);
    if(local) localStorage.setItem(key,JSON.stringify(val));
    else await dbSet(key,val);
    setTimeout(()=>setSaving(false),500);
  },[]);

  const updEntries=v=>{setEntries(v);save("entries",v);};
  const updLtvData=v=>{setLtvData(v);save("ltvData",v);};
  const updCheckedDaily=v=>{setCheckedDaily(v);save("checkedDaily",v);};
  const updCustomNotes=v=>{setCustomNotes(v);save("customNotes",v);};
  const updPrefs=(t,m,y)=>{save("jh_prefs",{tab:t,month:m,year:y},true);};
  const updAdv=o=>save("jh_adv",o,true);
  const switchTab=t=>{setTab(t);updPrefs(t,month,year);};

  const eKey=d=>`${year}-${month}-${d}`;
  const days=DAYS_IN_MONTH(month,year);
  const firstDow=new Date(year,month,1).getDay();
  const dayData=d=>entries[eKey(d)]||[];

  const ltvKey=(m,y)=>`${y}-${m}`;
  const getLtvRow=(m,y)=>ltvData[ltvKey(m,y)]||defaultLtvRow();
  const setLtvRow=(m,y,f,v)=>{const k=ltvKey(m,y);updLtvData({...ltvData,[k]:{...(ltvData[k]||defaultLtvRow()),[f]:v}});};

  const addEntry=d=>{
    if(!addAmt||isNaN(parseFloat(addAmt)))return;
    const k=eKey(d);updEntries({...entries,[k]:[...(entries[k]||[]),{type:addType,cat:addCat,amt:parseFloat(addAmt),note:addNote}]});
    setAddAmt("");setAddNote("");setAddingDay(null);
  };
  const removeEntry=(d,i)=>{const k=eKey(d);const p=[...(entries[k]||[])];p.splice(i,1);updEntries({...entries,[k]:p});};

  const monthStats=useMemo(()=>{
    let totalRev=0,totalExp=0,jobCount=0;const expByCat={},revByCat={};
    for(let d=1;d<=days;d++){
      const de=entries[eKey(d)]||[];
      if(de.some(e=>e.type==="revenue"))jobCount++;
      de.forEach(e=>{
        if(e.type==="revenue"){totalRev+=e.amt;revByCat[e.cat]=(revByCat[e.cat]||0)+e.amt;}
        else{totalExp+=e.amt;expByCat[e.cat]=(expByCat[e.cat]||0)+e.amt;}
      });
    }
    return{totalRev,totalExp,profit:totalRev-totalExp,expByCat,revByCat,jobCount};
  },[entries,month,year,days]);

  const margin=monthStats.totalRev>0?((monthStats.profit/monthStats.totalRev)*100).toFixed(1):"0.0";
  const expEntries=Object.entries(monthStats.expByCat).sort((a,b)=>b[1]-a[1]);
  const revEntries=Object.entries(monthStats.revByCat).sort((a,b)=>b[1]-a[1]);

  const advCalc=useMemo(()=>{
    const avgJob=parseFloat(advAvgJob)||275;
    const targetMargin=parseFloat(advTargetMargin)||40;
    const workDays=parseFloat(advWorkDays)||22;
    const fixedExp=parseFloat(advFixedExp)||800;
    const varPct=parseFloat(advVarPct)||35;
    const vr=varPct/100,tmr=targetMargin/100;
    const beRev=fixedExp/(1-vr);
    const beJobs=Math.ceil(beRev/avgJob);
    const tRev=(1-vr-tmr)>0?fixedExp/(1-vr-tmr):null;
    const tJobs=tRev?Math.ceil(tRev/avgJob):null;
    const tProfit=tRev?tRev*tmr:null;
    const varCost=avgJob*vr;
    const contrib=avgJob-varCost;
    const jobsToFixed=Math.ceil(fixedExp/contrib);
    const actualJPD=workDays>0?monthStats.jobCount/workDays:0;
    const neededJPD=tJobs?tJobs/workDays:null;
    const gapJobs=tJobs?Math.max(0,tJobs-monthStats.jobCount):null;
    const gapPD=neededJPD?Math.max(0,neededJPD-actualJPD):null;
    const tiers=[{label:"Survive",margin:10,color:T.red},{label:"Stable",margin:25,color:T.amber},{label:"Healthy",margin:40,color:T.green},{label:"Thriving",margin:55,color:T.purple}];
    const currentTier=tiers.reduce((b,t)=>parseFloat(margin)>=t.margin?t:b,tiers[0]);
    const scenarios=[1,2,3].map(jpd=>({
      jpd,jobs:Math.round(jpd*workDays),rev:Math.round(jpd*workDays*avgJob),
      exp:Math.round(fixedExp+jpd*workDays*avgJob*vr),
      profit:Math.round(jpd*workDays*avgJob*(1-vr)-fixedExp),
      marginPct:Math.round(((jpd*workDays*avgJob*(1-vr)-fixedExp)/(jpd*workDays*avgJob))*100),
    }));
    return{avgJob,targetMargin,workDays,fixedExp,varPct,beRev,beJobs,tRev,tJobs,tProfit,varCost,contrib,jobsToFixed,actualJPD,neededJPD,gapJobs,gapPD,tiers,currentTier,scenarios,currentMarginNum:parseFloat(margin)||0};
  },[advAvgJob,advTargetMargin,advWorkDays,advFixedExp,advVarPct,monthStats,margin]);

  const ltvSummary=useMemo(()=>{
    const rows=MONTHS.map((_,mi)=>{
      const r=getLtvRow(mi,ltvYear);const n=v=>parseFloat(v)||0;
      const totalAcq=n(r.marketingSpend)+n(r.referralSpend)+n(r.otherAcqSpend);
      const newC=n(r.newCustomers);const cac=newC>0?totalAcq/newC:null;
      const avgVal=n(r.avgJobValue);const avgJobs=n(r.avgJobsPerCustomer)||1;
      const churn=n(r.churnRate);const avgLife=churn>0?100/churn:null;
      const ltv=avgVal>0&&avgJobs>0&&avgLife!==null?avgVal*avgJobs*avgLife:null;
      const ratio=ltv!==null&&cac!==null&&cac>0?ltv/cac:null;
      return{cac,ltv,ratio,totalAcq,newC};
    });
    const valid=rows.filter(r=>r.ratio!==null);
    const avgRatio=valid.length>0?valid.reduce((s,r)=>s+r.ratio,0)/valid.length:null;
    const totalNewC=rows.reduce((s,r)=>s+r.newC,0);
    const blendedCac=totalNewC>0?rows.reduce((s,r)=>s+r.totalAcq,0)/totalNewC:null;
    return{rows,avgRatio,blendedCac};
  },[ltvData,ltvYear]);

  const ratioColor=r=>r===null?T.textMuted:r>=3?T.green:r>=1?T.amber:T.red;
  const mktDays=DAYS_IN_MONTH(mktMonth,mktYear);
  const mktFirstDow=new Date(mktYear,mktMonth,1).getDay();
  const mktKey=d=>`mkt-${mktYear}-${mktMonth}-${d}`;
  const taskForDay=d=>DAILY_MKT[(d-1)%DAILY_MKT.length];
  const getDailyDone=d=>!!checkedDaily[`${mktKey(d)}-done`];

  if(!loaded)return React.createElement('div',{style:{background:T.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}},React.createElement('span',{style:{color:T.textMuted,fontSize:14}},"Loading Junk Hunks..."));

  const label=(txt)=>(<div style={{fontSize:10,color:T.textMuted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5,fontWeight:500}}>{txt}</div>);
  const statCard=(title,val,color,glow)=>(<div style={{...card,padding:"10px 12px",boxShadow:`inset 0 0 24px ${glow}`}}>{label(title)}<div style={{fontSize:17,fontWeight:600,color,letterSpacing:"-0.02em"}}>{val}</div></div>);

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:"1.2rem",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",color:T.text,boxSizing:"border-box",maxWidth:900,margin:"0 auto"}}>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.1rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,borderRadius:7,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="truck" size={15} color="#fff"/></div>
          <div>
            <div style={{fontSize:15,fontWeight:600,letterSpacing:"-0.02em"}}>Junk Hunks</div>
            <div style={{fontSize:10,color:T.textMuted,marginTop:1}}>Business Tracker</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {saving&&<span style={{fontSize:10,color:T.textMuted}}>saving...</span>}
          <Icon name="save" size={13} color={saving?T.accent:T.textDim}/>
          <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:T.greenDim,color:T.green,fontWeight:600,letterSpacing:"0.05em",marginLeft:2}}>LIVE</span>
        </div>
      </div>

      <div style={{display:"flex",gap:2,marginBottom:"1.1rem",background:T.bgCard,padding:3,borderRadius:8,border:`1px solid ${T.border}`}}>
        {TABS.map(([t,l,ic])=>(
          <button key={t} onClick={()=>switchTab(t)} style={{flex:1,fontSize:10,padding:"6px 3px",borderRadius:6,border:"none",cursor:"pointer",fontWeight:tab===t?600:400,background:tab===t?T.accent:"transparent",color:tab===t?"#fff":T.textMuted,transition:"all 0.12s",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            {ic}{l}
          </button>
        ))}
      </div>

      <div style={{display:"flex",gap:6,marginBottom:"1rem",flexWrap:"wrap"}}>
        {(tab==="calendar"||tab==="breakdown")&&<>
          <select value={month} onChange={e=>setMonth(+e.target.value)} style={sel}>{MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}</select>
          <select value={year} onChange={e=>setYear(+e.target.value)} style={sel}>{[2024,2025,2026,2027].map(y=><option key={y}>{y}</option>)}</select>
        </>}
        {tab==="ltvcac"&&<select value={ltvYear} onChange={e=>setLtvYear(+e.target.value)} style={sel}>{[2024,2025,2026,2027].map(y=><option key={y}>{y}</option>)}</select>}
        {tab==="marketing"&&<>
          <select value={mktMonth} onChange={e=>{setMktMonth(+e.target.value);setMktDay(null);}} style={sel}>{MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}</select>
          <select value={mktYear} onChange={e=>{setMktYear(+e.target.value);setMktDay(null);}} style={sel}>{[2024,2025,2026,2027].map(y=><option key={y}>{y}</option>)}</select>
        </>}
      </div>

      {(tab==="calendar"||tab==="breakdown")&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:"1rem"}}>
          {statCard("Revenue",fmt(monthStats.totalRev),T.green,T.greenDim)}
          {statCard("Expenses",fmt(monthStats.totalExp),T.red,T.redDim)}
          {statCard("Profit",fmtS(monthStats.profit),monthStats.profit>=0?T.green:T.red,monthStats.profit>=0?T.greenDim:T.redDim)}
          {statCard("Margin",margin+"%",T.accent,T.accentGlow)}
          {statCard("Jobs",monthStats.jobCount,T.purple,T.purpleDim)}
        </div>
      )}

      {tab==="calendar"&&(<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,marginBottom:3}}>
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} style={{fontSize:9,color:T.textDim,textAlign:"center",padding:"2px 0",fontWeight:600}}>{d}</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
          {Array.from({length:firstDow}).map((_,i)=><div key={"e"+i}/>)}
          {Array.from({length:days},(_,i)=>i+1).map(d=>{
            const data=dayData(d);const rev=data.filter(e=>e.type==="revenue").reduce((s,e)=>s+e.amt,0);const exp=data.filter(e=>e.type==="expense").reduce((s,e)=>s+e.amt,0);const profit=rev-exp;const isOpen=addingDay===d;
            return(
              <div key={d} onClick={()=>{setAddingDay(isOpen?null:d);setAddAmt("");setAddNote("");setAddCat(REVENUE_CATS[0]);setAddType("revenue");}} style={{...card,padding:"5px 6px",cursor:"pointer",minHeight:60,borderColor:isOpen?T.accent:T.border}}>
                <div style={{fontSize:9,fontWeight:600,color:isOpen?T.accent:T.textDim,marginBottom:2}}>{d}</div>
                {rev>0&&<div style={{fontSize:8,color:T.green,lineHeight:1.6}}>+{fmt(rev)}</div>}
                {exp>0&&<div style={{fontSize:8,color:T.red,lineHeight:1.6}}>−{fmt(exp)}</div>}
                {data.length>0&&<div style={{fontSize:8,color:profit>=0?T.green:T.red,fontWeight:600,marginTop:2,paddingTop:2,borderTop:`1px solid ${T.border}`}}>{fmtS(profit)}</div>}
              </div>
            );
          })}
        </div>
        {addingDay&&(
          <div style={{...card,marginTop:10,padding:"14px",borderColor:T.accent}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontWeight:600,fontSize:13,color:T.accent}}>{MONTHS[month]} {addingDay}</span>
              <button onClick={()=>setAddingDay(null)} style={{background:"transparent",border:"none",cursor:"pointer",padding:0}}><Icon name="x" size={16} color={T.textMuted}/></button>
            </div>
            {dayData(addingDay).length>0&&(
              <div style={{marginBottom:12}}>
                {dayData(addingDay).map((e,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
                    <span style={{color:e.type==="revenue"?T.green:T.red,fontWeight:500}}>{e.cat}</span>
                    <span style={{color:T.textMuted,flex:1,paddingLeft:8,fontSize:10}}>{e.note}</span>
                    <span style={{fontWeight:600,marginLeft:8,color:e.type==="revenue"?T.green:T.red}}>{e.type==="expense"?"−":""}{fmt(e.amt)}</span>
                    <button onClick={()=>removeEntry(addingDay,i)} style={{background:"transparent",border:"none",cursor:"pointer",marginLeft:6,padding:0}}><Icon name="x" size={12} color={T.textDim}/></button>
                  </div>
                ))}
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              {[["Type",<select value={addType} onChange={e=>{setAddType(e.target.value);setAddCat(e.target.value==="revenue"?REVENUE_CATS[0]:EXPENSE_CATS[0]);}} style={inp}><option value="revenue">Revenue</option><option value="expense">Expense</option></select>],
                ["Category",<select value={addCat} onChange={e=>setAddCat(e.target.value)} style={inp}>{(addType==="revenue"?REVENUE_CATS:EXPENSE_CATS).map(c=><option key={c}>{c}</option>)}</select>],
                ["Amount",<input type="number" placeholder="0.00" value={addAmt} onChange={e=>setAddAmt(e.target.value)} style={inp}/>],
                ["Note",<input type="text" placeholder="optional" value={addNote} onChange={e=>setAddNote(e.target.value)} style={inp}/>],
              ].map(([lbl,el])=>(<div key={lbl}><div style={{fontSize:10,color:T.textMuted,marginBottom:3,textTransform:"uppercase",letterSpacing:"0.06em"}}>{lbl}</div>{el}</div>))}
            </div>
            <button onClick={()=>addEntry(addingDay)} style={{width:"100%",fontSize:12,padding:"8px 0",fontWeight:600,background:T.accent,border:"none",borderRadius:7,color:"#fff",cursor:"pointer"}}>Add Entry</button>
          </div>
        )}
      </>)}

      {tab==="breakdown"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            {[["Revenue",revEntries,monthStats.totalRev,T.green,false],["Expenses",expEntries,monthStats.totalExp,T.red,true]].map(([title,list,total,color,showBench])=>(
              <div key={title}>
                {label(title)}
                {list.length===0&&<div style={{fontSize:11,color:T.textDim}}>Nothing logged yet.</div>}
                {list.map(([cat,amt])=>{
                  const bench=showBench&&EXPENSE_CATS_BENCH[cat];
                  const pct=total>0?(amt/total*100):0;
                  const overMax=bench&&pct>bench.max;
                  const overIdeal=bench&&pct>bench.ideal&&!overMax;
                  return(
                    <div key={cat} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3,alignItems:"center"}}>
                        <span>{cat}</span>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          {overMax&&<span style={{fontSize:9,color:T.red,display:"flex",alignItems:"center",gap:2}}><Icon name="warn" size={9} color={T.red}/>over</span>}
                          {overIdeal&&<span style={{fontSize:9,color:T.amber}}>high</span>}
                          <span style={{fontWeight:600,color}}>{fmt(amt)}</span>
                        </div>
                      </div>
                      <div style={{height:4,background:T.bgInput,borderRadius:2,overflow:"hidden",position:"relative"}}>
                        {bench&&<div style={{position:"absolute",left:bench.ideal+"%",top:0,width:1,height:"100%",background:T.green,opacity:0.4}}/>}
                        {bench&&<div style={{position:"absolute",left:bench.max+"%",top:0,width:1,height:"100%",background:T.red,opacity:0.4}}/>}
                        <div style={{height:"100%",background:overMax?T.red:overIdeal?T.amber:color,width:Math.min(pct,100)+"%",borderRadius:2}}/>
                      </div>
                      <div style={{fontSize:9,color:T.textDim,marginTop:2}}>{pct.toFixed(0)}%{bench?` · ideal ≤${bench.ideal}% max ${bench.max}%`:""}</div>
                      {(overMax||overIdeal)&&bench&&<div style={{fontSize:10,color:overMax?T.red:T.amber,marginTop:4,lineHeight:1.5,padding:"4px 7px",background:overMax?T.redDim:T.amberDim,borderRadius:5}}>{bench.tip}</div>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{...card,overflow:"hidden"}}>
            <div style={{padding:"7px 10px",borderBottom:`1px solid ${T.border}`}}>{label("Daily Summary")}</div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr>{["Day","Revenue","Expenses","Profit"].map(h=><th key={h} style={{padding:"5px 10px",textAlign:"right",fontWeight:500,color:T.textMuted,borderBottom:`1px solid ${T.border}`,fontSize:10}}>{h}</th>)}</tr></thead>
              <tbody>
                {Array.from({length:days},(_,i)=>i+1).filter(d=>dayData(d).length>0).map(d=>{
                  const data=dayData(d);const rev=data.filter(e=>e.type==="revenue").reduce((s,e)=>s+e.amt,0);const exp=data.filter(e=>e.type==="expense").reduce((s,e)=>s+e.amt,0);const p=rev-exp;
                  return(<tr key={d} style={{borderBottom:`1px solid ${T.border}`}}>
                    <td style={{padding:"5px 10px",textAlign:"right",color:T.textMuted}}>{MONTHS[month].slice(0,3)} {d}</td>
                    <td style={{padding:"5px 10px",textAlign:"right",color:T.green}}>{rev>0?fmt(rev):"—"}</td>
                    <td style={{padding:"5px 10px",textAlign:"right",color:T.red}}>{exp>0?fmt(exp):"—"}</td>
                    <td style={{padding:"5px 10px",textAlign:"right",color:p>=0?T.green:T.red,fontWeight:600}}>{fmtS(p)}</td>
                  </tr>);
                })}
                {!Array.from({length:days},(_,i)=>i+1).some(d=>dayData(d).length>0)&&<tr><td colSpan={4} style={{padding:"14px 10px",textAlign:"center",color:T.textDim,fontSize:11}}>No entries this month.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==="advisor"&&(
        <div>
          <div style={{...card,padding:"12px",marginBottom:"1rem"}}>
            {label("Your Numbers")}
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:7}}>
              {[["Avg job ($)",advAvgJob,setAdvAvgJob,"avgJob"],["Target margin %",advTargetMargin,setAdvTargetMargin,"tm"],["Work days/mo",advWorkDays,setAdvWorkDays,"wd"],["Fixed expenses ($)",advFixedExp,setAdvFixedExp,"fe"],["Variable cost %",advVarPct,setAdvVarPct,"vp"]].map(([lbl,val,setter,key])=>(
                <div key={key}>
                  <div style={{fontSize:9,color:T.textMuted,marginBottom:3,letterSpacing:"0.06em",textTransform:"uppercase"}}>{lbl}</div>
                  <input type="number" value={val} onChange={e=>{setter(e.target.value);updAdv({avgJob:advAvgJob,tm:advTargetMargin,wd:advWorkDays,fe:advFixedExp,vp:advVarPct,[key]:e.target.value});}} style={{...inp,fontWeight:600,color:T.accent,fontSize:13}}/>
                </div>
              ))}
            </div>
          </div>
          <div style={{...card,padding:"12px",marginBottom:"1rem"}}>
            {label("Margin Tier")}
            <div style={{display:"flex",gap:4,marginBottom:8}}>
              {advCalc.tiers.map(t=>{const active=advCalc.currentMarginNum>=t.margin;return(
                <div key={t.label} style={{flex:1,padding:"7px 8px",borderRadius:7,background:active?`${t.color}15`:"transparent",border:`1px solid ${active?t.color:T.border}`}}>
                  <div style={{fontSize:12,fontWeight:600,color:active?t.color:T.textDim}}>{t.label}</div>
                  <div style={{fontSize:9,color:active?t.color:T.textDim,opacity:0.7,marginTop:1}}>{t.margin}%+</div>
                </div>
              );})}
            </div>
            <div style={{fontSize:11,color:T.textMuted,lineHeight:1.7,background:T.bgInput,borderRadius:6,padding:"8px 10px"}}>
              At <span style={{color:advCalc.currentTier.color,fontWeight:600}}>{margin}% — {advCalc.currentTier.label}</span>.
              {advCalc.currentMarginNum<40&&<> Need <span style={{color:T.green,fontWeight:600}}>{(40-advCalc.currentMarginNum).toFixed(1)} more pts</span> for Healthy. Cut variable costs to {(advCalc.varPct-5).toFixed(0)}% or raise job price by {fmt((0.05*advCalc.avgJob/(1-advCalc.varPct/100)))}.</>}
              {advCalc.currentMarginNum>=55&&<> Peak zone. Protect cost structure and scale volume.</>}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:"1rem"}}>
            <div style={{...card,padding:"12px",borderColor:`${T.red}30`,background:T.redDim}}>
              {label("Break-even")}
              <div style={{fontSize:26,fontWeight:700,color:T.red,letterSpacing:"-0.03em"}}>{advCalc.beJobs}<span style={{fontSize:12,fontWeight:400,color:T.textMuted,marginLeft:4}}>jobs/mo</span></div>
              <div style={{fontSize:11,color:T.textMuted,marginTop:4,lineHeight:1.6}}>{fmt(advCalc.beRev)} min. <span style={{color:T.red,fontWeight:600}}>{(advCalc.beJobs/advCalc.workDays).toFixed(1)} jobs/day</span> just to cover costs.</div>
            </div>
            <div style={{...card,padding:"12px",borderColor:`${T.green}30`,background:T.greenDim}}>
              {label(`Target — ${advCalc.targetMargin}% margin`)}
              {advCalc.tJobs?<>
                <div style={{fontSize:26,fontWeight:700,color:T.green,letterSpacing:"-0.03em"}}>{advCalc.tJobs}<span style={{fontSize:12,fontWeight:400,color:T.textMuted,marginLeft:4}}>jobs/mo</span></div>
                <div style={{fontSize:11,color:T.textMuted,marginTop:4,lineHeight:1.6}}>{fmt(advCalc.tRev)} → {fmt(advCalc.tProfit)} profit. <span style={{color:T.green,fontWeight:600}}>{advCalc.neededJPD?.toFixed(1)} jobs/day</span>.</div>
              </>:<div style={{fontSize:11,color:T.red}}>Target too high — reduce costs.</div>}
            </div>
          </div>
          {monthStats.jobCount>0&&advCalc.tJobs&&(
            <div style={{...card,padding:"12px",marginBottom:"1rem"}}>
              {label("This Month")}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:10}}>
                {[{l:"Jobs so far",v:monthStats.jobCount,c:T.purple},{l:"Jobs/day",v:advCalc.actualJPD.toFixed(1),c:T.accent},{l:"Still needed",v:Math.max(0,advCalc.tJobs-monthStats.jobCount),c:advCalc.gapJobs>0?T.amber:T.green}].map(c=>(
                  <div key={c.l} style={{background:T.bgInput,borderRadius:7,padding:"8px 10px"}}>
                    <div style={{fontSize:9,color:T.textMuted,marginBottom:2,textTransform:"uppercase",letterSpacing:"0.06em"}}>{c.l}</div>
                    <div style={{fontSize:20,fontWeight:700,color:c.c,letterSpacing:"-0.02em"}}>{c.v}</div>
                  </div>
                ))}
              </div>
              {advCalc.gapJobs>0
                ?<div style={{fontSize:11,color:T.amber,background:T.amberDim,borderRadius:6,padding:"7px 10px",lineHeight:1.7}}>Need <strong>{advCalc.gapJobs} more jobs</strong> — <strong>{advCalc.gapPD?.toFixed(1)} extra/day</strong>. Each job contributes <strong style={{color:T.green}}>{fmt(advCalc.contrib)}</strong> after variable costs.</div>
                :<div style={{fontSize:11,color:T.green,background:T.greenDim,borderRadius:6,padding:"7px 10px"}}>Target hit. Every extra job adds {fmt(advCalc.contrib)} straight to profit.</div>
              }
            </div>
          )}
          <div style={{...card,padding:"12px",marginBottom:"1rem"}}>
            {label("Revenue Scenarios")}
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr>{["Jobs/day","Jobs","Revenue","Expenses","Profit","Margin"].map(h=><th key={h} style={{padding:"5px 8px",textAlign:"right",fontWeight:500,color:T.textMuted,borderBottom:`1px solid ${T.border}`,fontSize:10}}>{h}</th>)}</tr></thead>
              <tbody>
                {advCalc.scenarios.map((s,i)=>{const mc=s.marginPct>=40?T.green:s.marginPct>=25?T.amber:T.red;return(
                  <tr key={i} style={{borderBottom:`1px solid ${T.border}`}}>
                    <td style={{padding:"7px 8px",textAlign:"right",fontWeight:700,color:T.purple}}>{s.jpd}</td>
                    <td style={{padding:"7px 8px",textAlign:"right",color:T.textMuted}}>{s.jobs}</td>
                    <td style={{padding:"7px 8px",textAlign:"right",color:T.green,fontWeight:600}}>{fmt(s.rev)}</td>
                    <td style={{padding:"7px 8px",textAlign:"right",color:T.red}}>{fmt(s.exp)}</td>
                    <td style={{padding:"7px 8px",textAlign:"right",color:s.profit>=0?T.green:T.red,fontWeight:600}}>{fmtS(s.profit)}</td>
                    <td style={{padding:"7px 8px",textAlign:"right",color:mc,fontWeight:600}}>{s.marginPct}%</td>
                  </tr>
                );})}
              </tbody>
            </table>
          </div>
          <div style={{...card,padding:"12px",marginBottom:"1rem"}}>
            {label(`Ideal cost split — per ${fmt(advCalc.avgJob)} job`)}
            {[{cat:"Dump fees",ideal:10,max:18},{cat:"Gas",ideal:6,max:10},{cat:"Labor",ideal:22,max:30},{cat:"U-Haul fees",ideal:8,max:15},{cat:"Marketing",ideal:5,max:10},{cat:"Other",ideal:4,max:7}].map(c=>{
              const actualAmt=monthStats.expByCat[c.cat]&&monthStats.jobCount>0?monthStats.expByCat[c.cat]/monthStats.jobCount:null;
              const actualPct=actualAmt?actualAmt/advCalc.avgJob*100:null;
              const over=actualPct&&actualPct>c.max;
              return(
                <div key={c.cat} style={{display:"grid",gridTemplateColumns:"100px 1fr 100px 50px",gap:8,alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{fontSize:10}}>{c.cat}</div>
                  <div style={{position:"relative",height:4,background:T.bgInput,borderRadius:2}}>
                    <div style={{position:"absolute",height:"100%",width:c.ideal+"%",background:T.green,opacity:0.2,borderRadius:2}}/>
                    <div style={{position:"absolute",left:c.ideal+"%",height:"100%",width:(c.max-c.ideal)+"%",background:T.amber,opacity:0.15}}/>
                    {actualPct&&<div style={{position:"absolute",left:0,height:"100%",width:Math.min(actualPct,100)+"%",background:over?T.red:T.accent,borderRadius:2}}/>}
                  </div>
                  <div style={{fontSize:9,color:T.textMuted,textAlign:"right"}}>{fmt(advCalc.avgJob*c.ideal/100)}–{fmt(advCalc.avgJob*c.max/100)}</div>
                  <div style={{fontSize:9,textAlign:"right",fontWeight:600,color:over?T.red:actualPct?T.green:T.textDim}}>{actualPct?actualPct.toFixed(0)+"%":"—"}</div>
                </div>
              );
            })}
            <div style={{marginTop:8,fontSize:11,color:T.textMuted,lineHeight:1.7,padding:"7px 10px",background:T.bgInput,borderRadius:6}}>
              Variable cost per job: <span style={{color:T.red,fontWeight:600}}>{fmt(advCalc.varCost)}</span> · Contribution: <span style={{color:T.green,fontWeight:600}}>{fmt(advCalc.contrib)}</span> · Fixed costs recover after <span style={{color:T.accent,fontWeight:600}}>{advCalc.jobsToFixed} jobs</span>
            </div>
          </div>
          <div style={{...card,padding:"12px"}}>
            {label("3 Profit Levers")}
            {[
              {icon:<Icon name="dollar" size={14} color={T.green}/>,title:`Raise avg job value by $25`,desc:`Adds ${fmt(25*advCalc.workDays*advCalc.scenarios[1].jpd*(1-advCalc.varPct/100))}/mo at 2 jobs/day. Set a minimum haul fee. Upsell same-day or large-load pricing.`},
              {icon:<Icon name="zap" size={14} color={T.amber}/>,title:"Cut top expense by 20%",desc:`Saves ${fmt(monthStats.totalExp*0.2)} this month. Start with dump fees — batch loads aggressively.`},
              {icon:<Icon name="repeat" size={14} color={T.accent}/>,title:"Convert 1 in 4 to repeat",desc:"Text every job 30 days later. A 25% repeat rate can double your effective LTV with $0 acquisition cost."},
            ].map(l=>(
              <div key={l.title} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                <div style={{width:28,height:28,borderRadius:6,background:T.bgInput,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{l.icon}</div>
                <div><div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{l.title}</div><div style={{fontSize:10,color:T.textMuted,lineHeight:1.6}}>{l.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="ltvcac"&&(
        <div>
          <div style={{...card,padding:"10px 12px",marginBottom:"1rem",fontSize:11,color:T.textMuted,lineHeight:1.7,display:"flex",gap:8,alignItems:"flex-start"}}>
            <Icon name="info" size={13} color={T.textDim}/>
            <span><strong style={{color:T.text}}>New customers</strong> = first-timers. <strong style={{color:T.text}}>Acq. spend</strong> = all money spent getting customers. <strong style={{color:T.text}}>Avg job</strong> = revenue per job. <strong style={{color:T.text}}>Jobs/yr</strong> = how often they rebook. <strong style={{color:T.text}}>Churn %</strong> = % who never rebook (1 in 4 = 25).</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:"1rem"}}>
            {[{l:"Avg LTV:CAC",v:ltvSummary.avgRatio!==null?fmtN(ltvSummary.avgRatio)+"x":"—",c:ltvSummary.avgRatio!==null?ratioColor(ltvSummary.avgRatio):T.textMuted},{l:"Blended CAC",v:ltvSummary.blendedCac!==null?fmt(ltvSummary.blendedCac):"—",c:T.text},{l:"Healthy target",v:"3x+",c:T.green}].map(c=>(
              <div key={c.l} style={{...card,padding:"10px 12px"}}><div style={{fontSize:10,color:T.textMuted,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>{c.l}</div><div style={{fontSize:20,fontWeight:700,color:c.c}}>{c.v}</div></div>
            ))}
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:10,tableLayout:"fixed"}}>
              <colgroup>{[58,48,48,48,62,56,56,56,52,50,56,56,50].map((w,i)=><col key={i} style={{width:w}}/>)}</colgroup>
              <thead>
                <tr style={{background:T.bgCard}}>
                  <th style={{padding:"5px",borderBottom:`1px solid ${T.border}`,textAlign:"left"}}></th>
                  {[["Customers",3,T.textMuted],["Acq. spend",3,T.red],["Behaviour",3,T.textMuted],["Calculated",3,T.green]].map(([l,s,c])=>(
                    <th key={l} colSpan={s} style={{padding:"5px",borderBottom:`1px solid ${T.border}`,textAlign:"center",fontWeight:600,color:c,borderLeft:`1px solid ${T.border}`,fontSize:10}}>{l}</th>
                  ))}
                </tr>
                <tr style={{background:T.bgCard}}>
                  {["Month","New","Rep","Jobs","Mktg","Ref","Other","Avg job","Jobs/yr","Churn%","CAC","LTV","Ratio"].map((h,i)=>(
                    <th key={h} style={{padding:"4px",borderBottom:`1px solid ${T.border}`,fontWeight:500,color:T.textMuted,borderLeft:i===1||i===4||i===7||i===10?`1px solid ${T.border}`:"none",textAlign:i===0?"left":"right",fontSize:9}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MONTHS.map((mName,mi)=>{
                  const r=getLtvRow(mi,ltvYear);const row=ltvSummary.rows[mi];const f=field=>val=>setLtvRow(mi,ltvYear,field,val);
                  return(<tr key={mi} style={{borderBottom:`1px solid ${T.border}`,background:mi%2===0?"transparent":T.bgCard+"80"}}>
                    <td style={{padding:"2px 4px",fontWeight:600,fontSize:10,color:T.accent}}>{mName.slice(0,3)}</td>
                    {[["newCustomers",r.newCustomers],["repeatCustomers",r.repeatCustomers],["totalJobs",r.totalJobs]].map(([f2,v],i)=>(
                      <td key={f2} style={{padding:"2px",borderLeft:i===0?`1px solid ${T.border}`:"none"}}><input type="number" value={v} onChange={e=>f(f2)(e.target.value)} placeholder="—" style={{...inp,height:22,fontSize:10,textAlign:"right",padding:"2px 4px"}}/></td>
                    ))}
                    {[["marketingSpend",r.marketingSpend],["referralSpend",r.referralSpend],["otherAcqSpend",r.otherAcqSpend]].map(([f2,v],i)=>(
                      <td key={f2} style={{padding:"2px",borderLeft:i===0?`1px solid ${T.border}`:"none"}}><input type="number" value={v} onChange={e=>f(f2)(e.target.value)} placeholder="—" style={{...inp,height:22,fontSize:10,textAlign:"right",padding:"2px 4px"}}/></td>
                    ))}
                    {[["avgJobValue",r.avgJobValue],["avgJobsPerCustomer",r.avgJobsPerCustomer],["churnRate",r.churnRate]].map(([f2,v],i)=>(
                      <td key={f2} style={{padding:"2px",borderLeft:i===0?`1px solid ${T.border}`:"none"}}><input type="number" value={v} onChange={e=>f(f2)(e.target.value)} placeholder="—" style={{...inp,height:22,fontSize:10,textAlign:"right",padding:"2px 4px"}}/></td>
                    ))}
                    <td style={{padding:"3px 4px",textAlign:"right",borderLeft:`1px solid ${T.border}`,color:T.red,fontWeight:600}}>{row.cac!==null?fmt(row.cac):"—"}</td>
                    <td style={{padding:"3px 4px",textAlign:"right",color:T.green,fontWeight:600}}>{row.ltv!==null?fmt(row.ltv):"—"}</td>
                    <td style={{padding:"3px 4px",textAlign:"right",fontWeight:700,color:ratioColor(row.ratio)}}>{row.ratio!==null?fmtN(row.ratio)+"x":"—"}</td>
                  </tr>);
                })}
              </tbody>
            </table>
          </div>
          <div style={{marginTop:10,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>
            {[{r:"< 1x",l:"Losing money",bg:T.redDim,c:T.red},{r:"1–3x",l:"Profitable but thin",bg:T.amberDim,c:T.amber},{r:"3x +",l:"Healthy — scale",bg:T.greenDim,c:T.green}].map(c=>(
              <div key={c.r} style={{background:c.bg,borderRadius:7,padding:"8px 10px",border:`1px solid ${c.c}20`}}>
                <div style={{fontSize:14,fontWeight:700,color:c.c}}>{c.r}</div>
                <div style={{fontSize:10,color:c.c,opacity:0.8,marginTop:1}}>{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="marketing"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:"1rem"}}>
            {PLATFORMS.map(p=>{
              const pc={Core:T.green,High:T.amber,Growth:T.accent}[p.priority]||T.textMuted;
              return(<div key={p.name} style={{...card,padding:"8px 10px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <span style={{fontSize:11,fontWeight:600}}>{p.name}</span>
                  <span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:`${pc}20`,color:pc,fontWeight:600}}>{p.priority.toUpperCase()}</span>
                </div>
                <div style={{fontSize:10,color:T.textMuted,lineHeight:1.5}}>{p.desc}</div>
              </div>);
            })}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,marginBottom:3}}>
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} style={{fontSize:9,color:T.textDim,textAlign:"center",padding:"2px 0",fontWeight:600}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:12}}>
            {Array.from({length:mktFirstDow}).map((_,i)=><div key={"me"+i}/>)}
            {Array.from({length:mktDays},(_,i)=>i+1).map(d=>{
              const task=taskForDay(d);const done=getDailyDone(d);const isSelected=mktDay===d;const cc=channelColor(task.channel);
              return(
                <div key={d} onClick={()=>setMktDay(mktDay===d?null:d)} style={{...card,padding:"5px 6px",cursor:"pointer",minHeight:58,borderColor:isSelected?T.accent:done?`${cc}40`:T.border,background:done?`${cc}08`:T.bgCard}}>
                  <div style={{fontSize:9,fontWeight:600,color:isSelected?T.accent:T.textDim,marginBottom:2}}>{d}</div>
                  <div style={{fontSize:8,color:cc,lineHeight:1.4,fontWeight:500,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{task.channel}</div>
                  {done&&<div style={{marginTop:3}}><Icon name="check" size={8} color={T.green}/></div>}
                </div>
              );
            })}
          </div>
          {mktDay&&(()=>{
            const task=taskForDay(mktDay);const done=getDailyDone(mktDay);const cc=channelColor(task.channel);const ck=`${mktKey(mktDay)}-done`;
            return(
              <div style={{...card,padding:"14px",marginBottom:12,borderColor:`${cc}40`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                      <span style={{fontSize:9,padding:"2px 7px",borderRadius:3,background:`${cc}20`,color:cc,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase"}}>{task.channel}</span>
                      <span style={{fontSize:10,color:T.textMuted}}>{MONTHS[mktMonth]} {mktDay}</span>
                    </div>
                    <div style={{fontSize:14,fontWeight:600,lineHeight:1.4,maxWidth:340}}>{task.action}</div>
                  </div>
                  <button onClick={()=>setMktDay(null)} style={{background:"transparent",border:"none",cursor:"pointer",padding:0,marginLeft:10}}><Icon name="x" size={14} color={T.textMuted}/></button>
                </div>
                <div style={{fontSize:11,color:T.textMuted,padding:"6px 10px",background:T.bgInput,borderRadius:6,marginBottom:10,display:"flex",gap:6,alignItems:"flex-start"}}>
                  <Icon name="info" size={11} color={T.textDim}/><span>{task.why}</span>
                </div>
                <button onClick={()=>updCheckedDaily({...checkedDaily,[ck]:!checkedDaily[ck]})} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:6,border:`1px solid ${done?T.green:T.border}`,background:done?T.greenDim:"transparent",cursor:"pointer",color:done?T.green:T.textMuted,fontSize:11,fontWeight:600,marginBottom:10}}>
                  <div style={{width:14,height:14,borderRadius:3,border:`1.5px solid ${done?T.green:T.border}`,background:done?T.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {done&&<Icon name="check" size={9} color={T.bg}/>}
                  </div>
                  {done?"Done":"Mark done"}
                </button>
                <div style={{fontSize:9,color:T.textMuted,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.07em",fontWeight:600}}>Notes</div>
                <textarea value={customNotes[mktKey(mktDay)]||""} onChange={e=>updCustomNotes({...customNotes,[mktKey(mktDay)]:e.target.value})} placeholder="What you posted, responses, leads..." style={{width:"100%",boxSizing:"border-box",fontSize:11,padding:"7px 9px",borderRadius:6,border:`1px solid ${T.border}`,background:T.bgInput,color:T.text,resize:"vertical",minHeight:52,outline:"none",fontFamily:"inherit"}}/>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
