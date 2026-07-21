import{t as h}from"./index-DXhm_e6C.js";import{E as H}from"./jspdf.es.min-PJAwSMrI.js";import{toPng as _}from"./index-BeoRn2gJ.js";import{Q as D}from"./browser-Cs2kZqsl.js";import{I as F}from"./types-DF86NaQT.js";import{t as O,z as U}from"./zatca-qr-B5jWTZCt.js";const c=e=>(Number.isFinite(e)?e:0).toFixed(2);async function L(e){return D.toDataURL(e,{errorCorrectionLevel:"M",margin:1,width:480,color:{dark:"#000000",light:"#ffffff"}})}const j='Arial, Tahoma, "Segoe UI", sans-serif',u="Tahoma, Arial, sans-serif";async function q(e,t=F){const i=O(e.timestamp),o=U({sellerName:t.name,vatNumber:t.vatNumber,isoTimestamp:i,totalInclVat:c(e.total),vatAmount:c(e.vat)}),l=await L(o),r=794,a=document.createElement("div");a.setAttribute("data-invoice-v2-root","true"),a.dir="ltr",a.style.cssText=`
    position: static;
    width: ${r}px;
    background: #ffffff;
    color: #0f172a;
    font-family: ${j};
    font-size: 13px;
    line-height: 1.5;
    box-sizing: border-box;
    padding: 36px 40px 28px;
    -webkit-font-smoothing: antialiased;
  `;const s=Math.max(0,e.total-(e.paidAmount??0)),g=e.previousDue??0,w=e.newDue??g+s,b=e.subtotal-e.vat,d=(n,x)=>`<span style="display:inline-flex;align-items:baseline;gap:6px;">
       <span>${n}</span>
       <span style="font-family:${u};direction:rtl;font-weight:600;color:#64748b;font-size:0.92em;">${x}</span>
     </span>`,N=e.items.map((n,x)=>{const v=Number(n.returnedQty??0),$=Math.max(0,n.qty-v),T=v>0?`${f(n.name)}<div style="font-size:10px;color:#b45309;font-weight:600;margin-top:2px;">Returned: ${v} · Net Sold: ${$}</div>`:f(n.name);return`
      <tr style="background:${x%2?"#f8fafc":"#ffffff"};">
        <td style="padding:11px 8px;text-align:center;border-bottom:1px solid #eef2f7;width:38px;color:#64748b;font-variant-numeric:tabular-nums;">${x+1}</td>
        <td style="padding:11px 10px;border-bottom:1px solid #eef2f7;text-align:left;font-weight:600;color:#0f172a;">${T}</td>
        <td style="padding:11px 8px;text-align:center;border-bottom:1px solid #eef2f7;width:64px;font-variant-numeric:tabular-nums;">${n.qty}</td>
        <td style="padding:11px 8px;text-align:right;border-bottom:1px solid #eef2f7;width:96px;font-variant-numeric:tabular-nums;color:#334155;">${c(n.price)}</td>
        <td style="padding:11px 10px;text-align:right;border-bottom:1px solid #eef2f7;width:110px;font-weight:700;color:#0f172a;font-variant-numeric:tabular-nums;">${c(n.qty*n.price)}</td>
      </tr>`}).join("");a.innerHTML=`
    <!-- HEADER -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:24px;padding-bottom:20px;border-bottom:3px solid #0f172a;">
      <div style="display:flex;gap:14px;align-items:flex-start;">
        <div style="width:72px;height:72px;border-radius:14px;background:linear-gradient(135deg,#0f172a,#1e293b);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:30px;color:#ffffff;overflow:hidden;box-shadow:0 2px 6px rgba(15,23,42,0.15);">
          ${t.logoDataUrl?`<img src="${t.logoDataUrl}" style="width:100%;height:100%;object-fit:contain;" />`:f(t.name.charAt(0).toUpperCase())}
        </div>
        <div>
          <div style="font-size:22px;font-weight:800;letter-spacing:-0.3px;color:#0f172a;">${f(t.name)}</div>
          <div style="color:#64748b;font-size:11.5px;margin-top:4px;line-height:1.55;">${f(t.address)}</div>
          <div style="color:#64748b;font-size:11.5px;margin-top:2px;">
            <span style="color:#94a3b8;">Phone · الجوال</span> &nbsp;<b style="color:#0f172a;font-variant-numeric:tabular-nums;">${f(t.phone)}</b>
          </div>
          <div style="color:#64748b;font-size:11.5px;margin-top:2px;">
            <span style="color:#94a3b8;">VAT · الرقم الضريبي</span> &nbsp;<b style="color:#0f172a;font-variant-numeric:tabular-nums;">${f(t.vatNumber)}</b>
            ${t.crNumber?`&nbsp;&nbsp;<span style="color:#94a3b8;">CR · السجل</span> &nbsp;<b style="color:#0f172a;font-variant-numeric:tabular-nums;">${f(t.crNumber)}</b>`:""}
          </div>
        </div>
      </div>
      <div style="text-align:right;min-width:220px;">
        <div style="font-size:22px;font-weight:800;color:#0f172a;letter-spacing:0.5px;">TAX INVOICE</div>
        <div style="font-family:${u};direction:rtl;font-size:17px;font-weight:700;color:#475569;margin-top:2px;">فاتورة ضريبية</div>
        <div style="margin-top:12px;display:flex;flex-direction:column;gap:6px;">
          ${z("Invoice No","رقم الفاتورة",String(e.invoiceNumber))}
          ${z("Date","التاريخ",e.date)}
          ${e.paymentMethod?z("Payment","الدفع",e.paymentMethod):""}
        </div>
      </div>
    </div>

    <!-- TITLE BAND -->
    <div style="margin-top:18px;background:linear-gradient(90deg,#f1f5f9,#f8fafc);padding:10px 14px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;border:1px solid #e2e8f0;">
      <div style="font-weight:700;color:#0f172a;font-size:12.5px;letter-spacing:0.4px;text-transform:uppercase;">Simplified Tax Invoice</div>
      <div style="font-family:${u};direction:rtl;font-weight:700;color:#0f172a;font-size:13px;">فاتورة ضريبية مبسطة</div>
    </div>

    <!-- CUSTOMER -->
    <div style="margin-top:14px;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;background:#fafbfc;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">BILL TO</div>
        <div style="font-family:${u};direction:rtl;font-size:11px;font-weight:600;color:#94a3b8;">إلى العميل</div>
      </div>
      <div style="font-size:17px;font-weight:700;margin-top:6px;color:#0f172a;letter-spacing:-0.2px;">${f(e.customerName||"Walk-in Customer")}</div>
      <div style="display:flex;flex-wrap:wrap;gap:22px;margin-top:8px;font-size:11.5px;">
        ${e.customerMobile?`<div><span style="color:#94a3b8;">Mobile · الجوال</span> &nbsp;<b style="color:#0f172a;font-variant-numeric:tabular-nums;">${f(e.customerMobile)}</b></div>`:""}
        <div><span style="color:#94a3b8;">Cust. VAT No · الرقم الضريبي للعميل</span> &nbsp;<b style="color:#0f172a;font-variant-numeric:tabular-nums;">${f(e.customerVatNo||"N/A")}</b></div>
      </div>
    </div>

    <!-- ITEMS -->
    <table style="width:100%;border-collapse:separate;border-spacing:0;margin-top:18px;font-size:12.5px;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
      <thead>
        <tr style="background:#0f172a;color:#ffffff;">
          <th style="padding:11px 8px;text-align:center;font-weight:700;font-size:11px;letter-spacing:0.4px;">#</th>
          <th style="padding:11px 10px;text-align:left;font-weight:700;font-size:11px;letter-spacing:0.4px;">${I("PRODUCT","المنتج")}</th>
          <th style="padding:11px 8px;text-align:center;font-weight:700;font-size:11px;letter-spacing:0.4px;">${I("QTY","الكمية")}</th>
          <th style="padding:11px 8px;text-align:right;font-weight:700;font-size:11px;letter-spacing:0.4px;">${I("RATE","السعر")}</th>
          <th style="padding:11px 10px;text-align:right;font-weight:700;font-size:11px;letter-spacing:0.4px;">${I("AMOUNT","الإجمالي")}</th>
        </tr>
      </thead>
      <tbody>${N||'<tr><td colspan="5" style="padding:18px;text-align:center;color:#94a3b8;">No items</td></tr>'}</tbody>
    </table>

    <!-- SUMMARY -->
    <div style="display:flex;justify-content:flex-end;margin-top:18px;">
      <table style="width:360px;border-collapse:separate;border-spacing:0;font-size:12.5px;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;background:#ffffff;">
        <tbody>
          ${m(d("Subtotal","المجموع الفرعي"),`SAR ${c(b)}`)}
          ${m(d("VAT (15%)","ضريبة القيمة المضافة"),`SAR ${c(e.vat)}`)}
          ${m(d("Grand Total","الإجمالي"),`SAR ${c(e.total)}`,"grand")}
          ${g!==0?m(d("Previous Due","الرصيد السابق"),`SAR ${c(g)}`,"muted"):""}
          ${e.paidAmount!=null?m(d("Paid","المدفوع"),`SAR ${c(e.paidAmount)}`,"muted"):""}
          ${m(d("Current Invoice Due","مستحق الفاتورة الحالية"),`SAR ${c(s)}`,"muted")}
          ${m(d("New Due","الرصيد الجديد"),`SAR ${c(w)}`,"due")}
        </tbody>
      </table>
    </div>

    <!-- QR + FOOTER -->
    <div style="margin-top:24px;display:flex;justify-content:space-between;align-items:stretch;border-top:1px solid #e5e7eb;padding-top:20px;gap:20px;">
      <div style="display:flex;flex-direction:column;align-items:center;border:1px solid #e5e7eb;border-radius:10px;padding:10px;background:#ffffff;">
        <img src="${l}" style="width:130px;height:130px;display:block;" />
        <div style="font-size:9.5px;color:#64748b;margin-top:6px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">ZATCA Phase 2 QR</div>
      </div>
      <div style="flex:1;text-align:center;display:flex;flex-direction:column;justify-content:center;">
        <div style="font-size:22px;font-weight:800;color:#047857;letter-spacing:-0.3px;">Thank You</div>
        <div style="font-family:${u};direction:rtl;font-size:20px;font-weight:800;color:#047857;margin-top:2px;">شكراً لكم</div>
        <div style="margin-top:10px;display:flex;justify-content:center;gap:18px;font-size:11.5px;color:#475569;">
          ${t.whatsapp?`<div>💬 <b style="color:#0f172a;font-variant-numeric:tabular-nums;">${f(t.whatsapp)}</b></div>`:""}
          <div>📞 <b style="color:#0f172a;font-variant-numeric:tabular-nums;">${f(t.phone)}</b></div>
        </div>
      </div>
      <div style="text-align:right;font-size:9.5px;color:#94a3b8;display:flex;flex-direction:column;justify-content:flex-end;max-width:120px;">
        <div>Generated by</div>
        <div style="font-weight:700;color:#64748b;font-size:11px;margin-top:2px;letter-spacing:0.3px;">ShRiAh ERP</div>
      </div>
    </div>
  `;const p=document.createElement("div");p.setAttribute("data-invoice-v2-wrapper","true"),p.style.cssText=`
    position: fixed;
    left: -10000px;
    top: 0;
    width: ${r}px;
    background: #ffffff;
    opacity: 1;
    visibility: visible;
    z-index: 0;
    pointer-events: none;
  `,p.appendChild(a),document.body.appendChild(p),a.__wrapper=p,await new Promise(n=>requestAnimationFrame(()=>setTimeout(n,300)));try{const n=document.fonts;n?.ready&&await n.ready}catch{}const A=a.offsetHeight;return{node:a,qrPng:l,widthPx:r,heightPx:A}}function I(e,t){return`<div style="display:flex;flex-direction:column;line-height:1.15;">
    <span>${e}</span>
    <span style="font-family:${u};direction:rtl;font-size:10px;font-weight:600;opacity:0.75;margin-top:1px;">${t}</span>
  </div>`}function z(e,t,i){return`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:5px 10px;">
    <span style="font-size:10px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;">
      ${e} <span style="font-family:${u};direction:rtl;font-weight:600;">· ${t}</span>
    </span>
    <b style="font-size:12px;color:#0f172a;font-variant-numeric:tabular-nums;">${f(i)}</b>
  </div>`}function m(e,t,i){let o="#ffffff",l="#0f172a",r=500,a=12.5,s="1px solid #f1f5f9";return i==="grand"?(o="#0f172a",l="#ffffff",r=800,a=14,s="none"):i==="due"?(o="#fef2f2",l="#b91c1c",r=800,a=14,s="1px solid #fecaca"):i==="muted"&&(l="#64748b"),`<tr style="background:${o};color:${l};">
    <td style="padding:9px 12px;font-weight:${r};font-size:${a}px;border-top:${s};">${e}</td>
    <td style="padding:9px 12px;text-align:right;font-weight:${r};font-size:${a}px;border-top:${s};font-variant-numeric:tabular-nums;">${t}</td>
  </tr>`}function f(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const E='Arial, Tahoma, "Segoe UI", sans-serif',P=/(Cairo|Tajawal|Noto\s+Sans\s+Arabic|Noto\s+Naskh\s+Arabic|IBM\s+Plex|Inter|Manrope|Plus\s+Jakarta)/i;function W(e){e.querySelectorAll('link[rel="stylesheet"]').forEach(i=>i.remove()),e.querySelectorAll("style").forEach(i=>{P.test(i.textContent||"")&&i.remove()}),e.querySelectorAll("*").forEach(i=>{const o=i.style.fontFamily;(!o||P.test(o))&&(i.style.fontFamily=E)}),e.style.fontFamily=E}function Q(e){if(e instanceof Error)return e.message;if(e instanceof Event){const t=e.target;return`Resource load failed (${e.type}${t?.src?`: ${t.src}`:""})`}try{return JSON.stringify(e)}catch{return String(e)}}async function S(e){const{node:t,widthPx:i,heightPx:o}=await q(e),l=t.__wrapper;try{W(t);const r={selector:"[data-invoice-v2-root]",offsetWidth:t.offsetWidth,offsetHeight:t.offsetHeight,scrollWidth:t.scrollWidth,scrollHeight:t.scrollHeight,childElementCount:t.childElementCount,innerHTMLLength:t.innerHTML.length};if(console.log("[InvoiceV2] export node diagnostics",r),t.childElementCount===0||t.offsetWidth===0||t.offsetHeight===0||t.innerHTML.length===0)throw new Error(`Invoice DOM is empty (w=${t.offsetWidth} h=${t.offsetHeight} children=${t.childElementCount})`);const a=await _(t,{pixelRatio:3,cacheBust:!0,backgroundColor:"#ffffff",width:i,height:t.offsetHeight,skipFonts:!0,fontEmbedCSS:"",style:{transform:"none",fontFamily:E,position:"static",left:"0",top:"0"},filter:w=>{const b=w.tagName;return!(b==="LINK"||b==="STYLE")}}),s=await(await fetch(a)).blob();console.log("[InvoiceV2] export complete",{bytes:s.size,width:i,height:t.offsetHeight});const g=`invoice_${e.invoiceNumber}_${Date.now()}.png`;return{blob:s,dataUrl:a,fileName:g,widthPx:i,heightPx:t.offsetHeight}}catch(r){throw new Error(`PNG render failed: ${Q(r)}`)}finally{(l??t).remove()}}const G=210,B=297,y=6;async function C(e){const{dataUrl:t,widthPx:i,heightPx:o}=await S(e),l=new H({unit:"mm",format:"a4",orientation:"portrait"}),r=G-y*2,a=B-y*2,s=r,g=o/i*s;if(g<=a)l.addImage(t,"PNG",y,y,s,g,void 0,"FAST");else{const d=i/s,N=a*d;let p=0;const A=await Y(t),n=document.createElement("canvas");n.width=i,n.height=Math.ceil(N);const x=n.getContext("2d");let v=!0;for(;p<o;){const $=Math.min(N,o-p);n.height=Math.ceil($),x.fillStyle="#ffffff",x.fillRect(0,0,n.width,n.height),x.drawImage(A,0,-p);const T=n.toDataURL("image/png");v||l.addPage();const k=$/d;l.addImage(T,"PNG",y,y,s,k,void 0,"FAST"),p+=$,v=!1}}const w=l.output("blob"),b=`invoice_${e.invoiceNumber}_${Date.now()}.pdf`;return{blob:w,fileName:b}}function Y(e){return new Promise((t,i)=>{const o=new Image;o.onload=()=>t(o),o.onerror=i,o.src=e})}function M(e){return`Tax Invoice #${e.invoiceNumber} — ${e.customerName||"Customer"}`}async function ot(e){try{const{blob:t,fileName:i}=await C(e);R(t,i),h.success("PDF downloaded")}catch(t){console.error("[InvoiceV2] download pdf failed",t),h.error(`PDF failed: ${t?.message??t}`)}}async function nt(e){try{const{blob:t,fileName:i}=await C(e);await V(t,i,"application/pdf",M(e))}catch(t){console.error("[InvoiceV2] share pdf failed",t),h.error(`Share failed: ${t?.message??t}`)}}async function at(e){try{const{blob:t,fileName:i}=await S(e);R(t,i),h.success("Image downloaded")}catch(t){console.error("[InvoiceV2] download image failed",t),h.error(`Image failed: ${t?.message??t}`)}}async function rt(e){try{const{blob:t,fileName:i}=await S(e);await V(t,i,"image/png",M(e))}catch(t){console.error("[InvoiceV2] share image failed",t),h.error(`Share failed: ${t?.message??t}`)}}function R(e,t){const i=URL.createObjectURL(e),o=document.createElement("a");o.href=i,o.download=t,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(i),1500)}async function V(e,t,i,o){const l=new File([e],t,{type:i}),r=navigator;if(typeof r.canShare=="function"&&r.canShare({files:[l]})&&typeof r.share=="function")try{await r.share({files:[l],text:o,title:o});return}catch(s){if(s?.name==="AbortError")return;console.warn("[InvoiceV2] native share failed, falling back",s)}R(e,t),h.success("Downloaded — attach it in WhatsApp"),window.open(`https://wa.me/?text=${encodeURIComponent(o)}`,"_blank")}const K="lovable:invoice-v2";function st(e){try{window.dispatchEvent(new CustomEvent(K,{detail:e}))}catch(t){console.error("[InvoiceV2] open failed",t)}}export{K as I,at as a,nt as b,ot as d,st as o,rt as s};
