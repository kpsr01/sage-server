# Transcript Server

Serverless transcript extraction service for the Sage YouTube extension.

## Overview

This service provides transcript extraction from YouTube videos using the `youtube-transcript-plus` library. It's deployed on Vercel and handles CORS properly to work with the browser extension.

## Features

- ✅ Serverless architecture (Vercel)
- ✅ CORS-enabled for browser extensions
- ✅ Automatic transcript extraction
- ✅ Error handling for videos without transcripts
- ✅ Fast and reliable

## API Endpoint

### POST /api

**Request Body:**
```json
{
  "videoId": "dQw4w9WgXcQ"
}
```

**Success Response:**
```json
{
  "data": "Full transcript text...",
  "language": "en",
  "isGenerated": true,
  "totalEntries": 123,
  "videoId": "dQw4w9WgXcQ",
  "success": true
}
```

**Error Response:**
```json
{
  "error": "No transcript available for this video",
  "videoId": "dQw4w9WgXcQ",
  "success": false
}
```

## Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

3. For production deployment:
```bash
vercel --prod
```

## Integration

Use this service in your extension:

```javascript
const response = await fetch('https://your-deployment.vercel.app/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    videoId: 'dQw4w9WgXcQ'
  })
});

const result = await response.json();

if (result.success) {
  console.log('Transcript:', result.data);
} else {
  console.log('Error:', result.error);
}
```

## Error Handling

The service returns structured errors for various cases:
- No transcript available
- Transcript disabled by uploader
- Invalid video ID
- Server errors

All errors include the `success: false` flag for easy checking.

## Dependencies

- `youtube-transcript-plus`: Transcript extraction library

## License

ISC
