// Configuration object for stickers and QR code
const config = {
  stickers: {
    "Sticker 1": "https://example.com/sticker1.png",
    "Sticker 2": "https://example.com/sticker2.png",
    "Sticker 3": "https://example.com/sticker3.png"
  },
  qrUrl: "https://instagram.com/youraccount",
  instagramTitle: "@youraccount",
  followMessage: "Follow us on Instagram for more updates!"
};

// Dynamically create the sticker voting UI
function createStickerVoteUI(config) {
  const container = document.createElement('div');
  container.className = 'sticker-container';

  Object.entries(config.stickers).forEach(([name, url]) => {
    const stickerDiv = document.createElement('div');
    stickerDiv.className = 'sticker';
    stickerDiv.tabIndex = 0;
    stickerDiv.setAttribute('role', 'button');
    stickerDiv.setAttribute('aria-label', `Vote for ${name}`);

    const img = document.createElement('img');
    img.src = url;
    img.alt = name;
    img.className = 'sticker-img';

    const label = document.createElement('div');
    label.className = 'sticker-label';
    label.textContent = name;

    const votes = getVotes(name);
    const voteCount = document.createElement('div');
    voteCount.className = 'vote-count';
    voteCount.textContent = `Votes: ${votes}`;
    voteCount.id = `votes-${name}`;

    // Add a vote bar visualization
    const voteBarContainer = document.createElement('div');
    voteBarContainer.className = 'vote-bar-container';
    const voteBar = document.createElement('div');
    voteBar.className = 'vote-bar';
    voteBar.id = `vote-bar-${name}`;
    voteBarContainer.appendChild(voteBar);

    stickerDiv.appendChild(img);
    stickerDiv.appendChild(label);
    stickerDiv.appendChild(voteCount);
    stickerDiv.appendChild(voteBarContainer);

    stickerDiv.addEventListener('click', () => handleVote(name, config.qrUrl));
    stickerDiv.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleVote(name, config.qrUrl);
      }
    });

    container.appendChild(stickerDiv);
  });

  document.body.appendChild(container);
}

// Get votes from localStorage
function getVotes(stickerName) {
  return parseInt(localStorage.getItem(`votes_${stickerName}`) || '0', 10);
}

// Set votes in localStorage
function setVotes(stickerName, count) {
  localStorage.setItem(`votes_${stickerName}` , count);
}

// Update all vote bars based on current votes
function updateVoteBars() {
  const stickers = Object.keys(config.stickers);
  const votes = stickers.map(getVotes);
  const totalVotes = votes.reduce((a, b) => a + b, 0) || 1;
  stickers.forEach((name, i) => {
    const bar = document.getElementById(`vote-bar-${name}`);
    if (bar) {
      const percent = (votes[i] / totalVotes) * 100;
      bar.style.width = percent + '%';
      bar.textContent = votes[i] > 0 ? `${Math.round(percent)}%` : '';
    }
  });
}

// Handle voting logic
function handleVote(stickerName, qrUrl) {
  let votes = getVotes(stickerName) + 1;
  setVotes(stickerName, votes);
  document.getElementById(`votes-${stickerName}`).textContent = `Votes: ${votes}`;
  updateVoteBars();
  showQRPopup(qrUrl);
}

// Show QR code popup for 5 seconds
function showQRPopup(qrUrl) {
  let popup = document.getElementById('qr-popup');
  let contentBox, progressBar;
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'qr-popup';
    popup.className = 'qr-popup';
    // White content box
    contentBox = document.createElement('div');
    contentBox.className = 'qr-content-box';
    // Instagram title
    const instaTitle = document.createElement('div');
    instaTitle.className = 'qr-title';
    instaTitle.textContent = config.instagramTitle || '';
    contentBox.appendChild(instaTitle);
    // QR code image
    const qrImg = document.createElement('img');
    qrImg.id = 'qr-img';
    contentBox.appendChild(qrImg);
    // Friendly follow message
    const msg = document.createElement('div');
    msg.className = 'qr-msg';
    msg.textContent = config.followMessage || '';
    contentBox.appendChild(msg);
    // Progress bar
    progressBar = document.createElement('div');
    progressBar.className = 'qr-progress-bar';
    progressBar.id = 'qr-progress-bar';
    contentBox.appendChild(progressBar);
    popup.appendChild(contentBox);
    document.body.appendChild(popup);
  } else {
    contentBox = popup.querySelector('.qr-content-box');
    progressBar = document.getElementById('qr-progress-bar');
    // Update title and message in case config changed
    const instaTitle = contentBox.querySelector('.qr-title');
    if (instaTitle) instaTitle.textContent = config.instagramTitle || '';
    const msg = contentBox.querySelector('.qr-msg');
    if (msg) msg.textContent = config.followMessage || '';
  }
  // Generate QR code
  generateQRCode(qrUrl, document.getElementById('qr-img'));
  popup.style.display = 'flex';
  // Animate progress bar
  progressBar.style.transition = 'none';
  progressBar.style.width = '100%';
  setTimeout(() => {
    progressBar.style.transition = 'width 5s linear';
    progressBar.style.width = '0%';
  }, 10);
  setTimeout(() => {
    popup.style.display = 'none';
    progressBar.style.transition = 'none';
    progressBar.style.width = '100%';
  }, 5000);
}

// Generate QR code using QRCode.js (https://davidshimjs.github.io/qrcodejs/)
function generateQRCode(url, imgElement) {
  // Remove any previous QR code canvas
  if (imgElement.nextSibling) imgElement.nextSibling.remove();
  // Use QRCode.js to generate a data URL
  const qr = new QRCode(document.createElement('div'), {
    text: url,
    width: 200,
    height: 200,
    correctLevel: QRCode.CorrectLevel.H
  });
  setTimeout(() => {
    const canvas = qr._oDrawing._elCanvas;
    imgElement.src = canvas.toDataURL();
  }, 100); // Wait for QR code to render
}

// On load
window.addEventListener('DOMContentLoaded', () => {
  createStickerVoteUI(config);
  updateVoteBars();
});
