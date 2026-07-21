const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/jspdf.es.min-PJAwSMrI.js","assets/index-DXhm_e6C.js"])))=>i.map(i=>d[i]);
import{t as A,aY as z,r as T,j as p,ae as B,af as W,ag as H,ah as q,aN as V,B as N,ar as k,U as Q,aO as G}from"./index-DXhm_e6C.js";import{Q as Y}from"./browser-Cs2kZqsl.js";import{S as Z}from"./share-2-BIPpfW2a.js";import{F as J}from"./file-text-BiJBs-Dk.js";import{D as K}from"./download-DhyHTk5G.js";const C="Azzouz WholeSale",X="عزوز للجملة",tt="Walyal Ahd, Makkah",et="0553687388",at="info@azzouzwholesale.sa",j="311339561300003",nt="—",ot="",I=.15;function st(t,o,e,a,n){const s=new TextEncoder,d=[[1,t],[2,o],[3,e],[4,a],[5,n]],c=[];for(const[r,l]of d){const f=s.encode(l);if(f.length>255)throw new Error(`ZATCA QR field ${r} is too long`);c.push(r,f.length,...f)}const g=new Uint8Array(c);let i="";for(let r=0;r<g.length;r+=32768)i+=String.fromCharCode(...g.subarray(r,r+32768));return btoa(i)}function it(t,o={}){if(typeof document>"u")throw new Error("A4 QR generation requires browser canvas");const e=o.sizePx??480,a=t.brand??C,n=(t.tax??Math.max(0,t.total-t.total/(1+I))).toFixed(2),s=Number(t.total).toFixed(2),d=(()=>{const h=t.timestamp??[t.date,t.time].filter(Boolean).join(" ");if(!h)return new Date().toISOString();const m=h instanceof Date?h:new Date(h);return Number.isNaN(m.getTime())?new Date().toISOString():m.toISOString()})(),c=st(a,j,d,s,n),g=Y.create(c,{errorCorrectionLevel:"M"}),i=Number(g.modules.size),r=g.modules.data,l=4,f=Math.max(2,Math.floor(e/(i+l*2))),v=f*(i+l*2),w=document.createElement("canvas");w.width=v,w.height=v;const b=w.getContext("2d");if(!b)throw new Error("A4 QR canvas context unavailable");b.fillStyle="#ffffff",b.fillRect(0,0,v,v),b.fillStyle="#000000";for(let h=0;h<i;h++)for(let m=0;m<i;m++)r[h*i+m]&&b.fillRect((m+l)*f,(h+l)*f,f,f);return w.toDataURL("image/png")}const $=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],rt=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];function F(t){if(t===0)return"";if(t<20)return $[t];if(t<100){const a=Math.floor(t/10),n=t%10;return rt[a]+(n?" "+$[n]:"")}const o=Math.floor(t/100),e=t%100;return $[o]+" Hundred"+(e?" "+F(e):"")}function P(t){if(t===0)return"Zero";const o=["","Thousand","Million","Billion"];let e=0,a="";for(;t>0&&e<o.length;){const n=t%1e3;n&&(a=F(n)+(o[e]?" "+o[e]:"")+(a?" "+a:"")),t=Math.floor(t/1e3),e++}return a.trim()}function ct(t){const o=Math.max(0,Number(t)||0),e=Math.floor(o),a=Math.round((o-e)*100);let s=`${P(e)} Saudi Riyals`;return a>0&&(s+=` and ${P(a)} Halalas`),s+=" Only",s}const u=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),y=t=>new Intl.NumberFormat("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(t)||0);function lt(t,o={}){const e={name:o.brand?.name??t.brand??C,nameAr:o.brand?.nameAr??X,address:o.brand?.address??tt,mobile:o.brand?.mobile??et,email:o.brand?.email??at,vatNo:o.brand?.vatNo??j,crNo:o.brand?.crNo??nt,branch:o.brand?.branch??"Main Branch",logo:o.brand?.logoDataUrl??ot},a=Number(t.total)||0,n=a/(1+I),s=a-n,d=Number(t.paidAmount??0),c=Number(t.previousDue??0),g=Number(t.newDue??Math.max(0,c+a-d)),i=Math.max(0,a-d),r=(()=>{try{return it(t,{sizePx:480})}catch{return""}})(),l=t.partyTaxNo&&t.partyTaxNo.trim()?t.partyTaxNo.trim():"N/A",f=(t.items??[]).map((m,R)=>{const x=Number(m.qty)||0,E=(Number(m.price)||0)/(1+I),O=E*x;return`
      <tr>
        <td class="c sl">${R+1}</td>
        <td class="name">${u(m.name)}</td>
        <td class="c num">${x}</td>
        <td class="r num">${y(E)}</td>
        <td class="r num">${y(O)}</td>
      </tr>`}).join(""),v=`
    <div class="meta-row"><span class="meta-k">Invoice #</span><span class="meta-v">${u(t.invoiceNumber)}</span></div>
    <div class="meta-row"><span class="meta-k">Date</span><span class="meta-v">${u(t.date)}${t.time?" · "+u(t.time):""}</span></div>
    <div class="meta-row"><span class="meta-k">Payment</span><span class="meta-v">${u(t.paymentMethod??"Cash")}</span></div>
    <div class="meta-row"><span class="meta-k">Branch</span><span class="meta-v">${u(e.branch)}</span></div>
  `,w=e.logo?`<img class="logo" src="${u(e.logo)}" alt="Logo" />`:`<div class="logo logo-fallback">${u(e.name.charAt(0))}</div>`;return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invoice ${u(t.invoiceNumber)}</title>
  <style>
    @page { size: A4 portrait; margin: 0; }
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #f3f4f6; color: #111; font-family: "Helvetica Neue", Arial, "Segoe UI", "Noto Sans Arabic", sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .sheet { width: 210mm; min-height: 297mm; margin: 0 auto; background: #ffffff; padding: 14mm 14mm 16mm; position: relative; }

    /* Header */
    .hdr { display: grid; grid-template-columns: 28mm 1fr 56mm; gap: 6mm; align-items: flex-start; padding-bottom: 6mm; border-bottom: 2px solid #0f5132; }
    .logo { width: 28mm; height: 28mm; object-fit: contain; border-radius: 3mm; background: #0f5132; }
    .logo-fallback { display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:48px; letter-spacing:1px; }
    .brand .name-en { font-size: 18pt; font-weight: 800; color: #0f5132; line-height: 1.1; }
    .brand .name-ar { font-size: 14pt; font-weight: 700; color: #0f5132; line-height: 1.2; margin-top: 1mm; direction: rtl; }
    .brand .small { font-size: 9pt; color: #374151; line-height: 1.45; margin-top: 1.5mm; }
    .brand .small .sep { color:#9ca3af; margin: 0 1mm; }
    .brand .regs { font-size: 8.5pt; color: #6b7280; margin-top: 1mm; }
    .meta { font-size: 9pt; color: #111; background:#f8fafc; border:1px solid #e5e7eb; border-radius:2mm; padding: 3mm 3.5mm; }
    .meta-row { display:flex; justify-content:space-between; gap:3mm; padding: 0.6mm 0; }
    .meta-k { color:#6b7280; font-weight:600; }
    .meta-v { color:#111; font-weight:700; }

    /* Title band */
    .title-band { margin: 5mm 0 4mm; text-align: center; }
    .title-band .en { font-size: 15pt; font-weight: 800; letter-spacing: 0.5px; color:#111; }
    .title-band .ar { font-size: 13pt; font-weight: 700; color:#0f5132; margin-top: 1mm; direction: rtl; }

    /* Customer */
    .cust { border: 1px solid #e5e7eb; border-radius: 2mm; padding: 4mm 5mm; display: grid; grid-template-columns: 1fr 1fr; gap: 2mm 8mm; font-size: 9.5pt; }
    .cust .row { display: grid; grid-template-columns: 42mm 1fr; gap: 3mm; }
    .cust .k { color:#6b7280; font-weight:600; }
    .cust .v { color:#111; font-weight:700; }

    /* Items table */
    table.items { width: 100%; border-collapse: collapse; margin-top: 5mm; font-size: 9.5pt; }
    table.items thead th { background:#0f5132; color:#fff; padding: 2.5mm 2mm; text-align:left; font-weight:700; font-size: 9.5pt; }
    table.items thead th.c { text-align:center; }
    table.items thead th.r { text-align:right; }
    table.items tbody td { padding: 2.2mm 2mm; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    table.items tbody tr:nth-child(even) td { background:#fafafa; }
    table.items td.c { text-align:center; }
    table.items td.r { text-align:right; }
    table.items td.sl { width: 8mm; color:#6b7280; }
    table.items td.num { font-variant-numeric: tabular-nums; }
    table.items col.col-sl { width: 10mm; }
    table.items col.col-qty { width: 18mm; }
    table.items col.col-unit { width: 30mm; }
    table.items col.col-sub { width: 32mm; }

    /* Summary */
    .sum-wrap { display: grid; grid-template-columns: 1fr 80mm; gap: 6mm; margin-top: 5mm; }
    .words { font-size: 9.5pt; color:#111; border:1px dashed #cbd5e1; border-radius: 2mm; padding: 3mm 4mm; background:#fcfcf7; }
    .words .k { color:#6b7280; font-weight:600; font-size: 9pt; }
    .words .v { font-weight:700; margin-top: 1mm; line-height:1.4; }
    .sum { border:1px solid #e5e7eb; border-radius:2mm; overflow:hidden; font-size: 10pt; }
    .sum .r { display:flex; justify-content:space-between; padding: 2mm 4mm; border-bottom:1px solid #f0f0f0; }
    .sum .r:last-child { border-bottom: 0; }
    .sum .r .k { color:#374151; font-weight:600; }
    .sum .r .v { font-weight:700; font-variant-numeric: tabular-nums; }
    .sum .grand { background:#0f5132; color:#fff; font-size: 11.5pt; }
    .sum .grand .k, .sum .grand .v { color:#fff; font-weight:800; }
    .sum .newdue { background:#fff7ed; }
    .sum .newdue .k, .sum .newdue .v { color:#9a3412; font-weight:800; font-size: 11pt; }

    /* Footer (QR + thanks) */
    .footer { margin-top: 6mm; border-top: 1px solid #e5e7eb; padding-top: 5mm; display:grid; grid-template-columns: 1fr 38mm; gap: 6mm; align-items: flex-end; }
    .thanks .en { font-size: 12pt; font-weight: 800; color:#0f5132; }
    .thanks .ar { font-size: 11pt; font-weight: 700; color:#0f5132; direction:rtl; margin-top: 1mm; }
    .thanks .contact { font-size: 9pt; color:#374151; margin-top: 2mm; }
    .thanks .gen { font-size: 8.5pt; color:#9ca3af; margin-top: 3mm; }
    .qr-block { text-align:center; }
    .qr-block img { width: 36mm; height: 36mm; display:block; margin: 0 auto; background:#fff; border:1px solid #e5e7eb; padding: 1.5mm; image-rendering: pixelated; }
    .qr-block .lbl { font-size: 8pt; color:#6b7280; margin-top: 1.5mm; }

    @media print {
      html, body { background:#fff; }
      .sheet { box-shadow: none !important; margin: 0 !important; }
    }
  </style>
</head>
<body>
  <div class="sheet" id="a4-sheet">
    <!-- HEADER -->
    <div class="hdr">
      <div>${w}</div>
      <div class="brand">
        <div class="name-en">${u(e.name)}</div>
        <div class="name-ar" lang="ar">${u(e.nameAr)}</div>
        <div class="small">
          ${u(e.address)}<span class="sep">·</span>${u(e.mobile)}<span class="sep">·</span>${u(e.email)}
        </div>
        <div class="regs">
          VAT No: <b>${u(e.vatNo)}</b> &nbsp; · &nbsp; CR No: <b>${u(e.crNo)}</b>
        </div>
      </div>
      <div class="meta">${v}</div>
    </div>

    <!-- TITLE -->
    <div class="title-band">
      <div class="en">Simplified Tax Invoice</div>
      <div class="ar" lang="ar">فاتورة ضريبية مبسطة</div>
    </div>

    <!-- CUSTOMER -->
    <div class="cust">
      <div class="row"><span class="k">Customer / العميل</span><span class="v">${u(t.partyName||"—")}</span></div>
      <div class="row"><span class="k">Mobile / الجوال</span><span class="v">${u(t.partyMobile||"—")}</span></div>
      <div class="row"><span class="k">Cust. VAT No / الرقم الضريبي</span><span class="v">${u(l)}</span></div>
      <div class="row"><span class="k">Invoice Type</span><span class="v">${t.kind==="sale"?"Sale":t.kind==="purchase"?"Purchase":"Order"}</span></div>
    </div>

    <!-- ITEMS -->
    <table class="items">
      <colgroup>
        <col class="col-sl" />
        <col />
        <col class="col-qty" />
        <col class="col-unit" />
        <col class="col-sub" />
      </colgroup>
      <thead>
        <tr>
          <th class="c">SL</th>
          <th>Product Name</th>
          <th class="c">Qty</th>
          <th class="r">Unit Price</th>
          <th class="r">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${f||'<tr><td colspan="5" style="text-align:center;color:#9ca3af;padding:6mm">No items</td></tr>'}
      </tbody>
    </table>

    <!-- SUMMARY -->
    <div class="sum-wrap">
      <div class="words">
        <div class="k">Amount In Words</div>
        <div class="v">${u(ct(a))}</div>
      </div>
      <div class="sum">
        <div class="r"><span class="k">Subtotal</span><span class="v">SAR ${y(n)}</span></div>
        <div class="r"><span class="k">VAT (15%)</span><span class="v">SAR ${y(s)}</span></div>
        <div class="r grand"><span class="k">Grand Total</span><span class="v">SAR ${y(a)}</span></div>
        <div class="r"><span class="k">Paid Amount</span><span class="v">SAR ${y(d)}</span></div>
        <div class="r"><span class="k">Previous Due</span><span class="v">SAR ${y(c)}</span></div>
        <div class="r"><span class="k">Current Invoice Due</span><span class="v">SAR ${y(i)}</span></div>
        <div class="r newdue"><span class="k">New Due</span><span class="v">SAR ${y(g)}</span></div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div class="thanks">
        <div class="en">Thank You For Your Business</div>
        <div class="ar" lang="ar">شكراً لتعاملكم معنا</div>
        <div class="contact">WhatsApp / Phone: <b>${u(e.mobile)}</b></div>
        <div class="gen">Generated by ShRiAh ERP</div>
      </div>
      <div class="qr-block">
        ${r?`<img src="${r}" alt="ZATCA QR" />`:'<div style="width:36mm;height:36mm;border:1px dashed #cbd5e1;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:8pt">QR</div>'}
        <div class="lbl">ZATCA — Scan to verify</div>
      </div>
    </div>
  </div>
</body>
</html>`}async function D(t,o={},e="a4"){const a=lt(t,o),n=document.createElement("iframe");n.setAttribute("title",`A4 Invoice ${e}`),n.setAttribute("data-receipt-source","A4Invoice"),n.style.position="fixed",n.style.left="-10000px",n.style.top="0",n.style.width="210mm",n.style.height="320mm",n.style.border="0",n.style.background="#fff",n.style.pointerEvents="none",document.body.appendChild(n);const s=n.contentDocument;if(!s)throw n.remove(),new Error("A4: could not create iframe document");s.open(),s.write(a),s.close(),await new Promise(r=>{if(s.readyState==="complete")return r();const l=()=>r();n.addEventListener("load",l,{once:!0}),setTimeout(l,600)});try{await s.fonts?.ready}catch{}const d=Array.from(s.querySelectorAll("img"));await Promise.all(d.map(r=>r.complete&&r.naturalWidth>0?Promise.resolve():new Promise(l=>{r.addEventListener("load",()=>l(),{once:!0}),r.addEventListener("error",()=>l(),{once:!0}),setTimeout(l,1500)}))),await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r(void 0))));const c=s.querySelector("#a4-sheet");if(!c)throw n.remove(),new Error("A4: .sheet not found");const g=c.getBoundingClientRect(),i=Math.max(g.height,c.scrollHeight,297*3.7795);return n.style.height=`${Math.ceil(i)+40}px`,console.log("[A4Invoice] DOM mounted",{label:e,width:c.scrollWidth,height:c.scrollHeight}),{iframe:n,doc:s,sheet:c,cleanup:()=>n.remove()}}async function M(t){const o=await z(()=>import("./index-BeoRn2gJ.js"),[]),e=t.sheet,a=Math.max(e.scrollWidth,e.getBoundingClientRect().width,794),n=Math.max(e.scrollHeight,e.getBoundingClientRect().height,1123),s=await o.toPng(e,{pixelRatio:2,backgroundColor:"#ffffff",width:a,height:n,cacheBust:!0}),c=await(await fetch(s)).blob();return console.log("[A4Invoice] PNG captured",{width:a,height:n,size:c.size}),{blob:c,width:a,height:n,dataUrl:s}}async function L(t,o={}){const e=await D(t,o,"png");try{return(await M(e)).blob}finally{e.cleanup()}}async function U(t,o={}){const e=await D(t,o,"pdf");try{const a=await M(e),{default:n}=await z(async()=>{const{default:r}=await import("./jspdf.es.min-PJAwSMrI.js").then(l=>l.j);return{default:r}},__vite__mapDeps([0,1])),s=new n({unit:"mm",format:"a4",orientation:"portrait"}),d=s.internal.pageSize.getWidth(),c=s.internal.pageSize.getHeight(),g=a.height/a.width,i=d*g;if(i<=c)s.addImage(a.dataUrl,"PNG",0,0,d,i,void 0,"FAST");else{const r=await new Promise((b,h)=>{const m=new Image;m.onload=()=>b(m),m.onerror=()=>h(new Error("A4 page slice image load failed")),m.src=a.dataUrl}),l=a.width/d,f=Math.floor(c*l);let v=0,w=0;for(;v<a.height;){const b=Math.min(f,a.height-v),h=document.createElement("canvas");h.width=a.width,h.height=b;const m=h.getContext("2d");if(!m)throw new Error("A4 slice canvas context unavailable");m.fillStyle="#fff",m.fillRect(0,0,h.width,h.height),m.drawImage(r,0,v,a.width,b,0,0,a.width,b);const R=h.toDataURL("image/png"),x=b/l;w>0&&s.addPage("a4","portrait"),s.addImage(R,"PNG",0,0,d,x,void 0,"FAST"),v+=b,w++}}return s.output("blob")}finally{e.cleanup()}}async function dt(t,o={}){const e=await D(t,o,"print");setTimeout(()=>{try{e.iframe.contentWindow?.focus(),e.iframe.contentWindow?.print()}catch(a){console.error("[A4Invoice] print failed",a),A.error("Could not open print dialog")}setTimeout(()=>e.cleanup(),2e3)},120)}function mt(t,o){return o??`${t.kind==="sale"?"Sales":t.kind==="purchase"?"Purchase":"Order"} Invoice #${t.invoiceNumber}`}async function ut(t,o,e={}){try{const a=await U(t,e),n=`${t.kind}_${t.invoiceNumber}_A4.pdf`,s=new File([a],n,{type:"application/pdf"}),d=mt(t,o),c=navigator;if(c.share&&c.canShare?.({files:[s]}))try{await c.share({files:[s],text:d});return}catch(f){if(f?.name==="AbortError")return;console.warn("[A4Invoice] PDF share failed, trying PNG",f)}const g=await L(t,e),i=new File([g],`${t.kind}_${t.invoiceNumber}_A4.png`,{type:"image/png"});if(c.share&&c.canShare?.({files:[i]}))try{await c.share({files:[i],text:d});return}catch(f){if(f?.name==="AbortError")return;console.warn("[A4Invoice] PNG share failed, downloading",f)}const r=URL.createObjectURL(a),l=document.createElement("a");l.href=r,l.download=n,document.body.appendChild(l),l.click(),l.remove(),setTimeout(()=>URL.revokeObjectURL(r),1500),A.success("A4 PDF downloaded — attach in WhatsApp"),window.open(`https://wa.me/?text=${encodeURIComponent(d)}`,"_blank")}catch(a){console.error("[A4Invoice] share failed",a),A.error(`A4 share failed: ${a?.message??a}`)}}async function ft(t,o={}){try{const e=await U(t,o),a=URL.createObjectURL(e),n=document.createElement("a");n.href=a,n.download=`${t.kind}_${t.invoiceNumber}_A4.pdf`,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(a),1500),A.success("A4 PDF downloaded")}catch(e){console.error("[A4Invoice] PDF download failed",e),A.error(`A4 PDF failed: ${e?.message??e}`)}}async function ht(t,o={}){try{const e=await L(t,o),a=URL.createObjectURL(e),n=document.createElement("a");n.href=a,n.download=`${t.kind}_${t.invoiceNumber}_A4.png`,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(a),1500),A.success("A4 image downloaded")}catch(e){console.error("[A4Invoice] PNG download failed",e),A.error(`A4 image failed: ${e?.message??e}`)}}const _="lovable:invoice-a4-share";async function S(t){if(t.partyTaxNo&&t.partyTaxNo.trim()||!t.partyMobile&&!t.partyId)return t;try{const o=await G({customer_id:t.partyId??null,customer_mobile:t.partyMobile??null});return o?{...t,partyTaxNo:o}:t}catch{return t}}function At(){const[t,o]=T.useState(null),[e,a]=T.useState(null);T.useEffect(()=>{const i=r=>{const l=r;l.detail?.payload&&o(l.detail)};return window.addEventListener(_,i),()=>window.removeEventListener(_,i)},[]);const n=()=>{e||o(null)},s=async()=>{if(t){a("share");try{const i=await S(t.payload);await ut(i,t.captionExtra)}finally{a(null),o(null)}}},d=async()=>{if(t){a("print");try{const i=await S(t.payload);await dt(i),o(null)}finally{a(null)}}},c=async()=>{if(t){a("pdf");try{const i=await S(t.payload);await ft(i)}finally{a(null)}}},g=async()=>{if(t){a("png");try{const i=await S(t.payload);await ht(i)}finally{a(null)}}};return p.jsx(B,{open:!!t,onOpenChange:i=>{i||n()},children:p.jsxs(W,{className:"max-w-sm",children:[p.jsxs(H,{children:[p.jsx(q,{children:"📄 A4 Portrait Invoice"}),p.jsx(V,{children:"Professional A4 invoice. Print, share via WhatsApp, or download as PDF / image — all from the same A4 template."})]}),p.jsxs("div",{className:"mt-1 flex flex-col gap-2",children:[p.jsxs(N,{onClick:s,disabled:!!e,className:"w-full gap-2",children:[e==="share"?p.jsx(k,{className:"h-4 w-4 animate-spin"}):p.jsx(Z,{className:"h-4 w-4"}),"Share on WhatsApp"]}),p.jsxs(N,{onClick:d,disabled:!!e,variant:"secondary",className:"w-full gap-2",children:[e==="print"?p.jsx(k,{className:"h-4 w-4 animate-spin"}):p.jsx(Q,{className:"h-4 w-4"}),"Print A4"]}),p.jsxs(N,{onClick:c,disabled:!!e,variant:"outline",className:"w-full gap-2",children:[e==="pdf"?p.jsx(k,{className:"h-4 w-4 animate-spin"}):p.jsx(J,{className:"h-4 w-4"}),"Download PDF"]}),p.jsxs(N,{onClick:g,disabled:!!e,variant:"ghost",className:"w-full gap-2",children:[e==="png"?p.jsx(k,{className:"h-4 w-4 animate-spin"}):p.jsx(K,{className:"h-4 w-4"}),"Download Image"]}),p.jsx("p",{className:"text-center text-[10px] text-muted-foreground",children:"Independent from thermal receipt — A4 portrait pipeline."})]})]})})}export{At as InvoiceA4ShareHost};
