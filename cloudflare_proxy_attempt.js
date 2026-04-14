export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        }
      });
    }

    try {
      // Extract the Google Sheets URL you passed to it
      const url = new URL(request.url);
      const targetUrl = url.searchParams.get("url");

      if (!targetUrl) {
        return new Response("Missing target URL parameter", { status: 400 });
      }

      // Fetch the data from Google (Cloudflare has no firewall!)
      const googleResponse = await fetch(targetUrl, { redirect: 'follow' });
      const csvData = await googleResponse.text();

      // Send the raw text back to Nemobot
      return new Response(csvData, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "text/plain"
        }
      });

    } catch (error) {
      return new Response(`Proxy Error: ${error.message}`, { status: 500 });
    }
  }
};