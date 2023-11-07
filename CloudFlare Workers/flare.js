const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1TUvxAOSVnHVb83opXcYU9vPI2QfWmJCoSzctHMGFptqZcF2dWoHGRvCKkBMQhDTu/exec';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      // Handle CORS preflight request.
      return new Response(null, {
        headers: corsHeaders
      });
    }

    if (request.method === 'POST') {
      try {
        console.log("Fetching Google Script URL...");

        // Forward the request body as is to the Google Apps Script
        const requestBody = await request.json();

        let response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: { 'Content-Type': 'application/json' },
        });

        // Handle redirect if status code is 302
        if (response.status === 302) {
          const redirectUrl = response.headers.get('Location');
          response = await fetch(redirectUrl);
        }

        if (!response.ok) {
          throw new Error(`Google Script responded with status: ${response.status}`);
        }

        // Forward the response from GAS as-is
        return new Response(response.body, {
          status: response.status,
          headers: {
            ...corsHeaders,
            // Include any additional headers from the GAS response if needed
            ...response.headers,
          },
        });

      }
      // Inside the catch block in your Cloudflare Worker
      catch (error) {
        // Log the error for debugging purposes
        console.error("Error occurred:", error);

        // Respond with a more detailed error message for debugging
        let errMsg = typeof error === 'string' ? error : (error.message || 'Unknown error');
        return new Response(JSON.stringify({ result: 'Error', message: errMsg }), {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }

    }

    return new Response('Expected POST', {
      status: 400,
      headers: corsHeaders
    });
  },
};