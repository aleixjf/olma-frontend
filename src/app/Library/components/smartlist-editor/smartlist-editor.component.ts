//Angular
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import * as LibraryActions from 'src/app/Library/actions';

//Models
import * as LibraryState from 'src/app/Library/models/library.state';

//Services
import { NavigationService } from 'src/app/Shared/services/navigation.service';
import { RulesDTO } from 'src/app/Shared/models/rules.dto';
import { PlaylistDTO } from 'src/app/Shared/models/playlist.dto';
import { TraktorLibrary } from 'src/app/Library/models/library';
import { RuleDTO } from 'src/app/Shared/models/rule.dto';
import { PlatformIDs } from 'src/app/Shared/models/metadata/platformIDs';

//External dependencies
import * as uuid from 'uuid';

@Component({
  selector: 'app-smartlist-editor',
  templateUrl: './smartlist-editor.component.html',
  styleUrls: ['./smartlist-editor.component.scss'],
})
export class SmartlistEditorComponent {
  spinner!: boolean;
  private library: TraktorLibrary | undefined;
  smartlist!: any;

  smartlistEditor: FormGroup;
  editMode = false;
  validForm!: boolean;
  error: string | undefined;

  name: FormControl;
  type: FormControl;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
  ) {
    this.route.paramMap.subscribe((params) => {
      const uuid = params.get('uuid');
      if (uuid) {
        this.editMode = true;
      }
    });
    this.store
      .select('library')
      .subscribe((response: LibraryState.LibraryState) => {
        this.spinner = response.pending;
        this.library = response.collection;
        if (response.active) {
          this.smartlist = response.active;
        }
      });

    this.name = new FormControl(
      this.editMode ? this.smartlist?.name : '',
      Validators.required,
    );
    this.type = new FormControl(
      this.editMode && this.smartlist?.rules?.type == 'and' ? true : false,
      Validators.required,
    );
    this.smartlistEditor = this.formBuilder.group({
      name: this.name,
      type: this.type,
      rules: this.formBuilder.array([]),
    });

    this.store
      .select('library')
      .subscribe((response: LibraryState.LibraryState) => {
        if (this.editMode && response.active?.rules?.rules) {
          this.rules().clear();
          for (const rule of response.active.rules.rules) {
            this.addRule(rule);
          }
          this.updateForm();
        } else if (!this.editMode) {
          this.rules().clear();
          this.addRule();
        }
      });

    this.smartlistEditor.valueChanges.subscribe(() => this.updateForm());
  }

  fields: { description: string; value: string }[] = [
    { description: 'Grid Locked', value: 'grid_lock' },
    { description: 'Analyzed', value: 'analyzed' },
    { description: 'Artist', value: 'artist' },
    { description: 'BPM', value: 'bpm' },
    { description: 'Bitrate', value: 'bitrate' },
    { description: 'Catalog Number', value: 'catalog_number' },
    { description: 'Color', value: 'color' },
    { description: 'Comment', value: 'comments' },
    { description: 'Comment 2', value: 'comments2' },
    { description: 'Content Type', value: 'content_type' },
    { description: 'File Availability', value: 'file_availability' },
    { description: 'File Name', value: 'file_name' },
    { description: 'File Path', value: 'path' },
    { description: 'Genre', value: 'genre' },
    { description: 'Import Date', value: 'import_date' },
    { description: 'Key', value: 'key_id' },
    { description: 'Key Text', value: 'key' },
    { description: 'Label', value: 'label' },
    { description: 'Last Played', value: 'last_played' },
    { description: 'Lyrics', value: 'lyrics' },
    { description: 'Media Source', value: 'media_source' },
    { description: 'Mix', value: 'mix' },
    { description: 'Play Count', value: 'playcount' },
    { description: 'Played this session', value: 'already_played' },
    { description: 'Producer', value: 'producer' },
    { description: 'Rating', value: 'rating' },
    { description: 'Release', value: 'album' },
    { description: 'Release Date', value: 'release_date' },
    { description: 'Remixer', value: 'remixer' },
    { description: 'Time', value: 'duration' },
    { description: 'Title', value: 'title' },
    /* Extra fields */
    { description: 'Energy', value: 'energy' },
    { description: 'Popularity', value: 'popularity' },
    { description: 'Danceability', value: 'danceability' },
    { description: 'Acousticnesss', value: 'acousticness' },
    { description: 'Instrumentalness', value: 'instrumentalness' },
    { description: 'Liveness', value: 'liveness' },
    { description: 'Speechiness', value: 'speechiness' },
  ];
  comparators: { description: string; value: string }[][] = [];
  targets: { description: string; value: any }[][] = [];
  types: string[] = [];

  updateForm(): void {
    const rules: { field: string; comparator: string; target: any }[] =
      this.smartlistEditor.value.rules;
    if (!rules || rules.length == 0) {
      this.error = 'At least 1 rule is required';
      this.validForm = false;
    } else {
      this.error = undefined;
      this.validForm = true;
      this.comparators = rules.map((rule) => this.getComparators(rule.field));
      this.targets = rules.map((rule) => this.getTargets(rule.field));
      this.types = rules.map((rule) =>
        this.getTypes(rule.field, rule.comparator),
      );
    }
  }

  private getComparators(
    field: string,
  ): { description: string; value: string }[] {
    switch (field) {
      case 'grid_lock':
      case 'analyzed':
      case 'already_played':
        return [{ description: 'is', value: '==' }];
      case 'artist':
      case 'catalog_number':
      case 'comments':
      case 'comments2':
      case 'file_name':
      case 'path':
      case 'genre':
      case 'key':
      case 'label':
      case 'lyrics':
      case 'mix':
      case 'producer':
      case 'album':
      case 'remixer':
      case 'title':
        return [
          { description: 'is', value: '==' },
          { description: 'is not', value: '!=' },
          { description: 'contains', value: '%' },
          { description: 'does not contain', value: '!%' },
          { description: 'starts with', value: 'STARTS_WITH' },
          { description: 'ends with', value: 'ENDS_WITH' },
        ];
      case 'bpm':
      case 'energy':
      case 'popularity':
      case 'danceability':
      case 'acousticness':
      case 'instrumentalness':
      case 'liveness':
      case 'speechiness':
        return [
          { description: 'is', value: '==' },
          { description: 'is not', value: '!=' },
          { description: 'is approximately', value: '~' },
          { description: 'is greater than', value: '>' },
          { description: 'is equal or greater than', value: '>=' },
          { description: 'is less than', value: '<' },
          { description: 'is equal or less than', value: '<=' },
        ];
      case 'bitrate':
      case 'playcount':
      case 'rating':
      case 'duration':
        return [
          { description: 'is', value: '==' },
          { description: 'is not', value: '!=' },
          { description: 'is greater than', value: '>' },
          { description: 'is equal or greater than', value: '>=' },
          { description: 'is less than', value: '<' },
          { description: 'is equal or less than', value: '<=' },
        ];
      case 'color':
      case 'content_type':
      case 'file_availability':
      case 'media_source':
        return [
          { description: 'is', value: '==' },
          { description: 'is not', value: '!=' },
        ];
      case 'import_date':
      case 'last_played':
      case 'release_date':
        return [
          { description: 'is', value: '==' },
          { description: 'is not', value: '<>' },
          { description: 'is before', value: '<' },
          { description: 'is after', value: '>' },
          { description: 'is in the last', value: '>=' },
          { description: 'is not in the last', value: '<' },
        ];
      case 'key_id':
        return [
          { description: 'is', value: '==' },
          { description: 'is not', value: '!=' },
          { description: 'matches', value: '~' },
        ];
      default:
        return [{ description: '', value: '' }];
    }
  }

  getTargets(field: string) {
    switch (field) {
      case 'grid_lock':
        return [
          { description: 'On', value: true },
          { description: 'Off', value: false },
        ];
      case 'analyzed':
        return [
          { description: 'Yes', value: true },
          { description: 'No', value: false },
        ];
      case 'colors':
        return [
          { description: 'None', value: 0 },
          { description: 'Red', value: 1 },
          { description: 'Orange', value: 2 },
          { description: 'Yellow', value: 3 },
          { description: 'Green', value: 4 },
          { description: 'Blue', value: 5 },
          { description: 'Violet', value: 6 },
          { description: 'Magenta', value: 7 },
        ];
      case 'content_type':
        return [
          { description: 'Track', value: 0 },
          { description: 'Stem', value: 1 },
          { description: 'Remix Set', value: 2 },
          { description: 'Sample', value: 3 },
        ];
      case 'file_availability':
        return [
          { description: 'Available', value: 0 },
          { description: 'Missing', value: 1 },
          { description: 'Unknown', value: 2 },
        ];
      case 'key':
        return [
          { description: '1m', value: '1m' },
          { description: '2m', value: '2m' },
          { description: '3m', value: '3m' },
        ];
      case 'key':
        return [
          { description: 'Local Files', value: 'FILE' },
          { description: 'Beatport LINK', value: 'BPLK' },
          { description: 'Beatsource LINK', value: 'BSLK' },
        ];
      default:
        return [];
    }
  }

  private getTypes(field: string, comparator: string): string {
    switch (field) {
      case 'bpm':
      case 'playcount':
      case 'rating':
      case 'duration':
      case 'energy':
      case 'popularity':
      case 'danceability':
      case 'acousticness':
      case 'instrumentalness':
      case 'liveness':
      case 'speechiness':
        return 'number';
      case 'import_date':
      case 'last_played':
      case 'release_date':
        //if (comparator == '')
        return 'date';
      default:
        return 'text';
    }
  }

  rules(): FormArray {
    return this.smartlistEditor.get('rules') as FormArray;
  }
  newRule(rule?: RuleDTO): FormGroup {
    return this.formBuilder.group({
      field: [rule?.field, Validators.required],
      comparator: [rule?.comparator, Validators.required],
      target: [rule?.target, Validators.required],
    });
  }
  addRule(rule?: RuleDTO) {
    if (!rule) this.rules().push(this.newRule());
    else this.rules().push(this.newRule(rule));
  }
  removeRule(index: number) {
    this.rules().removeAt(index);
  }

  addSmartlist() {
    const smartlist = this.smartlistEditor.value;
    const conditions: RuleDTO[] = [];
    for (const rule of smartlist.rules) {
      const condition: RuleDTO = new RuleDTO(rule);
      conditions.push(condition);
    }
    const ids: PlatformIDs = { traktor: uuid.v4() };
    const rules: RulesDTO = new RulesDTO(
      1,
      conditions,
      smartlist.type ? 'and' : 'or',
    );

    const playlist: PlaylistDTO = new PlaylistDTO(
      smartlist.name,
      ids,
      undefined,
      rules,
      this.library?.tracks,
    );
    this.store.dispatch(LibraryActions.createPlaylist({ playlist }));
  }

  save() {
    const smartlist = this.smartlistEditor.value;
    const conditions: RuleDTO[] = [];
    for (const rule of smartlist.rules) {
      const condition: RuleDTO = new RuleDTO(rule);
      conditions.push(condition);
    }
    const rules: RulesDTO = new RulesDTO(
      this.smartlist.rules.version,
      conditions,
      smartlist.type ? 'and' : 'or',
    );

    const playlist: PlaylistDTO = new PlaylistDTO(
      smartlist.name,
      this.smartlist.ids,
      undefined,
      rules,
      this.library?.tracks,
    );
    this.store.dispatch(LibraryActions.updatePlaylist({ playlist }));
  }

  cancel() {
    this.navigationService.back();
  }
}
