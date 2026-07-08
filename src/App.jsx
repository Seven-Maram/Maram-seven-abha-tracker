import { useState, useMemo, useRef, useEffect } from "react";

const C = {
  darkBlue:"#002F6C", blue:"#0057A4", bgBlue:"#BADEF4",
  cyan:"#00ADC4", bgCyan:"#CEEAEF",
  magenta:"#E5007A", bgMagenta:"#F9CFE7",
  green:"#04A357", bgGreen:"#D4F4DC",
  yellow:"#FABA00", bgYellow:"#FFF7C0",
  orange:"#F46300", bgOrange:"#FFDFD2",
  white:"#FFFFFF", border:"rgba(0,47,108,0.12)",
};

const TEAMS = ["Brand Team","Attractions Team","Media Team","Destinations Team","PR & Events Team"];
const STATUSES = ["Not Started","In Progress","Done","Blocked"];
const RISKS = ["On Track","Potential Risk","Critical Risk"];
const PRIORITIES = ["High","Medium","Low"];
const PHASES = ["Pre-Launch"];
const DESTINATIONS = ["Abha","AlNahda","Makkah","Tabuk","AlHamra"];
const DEST_PILLARS = ["Destination Film","Communication Rollout","Destination's Screen Content","Hoardings","B2B Booklet","AlNahda & Makkah Creative Concept"];

const MILESTONES = [
  { id:"m1", name:"Abha's Brand & Identity Lockdown", date:"2026-03-31", dateLabel:"Q1 2026" },
  { id:"m2", name:"Physical Site Readiness", date:"2026-06-30", dateLabel:"June 2026" },
  { id:"m3", name:"Ticketing, Invitations and Web Readiness", date:"2026-06-30", dateLabel:"June 2026" },
  { id:"m4", name:"Soft Opening", date:"2026-07-05", dateLabel:"5 Jul 2026" },
  { id:"m5", name:"Communication Rollout Ready", date:"2026-07-09", dateLabel:"9 Jul 2026" },
  { id:"m6", name:"Campaign Media Launch (Go-Live)", date:"2026-07-15", dateLabel:"15 Jul 2026" },
  { id:"m7", name:"Creative & Content Production", date:"2026-07-20", dateLabel:"20 Jul 2026" },
  { id:"m8", name:"Grand Opening", date:"2026-08-05", dateLabel:"5 Aug 2026" },
];

const TEAM_ACTIONS = {
  "Brand Team": ["Signage & Visual Identity","Invitation & Ticketing","Brand Guidelines & Comms"],
  "Attractions Team": ["Launch Campaign","Digital & Screens"],
  "Media Team": ["Launch Content Calendars","Pre-Opening Campaigns"],
  "Destinations Team": DEST_PILLARS.concat(["Special Activations"]),
  "PR & Events Team": ["Opening Event Planning","Stakeholder & Media Relations","PR & Communications"],
};

const TEAM_CFG = {
  "Brand Team":       { primary:C.cyan,     bg:C.bgCyan,    text:"#005F70" },
  "Attractions Team": { primary:C.green,    bg:C.bgGreen,   text:"#00774C" },
  "Media Team":       { primary:C.blue,     bg:C.bgBlue,    text:C.darkBlue },
  "Destinations Team":{ primary:C.magenta,  bg:C.bgMagenta, text:"#B4006F" },
  "PR & Events Team": { primary:C.yellow,   bg:C.bgYellow,  text:"#854F0B" },
};

const STATUS_CFG = {
  "Not Started": { bg:"#F0F4FA", text:"#3A5A8C", dot:"#7A9CC8" },
  "In Progress":  { bg:C.bgCyan,    text:"#005F70", dot:C.cyan },
  "Done":         { bg:C.bgGreen,   text:"#00774C", dot:C.green },
  "Blocked":      { bg:C.bgMagenta, text:"#B4006F", dot:C.magenta },
};

const RISK_CFG = {
  "On Track":       { bg:C.bgGreen,   text:"#00774C", dot:C.green },
  "Potential Risk": { bg:C.bgYellow,  text:"#854F0B", dot:C.yellow },
  "Critical Risk":  { bg:C.bgMagenta, text:"#B4006F", dot:C.magenta },
};

const PRIORITY_CFG = {
  High:   { bg:"#FFE8F4", text:"#B4006F", dot:C.magenta },
  Medium: { bg:C.bgCyan,  text:"#005F70", dot:C.cyan },
  Low:    { bg:C.bgGreen, text:"#00774C", dot:C.green },
};

const BUCKET_CFG = {
  "overdue":   { label:"Overdue",   bg:"#FCEBEB", text:"#A32D2D", dot:C.magenta, border:"#F09595" },
  "this-week": { label:"This week", bg:"#FFF7C0", text:"#854F0B", dot:C.yellow,  border:C.yellow },
  "next-week": { label:"Next week", bg:C.bgCyan,  text:"#005F70", dot:C.cyan,    border:C.cyan },
  "later":     { label:"Later",     bg:"#F0F4FA", text:"#3A5A8C", dot:"#7A9CC8", border:"#7A9CC8" },
  "no-date":   { label:"No date",   bg:"#F5F5F5", text:"#888",    dot:"#ccc",    border:"#ccc" },
};

const MS_STATUS_CFG = {
  "Done":     { bg:C.bgGreen,   text:"#00774C", dot:C.green },
  "On Track": { bg:C.bgCyan,    text:"#005F70", dot:C.cyan },
  "At Risk":  { bg:C.bgYellow,  text:"#854F0B", dot:C.yellow },
  "Delayed":  { bg:C.bgMagenta, text:"#B4006F", dot:C.magenta },
};

const T = (id,team,action,title,owner,dueDate,status,risk,milestone,comments="",destination="") =>
  ({ id, phase:"Pre-Launch", team, action, title, owner, destination, milestone, priority:"Medium", dueDate, status, risk, comments });

