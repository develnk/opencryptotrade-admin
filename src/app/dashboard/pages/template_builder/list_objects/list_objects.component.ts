import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ListType } from '../enum/list_type';
import { ListFolderModel } from '../model/list_folder.model';
import { ListObjectsModel } from '../model/list_objects.model';
import { TemplateBuilderService } from '../template_builder.service';
import { BackendService } from '../../../../@core/services/backend.service';
import { FolderModel } from '../model/folder.model';
import { ListItemModel } from '../model/list_item.model';
import { ListBaseBlockModel } from '../model/list_base_block.model';
import { BaseBlockModel } from '../model/base_block.model';
import { BlockType } from '../enum/block_type';
import { ListTemplateModel } from '../model/list_template.model';

@Component({
  selector: 'app-list-objects',
  templateUrl: './list_objects.component.html',
  styleUrls: ['./list_objects.component.scss']
})
export class ListObjectsComponent implements OnInit {

  listObjects: ListObjectsModel;
  isTemplate = false;
  isBlock = false;
  isBlockBuilder = false;
  isFolder = false;
  accordionExpanded = false;
  accordionDisabled = false;
  loading = false;
  folders: ListFolderModel[];
  folderInput: FormControl;
  showAddFolder: boolean;
  showEditFolder: boolean;
  showCancelFolder: boolean;
  currentFolderEdit: ListFolderModel;

  constructor(private templateBuilderService: TemplateBuilderService, private dataService: BackendService) {

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

      case ListType.BlockBuilder:
        this.printBlockBuilder();
        break;
    }
  }

  printBlocks() {
    this.isTemplate = false;
    this.isBlockBuilder = false;
    this.isFolder = false;
    this.accordionExpanded = false;
    this.accordionDisabled = false;
    this.isBlock = true;
  }

  printBlockBuilder() {
    this.isFolder = false;
    this.accordionExpanded = false;
    this.accordionDisabled = false;
    this.isTemplate = false;
    this.isBlockBuilder = true;
  }

  printTemplates() {
    this.isFolder = false;
    this.isBlockBuilder = false;
    this.isBlock = false;
    this.isTemplate = true;
  }

  printFolders() {
    this.isBlockBuilder = false;
    this.isTemplate = false;
    this.isBlock = false;
    this.isFolder = true;
    this.folders = [];
    this.listObjects.data[0].object.map((folder: ListFolderModel) => {
      this.folders.push(folder);
    });
    this.templateBuilderService.changeCurrentDefaultBlockBuilder();
  }

  removeFolder(folder: ListFolderModel) {
    this.loading = true;
    this.dataService.deleteFolder(folder.id).subscribe((response: string) => {
      if (response === 'true') {
        const index = this.folders.indexOf(folder);
        this.folders.splice(index, 1);
        this.loading = false;
      }
    });
  }

  editSelectedFolder(folder: ListFolderModel) {
    this.folderInput.setValue(folder.name);
    this.currentFolderEdit = folder;
    this.showEditFolder = true;
    this.showCancelFolder = true;
    this.showAddFolder = false;
  }

  addFolder() {
    this.loading = true;
    const folderName = this.folderInput.value;
    this.dataService.createFolder(folderName).subscribe((response: FolderModel) => {
      this.currentFolderEdit = new ListFolderModel(response.id, response.name);
      this.folders.push(this.currentFolderEdit);
      this.folderInput.setValue('');
      this.loading = false;
    });
  }

  editFolder() {
    this.loading = true;
    const folderToUpdate = this.currentFolderEdit;
    folderToUpdate.name = this.folderInput.value;
    this.dataService.updateFolder(folderToUpdate).subscribe((response: FolderModel) => {
      this.currentFolderEdit.name = response.name;
      this.loading = false;
    });
  }

  cancelFolder() {
    this.folderInput.setValue('');
    this.currentFolderEdit = null;
    this.showEditFolder = false;
    this.showCancelFolder = false;
    this.showAddFolder = true;
  }

  editBaseBlock(block: ListBaseBlockModel) {
    const blockModel: BaseBlockModel = new BaseBlockModel();
    blockModel.id = block.id;
    switch (block.type) {
      case 'HEADER':
        blockModel.type = BlockType.HEADER;
        break;

      case 'BODY':
        blockModel.type = BlockType.BODY;
        break;

      case 'FOOTER':
        blockModel.type = BlockType.FOOTER;
        break;

      default:
        blockModel.type = BlockType.BODY;
        break;
    }
    blockModel.html = block.html;
    this.templateBuilderService.changeCurrentBlockBuilderObject(blockModel);
  }

  editTemplate(template: ListTemplateModel) {
    this.templateBuilderService.changeCurrentTemplate(template);
  }

  copyBaseBlock(block: ListItemModel) {
    this.loading = true;
    if (this.listObjects.type === ListType.Block) {
      this.templateBuilderService.addBlockToTemplate(block as ListBaseBlockModel);
    }
    else if (this.listObjects.type === ListType.Template) {

    }

    // Todo change this behaviour.
    setTimeout(() => this.loading = false, 500);
  }

}
