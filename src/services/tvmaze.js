export async function getShows() {
  const response = await fetch('https://api.tvmaze.com/shows');
  
  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}