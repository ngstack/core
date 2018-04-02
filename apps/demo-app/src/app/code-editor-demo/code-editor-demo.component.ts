import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-code-editor-demo',
  templateUrl: './code-editor-demo.component.html',
  styleUrls: ['./code-editor-demo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CodeEditorDemoComponent {
  themes = [
    { name: 'Visual Studio', value: 'vs' },
    { name: 'Visual Studio Dark', value: 'vs-dark' },
    { name: 'High Contrast Dark', value: 'hc-black' }
  ];

  @Input() activeTheme = 'vs';
  @Input() code = 'var x = 1;';
  @Input() readOnly = false;

  @ViewChild('file') fileInput: ElementRef;

  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    }
  };

  onCodeChanged(value) {
    // console.log('CODE', this.code);
  }

  onLoadClicked() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file = files.item(0);
      const reader = new FileReader();

      reader.onloadend = () => {
        this.code = reader.result;
      };
      reader.readAsText(file);
    }
  }
}
