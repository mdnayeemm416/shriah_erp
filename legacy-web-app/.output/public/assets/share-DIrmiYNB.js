import{s as T,t as f}from"./index-DXhm_e6C.js";import{toPng as k}from"./index-BeoRn2gJ.js";import{I as V}from"./types-DF86NaQT.js";import{E as L}from"./jspdf.es.min-PJAwSMrI.js";const M=V,b=e=>(Number.isFinite(e)?e:0).toFixed(2),H='Arial, Tahoma, "Segoe UI", sans-serif',m="Tahoma, Arial, sans-serif",q={cash:"Cash Refund",credit:"Customer Credit",due_reduction:"Due Adjustment"};async function B(e,t=M){const o=document.createElement("div");o.setAttribute("data-sales-return-invoice-root","true"),o.dir="ltr",o.style.cssText=`
    position: static;
    width: 794px;
    background: #ffffff;
    color: #0f172a;
    font-family: ${H};
    font-size: 13px;
    line-height: 1.5;
    box-sizing: border-box;
    padding: 36px 40px 28px;
    -webkit-font-smoothing: antialiased;
  `;const r=(d,u)=>`<span style="display:inline-flex;align-items:baseline;gap:6px;">
       <span>${d}</span>
       <span style="font-family:${m};direction:rtl;font-weight:600;color:#64748b;font-size:0.92em;">${u}</span>
     </span>`,i=e.items.map((d,u)=>`
      <tr style="background:${u%2?"#fff5f5":"#ffffff"};">
        <td style="padding:11px 8px;text-align:center;border-bottom:1px solid #fee2e2;width:38px;color:#64748b;font-variant-numeric:tabular-nums;">${u+1}</td>
        <td style="padding:11px 10px;border-bottom:1px solid #fee2e2;text-align:left;font-weight:600;color:#0f172a;">
          ${p(d.name)}
          ${d.reason?`<div style="font-size:10px;color:#b45309;font-weight:600;margin-top:2px;">Reason: ${p(d.reason)}</div>`:""}
        </td>
        <td style="padding:11px 8px;text-align:center;border-bottom:1px solid #fee2e2;width:64px;font-variant-numeric:tabular-nums;color:#b91c1c;font-weight:700;">${d.qty}</td>
        <td style="padding:11px 8px;text-align:right;border-bottom:1px solid #fee2e2;width:96px;font-variant-numeric:tabular-nums;color:#334155;">${b(d.price)}</td>
        <td style="padding:11px 10px;text-align:right;border-bottom:1px solid #fee2e2;width:110px;font-weight:700;color:#b91c1c;font-variant-numeric:tabular-nums;">${b(d.amount)}</td>
      </tr>`).join(""),l=new Date(e.timestamp??Date.now()),s=`${l.toLocaleDateString()} ${l.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`;o.innerHTML=`
    <!-- HEADER (company) -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:24px;padding-bottom:18px;border-bottom:2px solid #0f172a;">
      <div style="display:flex;gap:14px;align-items:flex-start;">
        <div style="width:64px;height:64px;border-radius:14px;background:linear-gradient(135deg,#0f172a,#1e293b);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:26px;color:#fff;overflow:hidden;">
          ${t.logoDataUrl?`<img src="${t.logoDataUrl}" style="width:100%;height:100%;object-fit:contain;" />`:p(t.name.charAt(0).toUpperCase())}
        </div>
        <div>
          <div style="font-size:22px;font-weight:800;color:#0f172a;">${p(t.name)}</div>
          <div style="color:#64748b;font-size:11.5px;margin-top:3px;">${p(t.address)}</div>
          <div style="color:#64748b;font-size:11.5px;margin-top:2px;">
            <span style="color:#94a3b8;">Phone · الجوال</span> <b style="color:#0f172a;font-variant-numeric:tabular-nums;">${p(t.phone)}</b>
          </div>
          <div style="color:#64748b;font-size:11.5px;margin-top:2px;">
            <span style="color:#94a3b8;">VAT · الرقم الضريبي</span> <b style="color:#0f172a;font-variant-numeric:tabular-nums;">${p(t.vatNumber)}</b>
          </div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="display:inline-block;background:#b91c1c;color:#fff;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:800;letter-spacing:1px;">RETURN</div>
        <div style="font-family:${m};direction:rtl;font-size:12px;font-weight:700;color:#b91c1c;margin-top:6px;">مرتجع مبيعات</div>
      </div>
    </div>

    <!-- BIG TITLE BAND -->
    <div style="margin-top:16px;background:#b91c1c;color:#ffffff;padding:14px 18px;border-radius:10px;text-align:center;">
      <div style="font-size:24px;font-weight:800;letter-spacing:1px;">SALES RETURN INVOICE</div>
      <div style="font-family:${m};direction:rtl;font-size:16px;font-weight:700;margin-top:2px;opacity:0.95;">فاتورة مرتجع مبيعات</div>
    </div>

    <!-- REFERENCE STRIP -->
    <div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
      ${A("Return No","رقم المرتجع",e.returnNumber,!0)}
      ${A("Original Invoice","الفاتورة الأصلية",e.originalInvoiceNumber!=null?`INV-${e.originalInvoiceNumber}`:"—")}
      ${A("Return Date","تاريخ المرتجع",s)}
    </div>

    <!-- CUSTOMER -->
    <div style="margin-top:14px;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;background:#fafbfc;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">CUSTOMER</div>
        <div style="font-family:${m};direction:rtl;font-size:11px;font-weight:600;color:#94a3b8;">العميل</div>
      </div>
      <div style="font-size:17px;font-weight:700;margin-top:6px;color:#0f172a;">${p(e.customerName||"Walk-in Customer")}</div>
      <div style="display:flex;flex-wrap:wrap;gap:22px;margin-top:6px;font-size:11.5px;">
        ${e.customerMobile?`<div><span style="color:#94a3b8;">Mobile · الجوال</span> <b style="color:#0f172a;font-variant-numeric:tabular-nums;">${p(e.customerMobile)}</b></div>`:""}
        <div><span style="color:#94a3b8;">VAT No · الرقم الضريبي</span> <b style="color:#0f172a;font-variant-numeric:tabular-nums;">${p(e.customerVatNo||"N/A")}</b></div>
      </div>
    </div>

    <!-- ITEMS -->
    <table style="width:100%;border-collapse:separate;border-spacing:0;margin-top:18px;font-size:12.5px;border:1px solid #fecaca;border-radius:10px;overflow:hidden;">
      <thead>
        <tr style="background:#7f1d1d;color:#ffffff;">
          <th style="padding:11px 8px;text-align:center;font-weight:700;font-size:11px;">#</th>
          <th style="padding:11px 10px;text-align:left;font-weight:700;font-size:11px;">${v("PRODUCT","المنتج")}</th>
          <th style="padding:11px 8px;text-align:center;font-weight:700;font-size:11px;">${v("RET QTY","الكمية المرتجعة")}</th>
          <th style="padding:11px 8px;text-align:right;font-weight:700;font-size:11px;">${v("UNIT PRICE","السعر")}</th>
          <th style="padding:11px 10px;text-align:right;font-weight:700;font-size:11px;">${v("RETURN AMT","قيمة المرتجع")}</th>
        </tr>
      </thead>
      <tbody>${i||'<tr><td colspan="5" style="padding:18px;text-align:center;color:#94a3b8;">No items</td></tr>'}</tbody>
    </table>

    <!-- SUMMARY -->
    <div style="display:flex;justify-content:flex-end;margin-top:18px;">
      <table style="width:380px;border-collapse:separate;border-spacing:0;font-size:12.5px;border:1px solid #fecaca;border-radius:10px;overflow:hidden;background:#ffffff;">
        <tbody>
          ${w(r("Total Return Value","إجمالي قيمة المرتجع"),`SAR ${b(e.totalReturnValue)}`,"grand")}
          ${w(r("Due Adjustment","تسوية المستحقات"),`SAR ${b(e.dueAdjustment)}`,"muted")}
          ${w(r("Refund Amount","المبلغ المسترد"),`SAR ${b(e.refundAmount)}`,e.refundAmount>0?"refund":"muted")}
          ${w(r("Refund Method","طريقة الاسترداد"),q[e.refundType]??e.refundType,"muted")}
        </tbody>
      </table>
    </div>

    <!-- FOOTER -->
    <div style="margin-top:22px;border-top:1px dashed #cbd5e1;padding-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:12px;">
        <div style="font-size:10px;font-weight:700;color:#c2410c;text-transform:uppercase;letter-spacing:0.6px;">Return Reason · سبب الإرجاع</div>
        <div style="font-size:13px;font-weight:600;color:#7c2d12;margin-top:4px;">${p(e.reason||"—")}</div>
        ${e.notes?`<div style="font-size:11px;color:#78350f;margin-top:6px;">${p(e.notes)}</div>`:""}
      </div>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;">
        <div style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.6px;">Processed By · بواسطة</div>
        <div style="font-size:13px;font-weight:700;color:#0f172a;margin-top:4px;">${p(e.processedBy||"—")}</div>
        <div style="font-size:10px;color:#94a3b8;margin-top:6px;">${s}</div>
      </div>
    </div>

    <div style="text-align:center;margin-top:22px;">
      <div style="font-size:20px;font-weight:800;color:#0f766e;letter-spacing:-0.3px;">Thank You</div>
      <div style="font-family:${m};direction:rtl;font-size:18px;font-weight:800;color:#0f766e;margin-top:2px;">شكراً لكم</div>
      <div style="font-size:11px;color:#64748b;margin-top:6px;">This is an official Sales Return document.</div>
    </div>

    <div style="text-align:right;font-size:9.5px;color:#94a3b8;margin-top:12px;">
      Generated by <b style="color:#64748b;">ShRiAh ERP</b>
    </div>
  `;const a=document.createElement("div");a.setAttribute("data-sales-return-invoice-wrapper","true"),a.style.cssText=`
    position: fixed; left: -10000px; top: 0; width: 794px;
    background: #ffffff; opacity: 1; visibility: visible; z-index: 0; pointer-events: none;
  `,a.appendChild(o),document.body.appendChild(a),o.__wrapper=a,await new Promise(d=>requestAnimationFrame(()=>setTimeout(d,300)));try{const d=document.fonts;d?.ready&&await d.ready}catch{}return{node:o,widthPx:794,heightPx:o.offsetHeight}}function v(e,t){return`<div style="display:flex;flex-direction:column;line-height:1.15;">
    <span>${e}</span>
    <span style="font-family:${m};direction:rtl;font-size:10px;font-weight:600;opacity:0.8;margin-top:1px;">${t}</span>
  </div>`}function A(e,t,n,o=!1){return`<div style="border:1px solid ${o?"#fecaca":"#e2e8f0"};background:${o?"#fef2f2":"#f8fafc"};border-radius:8px;padding:8px 12px;">
    <div style="font-size:9.5px;color:${o?"#b91c1c":"#94a3b8"};font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
      ${e} <span style="font-family:${m};direction:rtl;font-weight:600;">· ${t}</span>
    </div>
    <div style="font-size:14px;font-weight:800;color:${o?"#7f1d1d":"#0f172a"};margin-top:2px;font-variant-numeric:tabular-nums;">${p(n)}</div>
  </div>`}function w(e,t,n){let o="#ffffff",r="#0f172a",i=500,l=12.5,s="1px solid #fef2f2";return n==="grand"?(o="#b91c1c",r="#ffffff",i=800,l=14,s="none"):n==="refund"?(o="#fff7ed",r="#c2410c",i=800,l=14,s="1px solid #fed7aa"):n==="muted"&&(r="#64748b"),`<tr style="background:${o};color:${r};">
    <td style="padding:9px 12px;font-weight:${i};font-size:${l}px;border-top:${s};">${e}</td>
    <td style="padding:9px 12px;text-align:right;font-weight:${i};font-size:${l}px;border-top:${s};font-variant-numeric:tabular-nums;">${t}</td>
  </tr>`}function p(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const E='Arial, Tahoma, "Segoe UI", sans-serif',P=/(Cairo|Tajawal|Noto\s+Sans\s+Arabic|Noto\s+Naskh\s+Arabic|IBM\s+Plex|Inter|Manrope|Plus\s+Jakarta)/i;function W(e){e.querySelectorAll('link[rel="stylesheet"]').forEach(t=>t.remove()),e.querySelectorAll("style").forEach(t=>{P.test(t.textContent||"")&&t.remove()}),e.querySelectorAll("*").forEach(t=>{const n=t.style.fontFamily;(!n||P.test(n))&&(t.style.fontFamily=E)}),e.style.fontFamily=E}function Y(e){if(e instanceof Error)return e.message;if(e instanceof Event){const t=e.target;return`Resource load failed (${e.type}${t?.src?`: ${t.src}`:""})`}try{return JSON.stringify(e)}catch{return String(e)}}async function $(e){const{node:t,widthPx:n}=await B(e),o=t.__wrapper;try{if(W(t),t.childElementCount===0||t.offsetWidth===0||t.offsetHeight===0)throw new Error(`Return invoice DOM empty (w=${t.offsetWidth} h=${t.offsetHeight})`);const r=await k(t,{pixelRatio:3,cacheBust:!0,backgroundColor:"#ffffff",width:n,height:t.offsetHeight,skipFonts:!0,fontEmbedCSS:"",style:{transform:"none",fontFamily:E,position:"static",left:"0",top:"0"},filter:s=>{const a=s.tagName;return!(a==="LINK"||a==="STYLE")}}),i=await(await fetch(r)).blob(),l=`${e.returnNumber}.png`;return{blob:i,dataUrl:r,fileName:l,widthPx:n,heightPx:t.offsetHeight}}catch(r){throw new Error(`Return PNG render failed: ${Y(r)}`)}finally{(o??t).remove()}}const G=210,K=297,x=6;async function F(e){const{dataUrl:t,widthPx:n,heightPx:o}=await $(e),r=new L({unit:"mm",format:"a4",orientation:"portrait"}),i=G-x*2,l=K-x*2,s=i,a=o/n*s;if(a<=l)r.addImage(t,"PNG",x,x,s,a,void 0,"FAST");else{const u=n/s,D=l*u;let h=0;const O=await J(t),g=document.createElement("canvas");g.width=n;const N=g.getContext("2d");let I=!0;for(;h<o;){const S=Math.min(D,o-h);g.height=Math.ceil(S),N.fillStyle="#ffffff",N.fillRect(0,0,g.width,g.height),N.drawImage(O,0,-h);const j=g.toDataURL("image/png");I||r.addPage(),r.addImage(j,"PNG",x,x,s,S/u,void 0,"FAST"),h+=S,I=!1}}return{blob:r.output("blob"),fileName:`${e.returnNumber}.pdf`}}function J(e){return new Promise((t,n)=>{const o=new Image;o.onload=()=>t(o),o.onerror=n,o.src=e})}const y=e=>(Number.isFinite(e)?e:0).toFixed(2),C='Arial, Tahoma, "Segoe UI", sans-serif';async function U(e){const t=M,n=380,o=document.createElement("div");o.style.cssText=`position:fixed;left:-10000px;top:0;width:${n}px;background:#fff;`;const r=document.createElement("div");r.style.cssText=`
    width:${n}px;background:#fff;color:#000;font-family:${C};
    font-size:12px;line-height:1.4;padding:14px 12px;box-sizing:border-box;
  `;const i=new Date(e.timestamp??Date.now()),l=`${i.toLocaleDateString()} ${i.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`,s=e.items.map(a=>`
    <tr>
      <td style="padding:4px 0;vertical-align:top;">
        <div style="font-weight:700;">${c(a.name)}</div>
        <div style="color:#666;font-size:10.5px;">${a.qty} × ${y(a.price)}${a.reason?` · ${c(a.reason)}`:""}</div>
      </td>
      <td style="padding:4px 0;text-align:right;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;">${y(a.amount)}</td>
    </tr>`).join("");r.innerHTML=`
    <div style="text-align:center;border-bottom:1px dashed #000;padding-bottom:8px;">
      <div style="font-size:15px;font-weight:800;">${c(t.name)}</div>
      <div style="font-size:10.5px;color:#333;">${c(t.address)}</div>
      <div style="font-size:10.5px;color:#333;">Tel: ${c(t.phone)} · VAT: ${c(t.vatNumber)}</div>
    </div>
    <div style="text-align:center;margin-top:8px;background:#000;color:#fff;padding:6px;border-radius:4px;">
      <div style="font-weight:800;letter-spacing:1px;">SALES RETURN INVOICE</div>
      <div style="font-size:10.5px;">فاتورة مرتجع مبيعات</div>
    </div>
    <div style="margin-top:8px;font-size:11px;">
      <div style="display:flex;justify-content:space-between;"><span>Return #</span><b>${c(e.returnNumber)}</b></div>
      <div style="display:flex;justify-content:space-between;"><span>Orig. Invoice</span><b>${e.originalInvoiceNumber!=null?`INV-${e.originalInvoiceNumber}`:"—"}</b></div>
      <div style="display:flex;justify-content:space-between;"><span>Date</span><b>${l}</b></div>
    </div>
    <div style="border-top:1px dashed #000;margin-top:8px;padding-top:6px;font-size:11px;">
      <div><b>${c(e.customerName||"Walk-in Customer")}</b></div>
      ${e.customerMobile?`<div style="color:#333;">${c(e.customerMobile)}</div>`:""}
      ${e.customerVatNo?`<div style="color:#333;">VAT: ${c(e.customerVatNo)}</div>`:""}
    </div>
    <table style="width:100%;border-collapse:collapse;margin-top:8px;border-top:1px dashed #000;">
      <tbody>${s||'<tr><td style="text-align:center;padding:8px;color:#666;">No items</td></tr>'}</tbody>
    </table>
    <div style="border-top:1px dashed #000;margin-top:6px;padding-top:6px;font-size:12px;">
      <div style="display:flex;justify-content:space-between;font-weight:800;background:#000;color:#fff;padding:4px 6px;border-radius:3px;">
        <span>Total Return</span><span>SAR ${y(e.totalReturnValue)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:4px;">
        <span>Due Adjustment</span><b>SAR ${y(e.dueAdjustment)}</b>
      </div>
      <div style="display:flex;justify-content:space-between;">
        <span>Refund</span><b>SAR ${y(e.refundAmount)} (${e.refundType})</b>
      </div>
    </div>
    <div style="border-top:1px dashed #000;margin-top:8px;padding-top:6px;font-size:10.5px;">
      <div><b>Reason:</b> ${c(e.reason||"—")}</div>
      <div><b>Processed by:</b> ${c(e.processedBy||"—")}</div>
      ${e.notes?`<div style="margin-top:2px;color:#333;">${c(e.notes)}</div>`:""}
    </div>
    <div style="text-align:center;margin-top:10px;font-weight:800;">Thank You · شكراً لكم</div>
    <div style="text-align:center;font-size:9.5px;color:#666;margin-top:4px;">ShRiAh ERP</div>
  `,o.appendChild(r),document.body.appendChild(o);try{await new Promise(u=>requestAnimationFrame(()=>setTimeout(u,200)));const a=await k(r,{pixelRatio:3,cacheBust:!0,backgroundColor:"#ffffff",width:n,height:r.offsetHeight,skipFonts:!0,fontEmbedCSS:"",style:{transform:"none",fontFamily:C,position:"static"}});return{blob:await(await fetch(a)).blob(),dataUrl:a,fileName:`${e.returnNumber}-80mm.png`,widthPx:n,heightPx:r.offsetHeight}}finally{o.remove()}}function c(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Q(e){const{data:t,error:n}=await T.from("sales_returns").select("*").eq("id",e).maybeSingle();if(n)throw n;if(!t)throw new Error("Return not found");const{data:o,error:r}=await T.from("sales_return_items").select("id,name,qty,price,line_value,reason").eq("return_id",e).order("created_at",{ascending:!0});if(r)throw r;const i=t,l=(o??[]).map(a=>({name:a.name,qty:Number(a.qty)||0,price:Number(a.price)||0,amount:Number(a.line_value??Number(a.qty)*Number(a.price))||0,reason:a.reason??null}));let s=null;if(i.customer_id){const{data:a}=await T.from("pos_customers").select("vat_number").eq("id",i.customer_id).maybeSingle();s=a?.vat_number??null}return{returnId:i.id,returnNumber:i.return_number??"SR-—",originalInvoiceNumber:i.invoice_number??null,date:new Date(i.created_at).toLocaleDateString(),timestamp:i.created_at,customerName:i.customer_name??"Walk-in Customer",customerMobile:i.customer_mobile??null,customerVatNo:s,items:l,totalReturnValue:Number(i.return_value)||0,dueAdjustment:Math.max(0,(Number(i.return_value)||0)-(Number(i.refund_amount)||0)),refundAmount:Number(i.refund_amount)||0,refundType:i.refund_type??"due_reduction",reason:i.reason??null,processedBy:i.processed_by_name??null,notes:i.notes??null}}const X="lovable:sales-return-invoice";function oe(e){try{window.dispatchEvent(new CustomEvent(X,{detail:e}))}catch(t){console.error("[SalesReturnInvoice] open failed",t)}}function z(e){return`Sales Return ${e.returnNumber} — ${e.customerName||"Customer"} · SAR ${e.totalReturnValue.toFixed(2)}`}function R(e,t){const n=URL.createObjectURL(e),o=document.createElement("a");o.href=n,o.download=t,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(n),1500)}async function _(e,t,n,o){const r=new File([e],t,{type:n}),i=navigator;if(typeof i.canShare=="function"&&i.canShare({files:[r]})&&typeof i.share=="function")try{await i.share({files:[r],text:o,title:o});return}catch(l){if(l?.name==="AbortError")return}R(e,t),f.success("Downloaded — attach it in WhatsApp"),window.open(`https://wa.me/?text=${encodeURIComponent(o)}`,"_blank")}async function ie(e){return typeof e=="string"?await Q(e):e}async function re(e){try{const{blob:t,fileName:n}=await F(e);R(t,n),f.success("PDF downloaded")}catch(t){f.error(`PDF failed: ${t?.message??t}`)}}async function ae(e){try{const{blob:t,fileName:n}=await F(e);await _(t,n,"application/pdf",z(e))}catch(t){f.error(`Share failed: ${t?.message??t}`)}}async function se(e){try{const{blob:t,fileName:n}=await $(e);R(t,n),f.success("Image downloaded")}catch(t){f.error(`Image failed: ${t?.message??t}`)}}async function le(e){try{const{blob:t,fileName:n}=await $(e);await _(t,n,"image/png",z(e))}catch(t){f.error(`Share failed: ${t?.message??t}`)}}async function de(e){try{const{blob:t,fileName:n}=await U(e);R(t,n),f.success("80mm image downloaded")}catch(t){f.error(`80mm failed: ${t?.message??t}`)}}async function pe(e){try{const{blob:t,fileName:n}=await U(e);await _(t,n,"image/png",z(e))}catch(t){f.error(`Share failed: ${t?.message??t}`)}}async function ce(e){try{const{dataUrl:t}=await $(e),n=window.open("","_blank","width=900,height=1200");if(!n){f.error("Popup blocked");return}n.document.write(`<!doctype html><html><head><title>${e.returnNumber}</title>
      <style>@page{size:A4;margin:8mm;} body{margin:0;} img{width:100%;display:block;}</style>
      </head><body><img src="${t}" onload="setTimeout(()=>{window.focus();window.print();},200)"/></body></html>`),n.document.close()}catch(t){f.error(`Print failed: ${t?.message??t}`)}}export{X as S,se as a,de as b,ae as c,re as d,pe as e,oe as o,ce as p,ie as r,le as s};
