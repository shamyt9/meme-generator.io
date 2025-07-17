document.addEventListener('DOMContentLoaded', function () {
       document.addEventListener('contextmenu', (event) => event.preventDefault());
    document.onkeydown = function (e) {
        if (
            e.key === 'F12' ||
            (e.ctrlKey &&
                e.shiftKey &&
                (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            return false;
        }
    };
    // Elements
    const canvas = document.getElementById('meme-canvas');
    const ctx = canvas.getContext('2d');
    const topTextInput = document.getElementById('top-text');
    const bottomTextInput = document.getElementById('bottom-text');
    const topTextDisplay = document.getElementById('top-text-display');
    const bottomTextDisplay = document.getElementById('bottom-text-display');
    const imageUpload = document.getElementById('image-upload');
    const templates = document.querySelectorAll('.template');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Style controls
    const fontFamily = document.getElementById('font-family');
    const fontSize = document.getElementById('font-size');
    const fontWeight = document.getElementById('font-weight');
    const textColor = document.getElementById('text-color');
    const strokeColor = document.getElementById('stroke-color');
    const strokeWidth = document.getElementById('stroke-width');

    // Default image
    let currentImage = new Image();
    currentImage.crossOrigin = 'Anonymous';
    currentImage.src = 'https://api.memegen.link/images/ds/small_file.png';

    // Text positions
    let topTextPos = { x: canvas.width / 2, y: 50 };
    let bottomTextPos = {
        x: canvas.width / 2,
        y: canvas.height - 50,
    };

    // Initialize
    currentImage.onload = function () {
        drawMeme();
    };

    // Draw meme on canvas
    function drawMeme() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw image
        const ratio = Math.min(
            canvas.width / currentImage.width,
            canvas.height / currentImage.height
        );
        const width = currentImage.width * ratio;
        const height = currentImage.height * ratio;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;

        ctx.drawImage(currentImage, x, y, width, height);
    }

    // Update text display
    function updateTextDisplay() {
        topTextDisplay.textContent = topTextInput.value;
        bottomTextDisplay.textContent = bottomTextInput.value;

        // Update text styles
        topTextDisplay.style.fontFamily = bottomTextDisplay.style.fontFamily =
            fontFamily.value;
        topTextDisplay.style.fontSize = bottomTextDisplay.style.fontSize =
            fontSize.value + 'px';
        topTextDisplay.style.fontWeight = bottomTextDisplay.style.fontWeight =
            fontWeight.value;
        topTextDisplay.style.color = bottomTextDisplay.style.color =
            textColor.value;

        // Update text stroke
        const stroke = strokeWidth.value + 'px ' + strokeColor.value;
        topTextDisplay.style.textShadow =
            bottomTextDisplay.style.textShadow = `${stroke}, 0 0 ${stroke}, 0 0 ${stroke}, 0 0 ${stroke}`;
    }

    // Handle image upload
    imageUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                currentImage.src = event.target.result;
                document
                    .querySelector('.template.active')
                    .classList.remove('active');
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle template selection
    templates.forEach((template) => {
        template.addEventListener('click', function () {
            templates.forEach((t) => t.classList.remove('active'));
            this.classList.add('active');

            const imageName = this.getAttribute('data-image');
            switch (imageName) {
                case 'drake':
                    currentImage.src =
                        'https://api.memegen.link/images/drake.png';
                    break;
                case 'doge':
                    currentImage.src =
                        'https://api.memegen.link/images/doge.png';
                    break;
                case 'wonka':
                    currentImage.src =
                        'https://api.memegen.link/images/wonka.png';
                    break;
                case 'fry':
                    currentImage.src =
                        'https://api.memegen.link/images/fry.png';
                    break;
                case 'spongebob':
                    currentImage.src = 'https://api.memegen.link/images/sb.png';
                    break;
                default:
                    currentImage.src =
                        'https://api.memegen.link/images/ds/small_file.png';
            }
        });
    });

    // Text input events
    topTextInput.addEventListener('input', updateTextDisplay);
    bottomTextInput.addEventListener('input', updateTextDisplay);

    // Style change events
    fontFamily.addEventListener('change', updateTextDisplay);
    fontSize.addEventListener('input', updateTextDisplay);
    fontWeight.addEventListener('change', updateTextDisplay);
    textColor.addEventListener('input', updateTextDisplay);
    strokeColor.addEventListener('input', updateTextDisplay);
    strokeWidth.addEventListener('input', updateTextDisplay);

    // Draggable text functionality
    function makeTextDraggable(textElement, position) {
        let isDragging = false;
        let offsetX, offsetY;

        textElement.addEventListener('mousedown', function (e) {
            isDragging = true;
            offsetX = e.clientX - position.x;
            offsetY = e.clientY - position.y;
            textElement.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                position.x = e.clientX - offsetX;
                position.y = e.clientY - offsetY;

                // Constrain to canvas boundaries
                position.x = Math.max(
                    30,
                    Math.min(canvas.width - 30, position.x)
                );
                position.y = Math.max(
                    30,
                    Math.min(canvas.height - 30, position.y)
                );

                textElement.style.left =
                    position.x - textElement.offsetWidth / 2 + 'px';
                textElement.style.top = position.y + 'px';
            }
        });

        document.addEventListener('mouseup', function () {
            isDragging = false;
            textElement.style.cursor = 'move';
        });
    }

    // Initialize draggable text
    makeTextDraggable(topTextDisplay, topTextPos);
    makeTextDraggable(bottomTextDisplay, bottomTextPos);

    // Download functionality
    downloadBtn.addEventListener('click', function () {
        // Create a temporary canvas to draw everything
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        // Draw the image
        const ratio = Math.min(
            canvas.width / currentImage.width,
            canvas.height / currentImage.height
        );
        const width = currentImage.width * ratio;
        const height = currentImage.height * ratio;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;

        tempCtx.drawImage(currentImage, x, y, width, height);

        // Draw top text
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'top';
        tempCtx.font = `${fontWeight.value} ${fontSize.value}px "${fontFamily.value}"`;

        // Text with stroke
        tempCtx.strokeStyle = strokeColor.value;
        tempCtx.lineWidth = parseInt(strokeWidth.value);
        tempCtx.strokeText(topTextInput.value, topTextPos.x, topTextPos.y);

        // Text fill
        tempCtx.fillStyle = textColor.value;
        tempCtx.fillText(topTextInput.value, topTextPos.x, topTextPos.y);

        // Draw bottom text
        tempCtx.textBaseline = 'bottom';
        tempCtx.strokeText(
            bottomTextInput.value,
            bottomTextPos.x,
            bottomTextPos.y
        );
        tempCtx.fillText(
            bottomTextInput.value,
            bottomTextPos.x,
            bottomTextPos.y
        );

        // Create download link
        const link = document.createElement('a');
        link.download = 'my-meme.png';
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    });

    // Reset functionality
    resetBtn.addEventListener('click', function () {
        // Reset image
        currentImage.src = 'https://api.memegen.link/images/ds/small_file.png';
        document.querySelector('.template').classList.add('active');
        templates.forEach((t, i) =>
            i === 0 ? t.classList.add('active') : t.classList.remove('active')
        );

        // Reset text
        topTextInput.value = 'WHEN THE CLIENT';
        bottomTextInput.value = 'WANTS ANOTHER REVISION';

        // Reset styles
        fontFamily.value = 'Impact';
        fontSize.value = 36;
        fontWeight.value = 'normal';
        textColor.value = '#ffffff';
        strokeColor.value = '#000000';
        strokeWidth.value = 2;

        // Reset positions
        topTextPos = { x: canvas.width / 2, y: 50 };
        bottomTextPos = {
            x: canvas.width / 2,
            y: canvas.height - 50,
        };

        topTextDisplay.style.left =
            topTextPos.x - topTextDisplay.offsetWidth / 2 + 'px';
        topTextDisplay.style.top = topTextPos.y + 'px';
        bottomTextDisplay.style.left =
            bottomTextPos.x - bottomTextDisplay.offsetWidth / 2 + 'px';
        bottomTextDisplay.style.top = bottomTextPos.y + 'px';

        updateTextDisplay();
    });

    // Initial update
    updateTextDisplay();
});
