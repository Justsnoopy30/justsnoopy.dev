import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function GET({ url }) {
  const title = url.searchParams.get('title');
  const type = url.searchParams.get('type');
  const author = url.searchParams.get('author') || '';
  const year = url.searchParams.get('year') || '';
  const apiPref = url.searchParams.get('api') || '';
  const itemId = url.searchParams.get('id');

  if (!title || !type) {
    return json({ error: 'Missing title or type' }, { status: 400 });
  }

  // Create cache filename based on title, type, and source
  const cacheKey = crypto.createHash('md5').update(`${title}-${type}-${author}-${year}-${apiPref}-${itemId || ''}`).digest('hex');
  const cacheDir = path.resolve('static/covers');
  const cacheFilePath = path.join(cacheDir, `${cacheKey}.jpg`);
  const publicUrl = `/covers/${cacheKey}.jpg`;

  // Return cached file if it exists
  if (fs.existsSync(cacheFilePath)) {
    return json({ url: publicUrl });
  }

  try {
    let imageUrl = '';

    if (type === 'game') {
      const steamGridKey = process.env.STEAMGRIDDB_API_KEY;
      if (!steamGridKey) {
        console.warn('STEAMGRIDDB_API_KEY not set');
        return json({ error: 'SteamGridDB API key not configured' }, { status: 500 });
      }

      // Search for game ID
      const searchRes = await fetch(`https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(title)}`, {
        headers: { Authorization: `Bearer ${steamGridKey}` }
      });
      
      if (!searchRes.ok) {
        const errorText = await searchRes.text();
        console.error(`SteamGridDB search failed for ${title}:`, errorText.slice(0, 100));
        return json({ error: 'SteamGridDB search failed' }, { status: searchRes.status });
      }

      const searchData = await searchRes.json();
      
      if (searchData.success && searchData.data.length > 0) {
        const gameId = searchData.data[0].id;
        // Get grids for the ID - NO fixed dimensions parameter as it's unreliable
        const gridsRes = await fetch(`https://www.steamgriddb.com/api/v2/grids/game/${gameId}`, {
          headers: { Authorization: `Bearer ${steamGridKey}` }
        });

        if (!gridsRes.ok) {
          console.error(`SteamGridDB grids failed for ${title} (ID: ${gameId})`);
          return json({ error: 'SteamGridDB grids failed' }, { status: gridsRes.status });
        }

        const gridsData = await gridsRes.json();
        if (gridsData.success && gridsData.data.length > 0) {
          if (itemId) {
            // Filter the search results for that game and choose the one with the matching id
            const specificGrid = gridsData.data.find(g => g.id.toString() === itemId.toString());
            if (specificGrid) {
              imageUrl = specificGrid.url;
            }
          }
          
          // Fallback to first grid if no itemId or if id wasn't found in results
          if (!imageUrl) {
            imageUrl = gridsData.data[0].url;
          }
        }
      }
    } else if (type === 'show' || type === 'movie') {
      const omdbKey = process.env.OMDB_API_KEY;
      const tmdbKey = process.env.TMDB_API_KEY;

      // 1. Try TMDB if it's the preference OR if no preference is set (Default)
      const preferTMDB = (apiPref === 'tmdb' || !apiPref) && tmdbKey;
      if (preferTMDB) {
        const tmdbType = type === 'show' ? 'tv' : 'movie';
        const yearParam = type === 'show' ? 'first_air_date_year' : 'primary_release_year';
        const tmdbSearchUrl = `https://api.themoviedb.org/3/search/${tmdbType}?api_key=${tmdbKey}&query=${encodeURIComponent(title)}${year ? `&${yearParam}=${year.split('-')[0]}` : ''}`;
        
        try {
          const tmdbRes = await fetch(tmdbSearchUrl);
          if (tmdbRes.ok) {
            const tmdbData = await tmdbRes.json();
            if (tmdbData.results && tmdbData.results.length > 0) {
              const bestMatch = tmdbData.results[0];
              if (bestMatch.poster_path) {
                imageUrl = `https://image.tmdb.org/t/p/original${bestMatch.poster_path}`;
              }
            }
          }
        } catch (err) {
          console.error(`TMDB Fetch Exception for ${title}:`, err);
        }
      }

      // 2. Try TVMaze if specifically requested OR if TMDB failed and it's a show
      const preferTVMaze = !imageUrl && (apiPref === 'tvmaze' || (type === 'show' && apiPref !== 'omdb' && apiPref !== 'tmdb'));

      if (preferTVMaze || (!imageUrl && type === 'show' && apiPref !== 'omdb')) {
        // Try to get exact match considering year
        const tvmSearchUrl = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(title)}`;
        const tvmSearchRes = await fetch(tvmSearchUrl);
        if (tvmSearchRes.ok) {
          const searchData = await tvmSearchRes.json();
          let bestMatch = null;
          
          if (year && searchData.length > 0) {
            bestMatch = searchData.find(m => {
              if (!m.show.premiered) return false;
              const pYear = m.show.premiered.split('-')[0];
              return year.includes(pYear) || pYear === year;
            });
          }
          
          if (!bestMatch) {
            bestMatch = searchData.find(m => m.show.name.toLowerCase() === title.toLowerCase());
          }
          
          if (!bestMatch) {
            bestMatch = searchData[0];
          }

          if (bestMatch && bestMatch.show.image) {
            imageUrl = bestMatch.show.image.original || bestMatch.show.image.medium;
          }
        }
      }

      // 3. Fallback to OMDb if no imageUrl yet
      if (!imageUrl && omdbKey && (apiPref === 'omdb' || !apiPref || (!imageUrl && apiPref !== 'tmdb' && apiPref !== 'tvmaze'))) {
        let omdbUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${omdbKey}`;
        if (type === 'show') omdbUrl += '&type=series';
        if (type === 'movie') omdbUrl += '&type=movie';
        if (year) omdbUrl += `&y=${encodeURIComponent(year)}`;

        const movieRes = await fetch(omdbUrl);
        if (movieRes.ok) {
          const movieData = await movieRes.json();
          if (movieData.Response === 'True' && movieData.Poster && movieData.Poster !== 'N/A') {
            imageUrl = movieData.Poster;
          }
        }
      }
    } else if (type === 'book') {
      const bookRes = await fetch(`https://bookcover.longitood.com/bookcover?book_title=${encodeURIComponent(title)}&author_name=${encodeURIComponent(author)}`);
      if (bookRes.ok) {
        const bookData = await bookRes.json();
        if (bookData.url) {
          imageUrl = bookData.url;
        }
      }

      // Fallback: If not found, try searching with title + author as title
      if (!imageUrl) {
        const fallbackRes = await fetch(`https://bookcover.longitood.com/bookcover?book_title=${encodeURIComponent(title + ' ' + author)}`);
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (fallbackData.url) {
            imageUrl = fallbackData.url;
          }
        }
      }
    }

    if (imageUrl) {
      // Download and cache the image
      try {
        const imgRes = await fetch(imageUrl);
        if (imgRes.ok) {
          const arrayBuffer = await imgRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          fs.writeFileSync(cacheFilePath, buffer);
          return json({ url: publicUrl });
        }
      } catch (err) {
        console.error(`Download failed for ${imageUrl}:`, err);
      }
      return json({ url: imageUrl });
    } else {
      return json({ error: 'Cover not found' }, { status: 404 });
    }
  } catch (e) {
    console.error(`Error fetching cover for ${title}:`, e);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
