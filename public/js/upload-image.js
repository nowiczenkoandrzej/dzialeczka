document.addEventListener('DOMContentLoaded', () => {
    const uploadInput = document.getElementById('image-upload-input');
    const imagePreview = document.getElementById('image-preview');
    const uploadForm = document.getElementById('upload-form');
    const hiddenFileInput = document.getElementById('hidden-file-input');

    // Image preview
    uploadInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        hiddenFileInput.files = event.target.files;

        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.classList.add('active');
            }
            
            reader.readAsDataURL(file);
        }
    });

    // Optional: Form submission handling with fetch for potential async upload
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(uploadForm);

        try {
            const response = await fetch('/upload_image', {
                method: 'POST',
                body: formData
            });

            if (response.redirected) {
                window.location.href = response.url;
            } else {
                const result = await response.json();
                if (result.error) {
                    alert(result.error);
                }
            }
        } catch (error) {
            console.error('Upload error:', error);
            //alert('Image upload failed');
        }
        window.location.reload();
    });
});