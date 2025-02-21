import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CypherComponent } from "./cypher/cypher.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CypherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'millennial-cypher';
}
