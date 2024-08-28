// [Código 4] - app.js
document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const certificateId = document.getElementById('certificateId').value;
    const email = document.getElementById('email').value;
    const pdfFile = document.getElementById('pdfFile').files[0];

    const formData = new FormData();
    formData.append('certificateId', certificateId);
    formData.append('email', email);
    formData.append('pdfFile', pdfFile);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.text();
        document.getElementById('response').innerText = result;

    } catch (error) {
        document.getElementById('response').innerText = 'Error al subir el archivo';
    }
});