// api/auth/discord.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  
  // Exchange code for token
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: '1529762647669608448',
      client_secret: process.env.DISCORD_CLIENT_SECRET, // Add this in Vercel env vars
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'https://m-purchase-hub.vercel.app/',
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) {
    return res.status(400).json({ error: tokenData.error_description || 'Token exchange failed' });
  }

  // Fetch user profile
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const userData = await userRes.json();
  return res.status(200).json(userData);
}
