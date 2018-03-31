import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-code-editor-demo',
  templateUrl: './code-editor-demo.component.html',
  styleUrls: ['./code-editor-demo.component.css']
})
export class CodeEditorDemoComponent implements OnInit {
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

  constructor() {}

  ngOnInit() {}
}
