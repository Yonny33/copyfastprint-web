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

    // NOTA: La funcionalidad del Lightbox (Modal) ahora es manejada globalmente por scripts.js
    // para asegurar consistencia, navegación por teclado y soporte de múltiples imágenes.
});
