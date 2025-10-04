import { TranscriptService } from './transcriptService.js';

export default async (req, res) => {
  // Add CORS headers - same pattern as LLM server
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['POST']
    });
  }

  try {
    const { videoId } = req.body;
    
    if (!videoId) {
      return res.status(400).json({ 
        error: 'Missing required parameter: videoId',
        success: false
      });
    }

    const transcriptService = new TranscriptService();
    const result = await transcriptService.fetchTranscript(videoId);
    
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ 
      error: 'Internal server error',
      success: false
    });
  }
};
