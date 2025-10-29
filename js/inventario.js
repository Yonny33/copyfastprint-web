// js/inventario.js
document.addEventListener("DOMContentLoaded", () => {
    // Función para verificar la sesión y cerrar sesión (reusada de registro.html)
    document
        .getElementById("btnCerrarSesion")
        .addEventListener("click", function (e) {
            e.preventDefault();
            if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                sessionStorage.clear();
                window.location.href = "login-registro.html";
            }
        });

    const inventarioBody = document.getElementById("inventario-body");

    // Función para cargar los datos del inventario desde la Netlify Function
    async function cargarInventario() {
        inventarioBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Cargando inventario...</td></tr>';
        
        try {
            // Llama a la nueva Netlify Function con el parámetro 'inventario'
            const response = await fetch('/.netlify/functions/obtener-data-admin?type=inventario');
            const result = await response.json();

            if (!result.success || !result.items) {
                throw new Error(result.error || "No se pudieron obtener los datos de inventario.");
            }

            mostrarInventario(result.items);

        } catch (error) {
            console.error("Error al cargar el inventario:", error);
            inventarioBody.innerHTML = 
                `<tr><td colspan="7" style="text-align: center; color: #c60e0f;">
                    ⚠️ Error al cargar: ${error.message}
                </td></tr>`;
        }
    }

    // Función para renderizar los datos en la tabla
    function mostrarInventario(items) {
        inventarioBody.innerHTML = ''; // Limpiar la tabla

        items.forEach(item => {
            // Determinar la clase de estilo para el stock
            let stockClass = '';
            if (item.stock < item.stockMinimo) {
                stockClass = 'stock-bajo';
            } else if (item.stock > item.stockMinimo * 2) {
                stockClass = 'stock-optimo';
            }

            const row = `
                <tr>
                    <td>${item.codigo}</td>
                    <td>${item.material}</td>
                    <td>${item.tipo}</td>
                    <td class="${stockClass}">${item.stock}</td>
                    <td>${item.unidad}</td>
                    <td>${item.stockMinimo}</td>
                    <td>
                        <button onclick="editarItem('${item.codigo}')" style="background: none; border: none; color: #4CAF50; cursor: pointer; margin-right: 0.5em;"><i class="fas fa-edit"></i></button>
                        <button onclick="eliminarItem('${item.codigo}')" style="background: none; border: none; color: #c60e0f; cursor: pointer;"><i class="fas fa-trash-alt"></i></button>
                    </td>
                </tr>
            `;
            inventarioBody.innerHTML += row;
        });

        if (items.length === 0) {
            inventarioBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay items en inventario.</td></tr>';
        }
    }

    // Funciones de acción (simuladas)
    window.editarItem = function(codigo) {
        alert('Simulando Edición de: ' + codigo);
        // Aquí iría la lógica para abrir un modal de edición y llamar a otra Netlify Function.
    }

    window.eliminarItem = function(codigo) {
        if (confirm('¿Seguro que quieres eliminar el item ' + codigo + '?')) {
            alert('Simulando Eliminación de: ' + codigo);
            // Aquí iría la lógica para llamar a otra Netlify Function de eliminación.
            // Tras el éxito: cargarInventario();
        }
    }


    // Iniciar carga de datos
    cargarInventario();
});