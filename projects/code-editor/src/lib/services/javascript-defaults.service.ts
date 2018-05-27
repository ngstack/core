import { Injectable } from '@angular/core';

@Injectable()
export class JavascriptDefaultsService {
  setup(monaco: any): void {
    if (!monaco) {
      return;
    }

    const defaults = monaco.languages.typescript.javascriptDefaults;

    defaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES6,
      module: 'commonjs',
      allowNonTsExtensions: true,
      baseUrl: '.',
      paths: {}
    });

    defaults.setMaximumWorkerIdleTime(-1);
    defaults.setEagerModelSync(true);

    /*
    defaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    });
    */
  }

  addExtraLibs(
    monaco: any,
    libs: Array<{ path: string; content: string }> = []
  ): void {
    if (!monaco || !libs || libs.length === 0) {
      return;
    }

    const defaults = monaco.languages.typescript.javascriptDefaults;

    // undocumented API
    const existing = defaults.getExtraLibs();

    libs.forEach(lib => {
      if (!existing[lib.path]) {
        // TODO: needs performance improvements, recreates its worker each time
        defaults.addExtraLib(lib.content, lib.path);
      }
    });
  }

  addLibraryPaths(monaco: any, paths: { [key: string]: string } = {}): void {
    if (!monaco) {
      return;
    }

    const defaults = monaco.languages.typescript.javascriptDefaults;
    const compilerOptions = defaults.getCompilerOptions();
    compilerOptions.paths = compilerOptions.paths || {};

    Object.keys(paths).forEach(key => {
      compilerOptions.paths[key] = [paths[key]];
    });
  }
}
