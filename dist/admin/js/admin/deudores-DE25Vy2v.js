import"../modulepreload-polyfill-B5Qt9EMX.js";import"../_responsive-DFmXB64n.js";import{A as z}from"../firebase-config-CAxC6apF.js";/* empty css                *//* empty css                 *//* empty css                          */import"../vendor-DPXNLk_s.js";document.addEventListener("DOMContentLoaded",function(){const h=z,E=document.getElementById("loading-overlay"),l=document.querySelector("#deudores-tbody"),D=document.getElementById("ventas-table-title"),_=document.getElementById("summary-ventas"),I=document.getElementById("abono-modal"),A=document.getElementById("close-modal-btn"),M=document.getElementById("abono-form"),V=document.getElementById("abono-details"),B=document.getElementById("abono-transaccion-id"),$=document.getElementById("monto-abono"),x=document.getElementById("detalles-modal"),C=document.getElementById("close-detalles-modal"),R=document.getElementById("detalles-venta-info"),p=document.getElementById("detalles-abonos-list");let L=[],g=[],S=[];const b=document.getElementById("cedula-search"),y=(e,n=E)=>{n&&(n.style.display=e?"flex":"none")},u=e=>`Bs. ${Number(e).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2})}`,T=e=>{const n=i(e);return n?n.toLocaleDateString("es-VE"):e||"N/A"},i=e=>{if(!e)return null;if(e instanceof Date)return e;if(typeof e=="object"&&(e.seconds||e._seconds))return new Date((e.seconds||e._seconds)*1e3);let n=new Date(e);if(!isNaN(n.getTime()))return n;try{const o=String(e).split(/[\sT]/)[0];if(n=new Date(o.replace(/\//g,"-")+"T00:00:00"),!isNaN(n.getTime()))return n}catch{}return null},F=e=>{if(!l)return;l.innerHTML="";let n=0;if(!e||e.length===0)l.innerHTML='<tr><td colspan="6" style="text-align: center;">No hay clientes con saldo pendiente.</td></tr>';else{const o=new Date;e.forEach(t=>{n+=parseFloat(t.saldo_pendiente)||0;const r=document.createElement("tr");let f="";const s=g.filter(c=>String(c.id_cliente)===String(t.id_cliente));let a=i(t.fecha)||new Date(2020,0,1);if(s.length>0){const c=s.reduce((m,q)=>{const w=i(q.fecha);return w&&w>m?w:m},new Date(0));c.getTime()>0&&(a=c)}if(a){const c=o-a,m=Math.floor(c/(1e3*60*60*24));m>=7&&(f=`<i class="fas fa-exclamation-triangle warning-icon" title="Retraso de ${m} días sin abonar"></i> <span style="color: #ffc107; font-size: 0.75rem; font-weight: bold;">${m}d</span>`)}let d="-";(parseFloat(t.saldo_pendiente)||0)>0&&(d=`
            <div class="action-buttons">
              <button class="btn-accion btn-details" data-venta-id="${t.id}" title="Ver Detalles Completos">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn-accion btn-abono" data-id="${t.id}" data-cliente="${t.nombre_cliente}" data-saldo="${t.saldo_pendiente}" title="Registrar Abono">
                <i class="fas fa-money-bill-wave"></i>
              </button>
            </div>
          `),r.innerHTML=`
          <td>${T(t.fecha)}</td>
          <td>${t.nombre_cliente||"Cliente General"} ${f}</td>
          <td>${t.cedula_cliente||"N/A"}</td>
          <td class="saldo-pendiente">${u(t.saldo_pendiente)}</td>
          <td><span class="status ${String(t.estado_pedido).toLowerCase()}">${t.estado_pedido||"N/A"}</span></td>
          <td class="actions">${d}</td>
        `,l.appendChild(r)})}_&&(_.textContent=`Total por Cobrar: ${u(n)}`),P()},P=()=>{document.querySelectorAll(".btn-abono").forEach(e=>{e.addEventListener("click",j)}),document.querySelectorAll(".btn-details").forEach(e=>{e.addEventListener("click",k)})},j=e=>{const n=e.currentTarget;B.value=n.dataset.id,V.innerHTML=`<strong>Cliente:</strong> ${n.dataset.cliente}<br><strong>Saldo Pendiente:</strong> ${u(n.dataset.saldo)}`,$.value="",$.max=n.dataset.saldo,I.style.display="flex"},v=()=>{I.style.display="none"},k=async e=>{const o=e.currentTarget.dataset.ventaId,t=L.find(s=>s.id===o);if(!t){alert("No se encontraron los detalles para esta venta.");return}const r=t.id_cliente;let f=0;t.items&&Array.isArray(t.items)&&(f=t.items.reduce((s,a)=>s+(Number(a.cantidad)||0),0)),R.innerHTML=`
        <p><strong>Cliente:</strong> ${t.nombre_cliente||"N/A"}</p>
        <p><strong>Fecha de Venta:</strong> ${T(t.fecha)}</p>
        <p><strong>Monto Total:</strong> ${u(t.monto_total)}</p>
        <p><strong>Cantidad de Items:</strong> ${f}</p>
        <p><strong>Detalles del Pedido:</strong><br>${t.detalles_pedido||"Sin detalles adicionales."}</p>
      `,p.innerHTML='<p style="text-align: center; color: var(--text-secondary);">Cargando abonos...</p>',x.style.display="flex";try{const s=g.filter(a=>a.id_cliente===r);s.length>0?(s.sort((a,d)=>new Date(d.fecha)-new Date(a.fecha)),p.innerHTML=`
              <table class="modern-table">
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>ID Venta</th>
                    <th style="text-align: right;">Monto Abonado</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.map(a=>{var d;return`
                    <tr>
                      <td>${T(a.fecha)} ${((d=i(a.fecha))==null?void 0:d.toLocaleTimeString("es-VE"))||""}</td>
                      <td><small>${a.id_venta||"N/A"}</small></td>
                      <td style="text-align: right;">${u(a.monto)}</td>
                    </tr>
                  `}).join("")}
                </tbody>
              </table>
            `):p.innerHTML='<p style="text-align: center; color: var(--text-secondary);">No se han registrado abonos para este cliente.</p>'}catch(s){console.error("Error al cargar historial de abonos:",s),p.innerHTML=`<p style="text-align: center; color: var(--error-color);">Error al cargar el historial: ${s.message}</p>`}},O=()=>{x.style.display="none"},U=async e=>{e.preventDefault();const n=B.value,o=parseFloat($.value);if(!o||o<=0){alert("Por favor, introduce un monto de abono válido.");return}y(!0);try{const r=await(await fetch(`${h}/ventas/${n}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({monto_abono:o})})).json();if(r.status==="success")alert(r.message),v(),H();else throw new Error(r.message||"Error al procesar el abono.")}catch(t){console.error("Error al registrar abono:",t),alert(`Error: ${t.message}`)}finally{y(!1)}},N=()=>{const e=b?b.value.trim().toLowerCase():"";let n=L.filter(o=>(parseFloat(o.saldo_pendiente)||0)>.01);e&&(n=n.filter(o=>o.cedula_cliente&&String(o.cedula_cliente).toLowerCase().includes(e))),n.sort((o,t)=>i(t.fecha)-i(o.fecha)),D&&(D.textContent="Lista de Clientes con Deuda"),S=n,F(S)},H=async()=>{y(!0,E);try{const[e,n]=await Promise.all([fetch(`${h}/ventas`),fetch(`${h}/abonos`)]);if(!e.ok)throw new Error(`Error de red en ventas: ${e.statusText}`);if(!n.ok)throw new Error(`Error de red en abonos: ${n.statusText}`);const o=await e.json(),t=await n.json();if(o.status==="success"&&o.data)L=o.data||[];else throw new Error(o.message||"La respuesta de ventas no contiene datos.");t.status==="success"&&t.data?g=t.data||[]:(console.warn(t.message||"La respuesta de abonos no contiene datos, se continuará sin historial de abonos."),g=[]),N()}catch(e){console.error("Error fatal al cargar los reportes:",e),alert(`No se pudieron cargar los datos de los reportes: ${e.message}`),l&&(l.innerHTML='<tr><td colspan="6" style="text-align: center;">Error al cargar datos.</td></tr>')}finally{y(!1,E)}};b&&b.addEventListener("input",N),A&&A.addEventListener("click",v),C&&C.addEventListener("click",O),M&&M.addEventListener("submit",U),l?H():console.error("El cuerpo de la tabla de deudores no se encontró en el DOM.")});