const INIT = [
  { id:"1", phase:"Pre-Launch", team:"Brand Team", action:"Brand Guidelines & Comms", title:"Abha identity & brand guidelines", owner:"Brand Team", destination:"", milestone:"m1", priority:"Medium", dueDate:"2026-03-30", status:"Done", risk:"On Track", comments:"" },
  { id:"2", phase:"Pre-Launch", team:"Brand Team", action:"Signage & Visual Identity", title:"Signages update", owner:"Brand Team", destination:"", milestone:"m1", priority:"Medium", dueDate:"2026-07-09", status:"Done", risk:"On Track", comments:"" },
  { id:"3", phase:"Pre-Launch", team:"Destinations Team", action:"Hoardings", title:"F&B & Retail hoardings", owner:"Omar", destination:"Abha", milestone:"m2", priority:"Medium", dueDate:"2026-07-07", status:"In Progress", risk:"On Track", comments:"Installation in progress - supplier missing AW for Maraki & F&B#24 (Mariam to get back when TBD)" },
  { id:"4", phase:"Pre-Launch", team:"Brand Team", action:"Signage & Visual Identity", title:"Coming soon banners (attractions)", owner:"Brand Team", destination:"", milestone:"m2", priority:"Medium", dueDate:"2026-07-09", status:"In Progress", risk:"On Track", comments:"Design to be ready by 9th - coordinated with Abha's Operation team to produce " },
  { id:"5", phase:"Pre-Launch", team:"Attractions Team", action:"Digital & Screens", title:"In-attraction screens content", owner:"Reema", destination:"", milestone:"m2", priority:"Medium", dueDate:"2026-07-09", status:"In Progress", risk:"On Track", comments:"content shared with operations - pending their confirmation on installation " },
  { id:"6", phase:"Pre-Launch", team:"Destinations Team", action:"Destination's Screen Content", title:"Destination Screen Content", owner:"Maram", destination:"Abha", milestone:"m2", priority:"Medium", dueDate:"2026-06-30", status:"Done", risk:"Potential Risk", comments:"no external content can run on any destination screen within Abha and only Seeber content is permitted - except the big screen where will showcase the new film" },
  { id:"7", phase:"Pre-Launch", team:"Destinations Team", action:"Hoardings", title:"External hoardings", owner:"Maram", destination:"Abha", milestone:"m2", priority:"Medium", dueDate:"2026-06-30", status:"Done", risk:"On Track", comments:"" },
  { id:"8", phase:"Pre-Launch", team:"Destinations Team", action:"Destination's Screen Content", title:"Google Maps linking", owner:"Maram", destination:"Abha", milestone:"m2", priority:"Medium", dueDate:"2026-06-30", status:"Done", risk:"On Track", comments:"the destination pin – we will be marking it as temporarily closed – until the public opening" },
  { id:"9", phase:"Pre-Launch", team:"Brand Team", action:"Invitation & Ticketing", title:"Internal invitation design", owner:"Brand Team", destination:"Abha", milestone:"m3", priority:"Medium", dueDate:"2026-07-09", status:"Done", risk:"On Track", comments:"Design ready - Destination team to share with Alanoud Aleissa (Internal comm SPOC)" },
  { id:"10", phase:"Pre-Launch", team:"Brand Team", action:"Invitation & Ticketing", title:"Soft opening invitation design", owner:"Brand Team", destination:"", milestone:"m3", priority:"Medium", dueDate:"2026-07-06", status:"Done", risk:"On Track", comments:"Influencers and media invitations" },
  { id:"11", phase:"Pre-Launch", team:"Attractions Team", action:"Digital & Screens", title:"LMC web and app visual development", owner:"Attractions Team", destination:"", milestone:"m3", priority:"Medium", dueDate:"2026-06-30", status:"Done", risk:"On Track", comments:"" },
  { id:"12", phase:"Pre-Launch", team:"Brand Team", action:"Invitation & Ticketing", title:"Parking ticket design", owner:"Brand Team", destination:"", milestone:"m3", priority:"Medium", dueDate:"2026-07-02", status:"Done", risk:"On Track", comments:"" },
  { id:"13", phase:"Pre-Launch", team:"Brand Team", action:"Invitation & Ticketing", title:"E-ticket design & integration", owner:"Areej", destination:"", milestone:"m3", priority:"Medium", dueDate:"", status:"Done", risk:"On Track", comments:"" },
  { id:"14", phase:"Pre-Launch", team:"Destinations Team", action:"Soft Opening", title:"Soft opening Internal Announcement", owner:"Maram", destination:"Abha", milestone:"m3", priority:"Medium", dueDate:"2026-07-09", status:"Not Started", risk:"On Track", comments:"coordinate with alanoud aleissa " },
  { id:"15", phase:"Pre-Launch", team:"PR & Events Team", action:"Stakeholder & Media Relations", title:"Media Kit", owner:"Najlaa", destination:"Abha", milestone:"m4", priority:"Medium", dueDate:"2026-07-11", status:"In Progress", risk:"On Track", comments:"*Destination photos - Maram to share by 11th \n*Re-validated factsheets - Mariam to share on 6th - team to revert with feedback by 8th july " },
  { id:"16", phase:"Pre-Launch", team:"Destinations Team", action:"Special Activations", title:"Abha's on ground Activations/takeover ideas finalization", owner:"Maram", destination:"", milestone:"m4", priority:"Medium", dueDate:"2026-07-09", status:"In Progress", risk:"On Track", comments:"elements to be finalized with webedia by 10th Jul" },
  { id:"17", phase:"Pre-Launch", team:"Destinations Team", action:"Special Activations", title:"Abha's World cup activation", owner:"Sorob", destination:"", milestone:"m4", priority:"Medium", dueDate:"2026-07-09", status:"In Progress", risk:"On Track", comments:"on track " },
  { id:"18", phase:"Pre-Launch", team:"PR & Events Team", action:"Opening Event Planning", title:"Minister of Tourism Visit / communication", owner:"Omar/Musab", destination:"", milestone:"m4", priority:"Medium", dueDate:"2026-07-09", status:"In Progress", risk:"On Track", comments:"on track" },
  { id:"19", phase:"Pre-Launch", team:"PR & Events Team", action:"Stakeholder & Media Relations", title:"Soft Opening Influencers and media invitations", owner:"Najlaa", destination:"", milestone:"m4", priority:"Medium", dueDate:"2026-07-16", status:"Not Started", risk:"On Track", comments:"27th of July will be Media day" },
  { id:"20", phase:"Pre-Launch", team:"PR & Events Team", action:"Opening Event Planning", title:"On ground activations/takeover execution", owner:"Omar Z", destination:"", milestone:"m4", priority:"Medium", dueDate:"2026-07-16", status:"In Progress", risk:"On Track", comments:"to be kicked off this week 6th july " },
  { id:"21", phase:"Pre-Launch", team:"Destinations Team", action:"Special Activations", title:"Formula E car airport delivery", owner:"Layal", destination:"Abha", milestone:"m4", priority:"Medium", dueDate:"2026-07-16", status:"Done", risk:"On Track", comments:"Car is delivered at Abha" },
  { id:"22", phase:"Pre-Launch", team:"PR & Events Team", action:"PR & Communications", title:"Destination and attractions fact sheets", owner:"Najlaa", destination:"", milestone:"m4", priority:"Medium", dueDate:"2026-06-30", status:"Done", risk:"On Track", comments:"" },
  { id:"23", phase:"Pre-Launch", team:"PR & Events Team", action:"PR & Communications", title:"PR Strategy locked & approved", owner:"Najlaa", destination:"", milestone:"m4", priority:"Medium", dueDate:"2026-06-30", status:"Done", risk:"On Track", comments:"" },
  { id:"24", phase:"Pre-Launch", team:"PR & Events Team", action:"Stakeholder & Media Relations", title:"ASDA Invitation Schedule", owner:"Najlaa", destination:"", milestone:"m4", priority:"Medium", dueDate:"2026-07-02", status:"Done", risk:"On Track", comments:"" },
  { id:"25", phase:"Pre-Launch", team:"Media Team", action:"Launch Content Calendars", title:"Abha Destinations launch calendar", owner:"Raghda", destination:"", milestone:"m5", priority:"Medium", dueDate:"2026-07-02", status:"Done", risk:"On Track", comments:"" },
  { id:"26", phase:"Pre-Launch", team:"Destinations Team", action:"Communication Rollout", title:"Abha's Comms plan rollout", owner:"Maram", destination:"", milestone:"m5", priority:"Medium", dueDate:"2026-07-08", status:"In Progress", risk:"On Track", comments:"WK1-3 revised and shared with team for final approval \n*WK4 under-revision with agency " },
  { id:"27", phase:"Pre-Launch", team:"Destinations Team", action:"Communication Rollout", title:"Abha's OOH comms", owner:"Maram", destination:"", milestone:"m5", priority:"Medium", dueDate:"2026-07-09", status:"In Progress", risk:"On Track", comments:"" },
  { id:"28", phase:"Pre-Launch", team:"Media Team", action:"Launch Content Calendars", title:"Abha Attractions Launch calendar", owner:"Raghda", destination:"Abha", milestone:"m5", priority:"Medium", dueDate:"2026-07-20", status:"Not Started", risk:"On Track", comments:"Attraction team to share content by 20th july \n* 8-10 posts per month per attraction " },
  { id:"29", phase:"Pre-Launch", team:"Media Team", action:"Launch Content Calendars", title:"Infographics assets development for media & external use", owner:"Jawaher", destination:"", milestone:"m5", priority:"Medium", dueDate:"2026-07-16", status:"In Progress", risk:"On Track", comments:"" },
  { id:"30", phase:"Pre-Launch", team:"Destinations Team", action:"Communication Rollout", title:"Abha's Comms rollout WK1", owner:"Maram", destination:"", milestone:"m5", priority:"Medium", dueDate:"2026-07-02", status:"Done", risk:"On Track", comments:"" },
  { id:"31", phase:"Pre-Launch", team:"Media Team", action:"Pre-Opening Campaigns", title:"Media Agency Awarding", owner:"Musab", destination:"", milestone:"m6", priority:"Medium", dueDate:"2026-06-28", status:"In Progress", risk:"Critical Risk", comments:"contract will be signed by 14th july " },
  { id:"33", phase:"Pre-Launch", team:"Media Team", action:"Pre-Opening Campaigns", title:"Abha's pre-opening organic campaign", owner:"Raghda", destination:"", milestone:"m6", priority:"Medium", dueDate:"2026-07-16", status:"In Progress", risk:"On Track", comments:"" },
  { id:"34", phase:"Pre-Launch", team:"Media Team", action:"Pre-Opening Campaigns", title:"Abha's Pushed Media Plan & E2E Digital Calendar ", owner:"Musab/Nora", destination:"Abha", milestone:"m6", priority:"Medium", dueDate:"2026-07-06", status:"Not Started", risk:"Potential Risk", comments:"pending agency qualification " },
  { id:"35", phase:"Pre-Launch", team:"Media Team", action:"Pre-Opening Campaigns", title:"Abha's OOH Plan", owner:"Musab", destination:"", milestone:"m6", priority:"Medium", dueDate:"2026-07-08", status:"In Progress", risk:"On Track", comments:"Nora to come back with OOH specs for assets adaptation " },
  { id:"36", phase:"Pre-Launch", team:"Media Team", action:"Pre-Opening Campaigns", title:"Abha's detailed calander (social, activations, etc)", owner:"Maram", destination:"", milestone:"m6", priority:"Medium", dueDate:"2026-07-09", status:"In Progress", risk:"On Track", comments:"" },
  { id:"37", phase:"Pre-Launch", team:"PR & Events Team", action:"PR & Communications", title:"Pre-Opening PR Launch Announcement", owner:"Najlaa", destination:"", milestone:"m6", priority:"Medium", dueDate:"2026-07-19", status:"Not Started", risk:"On Track", comments:"press release finalized pending alignment\npending chairman qoutes from qiddya " },
  { id:"38", phase:"Pre-Launch", team:"PR & Events Team", action:"PR & Communications", title:"Opening-Day PR release & Influencers", owner:"Najlaa", destination:"", milestone:"m6", priority:"Medium", dueDate:"2026-07-30", status:"Not Started", risk:"On Track", comments:"" },
  { id:"39", phase:"Pre-Launch", team:"PR & Events Team", action:"PR & Communications", title:"Post-Opening PR release", owner:"Najlaa", destination:"", milestone:"m6", priority:"Medium", dueDate:"2026-08-05", status:"Not Started", risk:"On Track", comments:"" },
  { id:"41", phase:"Pre-Launch", team:"Attractions Team", action:"Launch Campaign", title:"Golfi Film Delivery", owner:"Layal/Manar", destination:"", milestone:"m7", priority:"Medium", dueDate:"2026-07-20", status:"In Progress", risk:"On Track", comments:"" },
  { id:"42", phase:"Pre-Launch", team:"Attractions Team", action:"Launch Campaign", title:"Bowling Film Delivery", owner:"Layal/Manar", destination:"", milestone:"m7", priority:"Medium", dueDate:"2026-07-20", status:"In Progress", risk:"On Track", comments:"delivery date TBC" },
  { id:"43", phase:"Pre-Launch", team:"Attractions Team", action:"Launch Campaign", title:"Kawaken Film Delivery", owner:"Reema", destination:"", milestone:"m7", priority:"Medium", dueDate:"2026-07-20", status:"In Progress", risk:"On Track", comments:"" },
  { id:"44", phase:"Pre-Launch", team:"Destinations Team", action:"Destination Film", title:"Destination Film delivery", owner:"Maram", destination:"", milestone:"m7", priority:"Medium", dueDate:"2026-07-19", status:"In Progress", risk:"On Track", comments:"" },
  { id:"45", phase:"Pre-Launch", team:"Destinations Team", action:"Destination Film", title:"Destination Music Delivery", owner:"Maram", destination:"", milestone:"m7", priority:"Medium", dueDate:"2026-07-19", status:"In Progress", risk:"On Track", comments:"" },
  { id:"46", phase:"Pre-Launch", team:"Attractions Team", action:"Launch Campaign", title:"Attractions Film Shoot", owner:"Attractions Team", destination:"", milestone:"m7", priority:"Medium", dueDate:"2026-06-01", status:"Done", risk:"On Track", comments:"" },
  { id:"47", phase:"Pre-Launch", team:"Destinations Team", action:"Destination Film", title:"Destination Film Shoot", owner:"Maram", destination:"", milestone:"m7", priority:"Medium", dueDate:"2026-06-17", status:"Done", risk:"On Track", comments:"" },
  { id:"48", phase:"Pre-Launch", team:"PR & Events Team", action:"Opening Event Planning", title:"Event Agency awarding & mobilization", owner:"Omar Z", destination:"", milestone:"m8", priority:"Medium", dueDate:"2026-07-06", status:"Done", risk:"Critical Risk", comments:"OMAR TO BRING A CAKE TO CELEBRATE TOMORROW!!!" },
  { id:"49", phase:"Pre-Launch", team:"PR & Events Team", action:"Opening Event Planning", title:"Event Projection & Drone show ", owner:"Maram/Omar Z", destination:"Abha", milestone:"m7", priority:"Medium", dueDate:"2026-07-09", status:"In Progress", risk:"On Track", comments:"work in progress with webedia - storyboard draft to be shared by 8th Jul" },
  { id:"50", phase:"Pre-Launch", team:"PR & Events Team", action:"Opening Event Planning", title:"Event Site Visit", owner:"Omar Z", destination:"Abha", milestone:"m8", priority:"Medium", dueDate:"2026-07-09", status:"Not Started", risk:"On Track", comments:"date will be locked this week with the agency" },
  { id:"51", phase:"Pre-Launch", team:"PR & Events Team", action:"Opening Event Planning", title:"Protocol & VIP guest journey plan", owner:"Omar Z", destination:"", milestone:"m8", priority:"Medium", dueDate:"2026-07-16", status:"Not Started", risk:"On Track", comments:"" },
  { id:"52", phase:"Pre-Launch", team:"PR & Events Team", action:"Opening Event Planning", title:"H&S Plan", owner:"Omar Z", destination:"", milestone:"m8", priority:"Medium", dueDate:"2026-07-16", status:"Not Started", risk:"On Track", comments:"" },
  { id:"53", phase:"Pre-Launch", team:"Brand Team", action:"Brand Guidelines & Comms", title:"Abha's Operational team training on guest experience ", owner:"Mariam", destination:"Abha", milestone:"m8", priority:"Medium", dueDate:"2026-07-13", status:"In Progress", risk:"On Track", comments:"Training will be conducted on 12th & 13th july " },
  { id:"54", phase:"Pre-Launch", team:"PR & Events Team", action:"Opening Event Planning", title:"Production and Technical", owner:"Omar Z", destination:"", milestone:"m8", priority:"Medium", dueDate:"2026-07-16", status:"Not Started", risk:"On Track", comments:"" },
  { id:"55", phase:"Pre-Launch", team:"PR & Events Team", action:"Opening Event Planning", title:"Event permits", owner:"Omar Z", destination:"", milestone:"m8", priority:"Medium", dueDate:"2026-07-16", status:"Not Started", risk:"On Track", comments:"" },
  { id:"56", phase:"Pre-Launch", team:"PR & Events Team", action:"Opening Event Planning", title:"technical audio & visual plan", owner:"Omar Z", destination:"", milestone:"m8", priority:"Medium", dueDate:"2026-07-19", status:"Not Started", risk:"On Track", comments:"" },
  { id:"57", phase:"Pre-Launch", team:"PR & Events Team", action:"Opening Event Planning", title:"Catering plan", owner:"Omar Z", destination:"", milestone:"m8", priority:"Medium", dueDate:"2026-07-19", status:"Not Started", risk:"On Track", comments:"" },
  { id:"58", phase:"Pre-Launch", team:"PR & Events Team", action:"Stakeholder & Media Relations", title:"Issue Media & Influencers Invitees", owner:"Najlaa", destination:"", milestone:"m8", priority:"Medium", dueDate:"2026-07-20", status:"Not Started", risk:"On Track", comments:"" },
  { id:"59", phase:"Pre-Launch", team:"PR & Events Team", action:"Stakeholder & Media Relations", title:"Issue VIPs Invitees", owner:"Najlaa", destination:"", milestone:"m8", priority:"Medium", dueDate:"2026-07-20", status:"Not Started", risk:"On Track", comments:"" },
  { id:"60", phase:"Pre-Launch", team:"PR & Events Team", action:"PR & Communications", title:"Coverage Plan for Celebration week", owner:"Omar Z", destination:"", milestone:"m8", priority:"Medium", dueDate:"2026-08-05", status:"Not Started", risk:"On Track", comments:"" },
  { id:"1783335483728", phase:"Pre-Launch", team:"PR & Events Team", action:"PR & Communications", title:"Brief Agency on executing the onground activations ", owner:"Omar Z", destination:"Abha", milestone:"m4", priority:"Medium", dueDate:"2026-07-12", status:"Not Started", risk:"On Track", comments:"pending assets and final elements " },
  { id:"1783336854473", phase:"Pre-Launch", team:"PR & Events Team", action:"Opening Event Planning", title:"Brief the Agency on the Event ", owner:"Omar Z", destination:"Abha", milestone:"m8", priority:"Medium", dueDate:"2026-07-07", status:"In Progress", risk:"On Track", comments:"Meeting is conducted tmw with the prince & agency " },
];

