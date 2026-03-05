<script>
  import MediaCard from "$lib/MediaCard.svelte";
  import TextCard from "$lib/TextCard.svelte";
  import { writable } from 'svelte/store';

  let flippedCard = writable(null);

  const shows = [
    { title: "Death Note", api: "omdb" },
    { title: "Jujutsu Kaisen" },
    { title: "Stranger Things" },
    { title: "Hunter x Hunter", api: "tvmaze", musicId: "faqmNf_fZlE"},
    { title: "The Summer Hikaru Died" },
    { title: "Loki" },
    { title: "Gravity Falls" },
    { title: "The Owl House", api: "omdb" },
    { title: "Avatar: The Last Airbender", year: "2005" },
    { title: "Infinity Train" },
    { title: "Agents of S.H.I.E.L.D." },
    { title: "Where on Earth Is Carmen Sandiego?", year: "1994" },
    { title: "Carmen Sandiego", year: "2019" },
    { title: "Scott Pilgrim Takes Off" },
    { title: "Devil May Cry" },
    { title: "Rick and Morty" },
    { title: "The Flash" },
    { title: "Lab Rats", api: "omdb" },
    { title: "Sonic X" },
    { title: "Love Death + Robots" },
    { title: "Raising Dion" },
    { title: "Manifest" },
    { title: "Solar Opposite" },
    { title: "Inside Job", year: "2021" },
    { title: "Scooby-Doo! Mystery Incorporated" },
    { title: "Ben 10", year: "2005" },
    { title: "Cyberpunk Edgerunners" },
    { title: "Terror in Resonance" },
    { title: "Saiki K" },
    { title: "The Devil is a Part-Timer" },
    { title: "The Amazing Digital Circus" }
  ];

  const movies = [
    { title: "The Maze Runner" },
    { title: "Sonic the Hedgehog" },
    { title: "Sonic the Hedgehog 2" },
    { title: "Detective Pikachu" },
    { title: "The Truman Show" },
    { title: "Harry Potter and the Sorcerer's Stone" },
    { title: "Deadpool & Wolverine" },
    { title: "The Matrix" },
    { title: "A Wrinkle in Time" }
  ];

  const books = [
    { title: "The Maze Runner", author: "James Dashner" },
    { title: "Rush (The Game, #1)", author: "Eve Silver" },
    { title: "Push (The Game, #2)", author: "Eve Silver" },
    { title: "Crash (The Game, #3)", author: "Eve Silver" },
    { title: "A Wrinkle in Time", author: "Madeleine L'Engle" },
    { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling" }
  ];

  const games = [
    { title: "Minecraft" },
    { title: "Cyberpunk 2077" },
    { title: "DOOM Eternal" },
    { title: "Risk of Rain 2" },
    { title: "Geometry Dash" },
    { title: "It Takes Two", musicId: "2uK1cKPiqAs" },
    { title: "Split Fiction", musicId: "wV1JFwdp7Vg" },
    { title: "Stray" },
    { title: "Celeste", id: "40963" },
    { title: "Portal" },
    { title: "Portal 2", musicId: "st2d7IDaHic" },
    { title: "Forza Horizon 4" },
    { title: "Forza Horizon 5" },
    { title: "Castle Crashers" },
    { title: "Undertale" },
    { title: "Super Mario Galaxy" },
    { title: "Super Mario Galaxy 2" },
    { title: "Rounds" },
    { title: "SpiderHeck", id: "253637" },
    { title: "Bopl Battle" }
  ];
</script>

<svelte:head>
  <title>About Justsnoopy30</title>
  <meta name="title" content="About Justsnoopy30" />
</svelte:head>

<div class="aboutme">
  <div style="margin: 0 auto;">
    <TextCard>
      <p>Hey there - I'm Justsnoopy30<br />
      I like to write code sometimes, and I love a fair bit of media and games too</p>
      <a href="/soc" class="soc-link" tabindex=-1>?</a>
    </TextCard>
  </div>

  <section>
    <h4>Games</h4>
    <div class="media-grid">
      {#each games as game}
        <MediaCard title={game.title} id={game.id} musicId={game.musicId} type="game" flippedCard={flippedCard} />
      {/each}
    </div>
  </section>

  <section>
    <h4>Shows</h4>
    <div class="media-grid">
      {#each shows as show}
        <MediaCard title={show.title} year={show.year} api={show.api} musicId={show.musicId} type="show" flippedCard={flippedCard} />
      {/each}
    </div>
  </section>

  <section>
    <h4>Movies</h4>
    <div class="media-grid">
      {#each movies as movie}
        <MediaCard title={movie.title} year={movie.year} api={movie.api} musicId={movie.musicId} type="movie" flippedCard={flippedCard} />
      {/each}
    </div>
  </section>

  <section>
    <h4>Books</h4>
    <div class="media-grid">
      {#each books as book}
        <MediaCard title={book.title} author={book.author} type="book" flippedCard={flippedCard} />
      {/each}
    </div>
  </section>
</div>

<style>
  .aboutme {
    display: flex;
    flex-direction: column;
    justify-content: center;
		font-size: 150%;
    flex-grow: 1;
    gap: 2rem;
  }

  .soc-link {
    opacity: 0;
    transition: opacity 0.3s ease;
    color: var(--color-gray-600);
    text-decoration: none;
    font-size: 1rem;
    position: absolute;
    bottom: 0;
    right: 7px;
  }

  .soc-link:hover {
    opacity: 1;
  }

  hr {
    margin: 1rem 0;
    color: inherit;
    border: 0;
    border-top: 1px solid;
    opacity: 0.25;
    width: 50%;
  }

  h4 {
    font-weight: bold;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    color: #eee;
  }

  .media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
    width: 100%;
  }

  /* Responsive adjustments for phones if needed */
  @media (max-width: 600px) {
    .media-grid {
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 1rem;
    }
  }
</style>


