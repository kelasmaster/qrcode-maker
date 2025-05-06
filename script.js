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
      default: // transparent
        colorDark = '#000000';
        colorLight = 'rgba(0,0,0,0)';
    }

    // Clear canvas and reset
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Generate QR Code
    new QRCode(canvas, {
      text: url,
      width: 300,
      height: 300,
      colorDark: colorDark,
      colorLight: colorLight,
      correctLevel: QRCode.CorrectLevel.H
    });

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
          downloadLink.href = canvas.toDataURL('image/png');
          downloadLink.classList.remove('hidden');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(logoFile);
    } else {
      downloadLink.href = canvas.toDataURL('image/png');
      downloadLink.classList.remove('hidden');
    }
  });
});
