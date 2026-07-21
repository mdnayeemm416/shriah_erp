import{aY as ke,t as R}from"./index-DXhm_e6C.js";import{Q as Se}from"./browser-Cs2kZqsl.js";const J={sectionGap:4,productRowGap:2,summaryRowGap:1,dueRowGap:1,headerBottomGap:4,footerTopGap:4,qrTopMargin:6,qrBottomMargin:4,grandTopPadding:3,grandBottomPadding:3,topMargin:4,bottomMargin:4,productNameValueGap:2,productRowMinHeight:0,separatorTopGap:0,separatorBottomGap:2},ee=["header","info","items","summary","due","qr","footer"],te={header:!0,info:!0,items:!0,summary:!0,due:!0,qr:!0,footer:!0},b=(e,t={})=>({family:"english",size:e,bold:!1,align:"left",lineHeight:1.1,letterSpacing:0,uppercase:!1,...t}),I=(e,t={})=>({family:"arabic",size:e,bold:!0,align:"center",lineHeight:1.2,letterSpacing:0,...t});function _(e="Default"){return{templateName:e,sectionOrder:[...ee],sectionEnabled:{...te},printLayout:{leftMargin:4,rightMargin:4,topMargin:1,bottomMargin:1,safeMode:!0},header:{show:{logo:!1,brandEn:!0,brandAr:!0,shopName:!1,address:!0,phone:!0,vat:!0,cr:!1,email:!1,website:!1},en:b(21,{bold:!0,align:"center"}),ar:I(18,{align:"center"}),marginTop:0,marginBottom:1},spacing:{...J},info:{fields:{invoiceNo:{show:!0,labelAr:"رقم الفاتورة",bold:!0,align:"left"},date:{show:!0,labelAr:"التاريخ",bold:!1,align:"left"},time:{show:!0,labelAr:"الوقت",bold:!1,align:"left"},customer:{show:!0,labelAr:"العميل",bold:!0,align:"left"},mobile:{show:!0,labelAr:"الجوال",bold:!1,align:"left"},vatNumber:{show:!0,labelAr:"الرقم الضريبي",bold:!0,align:"left"},payment:{show:!0,labelAr:"الدفع",bold:!1,align:"left"},salesman:{show:!1,labelAr:"البائع",bold:!1,align:"left"}},en:b(13),ar:I(13,{align:"right"})},table:{columns:[{id:"c1",key:"item",label:"Item",labelAr:"الصنف",width:100,align:"left",visible:!0},{id:"c2",key:"qty",label:"Qty",labelAr:"الكمية",width:0,align:"left",visible:!0},{id:"c3",key:"rate",label:"Rate",labelAr:"السعر",width:0,align:"left",visible:!0},{id:"c4",key:"total",label:"Total",labelAr:"الإجمالي",width:0,align:"right",visible:!0}],rowSpacing:.3,padding:0,multiLine:!0,headerStyle:b(12,{bold:!0,uppercase:!0,weight:"bold"}),itemStyle:b(13,{bold:!0,weight:"bold"}),itemArStyle:I(12,{align:"right",bold:!1,weight:"regular"}),qtyStyle:b(13,{weight:"regular"}),rateStyle:b(13,{weight:"regular"}),totalStyle:b(13,{bold:!0,align:"right",weight:"bold"})},summary:{rows:[{id:"s1",key:"totalQty",label:"Total Qty",labelAr:"إجمالي الكمية",visible:!0,bold:!1},{id:"s2",key:"subtotal",label:"Subtotal",labelAr:"المجموع الفرعي",visible:!0,bold:!1},{id:"s3",key:"vat",label:"VAT 15%",labelAr:"ضريبة القيمة المضافة",visible:!0,bold:!1},{id:"s4",key:"discount",label:"Discount",labelAr:"الخصم",visible:!0,bold:!1},{id:"s5",key:"grandTotal",label:"Grand Total",labelAr:"الإجمالي الكلي",visible:!0,bold:!0}],en:b(14,{bold:!0}),ar:I(13,{align:"right"}),amount:b(15,{bold:!0,align:"right"}),grandTotal:b(22,{bold:!0,align:"center",letterSpacing:.5}),grandTotalAr:I(14,{align:"center"})},due:{rows:[{id:"d1",key:"paid",label:"Paid Amount",labelAr:"المبلغ المدفوع",visible:!0,bold:!1},{id:"d2",key:"current",label:"Current Due",labelAr:"المستحق الحالي",visible:!0,bold:!1},{id:"d3",key:"previous",label:"Previous Due",labelAr:"الرصيد السابق",visible:!0,bold:!1},{id:"d4",key:"new",label:"New Due",labelAr:"الرصيد الجديد",visible:!0,bold:!0}],en:b(14),ar:I(13,{align:"right"}),amount:b(15,{bold:!0,align:"right"})},qr:{show:!0,size:30,margin:2,align:"center",marginTop:6,marginBottom:4,captionShow:!0,captionSize:10,captionArSize:12,highQuality:!0},footer:{thankYou:{show:!0,text:"Thank You",style:b(15,{bold:!0,align:"center"})},thankYouAr:{show:!0,text:"شكراً لزيارتكم",style:I(13,{align:"center"})},amountInWords:{show:!0,style:b(11,{align:"center"})},custom:{show:!1,text:"",style:b(12,{align:"center"})},social:{show:!1,text:"",style:b(11,{align:"center"})},website:{show:!1,text:"",style:b(11,{align:"center"})},phone:{show:!0,text:"WhatsApp: 0553687388",style:b(12,{align:"center"})}}}}const Ae=["default","retail","wholesale","mini","premium","simple"],Re={default:"Default",retail:"Retail",wholesale:"Wholesale",mini:"Mini",premium:"Premium",simple:"Simple"};function Te(e){const t=_(Re[e]);switch(e){case"mini":t.header.en.size=17,t.header.ar.size=15,t.table.itemStyle.size=14,t.table.itemArStyle.size=12,t.qr.size=36,t.footer.amountInWords.show=!1;break;case"premium":t.header.en.size=24,t.header.en.letterSpacing=1,t.header.ar.size=20,t.summary.grandTotal.size=26,t.qr.size=46;break;case"simple":t.header.show.vat=!1,t.header.show.cr=!1,t.due.rows=t.due.rows.map(a=>({...a,visible:a.key==="paid"||a.key==="new"})),t.summary.rows=t.summary.rows.map(a=>({...a,visible:a.key!=="discount"})),t.footer.amountInWords.show=!1;break;case"retail":t.footer.thankYou.text="Thank you for shopping with us";break;case"wholesale":t.table.itemStyle.size=17,t.footer.thankYou.text="Wholesale Invoice";break}return t}const Ee="invoice.designer.88.v4",Ne="invoice.designer.mode";function Q(){const e={};for(const t of Ae)e[t]=Te(t);return{mode:"simple",activeId:"default",templates:e}}function ae(e,t){if(Array.isArray(e))return Array.isArray(t)?t:e;if(e&&typeof e=="object"){const a={...e};if(t&&typeof t=="object")for(const o of Object.keys(t))a[o]=o in e?ae(e[o],t[o]):t[o];return a}return t??e}function Pe(){try{if(typeof window>"u")return Q();const e=localStorage.getItem(Ee),t=localStorage.getItem(Ne)||"simple";if(!e)return{...Q(),mode:t};const a=JSON.parse(e),o=Q(),i={mode:a.mode??t,activeId:a.activeId??o.activeId,templates:{...o.templates}};if(a.templates)for(const r of Object.keys(a.templates)){const l=o.templates[r]??_(r);i.templates[r]=ae(l,a.templates[r])}return i.templates[i.activeId]||(i.activeId="default"),i}catch{return Q()}}function Ie(){const e=Pe();return e.templates[e.activeId]??_()}const oe="Azzouz WholeSale",Me="عزوز للجملة",qe="Walyal Ahd, Makkah",We="ولي العهد، مكة المكرمة",re="311339561300003",ze="0553687388";function T(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function De(e){const t=new TextEncoder,a=[[1,t.encode(e.seller)],[2,t.encode(e.vat)],[3,t.encode(e.ts)],[4,t.encode(e.total)],[5,t.encode(e.vatAmt)]];e.invoiceHash&&a.push([6,t.encode(e.invoiceHash)]),e.ecdsaSignature&&a.push([7,t.encode(e.ecdsaSignature)]),e.publicKey&&a.push([8,t.encode(e.publicKey)]),e.certSignature&&a.push([9,t.encode(e.certSignature)]);const o=[];for(const[l,s]of a)o.push(l,s.length,...s);let i="";const r=new Uint8Array(o);for(let l=0;l<r.length;l+=32768)i+=String.fromCharCode(...r.subarray(l,l+32768));return btoa(i)}function E(e,t={}){const a=e.family==="arabic",o=a?'"Cairo","Tajawal","Noto Sans Arabic",sans-serif':'"Noto Sans","Helvetica Neue",Arial,"Segoe UI",sans-serif',i=Math.max(1,e.size),r=Math.max(.5,e.lineHeight),l=a||t.rtl?"direction:rtl;unicode-bidi:embed;":"",s=e.weight==="medium"?500:e.weight==="regular"?400:e.weight==="bold"||e.bold?700:400;return[`font-family:${o}`,`font-size:${i}px`,`font-weight:${s}`,`text-align:${e.align}`,`line-height:${r}`,e.letterSpacing?`letter-spacing:${e.letterSpacing}px`:"",e.uppercase?"text-transform:uppercase":"",l].filter(Boolean).join(";")+";"}function P(e,t,a=""){if(!t)return"";const o=e.family==="arabic"?' lang="ar"':"";return`<span style="${E(e)}${a}"${o}>${T(t)}</span>`}function g(e,t,a=""){if(!t)return"";const o=e.family==="arabic"?' lang="ar"':"";return`<div style="${E(e)}${a}"${o}>${T(t)}</div>`}function Fe(e,t){const a=(()=>{const i=e.timestamp??[e.date,e.time].filter(Boolean).join(" "),r=i instanceof Date?i:new Date(i);return isNaN(r.getTime())?new Date().toISOString():r.toISOString()})(),o=e.zatca??{};return De({seller:e.brand??oe,vat:re,ts:a,total:e.total.toFixed(2),vatAmt:t.toFixed(2),invoiceHash:o.invoiceHash,ecdsaSignature:o.ecdsaSignature,publicKey:o.publicKey,certSignature:o.certSignature})}function Ce(e,t,a=4){if(typeof document>"u")throw new Error("QR PNG generation requires browser canvas");const o=Se.create(e,{errorCorrectionLevel:"M"}),i=Number(o.modules.size),r=o.modules.data;if(!i||!r)throw new Error("ZATCA QR generation failed");const l=Math.max(0,Math.round(a)),s=document.createElement("canvas");s.width=t,s.height=t;const p=s.getContext("2d");if(!p)throw new Error("QR canvas context unavailable");p.imageSmoothingEnabled=!1,p.fillStyle="#ffffff",p.fillRect(0,0,t,t);const h=Math.max(1,Math.floor(t/(i+l*2))),$=h*(i+l*2),u=Math.floor((t-$)/2);p.fillStyle="#000000";for(let d=0;d<i;d++)for(let y=0;y<i;y++)r[d*i+y]&&p.fillRect(u+(y+l)*h,u+(d+l)*h,h,h);return s.toDataURL("image/png")}async function Le(e,t={}){const a=t.cfg??_(),o=e.currency??"SAR",i=e.tax??0,r=Math.max(0,e.subtotal-i),l=e.discount??0,s=e.paidAmount??0,p=e.previousDue??0,h=Math.max(0,e.total-s),$=e.newDue??Math.max(0,p+e.total-s),u=e.items.reduce((n,m)=>n+(m.qty||0),0),d=!e.partyName||/walk[- ]?in/i.test(e.partyName),y=Math.max(180,Math.round(Math.max(30,a.qr.size)*3.78));let M=t.qrPngDataUrl??"";if(!M){let n="";try{n=Fe(e,i)}catch(m){throw console.error("[ThermalQR] ZATCA QR generation failed (TLV)",m),new Error("ZATCA QR generation failed")}if(!n)throw console.error("[ThermalQR] QR payload missing"),new Error("QR payload missing");console.log("[ThermalQR] QR payload generated",{length:n.length});try{M=Ce(n,y*3,4),console.log("[ThermalQR] QR image rendered",{type:"PNG",bytes:M.length,size:`${y*3}x${y*3}`})}catch(m){throw console.error("[ThermalQR] ZATCA QR generation failed (PNG canvas)",m),new Error("ZATCA QR generation failed")}}const V=`<img data-role="qr" data-qr="true" src="${M}" alt="ZATCA QR" width="${y}" height="${y}" decoding="sync" loading="eager" style="display:block;width:${y}px;height:${y}px;background:#fff;margin:0 auto;image-rendering:pixelated;" />`,v=a.header,c=v.en,q=v.ar,A=(n,m=!1)=>({...c,size:Math.max(1,c.size-n),bold:m,weight:m?"bold":c.weight}),D=(n,m=!1)=>({...q,size:Math.max(1,q.size-n),bold:m,weight:m?"bold":q.weight}),se=`
    <div class="header-block" style="margin-top:${v.marginTop}mm;margin-bottom:${v.marginBottom}mm;">
      ${v.show.brandAr?g(q,e.brandAr||Me):""}
      ${v.show.brandEn?g(c,e.brand??oe):""}
      ${v.show.address?g(D(4),We):""}
      ${v.show.address?g(A(7),qe):""}
      ${v.show.phone?g(A(7),`Tel: ${ze}`):""}
      ${v.show.vat?g(A(7),`VAT: ${re}`):""}
      ${v.show.cr?g(A(7),"CR: 1010101010"):""}
      ${v.show.email?g(A(7),"info@example.com"):""}
      ${v.show.website?g(A(7),"www.example.com"):""}
      ${g(D(2,!0),"فاتورة ضريبية مبسطة")}
      ${g(A(6,!0),"Simplified Tax Invoice")}
    </div>
  `,ce=n=>{switch(n){case"invoiceNo":return String(e.invoiceNumber);case"date":return e.date;case"time":return e.time||null;case"customer":return d?"Cash Customer":e.partyName;case"mobile":return d?null:e.partyMobile||null;case"payment":return e.paymentMethod?e.paymentMethod.toUpperCase():null;case"salesman":return e.createdBy||null}return null},de={invoiceNo:"Invoice No",date:"Date",time:"Time",customer:"Customer",mobile:"Mobile",vatNumber:"Cust. VAT No",payment:"Payment",salesman:"Salesman"},me=n=>{if(n==="vatNumber"){const m=e.partyTaxNo?.toString().trim();return m||"N/A"}return ce(n)},B=n=>{const m=a.info.fields[n];if(!m||!m.show)return null;const k=me(n);if(k==null||k==="")return null;const S={...a.info.en,align:m.align,bold:m.bold,weight:m.bold?"bold":a.info.en.weight},C={...S,bold:!1,weight:"regular"},U={...S,bold:m.bold||S.bold,weight:m.bold?"bold":S.weight},O=de[n]??"",X=m.labelAr??"",xe=`<span class="ic-label" style="${E(C)}color:#555;white-space:nowrap;direction:ltr;unicode-bidi:isolate;"><bdi dir="ltr">${T(O)}</bdi>`+(X?` / <bdi dir="rtl">${T(X)}</bdi>`:"")+'<bdi dir="ltr"> : </bdi></span>';return`<div class="ic" style="text-align:${m.align};direction:ltr;unicode-bidi:isolate;">${xe}<bdi dir="ltr">${P(U,k)}</bdi></div>`},L=n=>{const m=B(n);return m?`<div class="irow-full">${m}</div>`:""},Y=(n,m)=>{const k=B(n),S=B(m);return!k&&!S?"":`<div class="irow">${k??'<div class="ic"></div>'}${S??'<div class="ic"></div>'}</div>`},Z=[Y("invoiceNo","payment"),Y("date","time")].filter(Boolean).join(""),K=[L("customer"),L("mobile"),L("vatNumber"),L("salesman")].filter(Boolean).join(""),pe=`${Z}${Z&&K?'<div class="info-sep"></div>':""}${K}`,f=a.table,ue=f.columns.filter(n=>n.visible),N=n=>ue.some(m=>m.key===n),he=e.items.map(n=>{const m=n.qty*n.price,k=n.nameArabic||n.nameAr||"",S=N("item")?`<div class="i-name" style="text-align:${f.itemStyle.align};">${g(f.itemStyle,n.name||"—")}${k?g(f.itemArStyle,k):""}</div>`:'<div class="i-name"></div>',C=N("qty")?`<span class="i-qty" style="text-align:${f.qtyStyle.align};">${P(f.qtyStyle,String(n.qty))}</span>`:'<span class="i-qty"></span>',U=N("rate")?`<span class="i-rate" style="text-align:${f.rateStyle.align};">${P(f.rateStyle,n.price.toFixed(2))}</span>`:'<span class="i-rate"></span>',O=N("total")?`<span class="i-tot" style="text-align:${f.totalStyle.align};">${P(f.totalStyle,m.toFixed(2))}</span>`:'<span class="i-tot"></span>';return`<div class="product">${S}<div class="value-row"><span></span>${C}${U}${O}</div></div>`}).join(""),ge=`
    <div class="items-head">
      <span style="${E(f.headerStyle)}">${N("item")?T(f.columns.find(n=>n.key==="item")?.label??"Item"):""}</span>
      <span style="${E(f.headerStyle)}">${N("qty")?T(f.columns.find(n=>n.key==="qty")?.label??"Qty"):""}</span>
      <span style="${E(f.headerStyle)}">${N("rate")?T(f.columns.find(n=>n.key==="rate")?.label??"Rate"):""}</span>
      <span style="${E(f.headerStyle)}">${N("total")?T(f.columns.find(n=>n.key==="total")?.label??"Total"):""}</span>
    </div>`,fe=n=>{switch(n){case"totalQty":return String(u);case"subtotal":return`${r.toFixed(2)} ${o}`;case"vat":return`${i.toFixed(2)} ${o}`;case"discount":return l>0?`- ${l.toFixed(2)} ${o}`:null;case"grandTotal":return`${o} ${e.total.toFixed(2)}`}return null},we=a.summary.rows.filter(n=>n.visible).map(n=>{const m=fe(n.key);if(m==null)return"";if(n.key==="grandTotal"){const S=a.summary.grandTotal,C=a.summary.amount;return`
        <div class="grand-wrap">
          <div class="hr-grand"></div>
          <div class="grand-line"><span class="grand-label">${P(S,n.label)}</span><span class="grand-amount">${P(C,m)}</span></div>
          ${a.summary.grandTotalAr?g(a.summary.grandTotalAr,n.labelAr):""}
          <div class="hr-grand"></div>
        </div>`}const k={...a.summary.en,bold:n.bold||a.summary.en.bold,weight:n.bold?"bold":a.summary.en.weight};return`
      <div class="kv-row">
        <div class="kv-l">${g(k,n.label)}${g(a.summary.ar,n.labelAr)}</div>
        <div class="kv-v">${P(a.summary.amount,m)}</div>
      </div>`}).join(""),be=n=>{switch(n){case"paid":return`${s.toFixed(2)} ${o}`;case"current":return`${h.toFixed(2)} ${o}`;case"previous":return`${p.toFixed(2)} ${o}`;case"new":return`${$.toFixed(2)} ${o}`}return""},ye=a.due.rows.filter(n=>n.visible).map(n=>{const m={...a.due.en,bold:n.bold||a.due.en.bold,weight:n.bold?"bold":a.due.en.weight},k={...a.due.amount,bold:n.bold||a.due.amount.bold,weight:n.bold?"bold":a.due.amount.weight};return`
      <div class="kv-row">
        <div class="kv-l">${g(m,n.label)}${g(a.due.ar,n.labelAr)}</div>
        <div class="kv-v">${P(k,be(n.key))}</div>
      </div>`}).join(""),H=a.qr,x={...J,...a.spacing??{}},F=a.printLayout??{leftMargin:4,rightMargin:4,topMargin:1,bottomMargin:1,safeMode:!0},G=F.safeMode?{qty:10,rate:13,total:16}:{qty:12,rate:15,total:18},ve=H.show?`
    <div class="qrwrap" style="margin:8px 0 8px;text-align:center;width:100%;">
      <div class="qrbox" style="display:inline-block;padding:14px;background:#fff;border:0;margin:0 auto;">
        ${V}
      </div>
      ${H.captionShow?`
        <div style="${E({family:"arabic",size:H.captionArSize,bold:!0,align:"center",lineHeight:1.4,letterSpacing:0})};margin-top:4px;text-align:center;" lang="ar">امسح الرمز للتحقق - هيئة الزكاة والضريبة</div>
        <div style="${E({family:"english",size:H.captionSize,bold:!1,align:"center",lineHeight:1.4,letterSpacing:0})};text-align:center;">ZATCA — Scan to verify</div>`:""}
    </div>`:"",w=a.footer,W=n=>({...n,align:"center"}),$e=`
    <div class="footer">
      ${w.thankYou.show?g(W(w.thankYou.style),w.thankYou.text):""}
      ${w.thankYouAr.show?g(W(w.thankYouAr.style),w.thankYouAr.text):""}
      ${w.custom.show?g(W(w.custom.style),w.custom.text):""}
      ${w.social.show?g(W(w.social.style),w.social.text):""}
      ${w.website.show?g(W(w.website.style),w.website.text):""}
      ${w.phone.show?g(W(w.phone.style),w.phone.text):""}
    </div>`;return`<!doctype html>
<html><head>
<meta charset="utf-8" />
<title>Receipt ${T(e.invoiceNumber)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Tajawal:wght@400;500;700;900&family=Noto+Sans+Arabic:wght@400;500;700;900&family=Noto+Sans:wght@400;600;700;800&display=swap" />
<style>
  :root {
    --section-gap: ${x.sectionGap}px;
    --product-row-gap: ${x.productRowGap}px;
    --table-row-gap: ${f.rowSpacing}mm;
    --table-pad: ${f.padding}mm;
    --name-white-space: ${f.multiLine?"normal":"nowrap"};
    --name-val-gap: ${x.productNameValueGap??2}px;
    --row-min-h: ${x.productRowMinHeight??0}px;
    --sep-top: ${x.separatorTopGap??0}px;
    --sep-bot: ${x.separatorBottomGap??2}px;
    --summary-row-gap: ${x.summaryRowGap}px;
    --due-row-gap: ${x.dueRowGap}px;
    --header-bottom-gap: ${x.headerBottomGap}px;
    --footer-top-gap: ${x.footerTopGap}px;
    --grand-top-pad: ${x.grandTopPadding}px;
    --grand-bot-pad: ${x.grandBottomPadding}px;
    --pad-left: ${F.leftMargin}mm;
    --pad-right: ${F.rightMargin}mm;
    --pad-top: calc(${F.topMargin}mm + ${x.topMargin}px);
    --pad-bot: calc(${F.bottomMargin}mm + ${x.bottomMargin}px);
    --col-qty: ${G.qty}mm;
    --col-rate: ${G.rate}mm;
    --col-total: ${G.total}mm;

  }
  @page { size: 80mm auto; margin: 0; }
  html, body { width: 80mm !important; min-width: 80mm !important; max-width: 80mm !important; margin: 0 !important; padding: 0 !important; background: #fff; color: #000;
    transform: none !important; zoom: 1 !important; -webkit-transform: none !important;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
    font-family: "Noto Sans","Helvetica Neue",Arial,"Segoe UI",sans-serif; }
  * { box-sizing: border-box; }
  .receipt { width: 80mm !important; min-width: 80mm !important; max-width: 80mm !important; margin: 0 !important; padding: var(--pad-top) var(--pad-right) var(--pad-bot) var(--pad-left); overflow: visible !important; word-wrap:break-word; overflow-wrap:anywhere; transform: none !important; zoom: 1 !important; -webkit-transform: none !important; }
  .receipt > * { width:100%; max-width:100%; }
  .header-block { margin-bottom: var(--header-bottom-gap); width:100% !important; text-align:center !important; padding-left:0 !important; padding-right:0 !important; display:flex; flex-direction:column; align-items:center !important; justify-content:center !important; }
  .header-block > div { margin-top:0; margin-bottom:0; padding-left:0 !important; padding-right:0 !important; width:100% !important; text-align:center !important; display:block !important; }
  .header-block > div > span { display:inline-block !important; text-align:center !important; width:auto !important; }
  .hr { border:0; border-top:1px solid #000; margin: var(--section-gap) 0; }
  .hr-thin { border:0; border-top:1px dashed #000; margin: var(--section-gap) 0; }
  .hr-grand { border:0; border-top:1px solid #000; margin: 0.4mm 0; }

  .kv-row { display:flex; justify-content:space-between; gap:1.2mm; align-items:flex-start; padding: var(--summary-row-gap) 0; width:100%; min-width:0; }
  .kv-l { min-width:0; flex:1; }
  .kv-l > div { padding:0 !important; margin:0 !important; }
  .kv-v { text-align:right; word-break:break-word; overflow-wrap:anywhere; min-width:22mm; max-width:34mm; flex-shrink:0; }
  .due .kv-row { padding: var(--due-row-gap) 0; }

  .info { padding: 0; }
  .irow { display:flex; justify-content:space-between; gap:3mm; padding:2px 0; }
  .irow-full { padding:2px 0; }
  .info-sep { border-top:1px dashed #bbb; margin: 2px 0; }
  .ic { flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ic .ic-label { white-space:nowrap !important; unicode-bidi:isolate; display:inline-block; }
  .irow-full .ic { width:100%; }

  .items-head { display:grid; grid-template-columns:1fr var(--col-qty) var(--col-rate) var(--col-total); width:100%; align-items:end; gap:0;
    border-bottom:1px solid #000; padding: var(--table-pad) 0 0.6mm; margin-bottom:0.6mm; }
  .items-head > span { display:block; min-width:0; overflow:hidden; text-overflow:clip; white-space:nowrap; }

  .product { width:100%; border-bottom:1px dotted #aaa; padding: calc(var(--sep-top) + var(--table-pad)) 0 calc(var(--sep-bot) + var(--table-pad)); margin-bottom: calc(var(--product-row-gap) + var(--table-row-gap)); min-height: var(--row-min-h); overflow-wrap:anywhere; word-break:break-word; }
  .product:last-child { border-bottom:0; margin-bottom:0; }
  .i-name { width:100%; margin-bottom: var(--name-val-gap); }
  .i-name > div { padding:0 !important; margin:0 !important; white-space:var(--name-white-space); overflow:hidden; text-overflow:clip; }
  .value-row { display:grid; grid-template-columns:1fr var(--col-qty) var(--col-rate) var(--col-total); width:100%; align-items:center; gap:0; margin-top:0; }


  .value-row > span { display:block; min-width:0; overflow:hidden; }
  .value-row .i-tot  { overflow:hidden; }
  .i-tot span { max-width:100%; overflow-wrap:anywhere; word-break:break-word; }

  .grand-wrap { margin:0.5mm 0; padding-top: var(--grand-top-pad); padding-bottom: var(--grand-bot-pad); width:100%; }
  .grand-wrap > div { padding:0 !important; margin:0 !important; }
  .grand-line { display:flex; align-items:center; justify-content:space-between; gap:1mm; width:100%; white-space:nowrap; }
  .grand-label { flex:1; min-width:0; overflow:hidden; }
  .grand-amount { flex-shrink:0; max-width:38mm; overflow:hidden; }

  .qrwrap { text-align:center !important; }
  .qrwrap .qrbox { display:inline-block; background:#fff; margin:0 auto; }
  .qrwrap svg { display:block; background:#fff; shape-rendering: crispEdges; }
  .qrwrap img { display:block; background:#fff; image-rendering: -webkit-optimize-contrast; }

  .footer { margin-top: var(--footer-top-gap); width:100%; text-align:center !important; }
  .footer > div { margin: 0 auto !important; padding:0.2mm 0; width:100% !important; text-align:center !important; }
  .footer > div > span, .footer span { text-align:center !important; display:inline-block; }

  @media print {
    @page { size: 80mm auto; margin: 0; }
    html, body { width: 80mm !important; min-width: 80mm !important; max-width: 80mm !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; transform: none !important; zoom: 1 !important; -webkit-transform: none !important; }
    .receipt { width: 80mm !important; min-width: 80mm !important; max-width: 80mm !important; overflow: visible !important; transform: none !important; zoom: 1 !important; -webkit-transform: none !important; }
    button, .sidebar, .header, .navbar, footer, .floating-button { display:none !important; }
  }
</style>
</head>
<body>
  <div class="receipt">
${He(a,{headerHtml:se,infoRowsHtml:pe,tableHeadHtml:ge,itemRows:he,sumHtml:we,dueHtml:ye,qrHtml:ve,footerHtml:$e})}
  </div>
</body></html>`}function He(e,t){const a=(e.sectionOrder?.length?e.sectionOrder:ee).filter((l,s,p)=>p.indexOf(l)===s),o={...te,...e.sectionEnabled??{}},i=[],r=(l,s)=>`<div data-section="${l}">${s}</div>`;for(const l of a)if(o[l])switch(l){case"header":t.headerHtml&&i.push(r("header",t.headerHtml+'<hr class="hr" />'));break;case"info":t.infoRowsHtml&&i.push(r("info",`<div class="info">${t.infoRowsHtml}</div><hr class="hr-thin" />`));break;case"items":t.itemRows&&i.push(r("items",t.tableHeadHtml+`<div class="items">${t.itemRows}</div><hr class="hr" />`));break;case"summary":t.sumHtml&&i.push(r("summary",`<div class="summary">${t.sumHtml}</div><hr class="hr-thin" />`));break;case"due":t.dueHtml&&i.push(r("due",`<div class="due">${t.dueHtml}</div>`));break;case"qr":t.qrHtml&&i.push(r("qr",t.qrHtml));break;case"footer":t.footerHtml&&i.push(r("footer",t.footerHtml));break}return i.join(`
`)}const Qe='img[data-role="qr"], img[data-qr], .qrwrap img';function j(e,t=2){const a=e??window;return new Promise(o=>{let i=0;const r=()=>++i>=t?o():a.requestAnimationFrame(r);a.requestAnimationFrame(r)})}async function _e(e){if(e.contentDocument?.readyState==="complete"){await j(e.contentWindow);return}await new Promise((a,o)=>{const i=window.setTimeout(()=>{e.removeEventListener("load",r),o(new Error("Timed out waiting for printed receipt iframe to load"))},5e3),r=()=>{window.clearTimeout(i),a()};e.addEventListener("load",r,{once:!0})}),await j(e.contentWindow)}async function ne(e,t){e.complete||await new Promise((a,o)=>{const i=window.setTimeout(()=>{e.removeEventListener("load",r),e.removeEventListener("error",l),o(new Error(`${t} timed out while loading`))},5e3),r=()=>{window.clearTimeout(i),a()},l=()=>{window.clearTimeout(i),o(new Error(`${t} failed to load`))};e.addEventListener("load",r,{once:!0}),e.addEventListener("error",l,{once:!0})}),typeof e.decode=="function"&&await e.decode().catch(a=>{throw new Error(`${t} decode failed: ${a instanceof Error?a.message:String(a)}`)})}async function Be(e){const t=Array.from(e.querySelectorAll("img"));await Promise.all(t.map((a,o)=>ne(a,`Printed receipt image ${o+1}`)))}async function Ge(e){const t=e.querySelector(Qe);if(console.log("[PrintedReceipt] QR tagName before export =",t?.tagName??"(missing)"),!t)throw new Error("Printed receipt QR not loaded in share iframe: QR element missing");await ne(t,"Printed receipt QR");const a=t.getBoundingClientRect();if(!t.complete||t.naturalWidth===0)throw new Error("Printed receipt QR not loaded in share iframe");if(a.width<=0||a.height<=0)throw new Error(`Printed receipt QR has zero rendered size: ${Math.round(a.width)}x${Math.round(a.height)}`);if(!t.src.startsWith("data:image/png"))throw new Error("Printed receipt QR is not PNG");return t}async function ie(e,t,a="print"){let o=t;try{o=o??Ie()}catch{o=void 0}const i=await Le(e,{cfg:o}),r=document.createElement("iframe");r.setAttribute("data-receipt-source","ThermalReceipt"),r.setAttribute("title",`Thermal Receipt ${a}`),r.style.position="fixed",r.style.left="-9999px",r.style.top="0",r.style.width="80mm",r.style.height="20000px",r.style.border="0",r.style.opacity="1",r.style.pointerEvents="none",r.style.background="white",document.body.appendChild(r);const l=r.contentDocument;if(!l)throw r.remove(),new Error("Could not create thermal print DOM");try{l.open(),l.write(i),l.close(),await _e(r);try{await l.fonts?.ready}catch{}const s=l.querySelector(".receipt");if(!s)throw new Error("Thermal print DOM .receipt not found");await Be(l);const p=await Ge(l);await j(r.contentWindow,3);const h=p?.getBoundingClientRect();return console.log("[PrintedReceipt] Receipt Source: ThermalReceipt"),console.log("[PrintedReceipt] Print DOM prepared",{label:a,width:s.scrollWidth,height:s.scrollHeight}),console.log("[PrintedReceipt] QR Element Found =",!!p),console.log("[PrintedReceipt] QR Tag =",p?.tagName??"(none)"),console.log("[PrintedReceipt] QR Width =",Math.round(h?.width??0)),console.log("[PrintedReceipt] QR Height =",Math.round(h?.height??0)),console.log("[PrintedReceipt] QR Natural Width =",p.naturalWidth),console.log("[PrintedReceipt] QR Natural Height =",p.naturalHeight),{iframe:r,doc:l,receipt:s,cleanup:()=>r.remove()}}catch(s){throw r.remove(),s}}async function et(e,t){const a=await ie(e,t,"physical-print");setTimeout(()=>{try{const o=a.iframe.contentWindow,i=a.doc,r=a.receipt,l=i.body,s=i.documentElement,p=o?.getComputedStyle(r),h=o?.getComputedStyle(l),$=o?.getComputedStyle(s),u=25.4/96,d=y=>`${(y*u).toFixed(2)}mm`;console.log("[ThermalPrintAudit] === Width audit before window.print() ==="),console.log("[ThermalPrintAudit] .receipt",{offsetWidth:r.offsetWidth,scrollWidth:r.scrollWidth,clientWidth:r.clientWidth,computedWidth:p?.width,computedMinWidth:p?.minWidth,computedMaxWidth:p?.maxWidth,transform:p?.transform,zoom:p?.zoom,offsetWidthMm:d(r.offsetWidth)}),console.log("[ThermalPrintAudit] body",{offsetWidth:l.offsetWidth,scrollWidth:l.scrollWidth,clientWidth:l.clientWidth,computedWidth:h?.width,transform:h?.transform,zoom:h?.zoom,offsetWidthMm:d(l.offsetWidth)}),console.log("[ThermalPrintAudit] html",{offsetWidth:s.offsetWidth,scrollWidth:s.scrollWidth,clientWidth:s.clientWidth,computedWidth:$?.width,transform:$?.transform,zoom:$?.zoom,offsetWidthMm:d(s.offsetWidth)}),console.log("[ThermalPrintAudit] iframe",{styleWidth:a.iframe.style.width,clientWidth:a.iframe.clientWidth,offsetWidth:a.iframe.offsetWidth})}catch(o){console.error("[ThermalPrintAudit] failed to read widths",o)}a.iframe.contentWindow?.focus(),a.iframe.contentWindow?.print(),setTimeout(()=>a.cleanup(),2e3)},80)}async function Ue(e,t="printed receipt"){const a=await ke(()=>import("./index-BeoRn2gJ.js"),[]),o=e.doc.body,i=e.receipt,r=(e.doc.characterSet||"").toUpperCase();if(console.log("[PrintedReceipt] iframe characterSet =",r),r&&r!=="UTF-8")throw new Error(`Arabic encoding failed — iframe characterSet is ${r}, expected UTF-8`);const l=384;for(const c of[o,i])c.style.setProperty("width",`${l}px`,"important"),c.style.setProperty("min-width",`${l}px`,"important"),c.style.setProperty("max-width",`${l}px`,"important"),c.style.setProperty("margin","0","important"),c.style.setProperty("background","#ffffff","important"),c.style.setProperty("transform","none","important"),c.style.setProperty("zoom","1","important"),c.style.setProperty("filter","none","important"),c.style.setProperty("overflow","visible","important");try{await e.doc.fonts?.ready}catch{}try{await document.fonts?.ready}catch{}await new Promise(c=>setTimeout(c,250));const s=o.innerText||o.textContent||"",p=/[\u0600-\u06FF]/.test(s),h=s.match(/[ØÙÞ]|ï»¿/);if(console.log("[PrintedReceipt] Arabic chars present =",p,"| mojibake match =",h?.[0]??"none"),h&&!p)throw new Error(`Arabic encoding failed — found "${h[0]}" without any Arabic codepoints`);let $="";try{$=await a.getFontEmbedCSS(i),console.log("[PrintedReceipt] embedded font CSS length =",$.length)}catch(c){console.warn("[PrintedReceipt] font embed CSS failed",c)}const u=Math.max(l,i.scrollWidth,o.scrollWidth),d=Math.max(i.scrollHeight,o.scrollHeight,i.getBoundingClientRect().height),y=Array.from(i.querySelectorAll("img"));console.log(`[IMG-DEBUG] inspecting ${y.length} <img> elements before export`);for(const c of y){const q=c.src.length>120?c.src.slice(0,80)+"…["+c.src.length+" chars]":c.src;if(console.log("[IMG-DEBUG]",q,"complete=",c.complete,"naturalW=",c.naturalWidth,"naturalH=",c.naturalHeight,"role=",c.dataset.role??"(none)"),!c.complete||c.naturalWidth===0||c.naturalHeight===0)try{await c.decode()}catch{}if(!c.complete||c.naturalWidth===0||c.naturalHeight===0){const A=c.dataset.role??(c.classList.contains("qr")?"qr":c.alt||"unknown"),D=c.complete?"decoded to 0×0":"not loaded (complete=false)";throw console.error(`FAILED IMAGE:
`+c.src+`
role: `+A+`
reason: `+D),new Error(`Image failed to load before export — ${A}: ${D}
src: ${c.src}`)}}const M=await a.toPng(i,{pixelRatio:3,backgroundColor:"#ffffff",width:u,height:d,cacheBust:!0,fontEmbedCSS:$,style:{transform:"none",margin:"0",background:"#ffffff"}}),v=await(await fetch(M)).blob();return console.log("[PrintedReceipt] PNG capture complete",{label:t,width:u,height:d,size:v.size}),{blob:v,width:u,height:d}}async function Oe(e,t){const a=await ie(e,t,"share-printed-receipt-png");try{return(await Ue(a,"share printed receipt (PNG)")).blob}finally{a.cleanup()}}function je(e){if(e instanceof Error)return{exception:`${e.name||"Error"}: ${e.message||String(e)}`,stack:e.stack||`${e.name||"Error"}: ${e.message||String(e)}`};if(typeof Event<"u"&&e instanceof Event){const t=e.target instanceof Element?`${e.target.tagName.toLowerCase()}${e.target.id?`#${e.target.id}`:""}${e.target.className?`.${String(e.target.className).trim().replace(/\s+/g,".")}`:""}`:"unknown target",a=`Event: ${e.type||"unknown"} (${t})`;return{exception:a,stack:a}}return{exception:String(e),stack:String(e)}}function z(e){const t=e;if(t?.details?.functionName)return t.details;const a=je(e);return{step:"Unknown step",functionName:e instanceof Error&&e.stack&&(e.stack.split(`
`)[1]?.trim()||e.name)||"unknown()",exception:a.exception,stack:a.stack}}const Ve="Azzouz WholeSale";async function le(e,t){return console.log("[InvoiceRender] Receipt Source: ThermalReceipt (print DOM)",{note:"Share == Print: single 80mm pipeline"}),await Oe(e)}function Ye(e,t){return t??`${e.kind==="sale"?"Sales":e.kind==="purchase"?"Purchase":"Order"} Invoice #${e.invoiceNumber} — ${e.brand??Ve}`}async function tt(e,t,a){const o="[InvoiceShare]";let i=null,r=null;try{console.log(`${o} step=start`,{invoiceNumber:e.invoiceNumber,kind:e.kind,customer:e.partyName,format:t,itemCount:e.items?.length??0});const l="png",s="image/png";try{console.log(`${o} step=render-image (thermal88 master)`),i=await le(e,t),console.log(`${o} step=render-image ok`,{size:i.size,type:i.type})}catch(u){const d=z(u);console.error(`${o} render FAILED
Failed at:
${d.functionName}
Reason:
${d.exception}
Stack trace:
${d.stack}`,u),R.error(`Failed at ${d.functionName}: ${d.exception}`);return}try{const u=`${e.kind}_${e.invoiceNumber}_${t}_${Date.now()}.${l}`;r=new File([i],u,{type:s}),console.log(`${o} step=file-created`,{name:r.name,size:r.size,mime:s})}catch(u){const d=z(u);console.error(`${o} file creation FAILED
Failed at:
new File()
Reason:
${d.exception}
Stack trace:
${d.stack}`,u),R.error(`Failed at new File(): ${d.exception}`);return}const p=Ye(e,a),h=navigator,$=typeof h.canShare=="function"&&h.canShare({files:[r]})&&typeof h.share=="function";if(console.log(`${o} step=share-check`,{canNativeShare:$,hasShare:typeof h.share=="function",hasCanShare:typeof h.canShare=="function"}),console.log(`${o} Step 7: Share started`,{functionName:"shareInvoiceWithFormat()",canNativeShare:$}),$)try{console.log(`${o} step=navigator.share opening`,{functionName:"navigator.share()",file:r.name,size:r.size}),await h.share({files:[r],text:p}),console.log(`${o} step=native-share ok`);return}catch(u){if(u?.name==="AbortError"){console.log(`${o} step=native-share aborted by user`);return}const d=z(u);console.error(`${o} native share FAILED
Failed at:
navigator.share()
Reason:
${d.exception}
Stack trace:
${d.stack}`,u),R.message(`Share API failed: ${d.exception} — downloading image instead`)}else console.warn(`${o} Native Share API not available — downloading instead`),R.message("Native Share not supported — downloading image");try{const u=URL.createObjectURL(i),d=document.createElement("a");d.href=u,d.download=r.name,document.body.appendChild(d),d.click(),d.remove(),setTimeout(()=>URL.revokeObjectURL(u),1500),console.log(`${o} step=download ok`),R.success("Image downloaded — attach it in WhatsApp"),window.open(`https://wa.me/?text=${encodeURIComponent(p)}`,"_blank")}catch(u){const d=z(u);console.error(`${o} download FAILED
Failed at:
downloadFallback()
Reason:
${d.exception}
Stack trace:
${d.stack}`,u),R.error(`Failed at downloadFallback(): ${d.exception}`)}}catch(l){if(l?.name==="AbortError")return;const s=z(l);console.error(`${o} FATAL
Failed at:
${s.functionName}
Reason:
${s.exception}
Stack trace:
${s.stack}`,l),R.error(`Failed at ${s.functionName}: ${s.exception}`)}}async function at(e,t){const a="[InvoiceImage]";try{console.log(`${a} step=render format=${t} inv=${e.invoiceNumber}`);const o=await le(e,t);console.log(`${a} step=render ok size=${o.size}`);const i=URL.createObjectURL(o),r=document.createElement("a");r.href=i,r.download=`${e.kind}_${e.invoiceNumber}_${t}.png`,document.body.appendChild(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(i),1500),R.success("Image downloaded")}catch(o){const i=z(o);console.error(`${a} FAILED
Failed at:
${i.functionName}
Reason:
${i.exception}
Stack trace:
${i.stack}`,o),R.error(`Failed at ${i.functionName}: ${i.exception}`)}}const ot="lovable:invoice-share";function rt(e,t){console.warn("[InvoiceLockdown] openInvoiceShare blocked — Legacy Invoice System Disabled");try{R.message("Legacy Invoice System Disabled",{description:"Thermal receipts are temporarily unavailable while the new invoice system is being built."})}catch{}}export{ot as I,at as a,z as d,rt as o,et as p,le as r,tt as s};
