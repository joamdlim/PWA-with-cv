/*
 Copyright 2021 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
 const workerURL = new URL('./worker.js', import.meta.url);
 const worker = new SharedWorker(workerURL);
 const workerPort = worker.port;
 import { wrap } from 'comlink';
 import { openDB } from 'idb';

 if ('serviceWorker' in navigator) {
   window.addEventListener('load', async () => {
     try {
       let reg;
       if (import.meta.env.DEV) {
         reg = await navigator.serviceWorker.register('/service-worker.js', {
           type: 'module',
         });
       } else {
         reg = await navigator.serviceWorker.register('/service-worker.js');
       }
       console.log('Service worker registered! 😎', reg);
     } catch (err) {
       console.log('😥 Service worker registration failed: ', err);
     }
   });
 }
 
 window.addEventListener('DOMContentLoaded', async () => {
   const db = await openDB('settings-store', 1, {
     upgrade(db) {
       db.createObjectStore('settings');
     },
   });
 
   const { Editor } = await import('./app/editor.js');
   const editor = new Editor(document.body);
 
   const { Menu } = await import('./app/menu.js');
   new Menu(document.querySelector('.actions'), editor);
 
   const workerURL = new URL('./worker.js', import.meta.url);
   const worker = new SharedWorker(workerURL);
   const compiler = wrap(worker.port);
 
   editor.onUpdate(async (content) => {
     await saveContentToDatabase(content);
     await compiler.set(content);
     console.log("Content successfully set in the compiler.");
   });
  
   const defaultText = `# Welcome to PWA Edit!\n\nTo leave the editing area, press the \`esc\` key, then \`tab\` or \`shift+tab\`.`;
   editor.setContent((await db.get('settings', 'content')) || defaultText);
   
   const { NightMode } = await import('./app/night-mode.js');
   new NightMode(
     document.querySelector('#mode'),
     async (mode) => {
       editor.setTheme(mode);
       await db.put('settings', mode, 'night-mode');
     },
     await db.get('settings', 'night-mode'),
   );
 
   const { Install } = await import('./lib/install.js');
   new Install(document.querySelector('#install'));
 });
 
 // Example function to simulate saving content to the database
 function saveContentToDatabase(content) {
   return new Promise((resolve, reject) => {
     setTimeout(() => {
       console.log("Content saved to the database.");
       resolve();
     }, 1000);
   });
 }
 window.addEventListener('DOMContentLoaded', async () => {

  const link = document.createElement('a');
  link.textContent = 'My CV';
  link.href = 'https://joamdlim.github.io/cv/';
  
  // Append the hyperlink to an existing element or the document body
  document.body.appendChild(link);
  
  // Your existing code...
});