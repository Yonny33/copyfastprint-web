import"../modulepreload-polyfill-B5Qt9EMX.js";import"../_responsive-DFmXB64n.js";import{A as U}from"../firebase-config-CAxC6apF.js";/* empty css                *//* empty css                 *//* empty css                          */import"../vendor-DPXNLk_s.js";document.addEventListener("DOMContentLoaded",function(){const y=U,h=document.getElementById("loading-overlay"),l=document.querySelector("#deudores-tbody"),w=document.getElementById("ventas-table-title"),D=document.getElementById("summary-ventas"),T=document.getElementById("abono-modal"),I=document.getElementById("close-modal-btn"),v=document.getElementById("abono-form"),H=document.getElementById("abono-details"),_=document.getElementById("abono-transaccion-id"),E=document.getElementById("monto-abono"),A=document.getElementById("detalles-modal"),M=document.getElementById("close-detalles-modal"),R=document.getElementById("detalles-venta-info"),u=document.getElementById("detalles-abonos-list");let $=[],f=[],B=[];const p=document.getElementById("cedula-search"),b=(t,n=h)=>{n&&(n.style.display=t?"flex":"none")},c=t=>`Bs. ${Number(t).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2})}`,C=t=>{if(!t)return"N/A";const n=new Date(t);if(isNaN(n.getTime())){const o=t.split(" ")[0],e=new Date(o+"T00:00:00");return isNaN(e.getTime())?t:e.toLocaleDateString("es-VE")}return n.toLocaleDateString("es-VE")},L=t=>{if(!t)return null;const n=new Date(t.split(" ")[0]+"T00:00:00");return isNaN(n.getTime())?null:n},S=t=>{if(!l)return;l.innerHTML="";let n=0;if(!t||t.length===0)l.innerHTML='<tr><td colspan="6" style="text-align: center;">No hay clientes con saldo pendiente.</td></tr>';else{const o=new Date;t.forEach(e=>{n+=parseFloat(e.saldo_pendiente)||0;const r=document.createElement("tr");let m="";const a=f.filter(d=>d.id_cliente===e.id_cliente);let s=L(e.fecha);if(a.length>0&&(s=a.reduce((d,i)=>new Date(i.fecha)>d?new Date(i.fecha):d,new Date(0))),s){const d=o-s,i=Math.floor(d/(1e3*60*60*24));i>=7&&(m=`<i class="fas fa-exclamation-triangle warning-icon" title="Retraso de ${i} días sin abonar"></i> <span style="color: #ffc107; font-size: 0.75rem; font-weight: bold;">${i}d</span>`)}let g="-";(parseFloat(e.saldo_pendiente)||0)>0&&(g=`
            <div class="action-buttons">
              <button class="btn-accion btn-details" data-venta-id="${e.id}" title="Ver Detalles Completos">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn-accion btn-abono" data-id="${e.id}" data-cliente="${e.nombre_cliente}" data-saldo="${e.saldo_pendiente}" title="Registrar Abono">
                <i class="fas fa-money-bill-wave"></i>
              </button>
            </div>
          `),r.innerHTML=`
          <td>${C(e.fecha)}</td>
          <td>${e.nombre_cliente||"Cliente General"} ${m}</td>
          <td>${e.cedula_cliente||"N/A"}</td>
          <td class="saldo-pendiente">${c(e.saldo_pendiente)}</td>
          <td><span class="status ${String(e.estado_pedido).toLowerCase()}">${e.estado_pedido||"N/A"}</span></td>
          <td class="actions">${g}</td>
        `,l.appendChild(r)})}D&&(D.textContent=`Total por Cobrar: ${c(n)}`),F()},F=()=>{document.querySelectorAll(".btn-abono").forEach(t=>{t.addEventListener("click",P)}),document.querySelectorAll(".btn-details").forEach(t=>{t.addEventListener("click",k)})},P=t=>{const n=t.currentTarget;_.value=n.dataset.id,H.innerHTML=`<strong>Cliente:</strong> ${n.dataset.cliente}<br><strong>Saldo Pendiente:</strong> ${c(n.dataset.saldo)}`,E.value="",E.max=n.dataset.saldo,T.style.display="flex"},x=()=>{T.style.display="none"},k=async t=>{const o=t.currentTarget.dataset.ventaId,e=$.find(a=>a.id===o);if(!e){alert("No se encontraron los detalles para esta venta.");return}const r=e.id_cliente;let m=0;e.items&&Array.isArray(e.items)&&(m=e.items.reduce((a,s)=>a+(Number(s.cantidad)||0),0)),R.innerHTML=`
        <p><strong>Cliente:</strong> ${e.nombre_cliente||"N/A"}</p>
        <p><strong>Fecha de Venta:</strong> ${C(e.fecha)}</p>
        <p><strong>Monto Total:</strong> ${c(e.monto_total)}</p>
        <p><strong>Cantidad de Items:</strong> ${m}</p>
        <p><strong>Detalles del Pedido:</strong><br>${e.detalles_pedido||"Sin detalles adicionales."}</p>
      `,u.innerHTML='<p style="text-align: center; color: var(--text-secondary);">Cargando abonos...</p>',A.style.display="flex";try{const a=f.filter(s=>s.id_cliente===r);a.length>0?(a.sort((s,g)=>new Date(g.fecha)-new Date(s.fecha)),u.innerHTML=`
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
            `):u.innerHTML='<p style="text-align: center; color: var(--text-secondary);">No se han registrado abonos para este cliente.</p>'}catch(a){console.error("Error al cargar historial de abonos:",a),u.innerHTML=`<p style="text-align: center; color: var(--error-color);">Error al cargar el historial: ${a.message}</p>`}},j=()=>{A.style.display="none"},O=async t=>{t.preventDefault();const n=_.value,o=parseFloat(E.value);if(!o||o<=0){alert("Por favor, introduce un monto de abono válido.");return}b(!0);try{const r=await(await fetch(`${y}/ventas/${n}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({monto_abono:o})})).json();if(r.status==="success")alert(r.message),x(),V();else throw new Error(r.message||"Error al procesar el abono.")}catch(e){console.error("Error al registrar abono:",e),alert(`Error: ${e.message}`)}finally{b(!1)}},N=()=>{const t=p?p.value.trim().toLowerCase():"";let n=$.filter(o=>(parseFloat(o.saldo_pendiente)||0)>.01);t&&(n=n.filter(o=>o.cedula_cliente&&String(o.cedula_cliente).toLowerCase().includes(t))),n.sort((o,e)=>L(e.fecha)-L(o.fecha)),w&&(w.textContent="Lista de Clientes con Deuda"),B=n,S(B)},V=async()=>{b(!0,h);try{const[t,n]=await Promise.all([fetch(`${y}/ventas`),fetch(`${y}/abonos`)]);if(!t.ok)throw new Error(`Error de red en ventas: ${t.statusText}`);if(!n.ok)throw new Error(`Error de red en abonos: ${n.statusText}`);const o=await t.json(),e=await n.json();if(o.status==="success"&&o.data)$=o.data||[];else throw new Error(o.message||"La respuesta de ventas no contiene datos.");e.status==="success"&&e.data?f=e.data||[]:(console.warn(e.message||"La respuesta de abonos no contiene datos, se continuará sin historial de abonos."),f=[]),N()}catch(t){console.error("Error fatal al cargar los reportes:",t),alert(`No se pudieron cargar los datos de los reportes: ${t.message}`),l&&(l.innerHTML='<tr><td colspan="6" style="text-align: center;">Error al cargar datos.</td></tr>')}finally{b(!1,h)}};p&&p.addEventListener("input",N),I&&I.addEventListener("click",x),M&&M.addEventListener("click",j),v&&v.addEventListener("submit",O),l?V():console.error("El cuerpo de la tabla de deudores no se encontró en el DOM.")});
