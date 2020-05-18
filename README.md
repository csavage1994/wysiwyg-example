What's here is the WYSIWYG editor I created recently for the Vamonde content creation system. I made some minor edits while moving the code from the core repo to here which I'll list for transparency:

* Removed the Gallery option. This relied on the Vamonde S3 servers to upload the images and is low impact to the overall structure.
* Removed error messaging which relied on a notification system built into the Vamonde dashboard.
* Fixed certain dependency issues while migrating to the most recent version of the autosizing text area.
* Modified imports and global CSS to match dashboard specs, removed instance of inline style.

The core area you'll want to look at is `/src/postCreation/index.js`, which handles keyboard shortcuts, adding/deleting items, and focusing. `ContentEditor.js` handles rending the appropriate components into the draggable content area.

Other than that, please feel free to email me if there's any questions about the repo or getting it set up.

Bootstrapped with Create React App.

## Getting Started

Run `npm install` prior to `npm start` to download dependencies

### Running

`npm start` Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


