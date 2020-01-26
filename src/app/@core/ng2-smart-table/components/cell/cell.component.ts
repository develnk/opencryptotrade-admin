import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Grid } from '../../lib/grid';
import { Cell } from '../../lib/data-set/cell';
import { Row } from '../../lib/data-set/row';

@Component({
  selector: 'ng2-smart-table-cell',
  template: `
    <table-cell-view-mode *ngIf="!isInEditing" [cell]="cell"></table-cell-view-mode>
  `,
})
export class CellComponent {

  @Input() grid: Grid;
  @Input() row: Row;
  @Input() editConfirm: EventEmitter<any>;
  @Input() createConfirm: EventEmitter<any>;
  @Input() isNew: boolean;
  @Input() cell: Cell;
  @Input() inputClass = '';
  @Input() mode = 'inline';
  @Input() isInEditing = false;

  @Output() edited = new EventEmitter<any>();

  onEdited(event: any) {
    if (this.isNew) {
      this.grid.create(this.grid.getNewRow(), this.createConfirm);
    } else {
      this.grid.save(this.row, this.editConfirm);
    }
  }
}
