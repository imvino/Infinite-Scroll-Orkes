import React, { useState, useEffect } from 'react';
import { FixedSizeList } from 'react-window';

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  });
  return `${formattedDate} at ${formattedTime}`;
}

function renderFeedItem(item) {
  return (
    <div className="feed-item">
      <div className="feed-item-image">
        <img src={item?.field_photo_image_section} alt={item?.title} />
      </div>
      <div className="feed-item-content">
        <h2 className="feed-item-title">{item?.title}</h2>
        <p className="feed-item-date">{formatDate(item?.last_update)}</p>
      </div>
    </div>
  );
}

function App() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = () => {
    fetch(
      `https://3m1x3h-3000.preview.csb.app/photo-gallery-feed-page/page/${page}`
    )
      .then((response) => response.json())
      .then((data) => {
        const newItems = data.nodes.map(({ node }) => node);
        setItems([...items, ...newItems]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loadMoreItems = () => {
    setPage(page + 1);
    loadPhotos();
  };

  const Row = ({ index, style }) => {
    const item = items[index];
    return <div style={style}>{renderFeedItem(item)}</div>;
  };

  return (
    <div className="App">
      {items.length === 0 &&
        'loading... If the page did not load in 10sec check the api url'}
      <FixedSizeList
        height={980}
        width={600}
        itemCount={items.length}
        itemSize={300}
        onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => {
          if (visibleStopIndex === items.length - 2) {
            loadMoreItems();
          }
        }}
      >
        {Row}
      </FixedSizeList>
    </div>
  );
}

export default App;
