document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    const viewer = document.querySelector('.image-viewer');
    const viewerImage = document.querySelector('.viewer-image');
    const closeBtn = document.querySelector('.viewer-close');
    const prevBtn = document.querySelector('.viewer-nav-prev');
    const nextBtn = document.querySelector('.viewer-nav-next');

    let currentIndex = 0;
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

    // Open image viewer
    gallery.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) {
            currentIndex = parseInt(item.dataset.index);
            openViewer();
        }
    });

    // Close image viewer
    closeBtn.addEventListener('click', closeViewer);
    viewer.addEventListener('click', (e) => {
        if (e.target === viewer) closeViewer();
    });

    // Navigate images
    prevBtn.addEventListener('click', () => navigateImage(-1));
    nextBtn.addEventListener('click', () => navigateImage(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!viewer.classList.contains('active')) return;

        if (e.key === 'Escape') closeViewer();
        if (e.key === 'ArrowLeft') navigateImage(-1);
        if (e.key === 'ArrowRight') navigateImage(1);
    });

    function openViewer() {
        viewer.classList.add('active');
        updateViewerImage();
    }

    function closeViewer() {
        viewer.classList.remove('active');
    }

    function navigateImage(direction) {
        currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
        updateViewerImage();
    }

    function updateViewerImage() {
        const currentItem = galleryItems[currentIndex];
        const img = currentItem.querySelector('img');
        viewerImage.src = img.src;
        viewerImage.alt = img.alt;
    }
});