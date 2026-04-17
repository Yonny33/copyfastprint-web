import"../modulepreload-polyfill-B5Qt9EMX.js";import"../_responsive-DFmXB64n.js";import{A as z}from"../firebase-config-CAxC6apF.js";/* empty css                *//* empty css                 *//* empty css                          */import"../vendor-DPXNLk_s.js";document.addEventListener("DOMContentLoaded",function(){const h=z,E=document.getElementById("loading-overlay"),l=document.querySelector("#deudores-tbody"),D=document.getElementById("ventas-table-title"),T=document.getElementById("summary-ventas"),_=document.getElementById("abono-modal"),I=document.getElementById("close-modal-btn"),A=document.getElementById("abono-form"),V=document.getElementById("abono-details"),M=document.getElementById("abono-transaccion-id"),$=document.getElementById("monto-abono"),B=document.getElementById("detalles-modal"),x=document.getElementById("close-detalles-modal"),R=document.getElementById("detalles-venta-info"),f=document.getElementById("detalles-abonos-list");let L=[],p=[],C=[];const g=document.getElementById("cedula-search"),b=(e,n=E)=>{n&&(n.style.display=e?"flex":"none")},c=e=>`Bs. ${Number(e).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2})}`,S=e=>{const n=m(e);return n?n.toLocaleDateString("es-VE"):e||"N/A"},m=e=>{if(!e)return null;if(e instanceof Date)return e;if(typeof e=="object"&&(e.seconds||e._seconds))return new Date((e.seconds||e._seconds)*1e3);let n=new Date(e);if(!isNaN(n.getTime()))return n;try{const o=String(e).split(/[\sT]/)[0];if(n=new Date(o.replace(/\//g,"-")+"T00:00:00"),!isNaN(n.getTime()))return n}catch{}return null},F=e=>{if(!l)return;l.innerHTML="";let n=0;if(!e||e.length===0)l.innerHTML='<tr><td colspan="6" style="text-align: center;">No hay clientes con saldo pendiente.</td></tr>';else{const o=new Date;e.forEach(t=>{n+=parseFloat(t.saldo_pendiente)||0;const r=document.createElement("tr");let u="";const a=p.filter(d=>String(d.id_cliente)===String(t.id_cliente));let s=m(t.fecha)||new Date(2020,0,1);if(a.length>0){const d=a.reduce((i,q)=>{const w=m(q.fecha);return w&&w>i?w:i},new Date(0));d.getTime()>0&&(s=d)}if(s){const d=o-s,i=Math.floor(d/(1e3*60*60*24));i>=7&&(u=`<i class="fas fa-exclamation-triangle warning-icon" title="Retraso de ${i} días sin abonar"></i> <span style="color: #ffc107; font-size: 0.75rem; font-weight: bold;">${i}d</span>`)}let y="-";(parseFloat(t.saldo_pendiente)||0)>0&&(y=`
            <div class="action-buttons">
              <button class="btn-accion btn-details" data-venta-id="${t.id}" title="Ver Detalles Completos">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn-accion btn-abono" data-id="${t.id}" data-cliente="${t.nombre_cliente}" data-saldo="${t.saldo_pendiente}" title="Registrar Abono">
                <i class="fas fa-money-bill-wave"></i>
              </button>
            </div>
          `),r.innerHTML=`
          <td>${S(t.fecha)}</td>
          <td>${t.nombre_cliente||"Cliente General"} ${u}</td>
          <td>${t.cedula_cliente||"N/A"}</td>
          <td class="saldo-pendiente">${c(t.saldo_pendiente)}</td>
          <td><span class="status ${String(t.estado_pedido).toLowerCase()}">${t.estado_pedido||"N/A"}</span></td>
          <td class="actions">${y}</td>
        `,l.appendChild(r)})}T&&(T.textContent=`Total por Cobrar: ${c(n)}`),P()},P=()=>{document.querySelectorAll(".btn-abono").forEach(e=>{e.addEventListener("click",j)}),document.querySelectorAll(".btn-details").forEach(e=>{e.addEventListener("click",k)})},j=e=>{const n=e.currentTarget;M.value=n.dataset.id,V.innerHTML=`<strong>Cliente:</strong> ${n.dataset.cliente}<br><strong>Saldo Pendiente:</strong> ${c(n.dataset.saldo)}`,$.value="",$.max=n.dataset.saldo,_.style.display="flex"},v=()=>{_.style.display="none"},k=async e=>{const o=e.currentTarget.dataset.ventaId,t=L.find(a=>a.id===o);if(!t){alert("No se encontraron los detalles para esta venta.");return}const r=t.id_cliente;let u=0;t.items&&Array.isArray(t.items)&&(u=t.items.reduce((a,s)=>a+(Number(s.cantidad)||0),0)),R.innerHTML=`
        <p><strong>Cliente:</strong> ${t.nombre_cliente||"N/A"}</p>
        <p><strong>Fecha de Venta:</strong> ${S(t.fecha)}</p>
        <p><strong>Monto Total:</strong> ${c(t.monto_total)}</p>
        <p><strong>Cantidad de Items:</strong> ${u}</p>
        <p><strong>Detalles del Pedido:</strong><br>${t.detalles_pedido||"Sin detalles adicionales."}</p>
      `,f.innerHTML='<p style="text-align: center; color: var(--text-secondary);">Cargando abonos...</p>',B.style.display="flex";try{const a=p.filter(s=>s.id_cliente===r);a.length>0?(a.sort((s,y)=>new Date(y.fecha)-new Date(s.fecha)),f.innerHTML=`
              <table class="modern-table">
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>ID Venta</th>
                    <th style="text-align: right;">Monto Abonado</th>
                  </tr>
                </thead>
                <tbody>
                  ${a.map(s=>`
                    <tr>
                      <td>${new Date(s.fecha).toLocaleString("es-VE")}</td>
                      <td><small>${s.id_venta||"N/A"}</small></td>
                      <td style="text-align: right;">${c(s.monto)}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            `):f.innerHTML='<p style="text-align: center; color: var(--text-secondary);">No se han registrado abonos para este cliente.</p>'}catch(a){console.error("Error al cargar historial de abonos:",a),f.innerHTML=`<p style="text-align: center; color: var(--error-color);">Error al cargar el historial: ${a.message}</p>`}},O=()=>{B.style.display="none"},U=async e=>{e.preventDefault();const n=M.value,o=parseFloat($.value);if(!o||o<=0){alert("Por favor, introduce un monto de abono válido.");return}b(!0);try{const r=await(await fetch(`${h}/ventas/${n}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({monto_abono:o})})).json();if(r.status==="success")alert(r.message),v(),H();else throw new Error(r.message||"Error al procesar el abono.")}catch(t){console.error("Error al registrar abono:",t),alert(`Error: ${t.message}`)}finally{b(!1)}},N=()=>{const e=g?g.value.trim().toLowerCase():"";let n=L.filter(o=>(parseFloat(o.saldo_pendiente)||0)>.01);e&&(n=n.filter(o=>o.cedula_cliente&&String(o.cedula_cliente).toLowerCase().includes(e))),n.sort((o,t)=>m(t.fecha)-m(o.fecha)),D&&(D.textContent="Lista de Clientes con Deuda"),C=n,F(C)},H=async()=>{b(!0,E);try{const[e,n]=await Promise.all([fetch(`${h}/ventas`),fetch(`${h}/abonos`)]);if(!e.ok)throw new Error(`Error de red en ventas: ${e.statusText}`);if(!n.ok)throw new Error(`Error de red en abonos: ${n.statusText}`);const o=await e.json(),t=await n.json();if(o.status==="success"&&o.data)L=o.data||[];else throw new Error(o.message||"La respuesta de ventas no contiene datos.");t.status==="success"&&t.data?p=t.data||[]:(console.warn(t.message||"La respuesta de abonos no contiene datos, se continuará sin historial de abonos."),p=[]),N()}catch(e){console.error("Error fatal al cargar los reportes:",e),alert(`No se pudieron cargar los datos de los reportes: ${e.message}`),l&&(l.innerHTML='<tr><td colspan="6" style="text-align: center;">Error al cargar datos.</td></tr>')}finally{b(!1,E)}};g&&g.addEventListener("input",N),I&&I.addEventListener("click",v),x&&x.addEventListener("click",O),A&&A.addEventListener("submit",U),l?H():console.error("El cuerpo de la tabla de deudores no se encontró en el DOM.")});
