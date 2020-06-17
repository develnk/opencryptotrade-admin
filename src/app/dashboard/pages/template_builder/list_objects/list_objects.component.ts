import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ListGroupModel } from '../model/list_group.model';
import { ListType } from '../enum/list_type';
import { ListFolderModel } from '../model/list_folder.model';
import { ListObjectsModel } from '../model/list_objects.model';
import { TemplateBuilderService } from '../template_builder.service';
import { BackendService } from '../../../../@core/services/backend.service';
import { FolderModel } from '../model/folder.model';

@Component({
  selector: 'app-list-objects',
  templateUrl: './list_objects.component.html',
  styleUrls: ['./list_objects.component.scss']
})
export class ListObjectsComponent implements OnInit {

  listObjects: ListObjectsModel;
  isTemplate = false;
  isBlock = false;
  isFolder = false;
  accordionExpanded = false;
  accordionDisabled = false;
  folders: ListFolderModel[];
  folderInput: FormControl;
  showAddFolder: boolean;
  showEditFolder: boolean;
  showCancelFolder: boolean;
  currentFolderEdit: ListFolderModel;

  constructor(private templateBuilderService: TemplateBuilderService, private dataService: BackendService,) {

  }

  ngOnInit(): void {
    this.folderInput = new FormControl('');
    this.showAddFolder = true;
    this.showEditFolder = false;
    this.showCancelFolder = false;
    this.currentFolderEdit = null;
    this.templateBuilderService.currentListObject.subscribe( currentListObject => {
      this.listObjects = currentListObject;
      this.listObjectsChanges();
    });
  }

  listObjectsChanges(): void {
    switch (this.listObjects.type) {
      case ListType.Block:
        this.printBlocks();
        break;
      case ListType.Template:
        this.printTemplates();
        break;

      case ListType.Folder:
        this.printFolders();
        break;
    }
  }

  printBlocks() {

  }

  printTemplates() {

  }

  printFolders() {
    this.isFolder = true;
    this.accordionExpanded = true;
    this.accordionDisabled = true;
    this.folders = [];
    this.listObjects.data[0].object.map((folder: ListFolderModel) => {
      this.folders.push(folder);
    });
  }

  removeFolder(folder: ListFolderModel) {
    this.dataService.deleteFolder(folder.id).subscribe((response: string) => {
      if (response === 'true') {
        const index = this.folders.indexOf(folder);
        this.folders.splice(index, 1);
      }
    })
  }

  editSelectedFolder(folder: ListFolderModel) {
    this.folderInput.setValue(folder.name);
    this.currentFolderEdit = folder;
    this.showEditFolder = true;
    this.showCancelFolder = true;
    this.showAddFolder = false;
  }

  addFolder() {
    const folderName = this.folderInput.value;
    this.dataService.createFolder(folderName).subscribe((response: FolderModel) => {
      this.currentFolderEdit = new ListFolderModel(response.id, response.name);
      this.folders.push(this.currentFolderEdit);
      this.folderInput.setValue('');
    });
  }

  editFolder() {
    const folderToUpdate = this.currentFolderEdit;
    folderToUpdate.name = this.folderInput.value;
    this.dataService.updateFolder(folderToUpdate).subscribe((response: FolderModel) => {
      this.currentFolderEdit.name = response.name;
    });
  }

  cancelFolder() {
    this.folderInput.setValue('');
    this.currentFolderEdit = null;
    this.showEditFolder = false;
    this.showCancelFolder = false;
    this.showAddFolder = true;
  }
}