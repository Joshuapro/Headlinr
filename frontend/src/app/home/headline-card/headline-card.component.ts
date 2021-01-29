import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-headline-card',
  templateUrl: './headline-card.component.html',
  styleUrls: ['./headline-card.component.scss']
})
export class HeadlineCardComponent implements OnInit {

  @Input() id: string;
  @Input() title: string;
  @Input() description: string;
  @Input() source: string;
  @Input() date: Date;
  @Input() thumbnail: string;
  @Input() tag: string;

  constructor() { }

  ngOnInit(): void {
  }

}
