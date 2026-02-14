import { Link, useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { LazyCheeseHero3D } from '../components/LazyCheeseHero3D';
import { Tag } from '../components/Tag';
import { getCheeseById } from '../lib/cheeseData';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="row">
      <div className="rowLabel">{label}</div>
      <div className="rowValue">{value || '—'}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  if (!items?.length) return <span className="muted">—</span>;
  return (
    <ul className="list">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}

export function CheeseDetailPage() {
  const { slug } = useParams();
  const cheese = slug ? getCheeseById(slug) : undefined;

  if (!cheese) {
    return (
      <div className="page">
        <Card>
          <h1 className="title" style={{ fontSize: 22 }}>Cheese not found</h1>
          <p className="subtitle">That cheese doesn’t exist in the local dataset.</p>
          <div style={{ paddingTop: 10 }}>
            <Link className="link" to="/library">
              ← Back to library
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="title">{cheese.name}</h1>
          <p className="subtitle">
            {cheese.country}
            {cheese.region ? ` • ${cheese.region}` : ''}
          </p>
        </div>
        <Link className="link" to="/library">
          ← All cheeses
        </Link>
      </header>

      <LazyCheeseHero3D compact />

      <div className="detailGrid">
        <Card>
          <div className="sectionTitle">Overview</div>
          <div className="tagRow" style={{ paddingTop: 0 }}>
            <Tag>{String(cheese.milkType)}</Tag>
            <Tag>{String(cheese.texture)}</Tag>
            <Tag>{cheese.agingTime}</Tag>
            {cheese.pdoPgiStatus ? <Tag>{cheese.pdoPgiStatus}</Tag> : null}
          </div>

          <div style={{ paddingTop: 12 }}>
            <Row label="Rind type" value={cheese.rindType} />
            <Row label="Paste type" value={cheese.pasteType} />
            <Row label="Fat %" value={typeof cheese.fatPercent === 'number' ? `${cheese.fatPercent}%` : ''} />
            <Row label="Allergens" value={cheese.allergens.join(', ')} />
            <Row label="Vegetarian" value={cheese.vegetarianSuitability} />
          </div>
        </Card>

        <Card>
          <div className="sectionTitle">Tasting</div>
          <Row label="Aroma" value={cheese.aroma} />
          <Row label="Flavor notes" value={''} />
          <div style={{ paddingTop: 8 }}>
            <List items={cheese.flavorNotes} />
          </div>

          <div className="sectionTitle" style={{ paddingTop: 14 }}>
            Pairings
          </div>
          <Row label="Wine" value={''} />
          <List items={cheese.pairings.wine} />
          <Row label="Beer" value={''} />
          <List items={cheese.pairings.beer} />
          <Row label="Fruit" value={''} />
          <List items={cheese.pairings.fruit} />
          <Row label="Bread" value={''} />
          <List items={cheese.pairings.bread} />

          <div className="sectionTitle" style={{ paddingTop: 14 }}>
            Storage & serving
          </div>
          <Row label="How to store" value={cheese.storage} />
          <Row label="Serving" value={cheese.servingSuggestions} />
        </Card>
      </div>
    </div>
  );
}