const SKEY = "seven_abha_tracker_data";
const MSKEY = "seven_abha_milestones_data";
const RVKEY = "seven_abha_last_review";

// Only URLs with ?admin=<token> can edit. Change this before deploying.
const ADMIN_TOKEN = "maram-abha-2026";
const DEFAULT_OVERRIDES = { m2:"On Track", m8:"Delayed", m4:"On Track", m3:"On Track" };

function today() { const d=new Date(); d.setHours(0,0,0,0); return d; }
function parseDate(d) { if(!d) return null; const dt=new Date(d+"T00:00:00"); return isNaN(dt)?null:dt; }
function weekBucket(d) {
  if (!d) return "no-date";
  const diff = Math.floor((d - today()) / 86400000);
  if (diff < 0) return "overdue";
  if (diff <= 7) return "this-week";
  if (diff <= 14) return "next-week";
  return "later";
}
function normApos(s){ return (s||"").replace(/[\u2018\u2019\u02BC]/g,"'").trim(); }
function scoreColor(s) { return s>=70?C.green:s>=40?C.yellow:C.magenta; }
function pct(arr) { return arr.length?Math.round(arr.filter(t=>t.status==="Done").length/arr.length*100):0; }
function taskMilestone(t){ return t.milestone || ""; }
const STATUS_ORDER = { "In Progress":0, "Not Started":1, "Done":2, "Blocked":3 };
function sortByStatus(arr) { return [...arr].sort((a,b)=>(STATUS_ORDER[a.status]??9)-(STATUS_ORDER[b.status]??9)); }
function sortByDate(arr) {
  return [...arr].sort((a,b)=>{
    const aDone=a.status==="Done", bDone=b.status==="Done";
    if (aDone!==bDone) return aDone?1:-1;
    return (a.dueDate||"9999-12-31").localeCompare(b.dueDate||"9999-12-31");
  });
}
function milestoneStatus(items, mDate) {
  if (items.length===0) return "On Track";
  if (items.every(t=>t.status==="Done")) return "Done";
  const hasCritical = items.some(t=>t.risk==="Critical Risk"||t.status==="Blocked");
  const d = mDate?new Date(mDate+"T00:00:00"):null;
  const overdue = d && d < today();
  if (overdue && hasCritical) return "Delayed";
  if (hasCritical) return "At Risk";
  if (overdue) return "Delayed";
  const anyRisk = items.some(t=>t.risk==="Potential Risk");
  return anyRisk ? "At Risk" : "On Track";
}

function Pill({ label, cfg, dot }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:500, padding:"2px 9px", borderRadius:20, background:cfg.bg, color:cfg.text, border:`0.5px solid ${cfg.dot}33` }}>
      {dot && <span style={{ width:6, height:6, borderRadius:"50%", background:cfg.dot, flexShrink:0 }}/>}
      {label}
    </span>
  );
}
function Bar({ pct:p, color, bg, h=5 }) {
  return (
    <div style={{ background:bg||"rgba(0,47,108,0.08)", borderRadius:99, height:h, overflow:"hidden", width:"100%" }}>
      <div style={{ width:`${Math.min(p,100)}%`, height:"100%", background:color, borderRadius:99 }}/>
    </div>
  );
}
function RingScore({ val, size=80 }) {
  const r=30,cx=40,cy=40,circ=2*Math.PI*r,col=scoreColor(val),filled=circ*(val/100);
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,47,108,0.08)" strokeWidth="7"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth="7" strokeDasharray={`${filled} ${circ-filled}`} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}/>
      <text x={cx} y={cy-4} textAnchor="middle" fontSize="14" fontWeight="700" fill={col}>{val}%</text>
      <text x={cx} y={cy+9} textAnchor="middle" fontSize="9" fill="rgba(0,47,108,0.45)">ready</text>
    </svg>
  );
}
function StatusDropdown({ current, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position:"relative", display:"inline-block" }}>
      <span onClick={e=>{ e.stopPropagation(); setOpen(o=>!o); }} style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:500, padding:"2px 9px", borderRadius:20, background:STATUS_CFG[current].bg, color:STATUS_CFG[current].text, border:`0.5px solid ${STATUS_CFG[current].dot}33`, cursor:"pointer" }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:STATUS_CFG[current].dot, flexShrink:0 }}/>
        {current}<span style={{ fontSize:9, marginLeft:2 }}>▾</span>
      </span>
      {open && (
        <div style={{ position:"absolute", top:"110%", right:0, background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:4, zIndex:100, minWidth:130, boxShadow:"0 4px 16px rgba(0,47,108,0.12)" }}>
          {STATUSES.map(st=>(
            <div key={st} onClick={e=>{ e.stopPropagation(); onChange(st); setOpen(false); }} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:7, cursor:"pointer", background:st===current?STATUS_CFG[st].bg:"transparent" }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:STATUS_CFG[st].dot }}/>
              <span style={{ fontSize:12, color:STATUS_CFG[st].text, fontWeight:st===current?600:400 }}>{st}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Modal({ task, onSave, onClose }) {
  const [f, setF] = useState({...task, milestone: task.milestone || ""});
  const [customAction, setCustomAction] = useState(false);
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  const setTeam = (nt) => { setCustomAction(false); setF(p=>({...p, team:nt, action:(TEAM_ACTIONS[nt]||[]).includes(p.action)?p.action:""})); };
  const lbl = t => <label style={{ fontSize:11, fontWeight:600, color:"rgba(0,47,108,0.5)", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.05em" }}>{t}</label>;
  const actionOpts = TEAM_ACTIONS[f.team] || [];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,20,60,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000 }}>
      <div style={{ background:C.white, borderRadius:16, padding:"28px 30px", width:500, maxWidth:"95vw", border:`1px solid ${C.border}`, maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
          <div style={{ width:4, height:24, borderRadius:2, background:`linear-gradient(180deg,${C.cyan},${C.magenta})` }}/>
          <h2 style={{ margin:0, fontSize:16, fontWeight:600, color:C.darkBlue }}>{task.id?"Edit task":"New task"}</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div style={{ gridColumn:"1/-1" }}>{lbl("Task title")}<input value={f.title} onChange={e=>s("title",e.target.value)} style={{ width:"100%", boxSizing:"border-box" }} placeholder="Task title"/></div>
          <div>{lbl("Team")}<select value={f.team} onChange={e=>setTeam(e.target.value)} style={{ width:"100%" }}>{TEAMS.map(t=><option key={t}>{t}</option>)}</select></div>
          <div>{lbl("Action / Project")}
            {customAction ? (
              <div style={{ display:"flex", gap:6 }}>
                <input value={f.action} onChange={e=>s("action",e.target.value)} placeholder="Type new project name" autoFocus style={{ flex:1, boxSizing:"border-box" }}/>
                <button onClick={()=>{ setCustomAction(false); s("action",""); }} title="Back to list" style={{ padding:"0 12px", fontSize:12, borderRadius:8, border:`1px solid ${C.border}`, background:"var(--color-background-secondary)", color:C.darkBlue, cursor:"pointer" }}>List</button>
              </div>
            ) : (
              <select value={f.action||""} onChange={e=>{ if(e.target.value==="__new__"){ setCustomAction(true); s("action",""); } else s("action",e.target.value); }} style={{ width:"100%" }}>
                <option value="">Select a project…</option>
                {actionOpts.map(p=><option key={p} value={p}>{p}</option>)}
                {f.action && !actionOpts.includes(f.action) && <option value={f.action}>{f.action}</option>}
                <option value="__new__">+ Add new project…</option>
              </select>
            )}
          </div>
          <div>{lbl("Owner")}<input value={f.owner} onChange={e=>s("owner",e.target.value)} style={{ width:"100%", boxSizing:"border-box" }} placeholder="Name"/></div>
          <div>{lbl("Destination")}<select value={f.destination||""} onChange={e=>s("destination",e.target.value)} style={{ width:"100%" }}><option value="">—</option>{DESTINATIONS.map(d=><option key={d}>{d}</option>)}</select></div>
          <div style={{ gridColumn:"1/-1" }}>{lbl("Milestone")}<select value={f.milestone||""} onChange={e=>s("milestone",e.target.value)} style={{ width:"100%" }}><option value="">— None —</option>{MILESTONES.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
          <div>{lbl("Due date")}<input type="date" value={f.dueDate} onChange={e=>s("dueDate",e.target.value)} style={{ width:"100%", boxSizing:"border-box" }}/></div>
          <div>{lbl("Priority")}<select value={f.priority} onChange={e=>s("priority",e.target.value)} style={{ width:"100%" }}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select></div>
          <div>{lbl("Status")}<select value={f.status} onChange={e=>s("status",e.target.value)} style={{ width:"100%" }}>{STATUSES.map(x=><option key={x}>{x}</option>)}</select></div>
          <div>{lbl("Risk")}<select value={f.risk} onChange={e=>s("risk",e.target.value)} style={{ width:"100%" }}>{RISKS.map(r=><option key={r}>{r}</option>)}</select></div>
          <div style={{ gridColumn:"1/-1" }}>{lbl("Comments")}<textarea value={f.comments} onChange={e=>s("comments",e.target.value)} rows={3} style={{ width:"100%", boxSizing:"border-box", resize:"vertical" }} placeholder="Notes or blockers..."/></div>
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
          <button onClick={onClose} style={{ padding:"9px 20px", borderRadius:8, fontSize:13 }}>Cancel</button>
          <button onClick={()=>{ if(f.title.trim()) onSave(f); }} style={{ padding:"9px 22px", fontSize:13, fontWeight:600, background:C.darkBlue, color:C.white, border:"none", borderRadius:8, cursor:"pointer" }}>Save task</button>
        </div>
      </div>
    </div>
  );
}

function PresentationMode({ tasks, milestones, msOverrides, onClose }) {
  const overall=pct(tasks);
  const printRef = useRef();
  const msData = [...milestones].sort((a,b)=>a.date.localeCompare(b.date)).map(m=>{
    const items=tasks.filter(t=>taskMilestone(t)===m.id);
    const status=msOverrides[m.id]||milestoneStatus(items,m.date);
    const keyRisk=items.find(t=>t.status==="Blocked")||items.find(t=>t.risk==="Critical Risk")||items.find(t=>t.risk==="Potential Risk"&&t.comments);
    return { ...m, items, status, p:pct(items), keyRisk };
  });
  const handlePrint = () => {
    const w = window.open("","_blank");
    w.document.write(`<html><head><title>SEVEN Abha Readiness</title><style>body{margin:0;font-family:sans-serif;background:#f7fbfd;}*{box-sizing:border-box;}</style></head><body>${printRef.current.innerHTML}</body></html>`);
    w.document.close(); w.focus(); w.print(); w.close();
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"#f7fbfd", zIndex:3000, overflowY:"auto", padding:"32px 40px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", color:C.cyan, textTransform:"uppercase" }}>SEVEN</div>
          <div style={{ fontSize:22, fontWeight:700, color:C.darkBlue }}>Abha Destination — Launch Readiness</div>
          <div style={{ fontSize:12, color:"rgba(0,47,108,0.45)", marginTop:2 }}>{new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={handlePrint} style={{ padding:"9px 18px", fontSize:13, fontWeight:600, background:C.darkBlue, color:C.white, border:"none", borderRadius:10, cursor:"pointer" }}>Download PDF</button>
          <button onClick={onClose} style={{ padding:"9px 18px", fontSize:13, borderRadius:10, cursor:"pointer" }}>✕ Close</button>
        </div>
      </div>
      <div ref={printRef}>
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px", borderTop:`4px solid ${C.cyan}`, display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
          <RingScore val={overall} size={72}/>
          <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600, color:C.darkBlue, marginBottom:8 }}>Overall Pre-Launch readiness</div><Bar pct={overall} color={C.cyan} bg="rgba(0,47,108,0.06)" h={6}/><div style={{ fontSize:12, color:"rgba(0,47,108,0.5)", marginTop:6 }}>{tasks.filter(t=>t.status==="Done").length} / {tasks.length} tasks completed</div></div>
        </div>
        <div style={{ background:C.darkBlue, borderRadius:14, padding:"18px 22px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.cyan, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>Milestone summary</div>
          <div style={{ display:"grid", gridTemplateColumns:"auto 1.5fr 0.7fr 0.5fr 1.6fr", gap:"10px 16px", alignItems:"center" }}>
            {msData.map(m=>{ const cfg=MS_STATUS_CFG[m.status]; return (
              <div key={m.id} style={{ display:"contents" }}>
                <span style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, background:cfg.bg, color:cfg.text, whiteSpace:"nowrap" }}><span style={{ width:7, height:7, borderRadius:"50%", background:cfg.dot }}/>{m.status}</span>
                <span style={{ fontSize:13, fontWeight:600, color:"#fff" }}>{m.name}</span>
                <span style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>{m.dateLabel}</span>
                <span style={{ fontSize:13, fontWeight:700, color:m.p>=70?"#7ED957":m.p>=40?"#FFCC3E":"#F4519B" }}>{m.p}%</span>
                <span style={{ fontSize:12, color:"rgba(255,255,255,0.7)", lineHeight:1.3 }}>{m.keyRisk ? (m.keyRisk.comments || m.keyRisk.title) : "—"}</span>
              </div>
            );})}
          </div>
        </div>
      </div>
    </div>
  );
}

function fmtLong(d){ return d.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}); }
function fmtShort(d){ const dt=parseDate(d); return dt?dt.toLocaleDateString("en-GB",{day:"numeric",month:"short"}):"—"; }
function daysTo(dateStr){ const d=parseDate(dateStr); if(!d) return null; return Math.ceil((d-today())/86400000); }
function inDays(n){ if(n===null) return ""; if(n===0) return "today"; if(n<0) return `${Math.abs(n)}d overdue`; return `in ${n}d`; }
function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

