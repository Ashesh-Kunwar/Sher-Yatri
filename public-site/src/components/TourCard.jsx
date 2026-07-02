import { Link } from "react-router-dom";

export default function TourCard({ tour }) {
  return (
    <Link to={`/tours/${tour.slug}`} className="tour-card">
      <div className="tour-card-image">
        {tour.images?.[0] ? (
          <img src={tour.images[0]} alt={tour.title} />
        ) : (
          <div className="tour-card-placeholder">{tour.category}</div>
        )}
      </div>
      <div className="tour-card-body">
        <h3>{tour.title}</h3>
        <p className="muted-small">{tour.shortDescription}</p>
        <div className="tour-card-meta">
          <span>{tour.durationDays} days</span>
          <span className="dot-sep">&middot;</span>
          <span className="capitalize">{tour.difficulty}</span>
        </div>
        <div className="tour-card-price">
          {tour.currency} {tour.price?.toLocaleString()}
        </div>
      </div>
    </Link>
  );
}
