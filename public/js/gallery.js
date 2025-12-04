document.addEventListener('DOMContentLoaded', () => {
    // === FILTRADO DE GALERÍA ===
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.design-card');

    if (filterButtons.length > 0 && galleryCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const category = button.getAttribute('data-category');

                galleryCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // === MODAL LIGHTBOX (CON FUNCIONALIDAD COMPLETA) ===
    const modal = document.getElementById('modal-lightbox');
    const modalImg = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const whatsappBtn = document.getElementById('modal-whatsapp-btn');
    const closeModal = document.getElementById('modal-close');
    const phoneNumber = "584220135069"; // Número de WhatsApp actualizado

    if (modal && modalImg && modalTitle && whatsappBtn && closeModal) {
        galleryCards.forEach(card => {
            card.addEventListener('click', () => {
                // Obtener datos de la tarjeta
                const imgSrc = card.querySelector('.card-image').src;
                const title = card.querySelector('.card-info h3').innerText;

                // Actualizar contenido de la modal
                modalImg.src = imgSrc;
                modalTitle.innerText = title;

                // Crear el enlace de WhatsApp
                const message = `¡Hola! Estoy interesado en el diseño \"${title}\". ¿Podrían darme más información?`;
                const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                whatsappBtn.href = whatsappURL;

                // Mostrar la modal
                modal.classList.add('active');
            });
        });

        // Función para cerrar la modal
        const closeModalFunction = () => {
            modal.classList.remove('active');
        };

        // Eventos para cerrar
        closeModal.addEventListener('click', closeModalFunction);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModalFunction();
            }
        });
    }
});
