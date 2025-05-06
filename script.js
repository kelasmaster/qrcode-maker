document.addEventListener('DOMContentLoaded', () => {
  const logoCheckbox = document.getElementById('logo-checkbox');
  const logoUploadDiv = document.getElementById('logo-upload');
  const logoInput = document.getElementById('logo-input');
  const form = document.getElementById('qrcode-form');
  const canvas = document.getElementById('qrcode-canvas');
  const downloadLink = document.getElementById('download-link');

  logoCheckbox.addEventListener('change', () => {
    logoUploadDiv.classList.toggle('hidden', !logoCheckbox.checked);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = document.getElementById('url-input').value.trim();
    const background = document.getElementById('background-select').value;
    const includeLogo = logoCheckbox.checked;
    const logoFile = logoInput.files[0];

    if (!url) {
      alert('Please enter a valid URL.');
      return;
    }

    let colorDark, colorLight;

    switch (background) {
      case 'light':
        colorDark = '#000000';
        colorLight = '#FFFFFF';
        break;
      case 'dark':
        colorDark = '#FFFFFF';
        colorLight = '#000000';
        break;
      default: // transparent (simulate transparency)
        colorDark = '#000000';
        colorLight = '#FFFFFF'; // Draw on white, then clear background
    }

    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Generate QR Code on canvas
    new QRCode(canvas, {
      text: url,
      width: 300,
      height: 300,
      colorDark: colorDark,
      colorLight: colorLight,
      correctLevel: QRCode.CorrectLevel.H
    });

    // Simulate transparency by clearing background pixels
    if (background === 'transparent') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // If pixel is white, make it transparent
        if (r === 255 && g === 255 && b === 255) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    }

    // Handle logo overlay
    if (includeLogo && logoFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const size = canvas.width * 0.25;
          const x = (canvas.width - size) / 2;
          const y = (canvas.height - size) / 2;

          ctx.drawImage(img, x, y, size, size);
          finalizeDownload();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(logoFile);
    } else {
      finalizeDownload();
    }

    function finalizeDownload() {
      const random = Math.floor(Math.random() * 10000);
      const dataURL = canvas.toDataURL('image/png');
      downloadLink.href = dataURL;
      downloadLink.download = `qrcode-${random}.png`;
      downloadLink.classList.remove('hidden');
    }
  });
});
