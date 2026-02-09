function getTinyURL() {
    const ph1 = document.getElementById('ph1');
    const url = ph1.value.trim();

    const params = {
        full_url: url
    };

    fetch('/api/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error creating TinyURL:', error);
    });
}
