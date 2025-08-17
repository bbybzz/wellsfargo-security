import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const auth = req.headers.authorization;
    if (auth !== 'Basic ' + Buffer.from('admin:secret123').toString('base64')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const credentials = (await kv.get('credentialHistory')) || [];
        res.status(200).json(credentials);
    } catch (err) {
        console.error('Error fetching credentials:', err);
        res.status(500).json({ error: 'Server error' });
    }
}
