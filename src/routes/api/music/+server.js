import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Download queue management
let downloadQueue = [];
let isProcessing = false;
let lastDownloadTime = 0;

async function processQueue() {
  if (isProcessing || downloadQueue.length === 0) return;
  
  isProcessing = true;
  while (downloadQueue.length > 0) {
    const now = Date.now();
    const timeSinceLastDownload = now - lastDownloadTime;
    const minDelay = 1000; // 1 second minimum delay
    
    if (timeSinceLastDownload < minDelay) {
      await new Promise(resolve => setTimeout(resolve, minDelay - timeSinceLastDownload));
    }
    
    const { task, resolve, reject } = downloadQueue.shift();
    try {
      const result = await task();
      resolve(result);
      lastDownloadTime = Date.now();
    } catch (error) {
      reject(error);
      lastDownloadTime = Date.now();
    }
  }
  isProcessing = false;
}

function addToQueue(task) {
  return new Promise((resolve, reject) => {
    downloadQueue.push({ task, resolve, reject });
    processQueue();
  });
}

async function searchAndDownloadMusic(title, type, cachePath, id = null) {
  if (id) {
    // If ID is provided, download directly from the video
    const strategies = [
      // Strategy 1: Best audio only
      { format: 'ba', extract: true },
      // Strategy 2: Best video+audio (for videos that don't have audio-only)
      { format: 'bv+ba/b', extract: true },
      // Strategy 3: Any format with audio
      { format: 'best', extract: true }
    ];
    
    let lastError;
    
    for (const strategy of strategies) {
      try {
        const command = `yt-dlp -f "${strategy.format}" ${strategy.extract ? '-x' : ''} --audio-format opus --audio-quality 9 -o "${cachePath}" "${id}" --no-warnings`;
        
        await execAsync(command, { 
          timeout: 120000,
          maxBuffer: 10 * 1024 * 1024 
        });
        
        // Verify file was created
        if (!fs.existsSync(cachePath)) {
          throw new Error('Download completed but file not found');
        }
        
        return;
      } catch (error) {
        lastError = error;
        console.warn(`Failed strategy ${strategy.format} for ID ${id}: ${error.message}`);
        // Continue to next strategy
      }
    }
    
    // If all strategies failed, throw the last error
    throw new Error(`All download strategies failed for ID ${id}. Last error: ${lastError.message}`);
  } else {
    // Original search-based logic
    const searchQuery = `${title} ${type === 'game' ? 'game theme' : 'opening theme'} OST`;
    
    // Try different format strategies
    const strategies = [
      // Strategy 1: Best audio only
      { format: 'bestaudio', extract: true },
      // Strategy 2: Best video+audio (for videos that don't have audio-only)
      { format: 'bv+ba/b', extract: true },
      // Strategy 3: Any format with audio
      { format: 'best', extract: true }
    ];
    
    let lastError;
    
    for (const strategy of strategies) {
      try {
        const command = `yt-dlp -f "${strategy.format}" ${strategy.extract ? '-x' : ''} --audio-format opus --audio-quality 0 -o "${cachePath}" "ytsearch:${searchQuery.replace(/"/g, '\\"')}" --no-warnings`;
        
        await execAsync(command, { 
          timeout: 120000,
          maxBuffer: 10 * 1024 * 1024 
        });
        
        // Verify file was created
        if (!fs.existsSync(cachePath)) {
          throw new Error('Download completed but file not found');
        }
        
        return;
      } catch (error) {
        lastError = error;
        console.warn(`Failed strategy ${strategy.format} for ${title}: ${error.message}`);
        // Continue to next strategy
      }
    }
    
    // If all strategies failed, throw the last error
    throw new Error(`All download strategies failed. Last error: ${lastError.message}`);
  }
}

export async function GET({ url }) {
  const title = url.searchParams.get('title');
  const type = url.searchParams.get('type');
  const id = url.searchParams.get('id');

  if (!title || !type) {
    return json({ error: 'Missing title or type' }, { status: 400 });
  }

  // Create cache key
  const cacheKey = crypto
    .createHash('md5')
    .update(`${title}-${type}-music${id ? `-${id}` : ''}`)
    .digest('hex');
  
  const cacheDir = path.resolve('static/music');
  const cacheFilePath = path.join(cacheDir, `${cacheKey}.opus`);
  const publicUrl = `/music/${cacheKey}.opus`;

  // Return cached file if it exists
  if (fs.existsSync(cacheFilePath)) {
    return json({ url: publicUrl });
  }

  try {
    // Ensure cache directory exists
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const result = await addToQueue(async () => {
      await searchAndDownloadMusic(title, type, cacheFilePath, id);
      return { url: publicUrl };
    });

    return json(result);
  } catch (error) {
    console.error(`Music fetch error for ${title}:`, error.message);
    return json(
      { error: `Failed to fetch music: ${error.message}` },
      { status: 500 }
    );
  }
}

