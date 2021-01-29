import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss'],
})
export class PreferenceComponent implements OnInit {
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(private _apiService: ApiService, private _router: Router) {}

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 12,
    };

    this.dropdownList = [
      { item_id: 1, item_text: 'politics' },
      { item_id: 2, item_text: 'sports' },
      { item_id: 3, item_text: 'tech' },
      { item_id: 4, item_text: 'world' },
      { item_id: 5, item_text: 'travel' },
      { item_id: 6, item_text: 'covid' },
      { item_id: 7, item_text: 'weather' },
      { item_id: 8, item_text: 'health' },
      { item_id: 9, item_text: 'economy' },
      { item_id: 10, item_text: 'art' },
      { item_id: 11, item_text: 'business' },
      { item_id: 12, item_text: 'science' },
    ];

    this._apiService.getPreference().subscribe((res) => {
      const selected = [];
      res.forEach((pref) => {
        this.dropdownList.forEach((list_item) => {
          console.log(list_item.item_text, pref);
          if (list_item.item_text === pref) {
            selected.push(list_item);
          }
        });
      });
      this.selectedItems = selected;
    });
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  saveTag(): void {
    var userPref = {
      tags: [''],
    };

    // Saving user's favorite tags in userPref
    this.selectedItems.forEach((element) => {
      userPref.tags.push(element.item_text);
    });

    this._apiService.setPreference(userPref).subscribe((res) => {});
    this._router.navigate(['/home']);
  }
}
