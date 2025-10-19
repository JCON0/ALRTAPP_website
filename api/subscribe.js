// Vercel Serverless Function: /api/subscribe
// Accepts POST { email, name, hp } and returns JSON.
// Replace the placeholder "store" section with your provider integration (Mailchimp, Brevo, Postgres, etc.).

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async (req, res) => {
  // Allow only POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const { email, name, hp } = req.body || {};

    // Honeypot: if present, silently succeed (pretend success, do not process)
    if (hp) {
      return res.status(200).json({ ok: true, message: 'Thanks!' });
    }

    if (!email || !EMAIL_REGEX.test(String(email).toLowerCase())) {
      return res.status(400).json({ ok: false, error: 'Invalid email' });
    }

    // TODO: Replace with your real storage/subscription logic.
    // Examples:
    // - Call your ESP API (Mailchimp/ConvertKit/Brevo)
    // - Write to Vercel Postgres / Vercel KV / Supabase / Airtable
    // - Send a notification email via an SMTP provider
    // This placeholder just logs and returns success.
    console.log('New subscriber:', { email, name });

    return res.status(200).json({ ok: true, message: "You're subscribed" });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};
