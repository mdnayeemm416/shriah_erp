import{t as m,aY as P}from"./index-DXhm_e6C.js";import{E as C}from"./jspdf.es.min-PJAwSMrI.js";import{toPng as O}from"./index-BeoRn2gJ.js";import{Q as k}from"./browser-Cs2kZqsl.js";import{t as D,z as q}from"./zatca-qr-B5jWTZCt.js";import{I as U}from"./types-DF86NaQT.js";const x=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],H=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];function E(t){return t===0?"":t<20?x[t]:t<100?`${H[Math.floor(t/10)]}${t%10?" "+x[t%10]:""}`:`${x[Math.floor(t/100)]} Hundred${t%100?" "+E(t%100):""}`}function T(t){if(t===0)return"Zero";const e=["","Thousand","Million","Billion"];let a="",r=0;for(;t>0&&r<e.length;){const i=t%1e3;i&&(a=`${E(i)}${e[r]?" "+e[r]:""}${a?" "+a:""}`),t=Math.floor(t/1e3),r++}return a.trim()}function L(t){const e=Math.max(0,Number(t)||0),a=Math.floor(e),r=Math.round((e-a)*100),i=T(a),o=r?` and ${T(r)} Halalas`:"";return`${i} Saudi Riyal${a===1?"":"s"}${o} Only`}const w=302,V=10,W="Inter, Roboto, Arial, sans-serif",S='Cairo, Tajawal, "Noto Sans Arabic", sans-serif',f=t=>(Number.isFinite(t)?t:0).toFixed(2);async function Q(t){return k.toDataURL(t,{errorCorrectionLevel:"M",margin:1,width:360,color:{dark:"#000000",light:"#ffffff"}})}function B(t){if(!t)return{en:""};const e=String(t),a=e.match(/^(.*?)\s*[|/\n،]\s*(.+)$/);if(a){const r=a[1].trim(),i=a[2].trim();if(/[\u0600-\u06FF]/.test(i))return{en:r,ar:i};if(/[\u0600-\u06FF]/.test(r))return{en:i,ar:r}}return/[\u0600-\u06FF]/.test(e)&&!/[A-Za-z]/.test(e)?{en:e}:{en:e}}async function z(t,e=U){const a=D(t.timestamp),r=q({sellerName:e.name,vatNumber:e.vatNumber,isoTimestamp:a,totalInclVat:f(t.total),vatAmount:f(t.vat)}),i=await Q(r),o=Math.max(0,t.subtotal-t.vat),s=t.previousDue??0,l=t.paidAmount??0,p=t.newDue??Math.max(0,s+t.total-l),b=t.items.map(c=>{const{en:R,ar:N}=B(c.name),F=c.qty*c.price,y=Number(c.returnedQty??0),_=Math.max(0,c.qty-y);return`
        <div class="am-item">
          <div class="am-item-name">${n(R||"—")}</div>
          ${N?`<div class="am-item-name-ar">${n(N)}</div>`:""}
          <table class="am-item-row">
            <colgroup>
              <col style="width:46%"><col style="width:16%"><col style="width:18%"><col style="width:20%">
            </colgroup>
            <tbody><tr>
              <td></td>
              <td class="num c qty-col">${Number(c.qty).toFixed(2)}</td>
              <td class="num r rate-col">${f(c.price)}</td>
              <td class="num r b total-col">${f(F)}</td>
            </tr></tbody>
          </table>
          ${y>0?`<div style="font-size:10px;color:#b45309;font-weight:600;padding:2px 0 0 2px;">Returned: ${y.toFixed(2)} · Net Sold: ${_.toFixed(2)}</div>`:""}
        </div>
        <div class="am-divider-dashed"></div>
      `}).join(""),v=L(t.total),d=document.createElement("div");d.setAttribute("data-am80-root","true"),d.className="am80-receipt",d.dir="ltr",d.innerHTML=`
<style>
  .am80-receipt {
    width: ${w}px;
    box-sizing: border-box;
    background: #ffffff;
    color: #000000;
    font-family: ${W};
    font-size: 12.5px;
    line-height: 1.4;
    padding: ${V}px;
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum" 1, "lnum" 1;
  }
  .am80-receipt * { box-sizing: border-box; }
  .am80-receipt .ar { font-family: ${S}; direction: rtl; }
  .am80-receipt .c { text-align: center; }
  .am80-receipt .r { text-align: right; }
  .am80-receipt .l { text-align: left; }
  .am80-receipt .b { font-weight: 700; }
  .am80-receipt .muted { color: #000; opacity: 0.85; }
  .am80-receipt .num {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum" 1, "lnum" 1;
  }
  .am80-receipt .bi-label {
    display: block; font-size: 10.5px; line-height: 1.2;
    font-weight: 600; opacity: 0.95;
  }
  .am80-receipt .bi-label .ar {
    display: block; font-size: 10px; font-weight: 600;
  }
  .am80-receipt .am-divider {
    border: 0;
    border-top: 1px solid #000;
    margin: 6px 0;
  }
  .am80-receipt .am-divider-dashed {
    border: 0;
    border-top: 1px dashed #000;
    margin: 4px 0;
  }
  .am80-receipt .am-title {
    text-align: center;
    font-weight: 700;
    font-size: 12.5px;
    letter-spacing: 0.4px;
    line-height: 1.3;
    padding: 1px 0;
  }
  .am80-receipt .am-title.ar { font-size: 12.5px; }
  .am80-receipt .am-header { text-align: center; }
  .am80-receipt .am-header .company-en {
    font-size: 15px; font-weight: 800; letter-spacing: 0.3px;
  }
  .am80-receipt .am-header .company-ar {
    font-size: 14.5px; font-weight: 800; margin-top: 1px;
  }
  .am80-receipt .am-header .addr { font-size: 11.5px; margin-top: 2px; }
  .am80-receipt .am-header .addr.ar { font-size: 11.5px; }
  .am80-receipt .am-info, .am80-receipt .am-summary { width: 100%; border-collapse: collapse; }
  .am80-receipt .am-info td { padding: 2px 0; font-size: 12px; vertical-align: top; }
  .am80-receipt .am-info td.label { padding-bottom: 0; }
  .am80-receipt .am-info td.value { padding-top: 1px; }
  .am80-receipt .am-info td.r { text-align: right; }
  .am80-receipt .am-cols {
    width: 100%; border-collapse: collapse; font-weight: 700; font-size: 11.5px;
    letter-spacing: 0.3px;
  }
  .am80-receipt .am-cols td { padding: 2px 0; vertical-align: top; }
  .am80-receipt .am-cols td.qty-col { padding-left: 4px; }
  .am80-receipt .am-cols td.rate-col { padding-left: 6px; }
  .am80-receipt .am-cols td.total-col { padding-left: 6px; }
  .am80-receipt .am-item-name {
    font-weight: 700; font-size: 12.5px; word-break: break-word; line-height: 1.3;
  }
  .am80-receipt .am-item-name-ar {
    font-family: ${S}; direction: rtl; font-size: 12px;
    font-weight: 600; line-height: 1.4;
  }
  .am80-receipt .am-item-row { width: 100%; border-collapse: collapse; margin-top: 1px; }
  .am80-receipt .am-item-row td { padding: 1px 0; font-size: 12.5px; }
  .am80-receipt .am-item-row td.qty-col { padding-left: 4px; }
  .am80-receipt .am-item-row td.rate-col { padding-left: 6px; }
  .am80-receipt .am-item-row td.total-col { padding-left: 6px; }
  .am80-receipt .am-summary td { padding: 2px 0; font-size: 12.5px; vertical-align: top; }
  .am80-receipt .am-summary td.r { text-align: right; }
  .am80-receipt .am-summary .grand td {
    font-size: 13.5px; font-weight: 800; padding-top: 4px; padding-bottom: 4px;
    border-top: 1px solid #000; border-bottom: 1px solid #000;
  }
  .am80-receipt .am-words {
    font-size: 11px; font-style: italic; text-align: center; margin: 4px 0;
    line-height: 1.4;
  }
  .am80-receipt .am-words .ar {
    font-style: normal; font-size: 11px; display: block; margin-top: 1px;
  }
  .am80-receipt .am-qr { text-align: center; margin: 6px 0 4px; }
  .am80-receipt .am-qr img { width: 130px; height: 130px; display: inline-block; }
  .am80-receipt .am-qr .label {
    font-size: 9.5px; margin-top: 2px; letter-spacing: 0.4px;
  }
  .am80-receipt .am-qr .label .ar { display: inline; margin-left: 4px; font-size: 9.5px; }
  .am80-receipt .am-footer { text-align: center; margin-top: 4px; }
  .am80-receipt .am-footer .ty {
    font-size: 13px; font-weight: 800; letter-spacing: 0.5px;
  }
  .am80-receipt .am-footer .ty-ar { font-size: 13px; font-weight: 800; }
  .am80-receipt .am-footer .visit { font-size: 11.5px; margin-top: 1px; }
  .am80-receipt .am-footer .visit-ar { font-size: 11.5px; }

</style>

<!-- HEADER -->
<div class="am-header">
  ${e.logoDataUrl?`<img src="${e.logoDataUrl}" alt="logo" style="max-width:120px;max-height:60px;margin-bottom:2px;" />`:""}
  <div class="company-ar ar">${n(e.name)}</div>
  <div class="company-en">${n(e.name)}</div>
  <div class="addr ar">${n(e.address)}</div>
  <div class="addr">${n(e.address)}</div>
  <div class="addr">Mobile / <span class="ar">رقم الجوال</span>: ${n(e.phone)}</div>
  <div class="addr">VAT / <span class="ar">الرقم الضريبي</span>: ${n(e.vatNumber)}</div>
</div>

<hr class="am-divider" />
<div class="am-title">Simplified Tax Invoice</div>
<div class="am-title ar">فاتورة ضريبية مبسطة</div>
<hr class="am-divider" />

<!-- INVOICE INFO -->
<table class="am-info">
  <tbody>
    <tr>
      <td class="l label">Invoice # / <span class="ar">رقم الفاتورة</span>:</td>
      <td class="r label">Pay / <span class="ar">الدفع</span>:</td>
    </tr>
    <tr>
      <td class="l value"><b>${n(String(t.invoiceNumber))}</b></td>
      <td class="r value"><b>${n(t.paymentMethod||"—")}</b></td>
    </tr>
    <tr>
      <td class="l label">Date / <span class="ar">التاريخ</span>:</td>
      <td class="r label">Time / <span class="ar">الوقت</span>:</td>
    </tr>
    <tr>
      <td class="l value">${n(t.date)}</td>
      <td class="r value">${n(new Date(a).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))}</td>
    </tr>
    <tr>
      <td class="l label" colspan="2">Customer / <span class="ar">العميل</span>:</td>
    </tr>
    <tr>
      <td class="l value" colspan="2"><b>${n(t.customerName||"Walk-in")}</b></td>
    </tr>
    ${t.customerMobile?`<tr><td class="l label" colspan="2">Mobile / <span class="ar">الجوال</span>:</td></tr><tr><td class="l value" colspan="2">${n(t.customerMobile)}</td></tr>`:""}
    ${t.customerVatNo?`<tr><td class="l label" colspan="2">Cust. VAT / <span class="ar">الرقم الضريبي للعميل</span>:</td></tr><tr><td class="l value" colspan="2">${n(t.customerVatNo)}</td></tr>`:""}
  </tbody>
</table>

<hr class="am-divider" />

<!-- PRODUCT TABLE -->
<table class="am-cols">
  <colgroup>
    <col style="width:46%"><col style="width:16%"><col style="width:18%"><col style="width:20%">
  </colgroup>
  <tbody><tr>
    <td class="l">Item<br/><span class="ar" style="font-size:10px;">الصنف</span></td>
    <td class="c qty-col">QTY<br/><span class="ar" style="font-size:10px;">الكمية</span></td>
    <td class="r rate-col">RATE<br/><span class="ar" style="font-size:10px;">السعر</span></td>
    <td class="r total-col">TOTAL<br/><span class="ar" style="font-size:10px;">الإجمالي</span></td>
  </tr></tbody>
</table>
<div class="am-divider-dashed"></div>
${b||'<div class="am-title">No items / لا توجد أصناف</div><div class="am-divider-dashed"></div>'}

<!-- SUMMARY -->
<table class="am-summary">
  <tbody>
    <tr><td class="l">Subtotal <span class="ar">المجموع الفرعي</span></td><td class="r">SAR ${f(o)}</td></tr>
    <tr><td class="l">VAT 15% <span class="ar">ضريبة القيمة المضافة ١٥٪</span></td><td class="r">SAR ${f(t.vat)}</td></tr>
    <tr class="grand"><td class="l">Grand Total <span class="ar">الإجمالي النهائي</span></td><td class="r">SAR ${f(t.total)}</td></tr>
  </tbody>
</table>

<!-- BALANCE -->
${s||l||p&&p!==t.total?`
<hr class="am-divider-dashed" />
<table class="am-summary">
  <tbody>
    <tr><td class="l">Old Balance <span class="ar">الرصيد السابق</span></td><td class="r">SAR ${f(s)}</td></tr>
    <tr><td class="l">Received <span class="ar">المبلغ المستلم</span></td><td class="r">SAR ${f(l)}</td></tr>
    <tr><td class="l b">New Balance <span class="ar">الرصيد الجديد</span></td><td class="r b">SAR ${f(p)}</td></tr>
  </tbody>
</table>
`:""}

<hr class="am-divider-dashed" />
<div class="am-words">
  Amount in Words: ${n(v)}
  <span class="ar">المبلغ كتابةً</span>
</div>
<hr class="am-divider-dashed" />

<!-- QR -->
<div class="am-qr">
  <img src="${i}" alt="ZATCA QR" />
  <div class="label">ZATCA QR <span class="ar">رمز الاستجابة السريعة</span></div>
</div>

<hr class="am-divider" />

<!-- FOOTER -->
<div class="am-footer">
  <div class="ty">THANK YOU</div>
  <div class="ty-ar ar">شكراً لكم</div>
  <div class="visit">Visit Again</div>
  <div class="visit-ar ar">نتمنى زيارتكم مرة أخرى</div>
</div>
`;const u=document.createElement("div");u.setAttribute("data-am80-wrapper","true"),u.style.cssText=`
    position: fixed; left: -10000px; top: 0;
    width: ${w}px; background: #ffffff;
    z-index: 0; pointer-events: none;
  `,u.appendChild(d),document.body.appendChild(u),d.__wrapper=u,await new Promise(c=>requestAnimationFrame(()=>setTimeout(c,250)));try{const c=document.fonts;c?.ready&&await c.ready}catch{}return{node:d,widthPx:w,heightPx:d.offsetHeight,qrDataUrl:i}}function n(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}const Y="Inter, Roboto, Arial, sans-serif",j=/@import|url\s*\(/i;function G(t){t.querySelectorAll('link[rel="stylesheet"]').forEach(e=>e.remove()),t.querySelectorAll("style").forEach(e=>{j.test(e.textContent||"")&&e.remove()})}function Z(t){if(t instanceof Error)return t.message;if(t instanceof Event){const e=t.target;return`Resource load failed (${t.type}${e?.src?`: ${e.src}`:""})`}try{return JSON.stringify(t)}catch{return String(t)}}async function h(t){const{node:e,widthPx:a}=await z(t),r=e.__wrapper;try{if(G(e),e.offsetWidth===0||e.offsetHeight===0)throw new Error(`Invoice DOM empty (w=${e.offsetWidth} h=${e.offsetHeight})`);const i=e.offsetHeight,o=await O(e,{pixelRatio:3,cacheBust:!0,backgroundColor:"#ffffff",width:a,height:i,skipFonts:!0,fontEmbedCSS:"",style:{transform:"none",fontFamily:Y,position:"static",left:"0",top:"0"},filter:p=>p.tagName!=="LINK"}),s=await(await fetch(o)).blob(),l=`am80_${t.invoiceNumber}_${Date.now()}.png`;return{blob:s,dataUrl:o,fileName:l,widthPx:a,heightPx:i}}catch(i){throw new Error(`PNG render failed: ${Z(i)}`)}finally{(r??e).remove()}}const $=80;async function M(t){const{dataUrl:e,widthPx:a,heightPx:r}=await h(t),i=r/a*$,o=new C({unit:"mm",format:[$,i],orientation:"portrait"});o.addImage(e,"PNG",0,0,$,i,void 0,"FAST");const s=o.output("blob"),l=`am80_${t.invoiceNumber}_${Date.now()}.pdf`;return{blob:s,fileName:l}}function A(t){return`Invoice #${t.invoiceNumber} — ${t.customerName||"Customer"}`}function g(t,e){const a=URL.createObjectURL(t),r=document.createElement("a");r.href=a,r.download=e,document.body.appendChild(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(a),1500)}async function I(t,e,a,r){const i=new File([t],e,{type:a}),o=navigator;if(typeof o.canShare=="function"&&o.canShare({files:[i]})&&typeof o.share=="function")try{await o.share({files:[i],text:r,title:r});return}catch(l){if(l?.name==="AbortError")return;console.warn("[AM80] native share failed, falling back",l)}g(t,e),m.success("Downloaded — attach it in WhatsApp"),window.open(`https://wa.me/?text=${encodeURIComponent(r)}`,"_blank")}async function it(t){try{const{blob:e,fileName:a}=await M(t);g(e,a),m.success("PDF downloaded")}catch(e){console.error("[AM80] pdf download failed",e),m.error(`PDF failed: ${e?.message??e}`)}}async function ot(t){try{const{blob:e,fileName:a}=await M(t);await I(e,a,"application/pdf",A(t))}catch(e){console.error("[AM80] pdf share failed",e),m.error(`Share failed: ${e?.message??e}`)}}async function nt(t){try{const{blob:e,fileName:a}=await h(t);g(e,a),m.success("Image downloaded")}catch(e){console.error("[AM80] image download failed",e),m.error(`Image failed: ${e?.message??e}`)}}async function st(t){try{const{blob:e,fileName:a}=await h(t);await I(e,a,"image/png",A(t))}catch(e){console.error("[AM80] image share failed",e),m.error(`Share failed: ${e?.message??e}`)}}async function lt(t,e){const{normalizeMobile:a}=await P(async()=>{const{normalizeMobile:i}=await import("./index-DXhm_e6C.js").then(o=>o.cs);return{normalizeMobile:i}},[]),r=a(e??"");if(!r){m.error("Customer mobile number not found.");return}try{const{blob:i,fileName:o}=await h(t),s=A(t),l=new File([i],o,{type:"image/png"}),p=navigator;if(typeof p.canShare=="function"&&p.canShare({files:[l]})&&typeof p.share=="function")try{await p.share({files:[l],text:s,title:s});return}catch(d){if(d?.name==="AbortError")return;console.warn("[AM80] native share failed, opening WhatsApp chat",d)}g(i,o),m.success("Invoice downloaded — attach it in WhatsApp");const v=`https://wa.me/${r}?text=${encodeURIComponent(s)}`;window.open(v,"_blank","noopener,noreferrer")}catch(i){console.error("[AM80] customer share failed",i),m.error(`Share failed: ${i?.message??i}`)}}async function ct(t){let e=null;try{const{node:a}=await z(t),r=a.outerHTML;a.__wrapper?.remove(),e=document.createElement("iframe"),e.setAttribute("aria-hidden","true"),e.style.cssText="position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;",document.body.appendChild(e);const o=e.contentDocument;o.open(),o.write(`<!doctype html><html><head><meta charset="utf-8" />
<title>Invoice ${t.invoiceNumber}</title>
<style>
  @page { size: 80mm auto; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body { width: 80mm; }
</style>
</head><body>${r}</body></html>`),o.close(),await new Promise(l=>setTimeout(l,400));const s=e.contentWindow;s.focus(),s.print()}catch(a){console.error("[AM80] print failed",a),m.error(`Print failed: ${a?.message??a}`)}finally{setTimeout(()=>e?.remove(),2e3)}}const K="lovable:invoice-am80";function dt(t){try{window.dispatchEvent(new CustomEvent(K,{detail:t}))}catch(e){console.error("[AM80] open failed",e)}}export{K as INVOICE_AM80_EVENT,nt as downloadAm80Image,it as downloadAm80Pdf,dt as openInvoiceAm80,ct as printAm80,st as shareAm80Image,lt as shareAm80ImageToCustomer,ot as shareAm80Pdf};
