import React from 'react';
import './starRating.css'; // You'll need to create a corresponding CSS file

const StarRating = ({ rating }) => {
  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="star full-star">★</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="star half-star">★</span>);
      } else {
        stars.push(<span key={i} className="star empty-star">★</span>);
      }
    }

    return stars;
  };

  return (
    <div className="star-rating">
      {renderStars()}
    </div>
  );
};

export default StarRating;