export const TSCONFIG = `{
  "compilerOptions": {
    "baseUrl": ".",
    "module": "ES2020",
    "lib": ["DOM","ES2020"],
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "outDir": "./dist",
    "paths": {
      "https://unpkg.com/browser-nativefs": ["./node_modules/browser-nativefs/index.d.ts"]
    },
    "sourceMap": true
  },
  "include": ["src/**/*", "index.ts"],
  "exclude": ["node_modules"]
}`;

export const RECURSION = `{
  "name": "jmod-get-started",
  "version": "1.0.0",
  "lockfileVersion": 1,
  "requires": false,
  "dev": {
    "numeros": [42, 666, 1986],
    "inner": {
      "array": [
        "ke se yo",
        "pepe"
      ],
      "locro": null
    }
  }
}`;


export const BIGARRAY = `{
  "dev": {
    "objArray": [
      { "a": "hola", "before": 1, "mindfuck": [6, 7, 8] }
    ]
  }
}`;