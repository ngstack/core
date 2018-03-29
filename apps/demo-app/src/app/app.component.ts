import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @Input()
  lang = 'javascript';

  @Input()
  code = 'var x = 1;';

  @Input()
  readOnly = false;

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
