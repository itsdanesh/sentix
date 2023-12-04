# Browser extension

This project contains the source code of a browser extension.

## Features

The extension currently colors all tweets either green or red, depending on whether the label is positive or negative. The label is switched between positive and negative every 800ms, and there is no backend integration yet. Nonetheless, the coloring is functional.

## Development

During development, in order to install the extension, the following steps need to be taken:

1. Clone the repository.
2. Go to `chrome://extensions`. (Google Chrome only for now, to be updated for Firefox)
3. Enable Developer mode. (Top-right corner)
4. Press the `Load unpacked` button, that appeared in the top-left corner.
5. Navigate to `apps/extension` and press `Select folder`.
6. The extension is now installed locally.

Now, if contents of the folder have been changed and the extension needs to be updated, that can be achieved in two ways:
1. Go to `chrome://extensions`.
2.  - Press the `Update` button in the top-left corner, updating all extensions.
    - Press the reload icon button (counterclockwise arrow) on the extension itself to only reload the specific one.
## Production

In production, we hope to get the extension approved on the Chrome Web Store. That way, that will be a one-click installation. (and the link will be provided here)