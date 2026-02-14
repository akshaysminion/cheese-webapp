import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { SearchInput } from '../components/SearchInput';
import { Select } from '../components/Select';
import { Tag } from '../components/Tag';
import type { Cheese } from '../types';
import { getAllCheeses, getFilterOptions } from '../lib/cheeseData';

export function CheeseListPage() {
  const cheeses: Cheese[] = getAllCheeses();
  const options = getFilterOptions();

  const [query, setQuery] = useState('');
  const [milk, setMilk] = useState('');
  const [country, setCountry] = useState('');
  const [texture, setTexture] = useState('');

  const filtered = useMemo((): Cheese[] => {
    const q = query.trim().toLowerCase();

    return cheeses
      .filter((c) => (milk ? String(c.milkType) === milk : true))
      .filter((c) => (country ? c.country === country : true))
      .filter((c) => (texture ? String(c.texture) === texture : true))
      .filter((c) => {
        if (!q) return true;
        const hay = [
          c.name,
          c.country,
          c.region ?? '',
          String(c.milkType),
          String(c.texture),
          c.agingTime,
          c.aroma,
          c.rindType,
          c.pasteType,
          ...(c.flavorNotes ?? []),
          ...(c.pairings?.wine ?? []),
          ...(c.pairings?.beer ?? []),
          ...(c.pairings?.fruit ?? []),
          ...(c.pairings?.bread ?? [])
        ]
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [cheeses, query, milk, country, texture]);

  const clear = () => {
    setQuery('');
    setMilk('');
    setCountry('');
    setTexture('');
  };

  const opt = (xs: string[]) => [
    { label: 'All', value: '' },
    ...xs.map((x) => ({ label: x, value: x }))
  ];

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="title">Cheese Library</h1>
          <p className="subtitle">
            Search and filter a local, curated cheese dataset.
          </p>
        </div>
        <div className="muted">{filtered.length} results</div>
      </header>

      <div className="controls">
        <SearchInput value={query} onChange={setQuery} placeholder="Name, region, pairings…" />
        <Select label="Milk type" value={milk} onChange={setMilk} options={opt(options.milkTypes)} />
        <Select label="Country" value={country} onChange={setCountry} options={opt(options.countries)} />
        <Select label="Texture" value={texture} onChange={setTexture} options={opt(options.textures)} />
        <button className="select" style={{ cursor: 'pointer', width: 'auto' }} onClick={clear} type="button">
          Clear
        </button>
      </div>

      <div className="grid">
        {filtered.map((c) => (
          <Link key={c.id} className="cardLink" to={`/cheese/${c.id}`}>
            <Card>
              <div className="cardHeader">
                <div>
                  <div className="cardTitle">{c.name}</div>
                  <div className="cardSubtitle">
                    {c.country}
                    {c.region ? ` • ${c.region}` : ''}
                  </div>
                </div>
              </div>

              <div className="tagRow">
                <Tag>{String(c.milkType)}</Tag>
                <Tag>{String(c.texture)}</Tag>
                <Tag>{c.agingTime}</Tag>
                {c.pdoPgiStatus ? <Tag>{c.pdoPgiStatus}</Tag> : null}
              </div>

              <div className="cardBody">
                <div className="muted">{c.flavorNotes.slice(0, 4).join(' • ')}</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <footer className="footer">
        <span className="muted">
          Data lives in <code>src/data/cheeses.json</code>. Fields are curated and approximate.
        </span>
      </footer>
    </div>
  );
}
