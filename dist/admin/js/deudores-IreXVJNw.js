import"./modulepreload-polyfill-B5Qt9EMX.js";import"./auth-D0e3KaCN.js";import{A as q}from"./firebase-config-COMbAFny.js";import"./components-BXu2cGsF.js";document.addEventListener("DOMContentLoaded",function(){const b=q,y=document.getElementById("loading-overlay"),l=document.querySelector("#deudores-tbody"),$=document.getElementById("ventas-table-title"),w=document.getElementById("summary-ventas"),D=document.getElementById("abono-modal"),T=document.getElementById("close-modal-btn"),I=document.getElementById("abono-form"),H=document.getElementById("abono-details"),v=document.getElementById("abono-transaccion-id"),h=document.getElementById("monto-abono"),_=document.getElementById("detalles-modal"),M=document.getElementById("close-detalles-modal"),F=document.getElementById("detalles-venta-info"),u=document.getElementById("detalles-abonos-list");let E=[],m=[],A=[];const p=document.getElementById("cedula-search"),f=(e,t=y)=>{t&&(t.style.display=e?"flex":"none")},d=e=>`Bs. ${Number(e).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2})}`,B=e=>{if(!e)return"N/A";const t=new Date(e);if(isNaN(t.getTime())){const o=e.split(" ")[0],n=new Date(o+"T00:00:00");return isNaN(n.getTime())?e:n.toLocaleDateString("es-VE")}return t.toLocaleDateString("es-VE")},L=e=>{if(!e)return null;const t=new Date(e.split(" ")[0]+"T00:00:00");return isNaN(t.getTime())?null:t},P=e=>{if(!l)return;l.innerHTML="";let t=0;if(!e||e.length===0)l.innerHTML='<tr><td colspan="6" style="text-align: center;">No hay clientes con saldo pendiente.</td></tr>';else{const n=new Date;e.forEach(a=>{t+=parseFloat(a.saldo_pendiente)||0;const i=document.createElement("tr");let s="";const r=m.filter(g=>g.id_cliente===a.id_cliente);let c=L(a.fecha);r.length>0&&(c=r.reduce((g,V)=>new Date(V.fecha)>g?new Date(V.fecha):g,new Date(0))),c&&n-c>6048e5&&(s='<i class="fas fa-exclamation-triangle warning-icon" title="Más de 7 días sin abonar"></i>');let S="-";(parseFloat(a.saldo_pendiente)||0)>0&&(S=`
            <div class="action-buttons">
              <button class="btn-accion btn-details" data-venta-id="${a.id}" title="Ver Detalles Completos">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn-accion btn-abono" data-id="${a.id}" data-cliente="${a.nombre_cliente}" data-saldo="${a.saldo_pendiente}" title="Registrar Abono">
                <i class="fas fa-money-bill-wave"></i>
              </button>
            </div>
          `),i.innerHTML=`
          <td>${B(a.fecha)}</td>
          <td>${a.nombre_cliente||"Cliente General"} ${s}</td>
          <td>${a.cedula_cliente||"N/A"}</td>
          <td class="saldo-pendiente">${d(a.saldo_pendiente)}</td>
          <td><span class="status ${String(a.estado_pedido).toLowerCase()}">${a.estado_pedido||"N/A"}</span></td>
          <td class="actions">${S}</td>
        `,l.appendChild(i)})}w&&(w.textContent=`Total por Cobrar: ${d(t)}`),R()},R=()=>{document.querySelectorAll(".btn-abono").forEach(e=>{e.addEventListener("click",k)}),document.querySelectorAll(".btn-details").forEach(e=>{e.addEventListener("click",j)})},k=e=>{const t=e.currentTarget;v.value=t.dataset.id,H.innerHTML=`<strong>Cliente:</strong> ${t.dataset.cliente}<br><strong>Saldo Pendiente:</strong> ${d(t.dataset.saldo)}`,h.value="",h.max=t.dataset.saldo,D.style.display="flex"},C=()=>{D.style.display="none"},j=async e=>{const o=e.currentTarget.dataset.ventaId,n=E.find(s=>s.id===o);if(!n){alert("No se encontraron los detalles para esta venta.");return}const a=n.id_cliente;let i=0;n.items&&Array.isArray(n.items)&&(i=n.items.reduce((s,r)=>s+(Number(r.cantidad)||0),0)),F.innerHTML=`
        <p><strong>Cliente:</strong> ${n.nombre_cliente||"N/A"}</p>
        <p><strong>Fecha de Venta:</strong> ${B(n.fecha)}</p>
        <p><strong>Monto Total:</strong> ${d(n.monto_total)}</p>
        <p><strong>Cantidad de Items:</strong> ${i}</p>
        <p><strong>Detalles del Pedido:</strong><br>${n.detalles_pedido||"Sin detalles adicionales."}</p>
      `,u.innerHTML='<p style="text-align: center; color: var(--text-secondary);">Cargando abonos...</p>',_.style.display="flex";try{const s=m.filter(r=>r.id_cliente===a);s.length>0?(s.sort((r,c)=>new Date(c.fecha)-new Date(r.fecha)),u.innerHTML=`
              <table class="modern-table">
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>ID Venta</th>
                    <th style="text-align: right;">Monto Abonado</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.map(r=>`
                    <tr>
                      <td>${new Date(r.fecha).toLocaleString("es-VE")}</td>
                      <td><small>${r.id_venta||"N/A"}</small></td>
                      <td style="text-align: right;">${d(r.monto)}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            `):u.innerHTML='<p style="text-align: center; color: var(--text-secondary);">No se han registrado abonos para este cliente.</p>'}catch(s){console.error("Error al cargar historial de abonos:",s),u.innerHTML=`<p style="text-align: center; color: var(--error-color);">Error al cargar el historial: ${s.message}</p>`}},O=()=>{_.style.display="none"},U=async e=>{e.preventDefault();const t=v.value,o=parseFloat(h.value);if(!o||o<=0){alert("Por favor, introduce un monto de abono válido.");return}f(!0);try{const a=await(await fetch(`${b}/ventas/${t}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({monto_abono:o})})).json();if(a.status==="success")alert(a.message),C(),N();else throw new Error(a.message||"Error al procesar el abono.")}catch(n){console.error("Error al registrar abono:",n),alert(`Error: ${n.message}`)}finally{f(!1)}},x=()=>{const e=p?p.value.trim().toLowerCase():"";let t=E.filter(o=>(parseFloat(o.saldo_pendiente)||0)>.01);e&&(t=t.filter(o=>o.cedula_cliente&&String(o.cedula_cliente).toLowerCase().includes(e))),t.sort((o,n)=>L(n.fecha)-L(o.fecha)),$&&($.textContent="Lista de Clientes con Deuda"),A=t,P(A)},N=async()=>{f(!0,y);try{const[e,t]=await Promise.all([fetch(`${b}/ventas`),fetch(`${b}/abonos`)]);if(!e.ok)throw new Error(`Error de red en ventas: ${e.statusText}`);if(!t.ok)throw new Error(`Error de red en abonos: ${t.statusText}`);const o=await e.json(),n=await t.json();if(o.status==="success"&&o.data)E=o.data||[];else throw new Error(o.message||"La respuesta de ventas no contiene datos.");n.status==="success"&&n.data?m=n.data||[]:(console.warn(n.message||"La respuesta de abonos no contiene datos, se continuará sin historial de abonos."),m=[]),x()}catch(e){console.error("Error fatal al cargar los reportes:",e),alert(`No se pudieron cargar los datos de los reportes: ${e.message}`),l&&(l.innerHTML='<tr><td colspan="6" style="text-align: center;">Error al cargar datos.</td></tr>')}finally{f(!1,y)}};p&&p.addEventListener("input",x),T&&T.addEventListener("click",C),M&&M.addEventListener("click",O),I&&I.addEventListener("submit",U),l?N():console.error("El cuerpo de la tabla de deudores no se encontró en el DOM.")});
