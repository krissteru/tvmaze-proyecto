import { getShowWithEpisodes } from './services/tvmaze.js';

const appContainer = document.querySelector('#app') || document.body;

async function renderApp() {
  try {
    appContainer.innerHTML = '<p>Cargando información de la serie...</p>';

    const showData = await getShowWithEpisodes('139');
    const episodes = showData._embedded?.episodes || [];

    // Agrupación universal compatible con cualquier navegador
    const seasonsGrouped = episodes.reduce((acc, episode) => {
      const season = episode.season;
      if (!acc[season]) {
        acc[season] = [];
      }
      acc[season].push(episode);
      return acc;
    }, {});

    displayShow(showData, seasonsGrouped);
  } catch (error) {
    console.error('Error al cargar la aplicación:', error);
    appContainer.innerHTML = `<p>Ocurrió un error al cargar la serie: ${error.message}</p>`;
  }
}

function displayShow(show, seasons) {
  let html = `
    <header style="padding: 20px; font-family: sans-serif;">
      <h1>${show.name}</h1>
      ${show.image ? `<img src="${show.image.medium}" alt="${show.name}" style="border-radius: 8px;">` : ''}
      <div style="margin-top: 10px; max-width: 600px;">${show.summary || 'Sin descripción disponible.'}</div>
    </header>
    <main style="padding: 20px; font-family: sans-serif;">
  `;

  for (const [seasonNumber, episodeList] of Object.entries(seasons)) {
    html += `
      <section style="margin-bottom: 30px;">
        <h2>Temporada ${seasonNumber}</h2>
        <div style="display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px;">
    `;

    episodeList.forEach((ep) => {
      html += `
        <article style="min-width: 200px; border: 1px solid #ccc; border-radius: 6px; padding: 10px; background: #f9f9f9;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px;">Episodio ${ep.number}: ${ep.name}</h4>
          ${ep.image ? `<img src="${ep.image.medium}" alt="${ep.name}" style="width: 100%; border-radius: 4px;">` : ''}
        </article>
      `;
    });

    html += `
        </div>
      </section>
    `;
  }

  html += `</main>`;
  appContainer.innerHTML = html;
}

renderApp();