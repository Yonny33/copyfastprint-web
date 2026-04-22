import"../modulepreload-polyfill-B5Qt9EMX.js";import"../_responsive-DFmXB64n.js";import{A as z}from"../firebase-config-CAxC6apF.js";/* empty css                *//* empty css                 *//* empty css                          */import"../vendor-DPXNLk_s.js";document.addEventListener("DOMContentLoaded",function(){const y=z,h=document.getElementById("loading-overlay"),i=document.querySelector("#deudores-tbody"),T=document.getElementById("ventas-table-title"),_=document.getElementById("summary-ventas"),D=document.getElementById("abono-modal"),A=document.getElementById("close-modal-btn"),I=document.getElementById("abono-form"),H=document.getElementById("abono-details"),M=document.getElementById("abono-transaccion-id"),E=document.getElementById("monto-abono"),v=document.getElementById("detalles-modal"),B=document.getElementById("close-detalles-modal"),R=document.getElementById("detalles-venta-info"),p=document.getElementById("detalles-abonos-list");let $=[],f=[],x=[];const g=document.getElementById("cedula-search"),b=(e,n=h)=>{n&&(n.style.display=e?"flex":"none")},d=e=>`Bs. ${(parseFloat(e)||0).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2})}`,L=e=>{const n=c(e);return n?n.toLocaleDateString("es-VE"):e||"N/A"},c=e=>{if(!e)return null;if(e instanceof Date)return e;if(typeof e=="object"&&(e.seconds||e._seconds))return new Date((e.seconds||e._seconds)*1e3);let n=new Date(e);if(!isNaN(n.getTime()))return n;try{const o=String(e).split(/[\sT]/)[0];if(n=new Date(o.replace(/\//g,"-")+"T00:00:00"),!isNaN(n.getTime()))return n}catch{}return null},F=e=>{if(!i)return;i.innerHTML="";let n=0;if(!e||e.length===0)i.innerHTML='<tr><td colspan="6" style="text-align: center;">No hay clientes con saldo pendiente.</td></tr>';else{const o=new Date;e.forEach(t=>{n+=parseFloat(t.saldo_pendiente)||0;const r=document.createElement("tr");let a="";const s=f.filter(m=>String(m.id_cliente)===String(t.id_cliente));let l=c(t.fecha)||new Date(2020,0,1);if(s.length>0){const m=s.reduce((u,q)=>{const w=c(q.fecha);return w&&w>u?w:u},new Date(0));m.getTime()>0&&(l=m)}if(l){const m=o-l,u=Math.floor(m/(1e3*60*60*24));u>=7&&(a=`<i class="fas fa-exclamation-triangle warning-icon" title="Retraso de ${u} días sin abonar"></i> <span style="color: #ffc107; font-size: 0.75rem; font-weight: bold;">${u}d</span>`)}let V="-";(parseFloat(t.saldo_pendiente)||0)>0&&(V=`
            <div class="action-buttons">
              <button class="btn-accion btn-details" data-venta-id="${t.id}" title="Ver Detalles Completos">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn-accion btn-abono" data-id="${t.id}" data-cliente="${t.nombre_cliente}" data-saldo="${t.saldo_pendiente}" title="Registrar Abono">
                <i class="fas fa-money-bill-wave"></i>
              </button>
            </div>
          `),r.innerHTML=`
          <td>${L(t.fecha)}</td>
          <td>${t.nombre_cliente||"Cliente General"} ${a}</td>
          <td>${t.cedula_cliente||"N/A"}</td>
          <td class="saldo-pendiente">${d(t.saldo_pendiente)}</td>
          <td><span class="status ${String(t.estado_pedido).toLowerCase()}">${t.estado_pedido||"N/A"}</span></td>
          <td class="actions">${V}</td>
        `,i.appendChild(r)})}_&&(_.textContent=`Total por Cobrar: ${d(n)}`),P()},P=()=>{document.querySelectorAll(".btn-abono").forEach(e=>{e.addEventListener("click",j)}),document.querySelectorAll(".btn-details").forEach(e=>{e.addEventListener("click",k)})},j=e=>{const n=e.currentTarget;M.value=n.dataset.id,H.innerHTML=`<strong>Cliente:</strong> ${n.dataset.cliente}<br><strong>Saldo Pendiente:</strong> ${d(n.dataset.saldo)}`,E.value="",E.max=n.dataset.saldo,D.style.display="flex"},S=()=>{D.style.display="none"},k=async e=>{const o=e.currentTarget.dataset.ventaId,t=$.find(a=>a.id===o);if(!t){alert("No se encontraron los detalles para esta venta.");return}const r=t.id_cliente;t.items&&Array.isArray(t.items)&&t.items.reduce((a,s)=>a+(Number(s.cantidad)||0),0),R.innerHTML=`
        <p><strong>Cliente:</strong> ${t.nombre_cliente||"N/A"}</p>
        <p><strong>Última Actividad:</strong> ${L(t.fecha)}</p>
        <p><strong>Monto Total de Ventas:</strong> ${d(t.venta_bruta||t.monto_total)}</p>
        <p><strong>Saldo Pendiente:</strong> <span style="color: var(--error-color); font-weight: bold;">${d(t.saldo_pendiente)}</span></p>
        <p><strong>Ventas Agregadas:</strong><br>${t.descripcion||"Sin descripción"}</p>
        <p><strong>Notas del Pedido:</strong><br>${t.detalles_pedido||"Sin notas adicionales."}</p>
      `,p.innerHTML='<p style="text-align: center; color: var(--text-secondary);">Cargando abonos...</p>',v.style.display="flex";try{const a=f.filter(s=>s.id_cliente===r);a.length>0?(a.sort((s,l)=>new Date(l.fecha)-new Date(s.fecha)),p.innerHTML=`
              <table class="modern-table">
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>ID Venta</th>
                    <th style="text-align: right;">Monto Abonado</th>
                  </tr>
                </thead>
                <tbody>
                  ${a.map(s=>{var l;return`
                    <tr>
                      <td>${L(s.fecha)} ${((l=c(s.fecha))==null?void 0:l.toLocaleTimeString("es-VE"))||""}</td>
                      <td><small>${s.id_venta||"N/A"}</small></td>
                      <td style="text-align: right;">${d(s.monto)}</td>
                    </tr>
                  `}).join("")}
                </tbody>
              </table>
            `):p.innerHTML='<p style="text-align: center; color: var(--text-secondary);">No se han registrado abonos para este cliente.</p>'}catch(a){console.error("Error al cargar historial de abonos:",a),p.innerHTML=`<p style="text-align: center; color: var(--error-color);">Error al cargar el historial: ${a.message}</p>`}},O=()=>{v.style.display="none"},U=async e=>{e.preventDefault();const n=M.value,o=parseFloat(E.value);if(!o||o<=0){alert("Por favor, introduce un monto de abono válido.");return}b(!0);try{const r=await(await fetch(`${y}/ventas/${n}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({monto_abono:o})})).json();if(r.status==="success")alert(r.message),S(),N();else throw new Error(r.message||"Error al procesar el abono.")}catch(t){console.error("Error al registrar abono:",t),alert(`Error: ${t.message}`)}finally{b(!1)}},C=()=>{const e=g?g.value.trim().toLowerCase():"";let n=$.filter(o=>(parseFloat(o.saldo_pendiente)||0)>.01);e&&(n=n.filter(o=>o.cedula_cliente&&String(o.cedula_cliente).toLowerCase().includes(e))),n.sort((o,t)=>c(t.fecha)-c(o.fecha)),T&&(T.textContent="Lista de Clientes con Deuda"),x=n,F(x)},N=async()=>{b(!0,h);try{const[e,n]=await Promise.all([fetch(`${y}/ventas`),fetch(`${y}/abonos`)]);if(!e.ok)throw new Error(`Error de red en ventas: ${e.statusText}`);if(!n.ok)throw new Error(`Error de red en abonos: ${n.statusText}`);const o=await e.json(),t=await n.json();if(o.status==="success"&&o.data)$=o.data||[];else throw new Error(o.message||"La respuesta de ventas no contiene datos.");t.status==="success"&&t.data?f=t.data||[]:(console.warn(t.message||"La respuesta de abonos no contiene datos, se continuará sin historial de abonos."),f=[]),C()}catch(e){console.error("Error fatal al cargar los reportes:",e),alert(`No se pudieron cargar los datos de los reportes: ${e.message}`),i&&(i.innerHTML='<tr><td colspan="6" style="text-align: center;">Error al cargar datos.</td></tr>')}finally{b(!1,h)}};g&&g.addEventListener("input",C),A&&A.addEventListener("click",S),B&&B.addEventListener("click",O),I&&I.addEventListener("submit",U),i?N():console.error("El cuerpo de la tabla de deudores no se encontró en el DOM.")});
