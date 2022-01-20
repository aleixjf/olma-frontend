//Angular
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { A11yModule } from '@angular/cdk/a11y';

//Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

//Components
import { LibraryComponent } from './components/library/library.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { SmartlistEditorComponent } from './components/smartlist-editor/smartlist-editor.component';
//import { PlaylistRulesComponent } from './components/playlist/rules/playlist-rules.component';
import { TrackEditorComponent } from './components/track-editor/track-editor.component';
//import { ColumnSorterComponent } from './components/playlist/column-sorter/column-sorter.component';
import { SidePanelSearchBoxComponent } from './components/side-panel/search-box/search-box.component';
import { SidePanelAddButtonComponent } from './components/side-panel/add-button/add-playlist.component';
import { SidePanelTreeComponent } from './components/side-panel/side-panel-tree/side-panel-tree.component';

//Services
import { NavigationService } from '../Shared/services/navigation.service';

//External modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResizableModule } from 'angular-resizable-element';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';

@NgModule({
  declarations: [
    LibraryComponent,
    PlaylistComponent,
    SmartlistEditorComponent,
    //PlaylistRulesComponent,
    TrackEditorComponent,
    //ColumnSorterComponent,
    SidePanelSearchBoxComponent,
    SidePanelAddButtonComponent,
    SidePanelTreeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    DragDropModule,
    ScrollingModule,
    A11yModule,
    //Angular Material
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
    MatTreeModule,
    MatTooltipModule,
    MatMenuModule,
    MatSlideToggleModule,
    //External Modules
    NgbModule,
    ResizableModule,
    TableVirtualScrollModule,
  ],
  exports: [PlaylistComponent],
  providers: [DatePipe, NavigationService],
})
export class LibraryModule {}
