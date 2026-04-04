import"../modulepreload-polyfill-B5Qt9EMX.js";import"../auth-DWRhgorf.js";import{A as I}from"../firebase-config-DMqX9BD5.js";import"../components-ReZMhaLd.js";import"../vendor-B5gEuqmI.js";document.addEventListener("DOMContentLoaded",function(){const b=I,m=document.getElementById("loading-overlay"),f=document.getElementById("display-year"),p=document.getElementById("year-profitability"),l=document.getElementById("months-grid"),g=document.querySelector("#historical-table tbody"),y=document.getElementById("trend-chart");let a=[],i=null;const d=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],u=e=>{m&&(m.style.display=e?"flex":"none")},r=e=>`Bs. ${parseFloat(e||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})}`,v=async()=>{u(!0);try{const t=await(await fetch(`${b}/analisis`)).json();if(t.status==="success")a=t.data,a.length>0?(C(a),h(a[0])):l.innerHTML="<p style='grid-column: 1/-1; text-align: center;'>No hay datos registrados aún.</p>";else throw new Error(t.message)}catch(e){console.error("Error cargando análisis:",e),alert("Error al cargar datos de análisis.")}finally{u(!1)}},C=e=>{g.innerHTML="",e.forEach(t=>{const o=document.createElement("tr");o.className="historical-row",o.dataset.year=t.year;const s=t.mesEstrella.mes>=0?d[t.mesEstrella.mes]:"-";o.innerHTML=`
        <td style="font-weight: bold; font-size: 1.1rem;">${t.year}</td>
        <td style="color: var(--success-color);">${r(t.totalIngresos)}</td>
        <td style="color: var(--error-color);">${r(t.totalGastos)}</td>
        <td style="font-weight: bold;">${r(t.totalNeto)}</td>
        <td>${t.rentabilidad}%</td>
        <td>${s!=="-"?`<span class="star-month-badge"><i class="fas fa-star"></i> ${s}</span>`:"-"}</td>
        <td>${t.totalNeto>=0?'<span class="status pagado">Rentable</span>':'<span class="status pendiente">Pérdida</span>'}</td>
      `,o.addEventListener("click",()=>h(t)),g.appendChild(o)})},h=e=>{f.textContent=e.year,p.textContent=`${e.rentabilidad}%`,p.style.color=parseFloat(e.rentabilidad)>=0?"var(--success-color)":"var(--error-color)",document.querySelectorAll(".historical-row").forEach(o=>o.classList.remove("active-year"));const t=document.querySelector(`.historical-row[data-year="${e.year}"]`);t&&t.classList.add("active-year"),E(e),$(e)},E=e=>{l.innerHTML="";const t=new Date().getFullYear(),o=new Date().getMonth();e.months.forEach((s,n)=>{const L=e.year===t&&n>o,c=document.createElement("div");c.className=`month-card ${L?"future":""}`;const w=s.neto>=0?"positive":"negative";c.innerHTML=`
        <div class="month-name">${d[n]}</div>
        <div class="month-stat">
            <span class="stat-label">Ingresos</span>
            <span class="stat-value income">${r(s.ingresos)}</span>
        </div>
        <div class="month-stat">
            <span class="stat-label">Gastos</span>
            <span class="stat-value expense">${r(s.gastos)}</span>
        </div>
        <div class="month-net ${w}">
            <span>Utilidad Neta</span>
            <strong>${r(s.neto)}</strong>
        </div>
      `,l.appendChild(c)})},$=e=>{i&&i.destroy();const t=y.getContext("2d"),o=t.createLinearGradient(0,0,0,400);o.addColorStop(0,"rgba(16, 185, 129, 0.5)"),o.addColorStop(1,"rgba(16, 185, 129, 0.0)");const s=t.createLinearGradient(0,0,0,400);s.addColorStop(0,"rgba(239, 68, 68, 0.5)"),s.addColorStop(1,"rgba(239, 68, 68, 0.0)"),i=new Chart(t,{type:"line",data:{labels:d,datasets:[{label:"Ingresos",data:e.months.map(n=>n.ingresos),borderColor:"#10b981",backgroundColor:o,borderWidth:2,fill:!0,tension:.4},{label:"Gastos",data:e.months.map(n=>n.gastos),borderColor:"#ef4444",backgroundColor:s,borderWidth:2,fill:!0,tension:.4},{label:"Utilidad Neta",data:e.months.map(n=>n.neto),borderColor:"#ffffff",borderWidth:2,borderDash:[5,5],fill:!1,tension:.4,pointRadius:0}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"#ccc"}}},scales:{y:{grid:{color:"#333"},ticks:{color:"#888"}},x:{grid:{display:!1},ticks:{color:"#888"}}}}})};v()});
