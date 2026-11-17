const API_BASE = 'https://dogapi.dog/api/v2';

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

// The API sends breeds in pages, so this loads every page and joins them.
export async function fetchBreeds() {
  const first = await request('/breeds?page[size]=100');
  const lastPage = first.meta?.pagination?.last ?? 1;
  const others = await Promise.all(
    Array.from({ length: lastPage - 1 }, (_, i) =>
      request(`/breeds?page[size]=100&page[number]=${i + 2}`),
    ),
  );
  return [first, ...others].flatMap((json) => json.data ?? []);
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
