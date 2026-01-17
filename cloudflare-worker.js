// Cloudflare Worker for Gemini 3 Pro API proxy
// This worker hides your API key and provides rate limiting

export default {
  async fetch(request, env) {
    // CORS headers for GitHub Pages
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // ⚠️ Change to your GitHub Pages URL after deployment
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      const body = await request.json();

      // Rate limiting (per IP)
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const rateLimitKey = `ratelimit:${ip}`;

      // Simple rate limit: 50 requests per hour per IP
      const count = await env.RATE_LIMIT_KV?.get(rateLimitKey);
      if (count && parseInt(count) > 50) {
        return new Response(JSON.stringify({
          error: 'Rate limit exceeded. Try again in an hour.'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Increment rate limit counter
      await env.RATE_LIMIT_KV?.put(
        rateLimitKey,
        (parseInt(count || 0) + 1).toString(),
        { expirationTtl: 3600 } // 1 hour
      );

      // Forward to Gemini API
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${body.model}:generateContent?key=${env.GEMINI_API_KEY}`;

      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body.payload)
      });

      const data = await geminiResponse.json();

      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Proxy error: ' + error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
