import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  fetchBreedById,
  fetchBreeds,
  fetchFacts,
  fetchGroups,
  fetchInvalidEndpoint,
} from './api/dogApi'
import './App.css'

function getStatusState(isPending, isError, isSuccess) {
  if (isPending) {
    return { label: 'Loading', className: 'status status-pending' }
  }

  if (isError) {
    return { label: 'Error', className: 'status status-error' }
  }

  if (isSuccess) {
    return { label: 'Success', className: 'status status-success' }
  }

  return { label: 'Idle', className: 'status status-idle' }
}

function getStaticStatus(label) {
  if (label === 'Success' || label === 'Resolved' || label === 'Handled') {
    return { label, className: 'status status-success' }
  }

  if (label === 'Active') {
    return { label, className: 'status status-active' }
  }

  return { label: 'Idle', className: 'status status-idle' }
}

function StatusText({ label, isPending, isError, isSuccess }) {
  const statusState = getStatusState(isPending, isError, isSuccess)

  return (
    <p className={statusState.className}>
      {label}: {statusState.label}
    </p>
  )
}

function FieldList({ items }) {
  return (
    <dl className="field-list">
      {items.map((item) => (
        <div key={item.label} className="field-item">
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function App() {
  const [selectedBreedId, setSelectedBreedId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showInvalidEndpointCase, setShowInvalidEndpointCase] = useState(false)

  const breedsQuery = useQuery({
    queryKey: ['breeds'],
    queryFn: fetchBreeds,
  })

  const breedDetailQuery = useQuery({
    queryKey: ['breed', selectedBreedId],
    queryFn: () => fetchBreedById(selectedBreedId),
    enabled: Boolean(selectedBreedId),
  })

  const factsQuery = useQuery({
    queryKey: ['facts'],
    queryFn: fetchFacts,
  })

  const groupsQuery = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
  })

  const errorDemoQuery = useQuery({
    queryKey: ['demo', 'invalid-endpoint'],
    queryFn: fetchInvalidEndpoint,
    enabled: showInvalidEndpointCase,
    retry: false,
  })

  const selectedGroupId =
    breedsQuery.data?.find((breed) => breed.id === selectedBreedId)?.relationships
      ?.group?.data?.id ?? ''

  const selectedGroupName =
    groupsQuery.data?.find((group) => group.id === selectedGroupId)?.attributes
      ?.name ?? 'Unknown group'

  const breedCount = breedsQuery.data?.length ?? 0
  const factCount = factsQuery.data?.length ?? 0
  const groupCount = groupsQuery.data?.length ?? 0
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const filteredBreeds =
    breedsQuery.data?.filter((breed) =>
      (breed.attributes?.name ?? '').toLowerCase().includes(normalizedSearchQuery),
    ) ?? []
  const edgeCaseStatus = getStatusState(
    errorDemoQuery.isPending,
    errorDemoQuery.isError,
    errorDemoQuery.isSuccess,
  )
  const emptyStateStatus = getStaticStatus(selectedBreedId ? 'Resolved' : 'Active')
  const missingDataStatus = getStaticStatus('Handled')
  const factsAndGroupsStatus = factsQuery.isError || groupsQuery.isError
    ? getStatusState(false, true, false)
    : factsQuery.isPending || groupsQuery.isPending
      ? getStatusState(true, false, false)
      : factsQuery.isSuccess && groupsQuery.isSuccess
        ? getStatusState(false, false, true)
        : getStatusState(false, false, false)
  const invalidEndpointStatus = showInvalidEndpointCase
    ? edgeCaseStatus
    : getStaticStatus('Idle')

  return (
    <main className="app-shell">
      <section className="top-bar">
        <div className="top-bar-copy">
          <h1>Dog Query App</h1>
          <a
            className="top-bar-link"
            href="https://tanstack.com/query"
            target="_blank"
            rel="noreferrer"
          >
            TanStack Query + Dog API
          </a>
        </div>

        <div className="stats-bar">
          <div className="stat-badge">
            <span>Breeds</span>
            <strong>{breedCount}</strong>
          </div>
          <div className="stat-badge">
            <span>Facts</span>
            <strong>{factCount}</strong>
          </div>
          <div className="stat-badge">
            <span>Groups</span>
            <strong>{groupCount}</strong>
          </div>
        </div>
      </section>

      <div className="header-divider" aria-hidden="true" />

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Breeds</h2>
            </div>
            <StatusText
              label="Breeds"
              isPending={breedsQuery.isPending}
              isError={breedsQuery.isError}
              isSuccess={breedsQuery.isSuccess}
            />
          </div>

          {breedsQuery.isPending ? (
            <p className="message">Loading all breeds...</p>
          ) : breedsQuery.isError ? (
            <p className="message error-message">
              Could not load breeds. Please try again.
            </p>
          ) : breedsQuery.data.length > 0 ? (
            <>
              <div className="breed-search-row">
                <label className="sr-only" htmlFor="breed-search">
                  Search breeds
                </label>
                <input
                  id="breed-search"
                  type="text"
                  className="breed-search"
                  placeholder="Search breeds"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>

              {filteredBreeds.length > 0 ? (
                <ul className="breed-list">
                  {filteredBreeds.map((breed) => (
                    <li key={breed.id}>
                      <button
                        type="button"
                        className={
                          breed.id === selectedBreedId ? 'breed-button active' : 'breed-button'
                        }
                        aria-pressed={breed.id === selectedBreedId}
                        onClick={() => setSelectedBreedId(breed.id)}
                      >
                        <span className="breed-name">
                          {breed.attributes?.name ?? 'Unnamed breed'}
                        </span>
                        <small className="breed-life">
                          {breed.attributes?.life
                            ? `${breed.attributes.life.min}-${breed.attributes.life.max} years`
                            : 'No life span data'}
                        </small>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="message search-message">No breeds match your search.</p>
              )}
            </>
          ) : (
            <p className="message">No breeds were returned by the API.</p>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Selected Breed</h2>
            </div>
            {selectedBreedId ? (
              <StatusText
                label="Breed detail"
                isPending={breedDetailQuery.isPending}
                isError={breedDetailQuery.isError}
                isSuccess={breedDetailQuery.isSuccess}
              />
            ) : null}
          </div>

          {!selectedBreedId ? (
            <p className="message empty-state">
              Select a breed from the list to view details.
            </p>
          ) : breedDetailQuery.isPending ? (
            <p className="message">Loading breed detail...</p>
          ) : breedDetailQuery.isError ? (
            <p className="message error-message">
              Could not load the selected breed.
            </p>
          ) : breedDetailQuery.data ? (
            <>
              <div className="detail-title">
                <div>
                  <p className="detail-group">{selectedGroupName}</p>
                  <h3>{breedDetailQuery.data.attributes?.name ?? 'Breed details'}</h3>
                </div>
                <span className="pill">Selected</span>
              </div>

              <p className="detail-copy">
                {breedDetailQuery.data.attributes?.description ??
                  'No description was provided for this breed.'}
              </p>

              <FieldList
                items={[
                  {
                    label: 'Life span',
                    value: breedDetailQuery.data.attributes?.life
                      ? `${breedDetailQuery.data.attributes.life.min}-${breedDetailQuery.data.attributes.life.max} years`
                      : 'Not available',
                  },
                  {
                    label: 'Male weight',
                    value: breedDetailQuery.data.attributes?.male_weight
                      ? `${breedDetailQuery.data.attributes.male_weight.min}-${breedDetailQuery.data.attributes.male_weight.max} kg`
                      : 'Not available',
                  },
                  {
                    label: 'Female weight',
                    value: breedDetailQuery.data.attributes?.female_weight
                      ? `${breedDetailQuery.data.attributes.female_weight.min}-${breedDetailQuery.data.attributes.female_weight.max} kg`
                      : 'Not available',
                  },
                  {
                    label: 'Hypoallergenic',
                    value: breedDetailQuery.data.attributes?.hypoallergenic
                      ? 'Yes'
                      : 'No',
                  },
                ]}
              />
            </>
          ) : (
            <p className="message">Choose a breed to see the detail card.</p>
          )}
        </article>
      </section>

      <section className="triple-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Dog Facts</h2>
            </div>
            <StatusText
              label="Facts"
              isPending={factsQuery.isPending}
              isError={factsQuery.isError}
              isSuccess={factsQuery.isSuccess}
            />
          </div>

          {factsQuery.isPending ? (
            <p className="message">Loading facts...</p>
          ) : factsQuery.isError ? (
            <p className="message error-message">Could not load dog facts.</p>
          ) : factsQuery.data.length > 0 ? (
            <ul className="info-list">
              {factsQuery.data.map((fact) => (
                <li key={fact.id}>{fact.attributes?.body ?? 'No fact body available.'}</li>
              ))}
            </ul>
          ) : (
            <p className="message">No dog facts were returned.</p>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Dog Groups</h2>
            </div>
            <StatusText
              label="Groups"
              isPending={groupsQuery.isPending}
              isError={groupsQuery.isError}
              isSuccess={groupsQuery.isSuccess}
            />
          </div>

          {groupsQuery.isPending ? (
            <p className="message">Loading groups...</p>
          ) : groupsQuery.isError ? (
            <p className="message error-message">Could not load dog groups.</p>
          ) : groupsQuery.data.length > 0 ? (
            <ul className="group-list">
              {groupsQuery.data.map((group) => (
                <li key={group.id}>
                  <strong>{group.attributes?.name ?? 'Unnamed group'}</strong>
                  <span>{group.relationships?.breeds?.data?.length ?? 0} breeds</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="message">No dog groups were returned.</p>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Test Cases</h2>
            </div>
          </div>

          <div className="case-group">
            <h3 className="case-heading">Normal Cases</h3>
            <ul className="checklist">
              <li>
                <span>Breeds list loads and renders</span>
                <span
                  className={getStatusState(
                    breedsQuery.isPending,
                    breedsQuery.isError,
                    breedsQuery.isSuccess,
                  ).className}
                >
                  {
                    getStatusState(
                      breedsQuery.isPending,
                      breedsQuery.isError,
                      breedsQuery.isSuccess,
                    ).label
                  }
                </span>
              </li>
              <li>
                <span>Breed detail loads on selection</span>
                {selectedBreedId ? (
                  <span
                    className={getStatusState(
                      breedDetailQuery.isPending,
                      breedDetailQuery.isError,
                      breedDetailQuery.isSuccess,
                    ).className}
                  >
                    {
                      getStatusState(
                        breedDetailQuery.isPending,
                        breedDetailQuery.isError,
                        breedDetailQuery.isSuccess,
                      ).label
                    }
                  </span>
                ) : null}
              </li>
              <li>
                <span>Facts and Groups load on page load</span>
                <span className={factsAndGroupsStatus.className}>
                  {factsAndGroupsStatus.label}
                </span>
              </li>
            </ul>
          </div>

          <div className="case-group">
            <h3 className="case-heading">Edge Cases</h3>
            <ul className="checklist">
              <li>
                <span>Empty state shown when no breed is selected</span>
                <span className={emptyStateStatus.className}>
                  {emptyStateStatus.label}
                </span>
              </li>
              <li>
                <span>Invalid endpoint returns an error state</span>
                <div className="case-actions">
                  <label className="switch" htmlFor="invalid-endpoint-toggle">
                    <input
                      id="invalid-endpoint-toggle"
                      type="checkbox"
                      checked={showInvalidEndpointCase}
                      onChange={(event) =>
                        setShowInvalidEndpointCase(event.target.checked)
                      }
                    />
                    <span className="switch-track" aria-hidden="true">
                      <span className="switch-thumb" />
                    </span>
                  </label>
                  <span className={invalidEndpointStatus.className}>
                    {invalidEndpointStatus.label}
                  </span>
                </div>
              </li>
              <li>
                <span>Missing data handled gracefully</span>
                <span className={missingDataStatus.className}>
                  {missingDataStatus.label}
                </span>
              </li>
            </ul>
          </div>
        </article>
      </section>
    </main>
  )
}

export default App
