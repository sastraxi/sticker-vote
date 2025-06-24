// Configuration object for stickers and QR code
const config = {
  stickers: {
    "Chemically Imbalanced": "img/chemically imbalanced sticker w cutlines pink.png",
    "Organized Chaos": "img/organized chaos sticker w cutlines.png",
    "Women in STEM": "img/Women in STEM sticker w cutlines.png"
  },
  qrUrl: "https://instagram.com/stickerhardlyknowher",
  instagramTitle: "@stickerhardlyknowher",
  followMessage: "Follow us on Instagram for more updates!",
  qrPopupDuration: 5000 // duration in milliseconds
};

// Utility to sanitize sticker names for use as IDs
function sanitizeId(name) {
  return name.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

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
    voteCount.id = `votes-${sanitizeId(name)}`;

    // Add a vote bar visualization
    const voteBarContainer = document.createElement('div');
    voteBarContainer.className = 'vote-bar-container';
    const voteBar = document.createElement('div');
    voteBar.className = 'vote-bar';
    voteBar.id = `vote-bar-${sanitizeId(name)}`;
    voteBarContainer.appendChild(voteBar);

    stickerDiv.appendChild(img);
    stickerDiv.appendChild(label);
    stickerDiv.appendChild(voteCount);
    stickerDiv.appendChild(voteBarContainer);

    stickerDiv.addEventListener('click', () => handleVote(name, config.qrUrl));
    stickerDiv.addEventListener('keydown', (e) => {
      // Prevent voting with keyboard if QR popup is open
      const qrPopup = document.getElementById('qr-popup');
      if (qrPopup && qrPopup.style.display !== 'none') return;
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
    const bar = document.getElementById(`vote-bar-${sanitizeId(name)}`);
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
  document.getElementById(`votes-${sanitizeId(stickerName)}`).textContent = `Votes: ${votes}`;
  updateVoteBars();
  showQRPopup(qrUrl);
}

// Show QR code popup for 5 seconds
function showQRPopup(qrUrl) {
  let popup = document.getElementById('qr-popup');
  let contentBox, progressBar;
  const duration = config.qrPopupDuration || 5000;
  // Always remove and recreate the follow message and progress bar to ensure they update and animate every time
  if (popup) {
    // delete the existing popup if it exists
    popup.remove();
  }

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
    msg.innerText = config.followMessage || '';
    console.log(config.followMessage)
    contentBox.appendChild(msg);
    // Progress bar
    progressBar = document.createElement('div');
    progressBar.className = 'qr-progress-bar';
    progressBar.id = 'qr-progress-bar';
    contentBox.appendChild(progressBar);
    popup.appendChild(contentBox);
    document.body.appendChild(popup);

  // Generate QR code
  generateQRCode(qrUrl, contentBox.querySelector('#qr-img'));
  popup.style.display = 'flex';
  // Animate progress bar
  progressBar.style.transition = 'none';
  progressBar.style.width = '100%';
  // Force reflow to restart animation
  void progressBar.offsetWidth;
  setTimeout(() => {
    progressBar.style.transition = `width ${duration}ms linear`;
    progressBar.style.width = '0%';
  }, 10);
  setTimeout(() => {
    popup.style.display = 'none';
    progressBar.style.transition = 'none';
    progressBar.style.width = '100%';
  }, duration);
}

// Generate QR code using QRCode.js (https://davidshimjs.github.io/qrcodejs/)
function generateQRCode(url, imgElement) {
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

  // --- HOTFIX: Add missing CSS for vote bar and QR message if not present ---
  const style = document.createElement('style');
  style.innerHTML = `
    .vote-bar-container {
      width: 100%;
      height: 16px;
      background: #eee;
      border-radius: 8px;
      margin-top: 8px;
      margin-bottom: 4px;
      overflow: hidden;
      position: relative;
    }
    .vote-bar {
      height: 100%;
      background: linear-gradient(90deg, #ff7e5f, #feb47b);
      border-radius: 8px 0 0 8px;
      transition: width 0.5s;
      color: #222;
      font-weight: bold;
      text-align: right;
      padding-right: 8px;
      font-size: 1em;
      line-height: 16px;
      min-width: 0;
      white-space: nowrap;
    }
    .qr-msg {
      margin: 12px 0 8px 0;
      font-size: 1.1em;
      color: #222;
      text-align: center;
      font-weight: 500;
      display: block;
    }
  `;
  document.head.appendChild(style);
});
