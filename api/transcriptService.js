import { fetchTranscript } from 'youtube-transcript-plus';

class TranscriptService {
  async fetchTranscript(videoId) {
    try {
      if (!videoId) {
        throw new Error('Video ID is required');
      }

      // Fetch transcript using youtube-transcript-plus
      const transcriptArray = await fetchTranscript(videoId);

      if (!transcriptArray || transcriptArray.length === 0) {
        return {
          error: 'No transcript available for this video',
          videoId: videoId,
          success: false
        };
      }

      // Extract text from transcript array and join with newlines
      const transcriptText = transcriptArray
        .map(item => item.text)
        .filter(Boolean)
        .join('\n')
        .trim();

      if (!transcriptText) {
        return {
          error: 'No transcript available for this video',
          videoId: videoId,
          success: false
        };
      }

      return {
        data: transcriptText,
        language: 'en',
        isGenerated: true,
        totalEntries: transcriptArray.length,
        videoId: videoId,
        success: true
      };

    } catch (error) {
      const errorMessage = error.message || '';
      
      if (errorMessage.includes('Transcript is disabled') || errorMessage.includes('disabled')) {
        return {
          error: 'Transcript is disabled for this video',
          videoId: videoId,
          success: false
        };
      } else if (errorMessage.includes('Could not find captions') || 
                 errorMessage.includes('No transcripts') ||
                 errorMessage.includes('No transcript')) {
        return {
          error: 'No transcript available for this video',
          videoId: videoId,
          success: false
        };
      } else if (errorMessage.includes('video ID') || errorMessage.includes('Invalid')) {
        return {
          error: 'Invalid video ID',
          videoId: videoId,
          success: false
        };
      } else {
        return {
          error: 'Failed to fetch transcript',
          videoId: videoId,
          success: false
        };
      }
    }
  }
}

export { TranscriptService };
