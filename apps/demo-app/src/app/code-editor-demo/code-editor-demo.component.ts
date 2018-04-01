import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-code-editor-demo',
  templateUrl: './code-editor-demo.component.html',
  styleUrls: ['./code-editor-demo.component.css']
})
export class CodeEditorDemoComponent {
  themes = [
    { name: 'Visual Studio', value: 'vs' },
    { name: 'Visual Studio Dark', value: 'vs-dark' },
    { name: 'High Contrast Dark', value: 'hc-black' }
  ];

  @Input() activeTheme = 'vs';
  @Input() lang = 'javascript';
  @Input() code = 'var x = 1;';
  @Input() readOnly = false;

  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    }
  };

  onCodeChanged(value) {
    // console.log('CODE', this.code);
  }
}
