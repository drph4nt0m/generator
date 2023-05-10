import { Component } from '@angular/core';
import hljs from 'highlight.js';
import { jsonrepair } from 'jsonrepair';
import { CodeJarContainer } from 'ngx-codejar';
import stringify from "json-stringify-pretty-compact";


@Component({
  selector: 'app-json-prettier',
  templateUrl: './json-prettier.component.html',
  styleUrls: ['./json-prettier.component.scss'],
})
export class JsonPrettierComponent {
  code = '{}';

  constructor() {}

  highlightMethod(editor: CodeJarContainer) {
    if (editor.textContent !== null && editor.textContent !== undefined) {
      editor.innerHTML = hljs.highlight(editor.textContent, {
        language: 'JSON',
      }).value;
    }
  }

  formatJson(): void {
    try {
      console.log(this.code);
      const repairedCode = jsonrepair(this.code);
      this.code = JSON.parse(stringify(repairedCode));
    } catch (err) {
      console.error(err);
    }
  }
}
