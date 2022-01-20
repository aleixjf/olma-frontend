//Angular
import { Component } from '@angular/core';
import {
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
import { TrackDTO } from 'src/app/Shared/models/track.dto';
import { NavigationService } from 'src/app/Shared/services/navigation.service';
import { Label } from 'src/app/Shared/models/metadata/label';
import { AlbumDTO } from 'src/app/Shared/models/album.dto';
import { Artists } from 'src/app/Shared/models/metadata/artists';

@Component({
  selector: 'app-track-editor',
  templateUrl: './track-editor.component.html',
  styleUrls: ['./track-editor.component.scss'],
})
export class TrackEditorComponent {
  private uuid!: string;
  spinner!: boolean;

  track!: TrackDTO;

  trackEditor: FormGroup;
  validForm!: boolean;

  /* Track information */
  title: FormControl;
  name: FormControl;
  mix: FormControl;
  version: FormControl;

  artists: FormControl;
  featurers: FormControl;
  remixers: FormControl;
  composers: FormControl;
  lyricists: FormControl;

  album: FormControl;
  track_number: FormControl;
  disc_number: FormControl;

  bpm: FormControl;
  key: FormControl;
  genre: FormControl;

  release_date: FormControl;
  publish_date: FormControl;

  /* Extra information */
  isrc: FormControl;
  label: FormControl;
  catalog_number: FormControl;
  copyright: FormControl;
  terms: FormControl;

  rating: FormControl;
  comments: FormControl;

  lyrics: FormControl;
  language: FormControl;

  /* Library information */
  playcount: FormControl;

  /* DJ information */
  energy: FormControl;

  /* Traktor metadata */
  comments2: FormControl;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
  ) {
    this.route.paramMap.subscribe((params) => {
      const uuid = params.get('uuid');
      if (uuid) {
        this.uuid = uuid;
        this.store.dispatch(LibraryActions.getTrack({ trackId: uuid }));
      }
      //else this.navigationService.back();
    });

    this.store
      .select('library')
      .subscribe((response: LibraryState.LibraryState) => {
        this.spinner = response.pending;
        if (response.editor) this.track = response.editor;
      });

    /* Track information */
    this.title = new FormControl(this.track?.title, Validators.required);
    this.name = new FormControl(this.track?.name);
    this.mix = new FormControl(this.track?.mix);
    this.version = new FormControl(this.track?.version);

    this.artists = new FormControl(this.track?.artist);
    this.featurers = new FormControl(this.track?.artists_dto?.featurers);
    this.remixers = new FormControl(this.track?.remixer);
    this.composers = new FormControl(this.track?.composer);
    this.lyricists = new FormControl(this.track?.lyricist);

    this.album = new FormControl(this.track?.album);
    this.track_number = new FormControl(this.track?.track_number);
    this.disc_number = new FormControl(this.track?.disc_number);

    this.bpm = new FormControl(this.track?.bpm);
    this.key = new FormControl(this.track?.key);
    this.genre = new FormControl(this.track?.genre);

    this.release_date = new FormControl(this.track?.release_date);
    this.publish_date = new FormControl(this.track?.publish_date);

    /* Extra information */
    this.isrc = new FormControl(this.track?.isrc);
    this.label = new FormControl(this.track?.label);
    this.catalog_number = new FormControl(this.track?.catalog_number);
    this.copyright = new FormControl(this.track?.copyright);
    this.terms = new FormControl(this.track?.terms);

    this.rating = new FormControl(this.track?.rating);
    this.comments = new FormControl(this.track?.comments);

    this.lyrics = new FormControl(this.track?.lyrics);
    this.language = new FormControl(this.track?.language);

    /* Library information */
    this.playcount = new FormControl(this.track?.playcount);

    /* DJ information */
    this.energy = new FormControl(this.track?.energy);

    /* Traktor metadata */
    this.comments2 = new FormControl(this.track.comments2);

    this.trackEditor = this.formBuilder.group({
      title: this.title,
      name: this.name,
      mix: this.mix,
      version: this.version,

      artists: this.artists,
      featurers: this.featurers,
      remixers: this.remixers,
      composers: this.composers,
      lyricists: this.lyricists,

      album: this.album,
      track_number: this.track_number,
      disc_number: this.disc_number,

      bpm: this.bpm,
      key: this.key,
      genre: this.genre,

      release_date: this.release_date,
      publish_date: this.publish_date,

      isrc: this.isrc,
      label: this.label,
      catalog_number: this.catalog_number,
      copyright: this.copyright,
      terms: this.terms,

      rating: this.rating,
      comments: this.comments,

      lyrics: this.lyrics,
      language: this.language,
    });
  }

  cancel() {
    this.navigationService.back();
  }

  saveChanges() {
    if (this.trackEditor.invalid) {
      this.validForm = false;
      return;
    } else {
      this.validForm = true;

      const updatedArtists = new Artists(
        this.artists.value,
        undefined,
        undefined,
        this.remixers.value,
        undefined,
        this.composers.value,
        undefined,
        this.lyricists.value,
      );
      const updatedAlbum: AlbumDTO = {
        ...this.track.album_dto,
        name: this.album.value,
      };
      const updatedLabel: Label = {
        ...this.track.label_dto,
        name: this.label.value,
      };

      const updatedTrack: TrackDTO = new TrackDTO(
        this.uuid,
        this.track.ids,
        this.track.urls,
        this.title.value,
        this.name.value,
        this.mix.value,
        this.version.value,
        updatedArtists,
        updatedAlbum,
        this.track_number.value,
        this.disc_number.value,
        this.track.duration,
        this.bpm.value,
        this.key.value,
        undefined,
        this.genre.value,
        this.release_date.value,
        this.publish_date.value,
        this.isrc.value,
        updatedLabel,
        this.catalog_number.value,
        this.copyright.value,
        this.terms.value,
        this.rating.value,
        this.comments.value,
        this.lyrics.value,
        this.language.value,
        this.track.path,
        this.track.volume,
        this.track.volume_id,
        this.track.dir,
        this.track.file_name,
        this.track.file_type,
        this.track.file_size,
        this.track.encoder_info,
        this.track.bitrate,
        this.track.peak_db,
        this.track.perceived_db,
        this.track.analyzed_db,
        this.track.import_date,
        this.track.last_played,
        this.playcount.value,
        new Date(),
        'user',
        this.track.grid_lock,
        this.track.grid_locked_date,
        this.track.gridMarkers,
        this.track.hotcues,
        this.track.loops,
        this.energy.value,
        this.track.audio_id,
        this.comments2.value,
        this.track.flags,
        this.track.cover_art_id,
        this.track.bpm_quality,
        this.track.stems,
        this.track.popularity,
        this.track.danceability,
        this.track.valence,
        this.track.acousticness,
        this.track.instrumentalness,
        this.track.liveness,
        this.track.speechiness,
        this.track.time_signature,
      );

      if (this.uuid) {
        this.store.dispatch(
          LibraryActions.updateTrack({ track: updatedTrack }),
        );
      }
    }
  }

  /*
  loadNext() {}

  loadPrevious() {}
  */
}
