# Sticker Vote Web App

This project is a touchscreen-friendly voting webpage for stickers, designed for iPad and similar devices. Users can vote for their favorite sticker by tapping, and after voting, a QR code pop-up links to your Instagram account. Votes are stored locally per device.

## Features
- Touch-friendly UI for tablets
- Three sticker designs (easily customizable)
- Local storage voting (per sticker)
- QR code pop-up after voting
- No frameworks required (uses only QRCode.js for QR generation)

---

## Hosting with GitHub Pages

1. **Push your code to a GitHub repository.**

2. In your repo, go to **Settings > Pages**.

3. Under "Source", select the branch (usually `main` or `master`) and the root (`/`) folder.

4. Save. GitHub will provide a URL like `https://yourusername.github.io/your-repo/`.

5. Visit that URL to see your site live!

**Note:**
- All files (`index.html`, `main.js`, `style.css`, `qrcode.min.js`) must be in the root of your repository (or the folder you select for Pages).
- Changes may take a minute or two to appear.

---

## Previewing Locally

You can use Python’s built-in HTTP server:

1. Open Terminal and navigate to your project folder.
2. Start the server:
   - For Python 3:
     ```sh
     python3 -m http.server 8000
     ```
3. Open your browser and go to:
   ```
   http://localhost:8000
   ```

To view on another device (like your iPad), use your Mac’s local IP address instead of `localhost`.

---

## Configuring Stickers and QR Code

Open `main.js` and edit the `config` object at the top:

```js
const config = {
  stickers: {
    "Sticker 1": "https://example.com/sticker1.png",
    "Sticker 2": "https://example.com/sticker2.png",
    "Sticker 3": "https://example.com/sticker3.png"
  },
  qrUrl: "https://instagram.com/youraccount"
};
```

- **Sticker names** are the keys (e.g., "Sticker 1").
- **Sticker image URLs** are the values.
- **qrUrl** is the Instagram (or other) URL to encode in the QR code pop-up.

---

## Credits
- QR code generation by [QRCode.js](https://github.com/davidshimjs/qrcodejs)

---

## License
MIT
