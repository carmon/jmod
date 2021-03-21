JMOD: a minimalistic editor for JSON files
==========================================

The purpose of this nodejs app is to be a quick JSON -> HTML FORM -> JSON.
It uses [browser-nativefs](https://github.com/GoogleChromeLabs/browser-nativefs) lib for opening and saving the files.

Some features:

- Grabs a JSON and render inputs for each variable in pure HTML form
- Renders a textarea with the preview of the result
- Filename selector, if none selected save button should be a save-to-file browser form

Current version:
    
- Uses browser file loader and file saver for editing JSON data files 
- Vercel online version [here](https://jmod.vercel.app/)

## Commands

- **npm run build** to build TS to JS
- **npm start** to run a http-server with JSON editor