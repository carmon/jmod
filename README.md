JMOD: a minimalistic editor for JSON files
==========================================

The purpose of this nodejs app is to be a quick JSON -> HTML FORM -> JSON.
It uses [browser-nativefs](https://github.com/GoogleChromeLabs/browser-nativefs) lib for opening and saving the files.

---
**CHECK ONLINE**

[Test online on vercel](https://jmod.vercel.app/)
---

### Current version:

- Uses browser file loader and file saver for editing JSON data files 
- Grabs a JSON or an example if specified on query string
- Form view: render inputs for each variable in pure HTML form
- JSON preview: renders a preview of the result

## Commands

- **npm run build** to build TS to JS
- **npm start** to run a http-server with JSON editor