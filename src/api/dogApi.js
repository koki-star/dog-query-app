const API_BASE = 'https://dogapi.dog/api/v2';

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchBreeds() {
  const json = await request('/breeds');
  return json.data ?? [];
}

export async function fetchBreedById(id) {
  const json = await request(`/breeds/${encodeURIComponent(id)}`);
  return json.data ?? null;
}

export async function fetchFacts() {
  const json = await request('/facts');
  return json.data ?? [];
}

export async function fetchGroups() {
  const json = await request('/groups');
  return json.data ?? [];
}

export async function fetchInvalidEndpoint() {
  return request('/does-not-exist');
}
