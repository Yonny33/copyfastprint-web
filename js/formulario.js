// ========================================================================== 
// CONFIGURACIÓN EMAILJS - REEMPLAZA CON TUS VALORES
// ========================================================================== 

// Obtén estos valores en https://www.emailjs.com/
const EMAILJS_PUBLIC_KEY = "TU_PUBLIC_KEY_AQUI"; // Ejemplo: k1a2b3c4d5e6f7g8h9i0j
const EMAILJS_SERVICE_ID = "TU_SERVICE_ID_AQUI"; // Ejemplo: service_abc123xyz
const EMAILJS_TEMPLATE_ID = "TU_TEMPLATE_ID_AQUI"; // Ejemplo: template_abc123xyz

// Inicializar EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// ========================================================================== 
// FUNCIONALIDAD DEL MENÚ RESPONSIVE
// ========================================================================== 

const menu = document.getElementById("menu");
const toggleOpen = document.getElementById("toggle_open");
const toggleClose = document.getElementById("toggle_close");

if (menu && toggleOpen && toggleClose) {
    toggleOpen.addEventListener("click", toggleMenu);
    toggleClose.addEventListener("click", toggleMenu);

    function toggleMenu() {
        menu.classList.toggle("show-menu");
        const isMenuOpen = menu.classList.contains("show-menu");
        toggleOpen.style.display = isMenuOpen ? "none" : "block";
        toggleClose.style.display = isMenuOpen ? "block" : "none";
        toggleOpen.setAttribute("aria-expanded", isMenuOpen);
        toggleClose.setAttribute("aria-expanded", isMenuOpen);
    }
}

// Cerrar menú al hacer click en un enlace
const menuLinks = document.querySelectorAll(".menu li a");
menuLinks.forEach(link => {
    link.addEventListener("click", function() {
        if (menu && menu.classList.contains("show-menu")) {
            menu.classList.remove("show-menu");
            if (toggleOpen) toggleOpen.style.display = "block";
            if (toggleClose) toggleClose.style.display = "none";
        }
    });
});

