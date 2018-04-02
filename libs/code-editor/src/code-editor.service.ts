import { Injectable } from '@angular/core';

@Injectable()
export class CodeEditorService {
  // baseUrl = 'assets/monaco';
  baseUrl = 'https://unpkg.com/monaco-editor@0.11.1/min';

  loadEditor(): Promise<any> {
    return new Promise((resolve, reject) => {
      const onGotAmdLoader = () => {
        (<any>window).require.config({
          paths: { vs: `${this.baseUrl}/vs` }
        });

        if (this.baseUrl.startsWith('http')) {
          const proxyScript = `
            self.MonacoEnvironment = {
              baseUrl: "${this.baseUrl}"
            };
            importScripts("${this.baseUrl}/vs/base/worker/workerMain.js");
          `;
          const proxy = URL.createObjectURL(
            new Blob([proxyScript], { type: 'text/javascript' })
          );
          window['MonacoEnvironment'] = {
            getWorkerUrl: function() {
              return proxy;
            }
          };
        }

        (<any>window).require(['vs/editor/editor.main'], () => {
          resolve();
        });
      };

      if (!(<any>window).require) {
        const loaderScript = document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = `${this.baseUrl}/vs/loader.js`;
        loaderScript.addEventListener('load', onGotAmdLoader);
        document.body.appendChild(loaderScript);
      } else {
        onGotAmdLoader();
      }
    });
  }
}