const EMAIL_MS_COLORS = { "Done":{bg:"#D4F4DC",text:"#00774C"}, "On Track":{bg:"#CEEAEF",text:"#005F70"}, "At Risk":{bg:"#FFF7C0",text:"#854F0B"}, "Delayed":{bg:"#F9CFE7",text:"#B4006F"} };
const EMAIL_TASK_STATUS_COLORS = { "Done":{bg:"#D4F4DC",text:"#00774C"}, "In Progress":{bg:"#CEEAEF",text:"#005F70"}, "Not Started":{bg:"#F0F4FA",text:"#3A5A8C"}, "Blocked":{bg:"#F9CFE7",text:"#B4006F"} };
const SOFT_OPENING_EXTERNAL = { date:"2026-07-04", label:"4 Jul 2026" };

function buildEmail({ mode, tasks, milestones, msOverrides, lastReview }) {
  const now = new Date();
  const overall = pct(tasks);
  const done = tasks.filter(t=>t.status==="Done");
  const flagged = tasks.filter(t=>t.risk==="Critical Risk"||t.status==="Blocked");
  const overdue = tasks.filter(t=>{ const d=parseDate(t.dueDate); return d&&d<today()&&t.status!=="Done"; });
  const attn = [...new Map([...flagged,...overdue].map(t=>[t.id,t])).values()];
  const dueThisWeek = sortByDate(tasks.filter(t=>t.status!=="Done"&&weekBucket(parseDate(t.dueDate))==="this-week"));
  const msData = [...milestones].sort((a,b)=>a.date.localeCompare(b.date)).map(m=>{
    const items = tasks.filter(t=>taskMilestone(t)===m.id);
    const status = msOverrides[m.id] || milestoneStatus(items, m.date);
    const keyRisk = items.find(t=>t.status==="Blocked") || items.find(t=>t.risk==="Critical Risk") || items.find(t=>t.risk==="Potential Risk"&&t.comments);
    return { ...m, items, status, p:pct(items), keyRisk };
  });
  const grand = milestones.find(m=>m.id==="m8") || milestones.find(m=>/grand opening/i.test(m.name));

  const newlyDone = lastReview&&lastReview.doneIds ? tasks.filter(t=>t.status==="Done"&&!lastReview.doneIds.includes(t.id)) : null;
  const newlyFlagged = lastReview&&lastReview.doneIds ? flagged.filter(t=>!(lastReview.flaggedIds||[]).includes(t.id)) : null;

  // ---------- HTML (tables paste directly into Outlook) ----------
  const td = 'style="padding:6px 10px;border:1px solid #d5deea;font-size:12px;color:#002F6C;vertical-align:top;"';
  const th = 'style="padding:6px 10px;border:1px solid #d5deea;font-size:11px;font-weight:700;color:#ffffff;background:#002F6C;text-align:left;text-transform:uppercase;letter-spacing:0.04em;"';
  const h2 = s=>`<p style="margin:18px 0 6px;font-size:15px;font-weight:700;color:#002F6C;text-decoration:underline;">${s}</p>`;
  const tbl = rows=>`<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;">${rows}</table>`;
  const statusCell = st=>{ const c=EMAIL_MS_COLORS[st]||EMAIL_MS_COLORS["On Track"]; return `<td style="padding:6px 10px;border:1px solid #d5deea;font-size:11px;font-weight:700;color:${c.text};background:${c.bg};white-space:nowrap;">${st}</td>`; };
  const taskStatusCell = st=>{ const c=EMAIL_TASK_STATUS_COLORS[st]||EMAIL_TASK_STATUS_COLORS["Not Started"]; return `<td style="padding:6px 10px;border:1px solid #d5deea;font-size:11px;font-weight:700;color:${c.text};background:${c.bg};white-space:nowrap;">${st}</td>`; };
  const flagOf = t=>{ const r=[]; if(t.status==="Blocked")r.push("Blocked"); if(t.risk==="Critical Risk")r.push("Critical"); const d=parseDate(t.dueDate); if(d&&d<today()&&t.status!=="Done")r.push("Overdue"); return r.join(" · "); };

  const H = [];
  H.push(`<div style="font-family:Arial,Helvetica,sans-serif;color:#002F6C;max-width:760px;">`);
  H.push(`<p style="margin:0 0 10px;font-size:13px;">Team,</p>`);
  H.push(`<p style="margin:0 0 12px;font-size:13px;">Recap from today's Abha launch review:</p>`);
  H.push(`<p style="margin:0 0 4px;font-size:15px;font-weight:700;">Overall readiness: ${overall}% <span style="font-weight:400;font-size:12px;color:#5a7396;">(${done.length}/${tasks.length} tasks done)</span></p>`);
  const cd=[]; cd.push(`Soft Opening (external) from ${SOFT_OPENING_EXTERNAL.label} (${inDays(daysTo(SOFT_OPENING_EXTERNAL.date))})`); if(grand)cd.push(`Grand Opening ${esc(grand.dateLabel)} (${inDays(daysTo(grand.date))})`);
  if(cd.length) H.push(`<p style="margin:0 0 4px;font-size:12px;color:#5a7396;">${cd.join(" &nbsp;·&nbsp; ")}</p>`);

  H.push(h2("Milestones"));
  let r = `<tr><th ${th.slice(6)}>Milestone</th><th ${th.slice(6)}>Target</th><th ${th.slice(6)}>%</th><th ${th.slice(6)}>Status</th><th ${th.slice(6)}>Key risk / comment</th></tr>`;
  msData.forEach(m=>{
    const risk = m.keyRisk ? `${esc(m.keyRisk.title)}${m.keyRisk.comments?` — <i>${esc(m.keyRisk.comments)}</i>`:""}` : "—";
    r += `<tr><td ${td.slice(6)}><b>${esc(m.name)}</b></td><td ${td.slice(6)} style="white-space:nowrap;padding:6px 10px;border:1px solid #d5deea;font-size:12px;color:#002F6C;">${esc(m.dateLabel)}</td><td ${td.slice(6)}><b>${m.p}%</b></td>${statusCell(m.status)}<td ${td.slice(6)}>${risk}</td></tr>`;
  });
  H.push(tbl(r));

  if (attn.length) {
    H.push(h2(`Needs attention (${attn.length})`));
    r = `<tr><th ${th.slice(6)}>Task</th><th ${th.slice(6)}>Owner</th><th ${th.slice(6)}>Due</th><th ${th.slice(6)}>Flag</th><th ${th.slice(6)}>Status</th><th ${th.slice(6)}>Comment</th></tr>`;
    attn.forEach(t=>{
      r += `<tr><td ${td.slice(6)}>${esc(t.title)}</td><td ${td.slice(6)}>${esc(t.owner||t.team)}</td><td ${td.slice(6)}>${fmtShort(t.dueDate)}</td><td style="padding:6px 10px;border:1px solid #d5deea;font-size:11px;font-weight:700;color:#B4006F;background:#F9CFE7;white-space:nowrap;">${flagOf(t)}</td>${taskStatusCell(t.status)}<td ${td.slice(6)}><i>${esc(t.comments)||"—"}</i></td></tr>`;
    });
    H.push(tbl(r));
  }

  if (mode==="team") {
    if (dueThisWeek.length) {
      H.push(h2(`Due this week (${dueThisWeek.length})`));
      r = `<tr><th ${th.slice(6)}>Due</th><th ${th.slice(6)}>Task</th><th ${th.slice(6)}>Owner</th><th ${th.slice(6)}>Status</th><th ${th.slice(6)}>Comment</th></tr>`;
      dueThisWeek.forEach(t=>{
        r += `<tr><td ${td.slice(6)} style="white-space:nowrap;padding:6px 10px;border:1px solid #d5deea;font-size:12px;color:#002F6C;">${fmtShort(t.dueDate)}</td><td ${td.slice(6)}>${esc(t.title)}</td><td ${td.slice(6)}>${esc(t.owner||t.team)}</td>${taskStatusCell(t.status)}<td ${td.slice(6)}><i>${esc(t.comments)||"—"}</i></td></tr>`;
      });
      H.push(tbl(r));
    }
  }

  if (newlyDone) {
    H.push(h2(`Since last review (${fmtLong(new Date(lastReview.date))})`));
    const bits = [`<b>${newlyDone.length}</b> completed${lastReview.overall!==undefined?` — readiness ${lastReview.overall}% → <b>${overall}%</b>`:""}`];
    if (newlyDone.length) bits.push(newlyDone.slice(0,8).map(t=>`✓ ${esc(t.title)}`).join(" &nbsp;·&nbsp; ")+(newlyDone.length>8?` &nbsp;·&nbsp; +${newlyDone.length-8} more`:""));
    if (newlyFlagged&&newlyFlagged.length) bits.push(`<span style="color:#B4006F;">⚠ Newly flagged: ${newlyFlagged.map(t=>esc(t.title)).join(", ")}</span>`);
    H.push(`<p style="margin:0 0 4px;font-size:12px;line-height:1.6;">${bits.join("<br/>")}</p>`);
  }

  H.push(`<p style="margin:16px 0 0;font-size:13px;">Please flag anything missed before the next review.</p>`);
  H.push(`</div>`);

  // ---------- Plain-text fallback ----------
  const T = [];
  T.push("Team,");
  T.push("");
  T.push(`Recap from today's Abha launch review — overall readiness ${overall}% (${done.length}/${tasks.length} done).`);
  if(cd.length) T.push(cd.join("  |  ").replace(/&nbsp;/g," "));
  T.push("");
  T.push("MILESTONES");
  msData.forEach(m=>T.push(`• ${m.name} | ${m.dateLabel} | ${m.p}% | ${m.status}${m.keyRisk?` | Risk: ${m.keyRisk.title}${m.keyRisk.comments?` — ${m.keyRisk.comments}`:""}`:""}`));
  if (attn.length) {
    T.push("");
    T.push(`NEEDS ATTENTION (${attn.length})`);
    attn.forEach(t=>T.push(`• ${t.title} | ${t.owner||t.team} | due ${fmtShort(t.dueDate)} | ${flagOf(t)} | ${t.status}${t.comments?` | ${t.comments}`:""}`));
  }
  if (mode==="team") {
    if (dueThisWeek.length) {
      T.push("");
      T.push(`DUE THIS WEEK (${dueThisWeek.length})`);
      dueThisWeek.forEach(t=>T.push(`• ${fmtShort(t.dueDate)} | ${t.title} | ${t.owner||t.team} | ${t.status}${t.comments?` | ${t.comments}`:""}`));
    }
  }
  if (newlyDone) {
    T.push("");
    T.push(`SINCE LAST REVIEW (${fmtLong(new Date(lastReview.date))}): ${newlyDone.length} completed${lastReview.overall!==undefined?`, readiness ${lastReview.overall}% → ${overall}%`:""}`);
    if (newlyFlagged&&newlyFlagged.length) T.push(`⚠ Newly flagged: ${newlyFlagged.map(t=>t.title).join(", ")}`);
  }
  T.push("");
  T.push("Please flag anything missed before the next review.");

  const subject = mode==="leadership"
    ? `Abha Launch Readiness — ${fmtLong(now)} — ${overall}%`
    : `Abha Launch Review Recap — ${fmtLong(now)}`;
  return { subject, html: H.join(""), text: T.join("\n") };
}

