import { fetchTranscript } from 'youtube-transcript-plus';

class TranscriptService {
  async fetchTranscript(videoId) {
    try {
      if (!videoId) {
        throw new Error('Video ID is required');
      }

      console.log(`[TranscriptService] Fetching transcript for video: ${videoId}`);

      // Fetch transcript using youtube-transcript-plus
      // Don't specify language - let it fetch the default/available transcript
      const transcriptArray = await fetchTranscript(videoId);

      console.log(`[TranscriptService] Raw result:`, transcriptArray ? `${transcriptArray.length} segments` : 'null');

      if (!transcriptArray || transcriptArray.length === 0) {
        console.log(`[TranscriptService] Empty transcript array`);
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
        console.log(`[TranscriptService] Empty transcript text after processing`);
        return {
          error: 'No transcript available for this video',
          videoId: videoId,
          success: false
        };
      }

      console.log(`[TranscriptService] Success: ${transcriptText.length} characters, ${transcriptArray.length} segments`);

      // Get language from the first segment if available
      const language = transcriptArray[0]?.lang || 'en';

      return {
        data: transcriptText,
        language: language,
        isGenerated: true,
        totalEntries: transcriptArray.length,
        videoId: videoId,
        success: true
      };

    } catch (error) {
      const errorMessage = error.message || '';
      const errorName = error.constructor?.name || 'Error';
      
      console.error(`[TranscriptService] Error for ${videoId}:`, {
        name: errorName,
        message: errorMessage
      });
      
      if (errorMessage.includes('Transcript is disabled') || 
          errorMessage.includes('disabled') ||
          errorName.includes('Disabled')) {
        return {
          error: 'Transcript is disabled for this video',
          videoId: videoId,
          success: false,
          errorType: 'disabled'
        };
      } else if (errorMessage.includes('Could not find captions') || 
                 errorMessage.includes('No transcripts') ||
                 errorMessage.includes('No transcript') ||
                 errorMessage.includes('not available') ||
                 errorName.includes('NotAvailable')) {
        return {
          error: 'No transcript available for this video',
          videoId: videoId,
          success: false,
          errorType: 'not_available'
        };
      } else if (errorMessage.includes('video ID') || 
                 errorMessage.includes('Invalid') ||
                 errorName.includes('InvalidVideoId')) {
        return {
          error: 'Invalid video ID',
          videoId: videoId,
          success: false,
          errorType: 'invalid_id'
        };
      } else if (errorMessage.includes('Too many requests') ||
                 errorName.includes('TooManyRequest')) {
        return {
          error: 'Too many requests. Please try again later',
          videoId: videoId,
          success: false,
          errorType: 'rate_limit'
        };
      } else {
        return {
          error: 'Failed to fetch transcript',
          videoId: videoId,
          success: false,
          errorType: 'unknown',
          details: errorMessage
        };
      }
    }
  }
}

export { TranscriptService };
