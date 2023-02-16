const page = 1;
let loading = false;

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric"
  });
  return `${formattedDate} at ${formattedTime}`;
}

function renderFeedItem(item) {
  const feedItem = document.createElement("div");
  feedItem.classList.add("feed-item");
  feedItem.innerHTML = `
    <div class="feed-item-image">
      <img src="${item.field_photo_image_section}" alt="${item.title}">
    </div>
    <div class="feed-item-content">
      <h2 class="feed-item-title">${item.title}</h2>
      <p class="feed-item-date">${formatDate(item.last_update)}</p>
    </div>
  `;
  return feedItem;
}

function loadPhotos() {
  if (loading) {
    return;
  }

  loading = true;

  fetch(`/photo-gallery-feed-page/page/${page}`)
    .then((response) => response.json())
    .then((data) => {
      data.nodes.forEach(({ node }) => {
        const feedItem = renderFeedItem(node);
        document.getElementById("feed").appendChild(feedItem);
      });

      loading = false;
    })
    .catch((error) => {
      console.error(error);
      loading = false;
    });
}

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const shouldLoadPhotos =
    scrollTop + clientHeight >= scrollHeight - 5 && !loading;
  if (shouldLoadPhotos) {
    loadPhotos();
  }
});

loadPhotos();