function EmailSummary({ tasks, milestones, msOverrides }) {
  const [mode, setMode] = useState("leadership");
  const [lastReview, setLastReview] = useState(null);
  const [copied, setCopied] = useState(false);
  const [marked, setMarked] = useState(false);
  const previewRef = useRef();

  useEffect(()=>{
    (async()=>{
      try { const v=localStorage.getItem(RVKEY); if(v) setLastReview(JSON.parse(v)); } catch {}
    })();
  },[]);

  const email = useMemo(()=>buildEmail({ mode, tasks, milestones, msOverrides, lastReview }), [mode, tasks, milestones, msOverrides, lastReview]);

  const copyEmail = async () => {
    let ok = false;
    try {
      await navigator.clipboard.write([new ClipboardItem({
        "text/html": new Blob([email.html], {type:"text/html"}),
        "text/plain": new Blob([`Subject: ${email.subject}\n\n${email.text}`], {type:"text/plain"}),
      })]);
      ok = true;
    } catch {}
    if (!ok) {
      try {
        const sel=window.getSelection(), range=document.createRange();
        range.selectNodeContents(previewRef.current); sel.removeAllRanges(); sel.addRange(range);
        ok = document.execCommand("copy"); sel.removeAllRanges();
      } catch {}
    }
    if (!ok) {
      try { await navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.text}`); ok=true; } catch {}
    }
    setCopied(true); setTimeout(()=>setCopied(false), 2000);
  };
  const download = (asHtml) => {
    const content = asHtml
      ? `<html><head><meta charset="utf-8"><title>${esc(email.subject)}</title></head><body>${email.html}</body></html>`
      : `Subject: ${email.subject}\n\n${email.text}`;
    const blob = new Blob([content], {type: asHtml?"text/html;charset=utf-8":"text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=`SEVEN_Abha_Summary_${mode}_${new Date().toISOString().slice(0,10)}.${asHtml?"html":"txt"}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const markReviewed = () => {
    const snap = {
      date: new Date().toISOString(),
      overall: pct(tasks),
      doneIds: tasks.filter(t=>t.status==="Done").map(t=>t.id),
      flaggedIds: tasks.filter(t=>t.risk==="Critical Risk"||t.status==="Blocked").map(t=>t.id),
    };
    try { localStorage.setItem(RVKEY, JSON.stringify(snap)); } catch {}
    setLastReview(snap);
    setMarked(true); setTimeout(()=>setMarked(false), 2500);
  };

  const modeBtn=(v,l,hint)=>(
    <button onClick={()=>setMode(v)} style={{ padding:"8px 18px", borderRadius:10, fontSize:12, fontWeight:mode===v?600:400, background:mode===v?C.darkBlue:"transparent", color:mode===v?C.white:"rgba(0,47,108,0.6)", border:mode===v?"none":`1px solid ${C.border}`, cursor:"pointer", textAlign:"left" }}>
      <div>{l}</div>
      <div style={{ fontSize:10, opacity:0.65, fontWeight:400, marginTop:1 }}>{hint}</div>
    </button>
  );

  return (
    <div>
      <div style={{ display:"flex", gap:10, alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", marginBottom:16 }}>
        <div style={{ display:"flex", gap:8 }}>
          {modeBtn("leadership","Leadership","Milestones + attention items")}
          {modeBtn("team","Team detail","+ team rollup & due this week")}
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button onClick={copyEmail} style={{ padding:"9px 18px", fontSize:12, fontWeight:600, background:copied?C.green:C.cyan, color:copied?C.white:C.darkBlue, border:"none", borderRadius:10, cursor:"pointer", minWidth:120 }}>{copied?"Copied ✓":"Copy email"}</button>
          <button onClick={()=>download(true)} title="Formatted version with tables" style={{ padding:"9px 16px", fontSize:12, fontWeight:600, background:C.darkBlue, color:C.white, border:"none", borderRadius:10, cursor:"pointer" }}>Download .html</button>
          <button onClick={()=>download(false)} title="Plain-text version" style={{ padding:"9px 14px", fontSize:12, fontWeight:600, background:"var(--color-background-secondary)", color:C.darkBlue, border:`1px solid ${C.border}`, borderRadius:10, cursor:"pointer" }}>.txt</button>
          <button onClick={markReviewed} title="Snapshot today's status — the next summary will report progress since this point" style={{ padding:"9px 18px", fontSize:12, fontWeight:600, background:marked?C.bgGreen:"var(--color-background-secondary)", color:marked?"#00774C":C.darkBlue, border:`1px solid ${marked?C.green:C.border}`, borderRadius:10, cursor:"pointer" }}>{marked?"Review saved ✓":"Mark review as sent"}</button>
        </div>
      </div>

      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14, flexWrap:"wrap" }}>
        <Pill label={`Auto-generated from live tracker data — tables paste directly into Outlook`} cfg={{ bg:C.bgCyan, text:"#005F70", dot:C.cyan }} dot/>
        {lastReview
          ? <Pill label={`Comparing against review of ${fmtLong(new Date(lastReview.date))}`} cfg={{ bg:C.bgGreen, text:"#00774C", dot:C.green }} dot/>
          : <Pill label={`No baseline yet — click "Mark review as sent" after sharing`} cfg={{ bg:C.bgYellow, text:"#854F0B", dot:C.yellow }} dot/>}
      </div>

      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
        <div style={{ background:C.darkBlue, padding:"14px 22px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.cyan, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>Subject</div>
          <div style={{ fontSize:14, fontWeight:600, color:C.white }}>{email.subject}</div>
        </div>
        <div ref={previewRef} style={{ padding:"20px 24px", maxHeight:600, overflowY:"auto" }} dangerouslySetInnerHTML={{ __html: email.html }}/>
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(INIT);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("dashboard");
  const [filterTeam, setFilterTeam] = useState("All");
  const [filterRisk, setFilterRisk] = useState("All");
  const [filterOwner, setFilterOwner] = useState("All");
  const [modal, setModal] = useState(null);
  const isAdmin = useMemo(() => { try { return new URLSearchParams(window.location.search).get("admin") === ADMIN_TOKEN; } catch { return false; } }, []);
  const [expanded, setExpanded] = useState({});
  const [msOverrides, setMsOverrides] = useState(DEFAULT_OVERRIDES);
  const [milestones, setMilestones] = useState(MILESTONES);
  const [presentMode, setPresentMode] = useState(false);

  useEffect(()=>{
    (async()=>{
      let published = null;
      try {
        const res = await fetch(`data.json?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) published = await res.json();
      } catch {}
      if (isAdmin) {
        try { const v=localStorage.getItem(SKEY); if(v){ const p=JSON.parse(v); if(Array.isArray(p)&&p.length) setTasks(p); } else if (published && Array.isArray(published.tasks) && published.tasks.length) setTasks(published.tasks); } catch {}
        try { const v2=localStorage.getItem(MSKEY); if(v2){ const p=JSON.parse(v2); if(Array.isArray(p.milestones)&&p.milestones.length) setMilestones(p.milestones); if(p.overrides) setMsOverrides(p.overrides); } else if (published){ if(Array.isArray(published.milestones)&&published.milestones.length) setMilestones(published.milestones); if(published.overrides) setMsOverrides(published.overrides); } } catch {}
      } else {
        if (published) {
          if (Array.isArray(published.tasks) && published.tasks.length) setTasks(published.tasks);
          if (Array.isArray(published.milestones) && published.milestones.length) setMilestones(published.milestones);
          if (published.overrides) setMsOverrides(published.overrides);
        }
      }
      setLoaded(true);
    })();
  },[isAdmin]);

  const saveMs = (ms, ov) => { if (!isAdmin) return; try { localStorage.setItem(MSKEY, JSON.stringify({milestones:ms, overrides:ov})); } catch {} };
  const commitTasks = (updater) => { if (!isAdmin) return; setTasks(prev=>{ const next = typeof updater==="function"?updater(prev):updater; try { localStorage.setItem(SKEY, JSON.stringify(next)); } catch {} return next; }); };
  const updateStatus = (id, status) => commitTasks(ts=>ts.map(t=>t.id===id?{...t,status}:t));
  const save = f => { commitTasks(ts=>f.id?ts.map(t=>t.id===f.id?f:t):[...ts,{...f,id:Date.now().toString()}]); setModal(null); };
  const del  = id => commitTasks(ts=>ts.filter(t=>t.id!==id));
  const tog  = k => setExpanded(e=>({...e,[k]:!e[k]}));
  const backupData = () => {
    const data = JSON.stringify({ tasks, milestones, overrides:msOverrides, exportedAt:new Date().toISOString() }, null, 2);
    const blob = new Blob([data], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `SEVEN_Abha_Backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const fileInputRef = useRef(null);
  const restoreData = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!confirm(`Restore data from backup${data.exportedAt?` (exported ${new Date(data.exportedAt).toLocaleString()})`:""}? This will replace current tracker data.`)) { e.target.value=""; return; }
        if (Array.isArray(data.tasks)) commitTasks(data.tasks);
        if (Array.isArray(data.milestones)) { setMilestones(data.milestones); saveMs(data.milestones, data.overrides || data.msOverrides || {}); }
        if (data.overrides || data.msOverrides) setMsOverrides(data.overrides || data.msOverrides);
        alert("Backup restored successfully.");
      } catch (err) {
        alert("Failed to restore: " + err.message);
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  };
  const publishData = () => {
    const data = JSON.stringify({ tasks, milestones, overrides:msOverrides, publishedAt:new Date().toISOString() }, null, 2);
    const blob = new Blob([data], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "data.json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("data.json downloaded ✓\n\nNext: upload it to your GitHub repo (replace the existing data.json in the public folder). Vercel auto-redeploys in ~30 seconds and your team sees the update.");
  };

  const owners = useMemo(()=>["All",...Array.from(new Set(tasks.map(t=>t.owner).filter(Boolean)))],[tasks]);
  const overall=useMemo(()=>pct(tasks),[tasks]);
  const phaseT=tasks.filter(t=>(filterTeam==="All"||t.team===filterTeam)&&(filterRisk==="All"||t.risk===filterRisk)&&(filterOwner==="All"||t.owner===filterOwner));
  const byTA=phaseT.reduce((a,t)=>{ if(!a[t.team])a[t.team]={}; if(!a[t.team][t.action])a[t.team][t.action]=[]; a[t.team][t.action].push(t); return a; },{});
  const overdueCount=tasks.filter(t=>{ const d=parseDate(t.dueDate); return d&&d<today()&&t.status!=="Done"; }).length;
  const heatmap=useMemo(()=>{ const b={overdue:[],["this-week"]:[],["next-week"]:[],later:[],["no-date"]:[]}; tasks.filter(t=>t.status!=="Done").forEach(t=>{ b[weekBucket(parseDate(t.dueDate))].push(t); }); return b; },[tasks]);

  const navBtn=(v,l)=>(<button onClick={()=>setView(v)} style={{ padding:"8px 20px", borderRadius:20, fontSize:13, fontWeight:view===v?600:400, background:view===v?C.darkBlue:"transparent", color:view===v?C.white:"rgba(0,47,108,0.6)", border:view===v?"none":"1px solid rgba(0,47,108,0.15)", cursor:"pointer" }}>{l}</button>);
  const tc=t=>TEAM_CFG[t.team]||TEAM_CFG["Brand Team"];
  const rc=t=>RISK_CFG[t.risk]||RISK_CFG["On Track"];
  const newTask=(team="Brand Team",action="",milestone="")=>{ if(!isAdmin) return; setModal({title:"",action,phase:"Pre-Launch",team,owner:"",destination:"",milestone,priority:"Medium",dueDate:"",status:"Not Started",risk:"On Track",comments:""}); };
  const openEdit=(t)=>{ if(!isAdmin) return; setModal(t); };

  return (
    <div style={{ fontFamily:"var(--font-sans)", padding:"1.25rem 0" }}>
      {presentMode && <PresentationMode tasks={tasks} milestones={milestones} msOverrides={msOverrides} onClose={()=>setPresentMode(false)}/>}

      <div style={{ background:C.darkBlue, borderRadius:16, padding:"20px 24px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.12em", color:C.cyan, textTransform:"uppercase", marginBottom:2 }}>SEVEN</div>
          <div style={{ fontSize:18, fontWeight:700, color:C.white }}>Abha Destination</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:1 }}>Launch Readiness Tracker</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:28, fontWeight:700, color:C.cyan, lineHeight:1 }}>{overall}%</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", marginTop:2, letterSpacing:"0.06em", textTransform:"uppercase" }}>Overall ready</div>
          </div>
          {overdueCount>0 && <div style={{ background:"rgba(229,0,122,0.2)", border:"1px solid rgba(229,0,122,0.4)", borderRadius:10, padding:"6px 12px", fontSize:12, color:"#F4519B", fontWeight:600 }}>⚠ {overdueCount} overdue</div>}
          <div style={{ width:1, height:40, background:"rgba(255,255,255,0.15)" }}/>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", padding:"5px 10px", borderRadius:8, background:isAdmin?"rgba(0,213,235,0.15)":"rgba(255,255,255,0.08)", color:isAdmin?C.cyan:"rgba(255,255,255,0.55)", border:isAdmin?"1px solid rgba(0,213,235,0.35)":"1px solid rgba(255,255,255,0.15)" }} title={isAdmin?"You have edit access":"Read-only view — only the admin can edit"}>{isAdmin?"● Admin":"● View-only"}</div>
          <button onClick={()=>setPresentMode(true)} style={{ padding:"9px 18px", fontSize:12, fontWeight:600, background:"rgba(255,255,255,0.1)", color:C.white, border:"1px solid rgba(255,255,255,0.25)", borderRadius:10, cursor:"pointer" }}>Present</button>
          {isAdmin && <>
          <button onClick={backupData} title="Download a backup file of all your data" style={{ padding:"9px 16px", fontSize:12, fontWeight:600, background:"rgba(255,255,255,0.1)", color:C.white, border:"1px solid rgba(255,255,255,0.25)", borderRadius:10, cursor:"pointer" }}>Backup</button>
          <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={restoreData} style={{ display:"none" }}/>
          <button onClick={()=>fileInputRef.current && fileInputRef.current.click()} title="Load a backup file to restore data" style={{ padding:"9px 16px", fontSize:12, fontWeight:600, background:"rgba(255,255,255,0.1)", color:C.white, border:"1px solid rgba(255,255,255,0.25)", borderRadius:10, cursor:"pointer" }}>Restore</button>
          <button onClick={publishData} title="Download data.json to upload to your GitHub repo — this is how the team sees your updates" style={{ padding:"9px 18px", fontSize:12, fontWeight:700, background:C.green, color:C.white, border:"none", borderRadius:10, cursor:"pointer" }}>⤴ Publish</button>
          <button onClick={()=>newTask()} style={{ padding:"9px 20px", fontSize:13, fontWeight:600, background:C.cyan, color:C.darkBlue, border:"none", borderRadius:10, cursor:"pointer" }}>+ Add task</button>
          </>}
        </div>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:20, alignItems:"center", justifyContent:"space-between", flexWrap:"wrap" }}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>{navBtn("dashboard","Dashboard")}{navBtn("milestones","Milestones")}{navBtn("tracker","Detailed tracker")}{navBtn("kanban","Kanban")}{navBtn("destinations","Maram's Destination Tracker")}{navBtn("summary","✉ Email Summary")}</div>
        {view==="tracker" && (
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>{ const all={}; Object.keys(byTA).forEach(team=>{ all[`t-${team}`]=true; Object.keys(byTA[team]).forEach(action=>{ all[`${team}-${action}`]=true; }); }); setExpanded(all); }} title="Expand all" style={{ padding:"7px 10px", borderRadius:8, background:"var(--color-background-secondary)", border:`1px solid ${C.border}`, cursor:"pointer", display:"flex", alignItems:"center" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5L8 11L14 5" stroke={C.darkBlue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 9L8 15L14 9" stroke={C.darkBlue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/></svg>
            </button>
            <button onClick={()=>setExpanded({})} title="Collapse all" style={{ padding:"7px 10px", borderRadius:8, background:"var(--color-background-secondary)", border:`1px solid ${C.border}`, cursor:"pointer", display:"flex", alignItems:"center" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 11L8 5L14 11" stroke={C.darkBlue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 7L8 1L14 7" stroke={C.darkBlue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/></svg>
            </button>
          </div>
        )}
      </div>

      {view==="dashboard" && (<>
        <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr", gap:12, marginBottom:16 }}>
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", display:"flex", alignItems:"center", gap:14, borderTop:`3px solid ${C.cyan}` }}>
            <RingScore val={overall}/><div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.darkBlue, marginBottom:6 }}>Pre-Launch readiness</div>
              <Bar pct={overall} color={C.cyan} bg="rgba(0,47,108,0.06)" h={5}/>
              <div style={{ fontSize:11, color:"rgba(0,47,108,0.5)", marginTop:5 }}>{tasks.filter(t=>t.status==="Done").length} / {tasks.length} tasks done</div>
            </div>
          </div>
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", borderTop:`3px solid ${C.green}` }}>
            <div style={{ fontSize:12, fontWeight:600, color:"rgba(0,47,108,0.6)", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>Completed</div>
            <div style={{ fontSize:30, fontWeight:700, color:C.green, lineHeight:1 }}>{tasks.filter(t=>t.status==="Done").length}</div>
            <div style={{ fontSize:11, color:"rgba(0,47,108,0.5)", marginTop:4 }}>tasks done</div>
          </div>
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", borderTop:`3px solid ${C.yellow}` }}>
            <div style={{ fontSize:12, fontWeight:600, color:"rgba(0,47,108,0.6)", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>Remaining</div>
            <div style={{ fontSize:30, fontWeight:700, color:C.yellow, lineHeight:1 }}>{tasks.filter(t=>t.status!=="Done").length}</div>
            <div style={{ fontSize:11, color:"rgba(0,47,108,0.5)", marginTop:4 }}>tasks open</div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16 }}>
          {RISKS.map(r=>{ const n=tasks.filter(t=>t.risk===r).length, cfg=RISK_CFG[r]; return (
            <div key={r} style={{ background:cfg.bg, borderRadius:14, padding:"16px 20px", borderLeft:`4px solid ${cfg.dot}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8 }}><span style={{ width:9, height:9, borderRadius:"50%", background:cfg.dot }}/><span style={{ fontSize:12, fontWeight:600, color:cfg.text, textTransform:"uppercase", letterSpacing:"0.07em" }}>{r}</span></div>
              <div style={{ fontSize:30, fontWeight:700, color:cfg.text, lineHeight:1 }}>{n}</div>
              <div style={{ fontSize:11, color:cfg.text, opacity:0.7, marginTop:4 }}>tasks</div>
            </div>
          );})}
        </div>
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
            <span style={{ width:4, height:18, borderRadius:2, background:`linear-gradient(${C.cyan},${C.darkBlue})` }}/>
            <span style={{ fontSize:14, fontWeight:600, color:C.darkBlue }}>Due date heatmap</span>
            <span style={{ fontSize:11, color:"rgba(0,47,108,0.4)" }}>open tasks only</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
            {["overdue","this-week","next-week","later","no-date"].map(b=>{ const cfg=BUCKET_CFG[b], items=heatmap[b]; return (
              <div key={b} style={{ background:cfg.bg, borderRadius:12, padding:"12px 14px", border:`1px solid ${cfg.border}33` }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}><span style={{ width:8, height:8, borderRadius:"50%", background:cfg.dot }}/><span style={{ fontSize:11, fontWeight:700, color:cfg.text, textTransform:"uppercase", letterSpacing:"0.06em" }}>{cfg.label}</span></div>
                <div style={{ fontSize:26, fontWeight:700, color:cfg.text, lineHeight:1, marginBottom:6 }}>{items.length}</div>
                {items.slice(0,3).map(t=><div key={t.id} style={{ fontSize:10, color:cfg.text, opacity:0.8, marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>· {t.title}</div>)}
                {items.length>3 && <div style={{ fontSize:10, color:cfg.text, opacity:0.6 }}>+{items.length-3} more</div>}
              </div>
            );})}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:16 }}>
          {TEAMS.map(team=>{ const tt=tasks.filter(t=>t.team===team), sc=pct(tt), cfg=TEAM_CFG[team]; return (
            <div key={team} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ width:10, height:10, borderRadius:"50%", background:cfg.primary }}/><span style={{ fontSize:13, fontWeight:600, color:C.darkBlue }}>{team}</span></div>
                <span style={{ fontSize:14, fontWeight:700, color:scoreColor(sc) }}>{sc}%</span>
              </div>
              <Bar pct={sc} color={cfg.primary} bg={cfg.bg} h={5}/>
              <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
                {STATUSES.map(st=>{ const n=tt.filter(t=>t.status===st).length; return n>0?<Pill key={st} label={`${n} ${st}`} cfg={STATUS_CFG[st]} dot/>:null; })}
              </div>
            </div>
          );})}
        </div>
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
            <span style={{ width:4, height:18, borderRadius:2, background:`linear-gradient(${C.magenta},${C.orange})` }}/>
            <span style={{ fontSize:14, fontWeight:600, color:C.darkBlue }}>Flagged tasks</span>
            <span style={{ fontSize:11, color:"rgba(0,47,108,0.4)" }}>critical risk + overdue</span>
          </div>
          {(()=>{ const critical=tasks.filter(t=>t.risk==="Critical Risk"||t.status==="Blocked"); const overdue=tasks.filter(t=>{ const d=parseDate(t.dueDate); return d&&d<today()&&t.status!=="Done"; }); const all=[...new Map([...critical,...overdue].map(t=>[t.id,t])).values()]; return all.length===0?<div style={{ fontSize:13, color:"rgba(0,47,108,0.4)" }}>No flagged tasks.</div>:all.map(t=>{ const isOverdue=parseDate(t.dueDate)&&parseDate(t.dueDate)<today()&&t.status!=="Done"; return (<div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:`1px solid ${C.border}`, flexWrap:"wrap" }}><span style={{ width:8, height:8, borderRadius:"50%", background:rc(t).dot, flexShrink:0 }}/><span style={{ fontSize:13, flex:1, color:C.darkBlue, fontWeight:500 }}>{t.title}</span>{isOverdue&&<span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#FCEBEB", color:"#A32D2D" }}>OVERDUE</span>}<span style={{ fontSize:11, color:"rgba(0,47,108,0.45)" }}>{t.team}</span><Pill label={t.status} cfg={STATUS_CFG[t.status]} dot/></div>); }); })()}
        </div>
      </>)}

      {view==="milestones" && (()=>{
        const msData = [...milestones].sort((a,b)=>a.date.localeCompare(b.date)).map(m=>{
          const items = tasks.filter(t=>taskMilestone(t)===m.id);
          const status = msOverrides[m.id] || milestoneStatus(items, m.date);
          const keyRisk = items.find(t=>t.status==="Blocked") || items.find(t=>t.risk==="Critical Risk") || items.find(t=>t.risk==="Potential Risk"&&t.comments);
          const nextAction = sortByDate(items.filter(t=>t.status!=="Done"))[0];
          return { ...m, items, status, p:pct(items), keyRisk, nextAction };
        });
        return (
          <div>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px 16px", marginBottom:18, overflowX:"auto" }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.darkBlue, marginBottom:18 }}>Launch timeline</div>
              <div style={{ display:"flex", alignItems:"flex-start", minWidth:760, position:"relative" }}>
                <div style={{ position:"absolute", top:7, left:"6%", right:"6%", height:2, background:"rgba(0,47,108,0.12)" }}/>
                {msData.map((m)=>{ const cfg=MS_STATUS_CFG[m.status]; return (
                  <div key={m.id} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", position:"relative", padding:"0 4px" }}>
                    <div style={{ width:16, height:16, borderRadius:"50%", background:cfg.dot, border:"3px solid #fff", boxShadow:`0 0 0 2px ${cfg.dot}`, zIndex:1, marginBottom:10 }}/>
                    <div style={{ fontSize:10, fontWeight:700, color:cfg.text, textAlign:"center", marginBottom:3 }}>{m.dateLabel}</div>
                    <div style={{ fontSize:11, fontWeight:600, color:C.darkBlue, textAlign:"center", lineHeight:1.3, marginBottom:5 }}>{m.name}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:scoreColor(m.p) }}>{m.p}%</div>
                  </div>
                );})}
              </div>
            </div>

            <div style={{ background:C.darkBlue, borderRadius:16, padding:"18px 22px", marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.cyan, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>Leadership summary</div>
              <div style={{ display:"grid", gridTemplateColumns:"auto 1.4fr 0.7fr 0.5fr 1.6fr", gap:"10px 16px", alignItems:"center" }}>
                <div style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.06em" }}></div>
                <div style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Milestone</div>
                <div style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Target</div>
                <div style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Ready</div>
                <div style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Key risk</div>
                {msData.map(m=>{ const cfg=MS_STATUS_CFG[m.status]; return (
                  <div key={m.id} style={{ display:"contents" }}>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, background:cfg.bg, color:cfg.text, whiteSpace:"nowrap" }}><span style={{ width:7, height:7, borderRadius:"50%", background:cfg.dot }}/>{m.status}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:"#fff" }}>{m.name}</span>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>{m.dateLabel}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:m.p>=70?"#7ED957":m.p>=40?"#FFCC3E":"#F4519B" }}>{m.p}%</span>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.7)", lineHeight:1.3 }}>{m.keyRisk ? (m.keyRisk.comments || m.keyRisk.title) : "—"}</span>
                  </div>
                );})}
              </div>
            </div>

            {msData.map(m=>{ const cfg=MS_STATUS_CFG[m.status], mk=`ms-${m.id}`; return (
              <div key={m.id} style={{ marginBottom:10, background:C.white, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
                <div onClick={()=>tog(mk)} style={{ display:"flex", alignItems:"center", gap:12, padding:"15px 20px", cursor:"pointer", borderLeft:`4px solid ${cfg.dot}` }}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, background:cfg.bg, color:cfg.text, whiteSpace:"nowrap" }}><span style={{ width:7, height:7, borderRadius:"50%", background:cfg.dot }}/>{m.status}</span>
                  <span style={{ fontSize:14, fontWeight:600, color:C.darkBlue, flex:1 }}>{m.name}</span>
                  <span style={{ fontSize:11, fontWeight:600, color:"rgba(0,47,108,0.5)", padding:"2px 10px", borderRadius:20, background:"#F0F4FA" }}>{m.dateLabel}</span>
                  <span style={{ fontSize:12, color:"rgba(0,47,108,0.55)" }}>{m.items.filter(t=>t.status==="Done").length}/{m.items.length} done</span>
                  <div style={{ width:72 }}><Bar pct={m.p} color={scoreColor(m.p)} bg="rgba(0,47,108,0.08)" h={5}/></div>
                  <span style={{ fontSize:13, fontWeight:700, color:scoreColor(m.p), minWidth:36, textAlign:"right" }}>{m.p}%</span>
                  <span style={{ fontSize:11, color:"rgba(0,47,108,0.4)" }}>{expanded[mk]?"▲":"▼"}</span>
                </div>
                {expanded[mk] && (
                  <div style={{ borderTop:`1px solid ${C.border}` }}>
                    <div style={{ display:"flex", gap:20, padding:"12px 24px", background:"#F7FBFD", flexWrap:"wrap" }}>
                      <div style={{ flex:1, minWidth:150 }}>
                        <div style={{ fontSize:10, fontWeight:600, color:"rgba(0,47,108,0.45)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>Status</div>
                        <select disabled={!isAdmin} value={msOverrides[m.id]||""} onChange={e=>{ if(!isAdmin) return; const next={...msOverrides,[m.id]:e.target.value}; setMsOverrides(next); saveMs(milestones,next); }} style={{ fontSize:12, padding:"4px 8px", borderRadius:6, border:`1px solid ${C.border}`, opacity:isAdmin?1:0.6 }}>
                          <option value="">Auto: {milestoneStatus(m.items,m.date)}</option>
                          {Object.keys(MS_STATUS_CFG).map(s=><option key={s} value={s}>{s} (manual)</option>)}
                        </select>
                      </div>
                      <div style={{ flex:1, minWidth:150 }}>
                        <div style={{ fontSize:10, fontWeight:600, color:"rgba(0,47,108,0.45)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>Target date</div>
                        <input type="date" disabled={!isAdmin} value={m.date||""} onChange={e=>{ if(!isAdmin) return; setMilestones(ms=>{ const next=ms.map(x=>x.id===m.id?{...x,date:e.target.value}:x); saveMs(next,msOverrides); return next; }); }} style={{ fontSize:12, padding:"4px 8px", borderRadius:6, border:`1px solid ${C.border}`, width:"100%", boxSizing:"border-box", opacity:isAdmin?1:0.6 }}/>
                      </div>
                      <div style={{ flex:1, minWidth:130 }}>
                        <div style={{ fontSize:10, fontWeight:600, color:"rgba(0,47,108,0.45)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>Display label</div>
                        <input disabled={!isAdmin} value={m.dateLabel||""} onChange={e=>{ if(!isAdmin) return; setMilestones(ms=>{ const next=ms.map(x=>x.id===m.id?{...x,dateLabel:e.target.value}:x); saveMs(next,msOverrides); return next; }); }} placeholder="e.g. 5 Jul 2026" style={{ fontSize:12, padding:"4px 8px", borderRadius:6, border:`1px solid ${C.border}`, width:"100%", boxSizing:"border-box", opacity:isAdmin?1:0.6 }}/>
                      </div>
                      <div style={{ flex:2, minWidth:200 }}>
                        <div style={{ fontSize:10, fontWeight:600, color:"rgba(0,47,108,0.45)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>Next critical action</div>
                        <div style={{ fontSize:13, color:C.darkBlue, fontWeight:500 }}>{m.nextAction ? m.nextAction.title : "All tasks complete ✓"}</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"flex-end" }}>
                        {isAdmin && <button onClick={()=>newTask("Brand Team","",m.id)} style={{ padding:"8px 16px", fontSize:12, fontWeight:600, background:C.darkBlue, color:C.white, border:"none", borderRadius:8, cursor:"pointer", whiteSpace:"nowrap" }}>+ Add task</button>}
                      </div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 100px 52px", gap:8, padding:"8px 24px", fontSize:10, fontWeight:600, color:"rgba(0,47,108,0.4)", letterSpacing:"0.07em", textTransform:"uppercase", borderBottom:`1px solid ${C.border}`, borderTop:`1px solid ${C.border}` }}>
                      <span>Task</span><span>Owner</span><span>Due</span><span>Risk</span><span>Status</span><span></span>
                    </div>
                    {m.items.length===0 ? <div style={{ padding:"14px 24px", fontSize:12, color:"rgba(0,47,108,0.4)", fontStyle:"italic" }}>No tasks mapped to this milestone yet.</div>
                      : sortByDate(m.items).map(t=>{ const d=parseDate(t.dueDate), isOverdue=d&&d<today()&&t.status!=="Done"; return (
                        <div key={t.id} style={{ borderBottom:`1px solid ${C.border}`, background:isOverdue?"#fff8f8":"transparent" }}>
                          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 100px 52px", gap:8, padding:"10px 24px 6px", alignItems:"center" }}>
                            <span style={{ color:C.darkBlue, fontWeight:500, fontSize:13 }}>{t.title}{isOverdue&&<span style={{ marginLeft:6, fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:20, background:"#FCEBEB", color:"#A32D2D" }}>OVERDUE</span>}</span>
                            <span style={{ color:"rgba(0,47,108,0.55)", fontSize:12 }}>{t.owner||"—"}</span>
                            <span style={{ color:isOverdue?"#A32D2D":"rgba(0,47,108,0.55)", fontSize:11, fontWeight:isOverdue?600:400 }}>{t.dueDate||"—"}</span>
                            <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, color:rc(t).text }}><span style={{ width:7, height:7, borderRadius:"50%", background:rc(t).dot }}/>{t.risk}</span>
                            <StatusDropdown current={t.status} onChange={st=>updateStatus(t.id,st)}/>
                            <div style={{ display:"flex", gap:4 }}>
                              <button onClick={()=>openEdit(t)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(0,47,108,0.4)", fontSize:13, padding:2 }}>✏️</button>
                              <button onClick={()=>del(t.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(0,47,108,0.4)", fontSize:13, padding:2 }}>🗑</button>
                            </div>
                          </div>
                          {t.comments && <div style={{ padding:"0 24px 10px", fontSize:11, color:"rgba(0,47,108,0.55)", fontStyle:"italic", display:"flex", gap:6, alignItems:"flex-start" }}><span style={{ flexShrink:0 }}>💬</span><span>{t.comments}</span></div>}
                        </div>
                      );})}
                  </div>
                )}
              </div>
            );})}
          </div>
        );
      })()}

      {view==="tracker" && (
        <div>
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
            <select value={filterTeam} onChange={e=>setFilterTeam(e.target.value)} style={{ fontSize:12, padding:"6px 10px", borderRadius:8, border:`1px solid ${C.border}`, color:C.darkBlue }}><option value="All">All teams</option>{TEAMS.map(t=><option key={t}>{t}</option>)}</select>
            <select value={filterOwner} onChange={e=>setFilterOwner(e.target.value)} style={{ fontSize:12, padding:"6px 10px", borderRadius:8, border:`1px solid ${C.border}`, color:C.darkBlue }}><option value="All">All owners</option>{owners.filter(o=>o!=="All").map(o=><option key={o}>{o}</option>)}</select>
            <select value={filterRisk} onChange={e=>setFilterRisk(e.target.value)} style={{ fontSize:12, padding:"6px 10px", borderRadius:8, border:`1px solid ${C.border}`, color:C.darkBlue }}><option value="All">All risks</option>{RISKS.map(r=><option key={r}>{r}</option>)}</select>
          </div>
          {Object.entries(byTA).map(([team,actions])=>{ const teamT=Object.values(actions).flat(), cfg=TEAM_CFG[team]||TEAM_CFG["Brand Team"], ts=pct(teamT), tk=`t-${team}`; return (
            <div key={team} style={{ marginBottom:10, background:C.white, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
              <div onClick={()=>tog(tk)} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 20px", cursor:"pointer", background:cfg.bg, borderLeft:`4px solid ${cfg.primary}` }}>
                <span style={{ width:10, height:10, borderRadius:"50%", background:cfg.primary }}/><span style={{ fontSize:14, fontWeight:600, color:C.darkBlue, flex:1 }}>{team}</span>
                <span style={{ fontSize:12, color:"rgba(0,47,108,0.55)" }}>{teamT.filter(t=>t.status==="Done").length}/{teamT.length} done</span>
                <div style={{ width:72 }}><Bar pct={ts} color={cfg.primary} bg="rgba(0,47,108,0.08)" h={4}/></div>
                <span style={{ fontSize:12, fontWeight:700, color:scoreColor(ts), minWidth:32, textAlign:"right" }}>{ts}%</span>
                <span style={{ fontSize:11, color:"rgba(0,47,108,0.4)" }}>{expanded[tk]?"▲":"▼"}</span>
              </div>
              {expanded[tk]&&Object.entries(actions).map(([action,items])=>{ const ak=`${team}-${action}`, as=pct(items); return (
                <div key={action} style={{ borderTop:`1px solid ${C.border}` }}>
                  <div onClick={()=>tog(ak)} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 20px 11px 28px", cursor:"pointer", background:"#F7FBFD" }}>
                    <span style={{ fontSize:13, fontWeight:600, color:C.darkBlue, flex:1 }}>{action||"Unassigned project"}</span>
                    <span style={{ fontSize:11, color:"rgba(0,47,108,0.45)" }}>{items.filter(t=>t.status==="Done").length}/{items.length}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:scoreColor(as), minWidth:32, textAlign:"right" }}>{as}%</span>
                    <span style={{ fontSize:11, color:"rgba(0,47,108,0.4)" }}>{expanded[ak]?"▲":"▼"}</span>
                  </div>
                  {expanded[ak]&&(<div>
                    <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 100px 52px", gap:8, padding:"6px 20px 6px 32px", fontSize:10, fontWeight:600, color:"rgba(0,47,108,0.4)", letterSpacing:"0.07em", textTransform:"uppercase", borderBottom:`1px solid ${C.border}` }}>
                      <span>Task</span><span>Owner</span><span>Due</span><span>Priority</span><span>Risk</span><span>Status</span><span></span>
                    </div>
                    {sortByDate(items).map(t=>{ const d=parseDate(t.dueDate), isOverdue=d&&d<today()&&t.status!=="Done"; return (
                      <div key={t.id} style={{ borderBottom:`1px solid ${C.border}`, background:isOverdue?"#fff8f8":"transparent" }}>
                        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 100px 52px", gap:8, padding:"10px 20px 6px 32px", alignItems:"center" }}>
                          <span style={{ color:C.darkBlue, fontWeight:500, fontSize:13 }}>{t.title}{t.destination&&<span style={{ marginLeft:6, fontSize:10, fontWeight:600, padding:"1px 7px", borderRadius:20, background:C.bgBlue, color:C.darkBlue }}>{t.destination}</span>}{isOverdue&&<span style={{ marginLeft:6, fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:20, background:"#FCEBEB", color:"#A32D2D" }}>OVERDUE</span>}</span>
                          <span style={{ color:"rgba(0,47,108,0.55)", fontSize:12 }}>{t.owner||"—"}</span>
                          <span style={{ color:isOverdue?"#A32D2D":"rgba(0,47,108,0.55)", fontSize:11, fontWeight:isOverdue?600:400 }}>{t.dueDate||"—"}</span>
                          <Pill label={t.priority} cfg={PRIORITY_CFG[t.priority]||PRIORITY_CFG["Medium"]} dot/>
                          <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, color:rc(t).text }}><span style={{ width:7, height:7, borderRadius:"50%", background:rc(t).dot }}/>{t.risk}</span>
                          <StatusDropdown current={t.status} onChange={st=>updateStatus(t.id,st)}/>
                          <div style={{ display:"flex", gap:4 }}>
                            <button onClick={()=>openEdit(t)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(0,47,108,0.4)", fontSize:13, padding:2 }}>✏️</button>
                            <button onClick={()=>del(t.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(0,47,108,0.4)", fontSize:13, padding:2 }}>🗑</button>
                          </div>
                        </div>
                        {t.comments && <div style={{ padding:"0 20px 10px 32px", fontSize:11, color:"rgba(0,47,108,0.55)", fontStyle:"italic", display:"flex", gap:6, alignItems:"flex-start" }}><span style={{ flexShrink:0 }}>💬</span><span>{t.comments}</span></div>}
                      </div>
                    );})}
                  </div>)}
                </div>
              );})}
            </div>
          );})}
        </div>
      )}

      {view==="kanban" && (
        <div>
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            <select value={filterTeam} onChange={e=>setFilterTeam(e.target.value)} style={{ fontSize:12, padding:"6px 10px", borderRadius:8, border:`1px solid ${C.border}`, color:C.darkBlue }}><option value="All">All teams</option>{TEAMS.map(t=><option key={t}>{t}</option>)}</select>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
            {STATUSES.map(col=>{ const colT=tasks.filter(t=>t.status===col&&(filterTeam==="All"||t.team===filterTeam)); const accent=col==="Done"?C.green:col==="Blocked"?C.magenta:col==="In Progress"?C.cyan:C.darkBlue; return (
              <div key={col} style={{ background:"#F5F9FC", borderRadius:14, padding:"12px 10px", minHeight:180, borderTop:`3px solid ${accent}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}><span style={{ width:7, height:7, borderRadius:"50%", background:accent }}/><span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:C.darkBlue }}>{col}</span><span style={{ fontSize:11, background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"0 7px", color:"rgba(0,47,108,0.5)", marginLeft:"auto" }}>{colT.length}</span></div>
                {colT.map(t=>{ const d=parseDate(t.dueDate), isOverdue=d&&d<today()&&t.status!=="Done"; return (
                  <div key={t.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 12px", marginBottom:8, borderLeft:`3px solid ${tc(t).primary}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7 }}><span style={{ fontSize:12, fontWeight:600, color:C.darkBlue, lineHeight:1.4, flex:1 }}>{t.title}</span><button onClick={()=>openEdit(t)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(0,47,108,0.35)", fontSize:12, padding:2 }}>✏️</button></div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:7 }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:600, color:rc(t).text, background:rc(t).bg, padding:"2px 8px", borderRadius:20 }}><span style={{ width:5, height:5, borderRadius:"50%", background:rc(t).dot }}/>{t.risk}</span>
                      {isOverdue&&<span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, background:"#FCEBEB", color:"#A32D2D" }}>OVERDUE</span>}
                    </div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", fontSize:11 }}>
                      <span style={{ padding:"1px 8px", borderRadius:20, background:tc(t).bg, color:tc(t).text, fontWeight:500 }}>{t.team.replace(" Team","")}</span>
                      {t.owner&&<span style={{ color:"rgba(0,47,108,0.5)" }}>👤 {t.owner}</span>}
                      {t.dueDate&&<span style={{ color:isOverdue?"#A32D2D":"rgba(0,47,108,0.5)", fontWeight:isOverdue?600:400 }}>📅 {t.dueDate}</span>}
                    </div>
                  </div>
                );})}
              </div>
            );})}
          </div>
        </div>
      )}

      {view==="destinations" && (()=>{
        const destTasks = tasks.filter(t=>t.team==="Destinations Team");
        const destPct = pct(destTasks);
        const byPillar = {}; DEST_PILLARS.forEach(p=>{ byPillar[p]=destTasks.filter(t=>normApos(t.action)===normApos(p)); });
        const otherTasks = destTasks.filter(t=>!DEST_PILLARS.some(p=>normApos(p)===normApos(t.action)));
        const cfg = TEAM_CFG["Destinations Team"];
        const exportExcel = () => {
          const headers = ["Pillar","Task","Owner","Destination","Due Date","Priority","Risk","Status","Comments"];
          const esc = v => `"${String(v??"").replace(/"/g,'""')}"`;
          const ordered = [...DEST_PILLARS.flatMap(p=>sortByStatus(byPillar[p])), ...sortByStatus(otherTasks)];
          const rows = ordered.map(t=>[t.action,t.title,t.owner,t.destination,t.dueDate,t.priority,t.risk,t.status,t.comments].map(esc).join(","));
          const csv = "\uFEFF" + [headers.map(esc).join(","), ...rows].join("\r\n");
          const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = "Maram_Destination_Tracker.csv";
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          URL.revokeObjectURL(url);
        };
        return (
          <div>
            <div style={{ background:`linear-gradient(135deg,${C.magenta},${C.darkBlue})`, borderRadius:14, padding:"18px 22px", marginBottom:18, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:C.white }}>Maram's Destination Tracker</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{destTasks.length} tasks · {destTasks.filter(t=>t.status==="Done").length} done</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ textAlign:"center" }}><div style={{ fontSize:26, fontWeight:700, color:C.white, lineHeight:1 }}>{destPct}%</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", marginTop:2, textTransform:"uppercase", letterSpacing:"0.06em" }}>ready</div></div>
                <button onClick={exportExcel} style={{ padding:"9px 16px", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.15)", color:C.white, border:"1px solid rgba(255,255,255,0.3)", borderRadius:10, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1V10M8 10L4.5 6.5M8 10L11.5 6.5" stroke={C.white} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 11V13.5C2 14 2.4 14.5 3 14.5H13C13.6 14.5 14 14 14 13.5V11" stroke={C.white} strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Export
                </button>
                {isAdmin && <button onClick={()=>newTask("Destinations Team","Destination Film")} style={{ padding:"9px 18px", fontSize:13, fontWeight:600, background:C.white, color:C.magenta, border:"none", borderRadius:10, cursor:"pointer" }}>+ Add task</button>}
              </div>
            </div>
            {DEST_PILLARS.map(pillar=>{ const items=byPillar[pillar], ps=pct(items), pk=`pillar-${pillar}`; return (
              <div key={pillar} style={{ marginBottom:10, background:C.white, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
                <div onClick={()=>tog(pk)} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 20px", cursor:"pointer", background:cfg.bg, borderLeft:`4px solid ${cfg.primary}` }}>
                  <span style={{ width:10, height:10, borderRadius:"50%", background:cfg.primary }}/><span style={{ fontSize:14, fontWeight:600, color:C.darkBlue, flex:1 }}>{pillar}</span>
                  <span style={{ fontSize:12, color:"rgba(0,47,108,0.55)" }}>{items.filter(t=>t.status==="Done").length}/{items.length} done</span>
                  <div style={{ width:72 }}><Bar pct={ps} color={cfg.primary} bg="rgba(0,47,108,0.08)" h={4}/></div>
                  <span style={{ fontSize:12, fontWeight:700, color:scoreColor(ps), minWidth:32, textAlign:"right" }}>{items.length?ps+"%":"—"}</span>
                  <span style={{ fontSize:11, color:"rgba(0,47,108,0.4)" }}>{expanded[pk]?"▲":"▼"}</span>
                </div>
                {expanded[pk]&&(<div>
                  {items.length===0
                    ? <div style={{ padding:"14px 32px", fontSize:12, color:"rgba(0,47,108,0.4)", fontStyle:"italic" }}>No tasks yet — click "+ Add task" to add one.</div>
                    : (<>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 100px 52px", gap:8, padding:"6px 20px 6px 32px", fontSize:10, fontWeight:600, color:"rgba(0,47,108,0.4)", letterSpacing:"0.07em", textTransform:"uppercase", borderBottom:`1px solid ${C.border}` }}>
                        <span>Task</span><span>Owner</span><span>Due</span><span>Risk</span><span>Status</span><span></span>
                      </div>
                      {sortByStatus(items).map(t=>{ const d=parseDate(t.dueDate), isOverdue=d&&d<today()&&t.status!=="Done"; return (
                        <div key={t.id} style={{ borderBottom:`1px solid ${C.border}`, background:isOverdue?"#fff8f8":"transparent" }}>
                          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 100px 52px", gap:8, padding:"10px 20px 6px 32px", alignItems:"center" }}>
                            <span style={{ color:C.darkBlue, fontWeight:500, fontSize:13 }}>{t.title}{t.destination&&<span style={{ marginLeft:6, fontSize:10, fontWeight:600, padding:"1px 7px", borderRadius:20, background:C.bgBlue, color:C.darkBlue }}>{t.destination}</span>}{isOverdue&&<span style={{ marginLeft:6, fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:20, background:"#FCEBEB", color:"#A32D2D" }}>OVERDUE</span>}</span>
                            <span style={{ color:"rgba(0,47,108,0.55)", fontSize:12 }}>{t.owner||"—"}</span>
                            <span style={{ color:isOverdue?"#A32D2D":"rgba(0,47,108,0.55)", fontSize:11, fontWeight:isOverdue?600:400 }}>{t.dueDate||"—"}</span>
                            <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, color:rc(t).text }}><span style={{ width:7, height:7, borderRadius:"50%", background:rc(t).dot }}/>{t.risk}</span>
                            <StatusDropdown current={t.status} onChange={st=>updateStatus(t.id,st)}/>
                            <div style={{ display:"flex", gap:4 }}>
                              <button onClick={()=>openEdit(t)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(0,47,108,0.4)", fontSize:13, padding:2 }}>✏️</button>
                              <button onClick={()=>del(t.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(0,47,108,0.4)", fontSize:13, padding:2 }}>🗑</button>
                            </div>
                          </div>
                          {t.comments && <div style={{ padding:"0 20px 10px 32px", fontSize:11, color:"rgba(0,47,108,0.55)", fontStyle:"italic", display:"flex", gap:6, alignItems:"flex-start" }}><span style={{ flexShrink:0 }}>💬</span><span>{t.comments}</span></div>}
                        </div>
                      );})}
                    </>)}
                </div>)}
              </div>
            );})}
            {otherTasks.length>0 && (
              <div style={{ marginBottom:10, background:C.white, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
                <div onClick={()=>tog("pillar-other")} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 20px", cursor:"pointer", background:"#F0F4FA", borderLeft:`4px solid #7A9CC8` }}>
                  <span style={{ width:10, height:10, borderRadius:"50%", background:"#7A9CC8" }}/><span style={{ fontSize:14, fontWeight:600, color:C.darkBlue, flex:1 }}>Other / Uncategorized</span>
                  <span style={{ fontSize:12, color:"rgba(0,47,108,0.55)" }}>{otherTasks.length} tasks</span>
                  <span style={{ fontSize:11, color:"rgba(0,47,108,0.4)" }}>{expanded["pillar-other"]?"▲":"▼"}</span>
                </div>
                {expanded["pillar-other"]&&otherTasks.map(t=>(
                  <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 20px 10px 32px", borderTop:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:13, color:C.darkBlue, fontWeight:500, flex:1 }}>{t.title} <span style={{ fontSize:11, color:"rgba(0,47,108,0.4)" }}>· {t.action}</span></span>
                    <StatusDropdown current={t.status} onChange={st=>updateStatus(t.id,st)}/>
                    <button onClick={()=>openEdit(t)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(0,47,108,0.4)", fontSize:13, padding:2 }}>✏️</button>
                    <button onClick={()=>del(t.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(0,47,108,0.4)", fontSize:13, padding:2 }}>🗑</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {view==="summary" && <EmailSummary tasks={tasks} milestones={milestones} msOverrides={msOverrides}/>}

      {modal&&<Modal task={modal} onSave={save} onClose={()=>setModal(null)}/>}
    </div>
  );
}