// ========================================================================== 
// FUNCIONALIDAD DEL FORMULARIO
// ========================================================================== 

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("cotizacionForm");
    const servicioRadios = document.querySelectorAll('input[name="servicio"]');
    const prendasDTFDiv = document.getElementById("prendasDTF");
    const prendasSublimacionDiv = document.getElementById("prendasSublimacion");
    const archivosInput = document.getElementById("archivo");
    const fileName = document.querySelector(".file-name");
    const successMessage = document.getElementById("successMessage");
    const submitBtn = form.querySelector('button[type="submit"]');

    // ========== Mostrar/Ocultar campos según servicio ==========
    servicioRadios.forEach(radio => {
        radio.addEventListener("change", function() {
            prendasDTFDiv.style.display = "none";
            prendasSublimacionDiv.style.display = "none";

            if (this.value === "dtf") {
                prendasDTFDiv.style.display = "block";
            } else if (this.value === "sublimacion") {
                prendasSublimacionDiv.style.display = "block";
            } else if (this.value === "ambos") {
                prendasDTFDiv.style.display = "block";
                prendasSublimacionDiv.style.display = "block";
            }
        });
    });

    // ========== Manejo de carga de archivos ==========
    if (archivosInput) {
        archivosInput.addEventListener("change", function(e) {
            const file = e.target.files[0];
            if (file) {
                const maxSize = 50 * 1024 * 1024; // 50MB
                if (file.size > maxSize) {
                    fileName.textContent = "❌ Archivo muy grande (máximo 50MB)";
                    fileName.style.color = "#dc3545";
                    archivosInput.value = "";
                    return;
                }

                const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
                if (!allowedTypes.includes(file.type)) {
                    fileName.textContent = "❌ Formato no permitido (PNG, JPG, PDF)";
                    fileName.style.color = "#dc3545";
                    archivosInput.value = "";
                    return;
                }

                fileName.textContent = "✅ " + file.name + " (" + (file.size / 1024 / 1024).toFixed(2) + "MB)";
                fileName.style.color = "#28a745";
            }
        });
    }

    // ========== Envío del formulario con EmailJS ==========
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            // Validar formulario
            if (!validarFormulario()) {
                return;
            }

            // Cambiar estado del botón
            const textoOriginal = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            // Preparar datos del formulario
            const formData = {
                to_email: "copyfastprintcfp@gmail.com",
                nombre: document.getElementById("nombre").value,
                email: document.getElementById("email").value,
                telefono: document.getElementById("telefono").value,
                empresa: document.getElementById("empresa").value || "No especificada",
                servicio: document.querySelector('input[name="servicio"]:checked').value,
                prenda: getPrendaSeleccionada(),
                cantidad: document.getElementById("cantidad").value,
                descripcion: document.getElementById("descripcion").value,
                presupuesto: document.getElementById("presupuesto").value,
                fecha_requerida: document.getElementById("fechaRequerida").value,
                mensaje: document.getElementById("mensaje").value || "Sin mensaje adicional",
                newsletter: document.querySelector('input[name="newsletter"]').checked ? "Sí" : "No"
            };

            // Enviar con EmailJS
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData)
                .then(function(response) {
                    console.log("Cotización enviada exitosamente", response);
                    mostrarMensajeExito();
                    
                    // Limpiar formulario después de 3 segundos
                    setTimeout(() => {
                        form.reset();
                        prendasDTFDiv.style.display = "none";
                        prendasSublimacionDiv.style.display = "none";
                        fileName.textContent = "";
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = textoOriginal;
                    }, 3000);
                })
                .catch(function(error) {
                    console.error("Error al enviar cotización:", error);
                    alert("❌ Hubo un error al enviar tu cotización. Por favor, intenta nuevamente o contáctanos por WhatsApp.");
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = textoOriginal;
                });
        });
    }

    // Función para obtener prenda seleccionada
    function getPrendaSeleccionada() {
        const prendaDTF = document.getElementById("prendaDTF").value;
        const prendaSublimacion = document.getElementById("prendaSublimacion").value;
        
        if (prendaDTF) return prendaDTF;
        if (prendaSublimacion) return prendaSublimacion;
        return "No especificada";
    }

    // Función para validar el formulario
    function validarFormulario() {
        let esValido = true;
        const campos = form.querySelectorAll("input[required], select[required], textarea[required]");

        campos.forEach(campo => {
            const errorMessage = campo.parentElement.querySelector(".error-message");
            
            if (!campo.value.trim()) {
                if (errorMessage) {
                    errorMessage.textContent = "Este campo es requerido";
                    errorMessage.classList.add("show");
                }
                esValido = false;
            } else {
                if (errorMessage) {
                    errorMessage.classList.remove("show");
                }

                // Validaciones específicas
                if (campo.type === "email") {
                    if (!validarEmail(campo.value)) {
                        if (errorMessage) {
                            errorMessage.textContent = "Por favor ingresa un email válido";
                            errorMessage.classList.add("show");
                        }
                        esValido = false;
                    }
                }

                if (campo.type === "tel") {
                    if (campo.value.length < 7) {
                        if (errorMessage) {
                            errorMessage.textContent = "Por favor ingresa un teléfono válido";
                            errorMessage.classList.add("show");
                        }
                        esValido = false;
                    }
                }

                if (campo.type === "date") {
                    const fechaSeleccionada = new Date(campo.value);
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    if (fechaSeleccionada < hoy) {
                        if (errorMessage) {
                            errorMessage.textContent = "La fecha debe ser futura";
                            errorMessage.classList.add("show");
                        }
                        esValido = false;
                    }
                }
            }
        });

        // Validar checkbox de términos
        const checkboxTerminos = document.querySelector('input[name="terminos"]');
        if (checkboxTerminos && !checkboxTerminos.checked) {
            alert("❌ Debes aceptar los términos y condiciones");
            esValido = false;
        }

        return esValido;
    }

    // Función para validar email
    function validarEmail(email) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email);
    }

    // Función para mostrar mensaje de éxito
    function mostrarMensajeExito() {
        if (successMessage) {
            form.style.display = "none";
            successMessage.style.display = "block";
            
            setTimeout(() => {
                successMessage.style.display = "none";
                form.style.display = "block";
            }, 5000);
        }
    }

    // ========== Validación en tiempo real ==========
    const inputsChange = form.querySelectorAll("input, textarea");
    inputsChange.forEach(input => {
        input.addEventListener("blur", function() {
            const errorMessage = this.parentElement.querySelector(".error-message");
            if (this.value.trim()) {
                if (errorMessage) {
                    errorMessage.classList.remove("show");
                }
            }
        });

        input.addEventListener("focus", function() {
            const errorMessage = this.parentElement.querySelector(".error-message");
            if (errorMessage) {
                errorMessage.classList.remove("show");
            }
        });
    });
});