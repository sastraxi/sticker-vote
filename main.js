// Configuration object for stickers and QR code
const config = {
  stickers: {
    "Sticker 1": "https://example.com/sticker1.png",
    "Sticker 2": "https://example.com/sticker2.png",
    "Sticker 3": "https://example.com/sticker3.png"
  },
  qrUrl: "https://instagram.com/youraccount"
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

    stickerDiv.appendChild(img);
    stickerDiv.appendChild(label);
    stickerDiv.appendChild(voteCount);

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

// Handle voting logic
function handleVote(stickerName, qrUrl) {
  let votes = getVotes(stickerName) + 1;
  setVotes(stickerName, votes);
  document.getElementById(`votes-${stickerName}`).textContent = `Votes: ${votes}`;
  showQRPopup(qrUrl);
}

// Show QR code popup for 5 seconds
function showQRPopup(qrUrl) {
  let popup = document.getElementById('qr-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'qr-popup';
    popup.className = 'qr-popup';
    const qrImg = document.createElement('img');
    qrImg.id = 'qr-img';
    popup.appendChild(qrImg);
    const msg = document.createElement('div');
    msg.className = 'qr-msg';
    msg.textContent = 'Scan to follow us on Instagram!';
    popup.appendChild(msg);
    document.body.appendChild(popup);
  }
  // Generate QR code
  generateQRCode(qrUrl, document.getElementById('qr-img'));
  popup.style.display = 'flex';
  setTimeout(() => {
    popup.style.display = 'none';
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
});
