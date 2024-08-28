// [Código 9] - search.js
document.getElementById('searchForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;

    try {
        const response = await fetch('/search-certificate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('response').innerHTML = `
                <a href="${result.pdfUrl}" target="_blank">Ver Certificado</a>
            `;
        } else {
            document.getElementById('response').innerText = result.message;
        }
    } catch (error) {
        document.getElementById('response').innerText = 'Error al buscar el certificado';
    }
});
