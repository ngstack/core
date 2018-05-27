import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TypescriptDefaultsService } from './typescript-defaults.service';
import { JavascriptDefaultsService } from './javascript-defaults.service';

declare const monaco: any;

export interface TypingsInfo {
  entryPoints: { [key: string]: string };
  files: Array<{
    content: string;
    name: string;
    url: string;
    path: string;
  }>;
}

@Injectable()
export class CodeEditorService {
  // baseUrl = 'assets/monaco';
  baseUrl = 'https://unpkg.com/monaco-editor/min';

  // typingsWorkerUrl = 'assets/workers/typings-worker.js';
  typingsWorkerUrl = 'https://unpkg.com/@ngstack/code-editor/workers/typings-worker.js';

  typingsLoaded = new Subject<TypingsInfo>();

  private typingsWorker: Worker;

  constructor(
    private typescriptDefaults: TypescriptDefaultsService,
    private javascriptDefaults: JavascriptDefaultsService
  ) {}

  private loadTypingsWorker(): Worker {
    if (!this.typingsWorker && (<any>window).Worker) {
      if (this.typingsWorkerUrl.startsWith('http')) {
        const proxyScript = `importScripts('${this.typingsWorkerUrl}');`;
        const proxy = URL.createObjectURL(
          new Blob([proxyScript], { type: 'text/javascript' })
        );
        this.typingsWorker = new Worker(proxy);
      } else {
        this.typingsWorker = new Worker(this.typingsWorkerUrl);
      }
      this.typingsWorker.addEventListener('message', e => {
        this.typingsLoaded.next(e.data);
      });
    }
    return this.typingsWorker;
  }

  loadTypings(dependencies: string[]) {
    if (dependencies && dependencies.length > 0) {
      const worker = this.loadTypingsWorker();
      if (worker) {
        worker.postMessage({
          dependencies
        });
      }
    }
  }

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
            importScripts('${this.baseUrl}/vs/base/worker/workerMain.js');
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
          this.typescriptDefaults.setup(monaco);
          this.javascriptDefaults.setup(monaco);
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
