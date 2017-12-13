import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'agenda-app',
  styleUrls: ['app.component.less'],
  templateUrl: 'app.component.html'

})

export class AppComponent {
  title = 'My Weekly Schedule';
  constructor(public auth: AuthService) {
  }

}
