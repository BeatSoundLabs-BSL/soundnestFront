import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle-navigation',
  templateUrl: './toggle-navigation.component.html',
  styleUrls: ['./toggle-navigation.component.scss']
})
export class ToggleNavigationComponent {
  @Input() tabs: Array<{
    id: string;
    label: string;
    disabled?: boolean;
  }> = [];

  @Input() activeTabId: string = '';
  @Output() tabChange = new EventEmitter<string>();

  setActiveTab(tabId: string): void {
    if (this.activeTabId !== tabId) {
      this.activeTabId = tabId;
      this.tabChange.emit(tabId);
    }
  }

  isActive(tabId: string): boolean {
    return this.activeTabId === tabId;
  }
}
