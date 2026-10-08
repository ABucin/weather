import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'wa-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [
    NgIcon
  ]
})
export class CardComponent {
  inPast = input(false);
  code = input('');
  minTemp = input('');
  maxTemp = input('');
  precipitation = input('');
  dateTime = input('');
}
