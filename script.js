document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('usageReportForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get the values from the form fields
        var email = document.getElementById('emailAddress').value;
        var slide = document.getElementById('slideViewed').value;

        // Construct the request payload
        var payload = {
            email_address: email,
            slide_viewed: slide
        };

        // Send the data to the Cloudflare Worker endpoint
        fetch('https://usage-report.crownzcom.workers.dev/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            // Check the response: if the status code is 2xx, parse it as JSON
            if (response.ok) {
                return response.json();
            } else {
                // If the status code is not in the 2xx range, handle it as an error
                // Try to read it as text, and throw it to be caught by the catch block
                return response.text().then(text => Promise.reject(text));
            }
        })
        .then(data => {
            // Process the data from the successful JSON response
            if (data.result === 'Success') {
                console.log('Success:', data);
                alert('Report submitted successfully!');
            } else if (data.result === 'Error') {
                // If the server indicates there was an error, display the error message
                console.error('Error:', data.message);
                alert(data.message);
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch or in the parsing of the response
            console.error('Fetch Error:', error);
            alert('An error occurred while submitting the report: ' + error);
        });
    });
});