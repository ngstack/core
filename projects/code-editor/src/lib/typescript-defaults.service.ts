import { Injectable } from '@angular/core';

@Injectable()
export class TypescriptDefaultsService {
  setup(monaco: any): void {
    if (!monaco) {
      return;
    }

    const defaults = monaco.languages.typescript.typescriptDefaults;

    defaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES6,
      module: 'commonjs',
      noEmit: true,
      noLib: true,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      allowNonTsExtensions: true,
      declaration: true,
      lib: ['es2017', 'dom'],
      baseUrl: '.',
      paths: {}
    });

    defaults.setMaximumWorkerIdleTime(-1);
    defaults.setEagerModelSync(true);

    /*
    defaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true
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

    // undocumented API
    const existing = monaco.languages.typescript.typescriptDefaults.getExtraLibs();

    libs.forEach(lib => {
      if (!existing[lib.path]) {
        // TODO: needs performance improvements, recreates its worker each time
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          lib.content,
          lib.path
        );
      }
    });
  }

  addLibraryPaths(monaco: any, paths: { [key: string]: string } = {}): void {
    if (!monaco) {
      return;
    }

    const compilerOptions = monaco.languages.typescript.typescriptDefaults.getCompilerOptions();
    compilerOptions.paths = compilerOptions.paths || {};

    Object.keys(paths).forEach(key => {
      compilerOptions.paths[key] = [paths[key]];
    });
  }
}
