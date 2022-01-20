import { TrackDTO } from './track.dto';
import * as Helpers from 'src/app/Shared/services/helpers/Helpers';

export class RuleDTO {
  query: string;
  field: keyof TrackDTO;
  comparator: string;
  target: any;
  xml?: {
    field: string;
    value: string;
  };

  constructor(
    query:
      | string
      | {
          field: keyof TrackDTO;
          comparator: string;
          target: any;
        },
  ) {
    if (typeof query === 'string') {
      this.query = query;
      //Parse query
      const rule = this.query.split(' ');
      this.field = this.field_to_dto(rule[0]);
      this.comparator = rule[1];
      this.target = this.target_to_dto(rule[0], rule.slice(2).join(' '));
      this.xml = {
        field: rule[0],
        value: rule.slice(2).join(' '),
      };
    } else {
      this.field = query.field;
      this.comparator = query.comparator;
      const xml_field = this.field_to_xml(this.field);
      this.target = this.target_to_dto(xml_field, query.target);
      //Build query
      this.xml = {
        field: xml_field,
        value: this.target_to_xml(this.field, this.target),
      };
      this.query = `${this.xml.field} ${this.comparator} ${this.xml.value}`;
    }
  }

  get filter(): any {
    switch (this.comparator) {
      case '==':
        return (a: any, b: any) => a === b;
      case '<>':
        return (a: any, b: any) => a !== b;
      case '>=':
        return (a: any, b: any) => a >= b;
      case '<=':
        return (a: any, b: any) => a <= b;
      case '>':
        return (a: any, b: any) => a > b;
      case '<':
        return (a: any, b: any) => a < b;
      case '~': //5% margin?
        return (a: number, b: number) => a >= b * 0.99 && a <= b * 1.01;
      case '%': //contains
        return (a: string, b: string) =>
          a.toLowerCase().includes(b.toLowerCase());
      case '!%': //doesn't contain
        return (a: string, b: string) =>
          !a.toLowerCase().includes(b.toLowerCase());
      case 'STARTS_WITH':
        return (a: string, b: string) =>
          a.toLowerCase().startsWith(b.toLowerCase());
      case 'ENDS_WITH':
        return (a: string, b: string) =>
          a.toLowerCase().endsWith(b.toLowerCase());
      default:
        return (a: any, b: any) => true;
    }
  }

  private field_to_dto(field: string): keyof TrackDTO {
    switch (field) {
      case '$ANALYSISLOCKED':
        return 'grid_lock';
      case '$ANALYZED':
        return 'analyzed';
      case '$ARTIST':
        return 'artist';
      case '$BPM':
        return 'bpm';
      case '$BITRATE':
        return 'bitrate';
      case '$CATALOG_NO':
        return 'catalog_number';
      case '$COLOR':
        return 'color';
      case '$COMMENT':
        return 'comments';
      case '$COMMENT2':
        return 'comments2';
      case '$CONTENTTYPE':
        return 'content_type';
      case '$FILESTATE':
        return 'file_availability';
      case '$FILENAME':
        return 'file_name';
      case '$FILEPATH':
        return 'path';
      case '$GENRE':
        return 'genre';
      case '$IMPORTDATE':
        return 'import_date';
      case '$KEY':
        return 'key_id';
      case '$KEYTEXT':
        return 'key';
      case '$LABEL':
        return 'label';
      case '$LASTPLAYEDDATE':
        return 'last_played';
      case '$LYRICS':
        return 'lyrics';
      case '$MEDIASOURCE':
        return 'media_source';
      case '$MIX':
        return 'mix';
      case '$PLAYCOUNT':
        return 'playcount';
      case '$PLAYED':
        return 'already_played';
      case '$PRODUCER':
        return 'composer';
      case '$RATING':
        return 'rating';
      case '$RELEASE':
        return 'album';
      case '$RELEASEDATE':
        return 'release_date';
      case '$REMIXER':
        return 'remixer';
      case '$TIME':
        return 'duration';
      case '$TITLE':
        return 'title';
      default:
        return 'ids';
    }
  }

  private field_to_xml(field: keyof TrackDTO): string {
    if (this.xml) return this.xml?.field;
    switch (field) {
      case 'grid_lock':
        return '$ANALYSISLOCKED';
      case 'analyzed':
        return '$ANALYZED';
      case 'artist':
        return '$ARTIST';
      case 'bpm':
        return '$BPM';
      case 'bitrate':
        return '$BITRATE';
      case 'catalog_number':
        return '$CATALOG_NO';
      case 'color':
        return '$COLOR';
      case 'comments':
        return '$COMMENT';
      case 'comments2':
        return '$COMMENT2';
      case 'content_type':
        return '$CONTENTTYPE';
      case 'file_availability':
        return '$FILESTATE';
      case 'file_name':
        return '$FILENAME';
      case 'path':
        return '$FILEPATH';
      case 'genre':
        return '$GENRE';
      case 'import_date':
        return '$IMPORTDATE';
      case 'key_id':
        return '$KEY';
      case 'key':
        return '$KEYTEXT';
      case 'label':
        return '$LABEL';
      case 'last_played':
        return '$LASTPLAYEDDATE';
      case 'lyrics':
        return '$LYRICS';
      case 'media_source':
        return '$MEDIASOURCE';
      case 'mix':
        return '$MIX';
      case 'playcount':
        return '$PLAYCOUNT';
      case 'already_played':
        return '$PLAYED';
      case 'composer':
        return '$PRODUCER';
      case 'rating':
        return '$RATING';
      case 'album':
        return '$RELEASE';
      case 'release_date':
        return '$RELEASEDATE';
      case 'remixer':
        return '$REMIXER';
      case 'duration':
        return '$TIME';
      case 'title':
        return '$TITLE';
      case 'energy':
        return '$ENERGY';
      case 'popularity':
        return '$POPULARITY';
      case 'danceability':
        return '$DANCEABILITY';
      case 'acousticness':
        return '$ACOUSTICNESS';
      case 'instrumentalness':
        return '$INSTRUMENTALNESS';
      case 'liveness':
        return '$LIVENESS';
      case 'speechiness':
        return '$SPEECHINESS';
      default:
        return '';
    }
  }

  private target_to_dto(
    field: string,
    value: string,
  ): boolean | string | number | Date {
    switch (field) {
      case '$ANALYSISLOCKED':
      case '$ANALYZED':
      case '$PLAYED':
        return value == 'TRUE' ? true : false;
      case '$ARTIST':
      case '$CATALOG_NO':
      case '$COMMENT':
      case '$COMMENT2':
      case '$FILENAME':
      case '$FILEPATH':
      case '$GENRE':
      case '$KEYTEXT':
      case '$LABEL':
      case '$LYRICS':
      case '$MIX':
      case '$PRODUCER':
      case '$RELEASE':
      case '$REMIXER':
      case '$TITLE':
        let parsed: string = value;
        parsed = parsed.replace('"', '').replace('"', '');
        return parsed;
      case '$BPM':
      case '$BITRATE':
        return parseFloat(value);
      case '$COLOR':
        const colors = [
          'None',
          'Red',
          'Orange',
          'Yellow',
          'Green',
          'Blue',
          'Violet',
          'Magenta',
        ];
        return colors[parseInt(value)];
      case '$CONTENTTYPE':
        const content_type = ['Track', 'Stem', 'Remix', 'Sample'];
        return content_type[parseInt(value)];
      case '$FILESTATE':
        const file_availability = ['Available', 'Missing', 'Unknown'];
        return file_availability[parseInt(value)];
      case '$IMPORTDATE':
      case '$LASTPLAYEDDATE':
      case '$RELEASEDATE':
        const date_string = value.replace('"', '').replace('"', '');
        if (date_string.startsWith('MONTHS_AGO')) {
          const date = new Date();
          const months = date_string
            .match(/^.*?\([^\d]*(\d+)[^\d]*\).*$/)
            ?.toString();
          if (months) date.setMonth(date.getMonth() - parseInt(months));
          return date;
        } else if (date_string.startsWith('WEEKS_AGO')) {
          const date = new Date();
          const weeks = date_string
            .match(/^.*?\([^\d]*(\d+)[^\d]*\).*$/)
            ?.toString();
          if (weeks) date.setDate(date.getDate() - parseInt(weeks) * 7);
          return date;
        } else if (date_string.startsWith('DAYS_AGO')) {
          const date = new Date();
          const days = date_string
            .match(/^.*?\([^\d]*(\d+)[^\d]*\).*$/)
            ?.toString();
          if (days) date.setDate(date.getDate() - parseInt(days) * 7);
          return date;
        } else return new Date(value);
      case '$KEY':
        return value;
      case '$PLAYCOUNT':
      case '$RATING':
        return parseInt(value);
      case '$MEDIASOURCE':
        switch (value) {
          case 'BPLK':
            return 'Beatport LINK';
          case 'BSLK':
            return 'Beatsource LINK';
          case 'FILE':
          default:
            return 'Local Files';
        }
      case '$TIME':
        return Helpers.parse_duration(value);
      default:
        return value;
    }
  }

  private target_to_xml(
    field: keyof TrackDTO,
    value: boolean | string | number | Date,
  ): string {
    if (this.xml) return this.xml?.value;
    switch (field) {
      case 'grid_lock':
      case 'analyzed':
      case 'already_played':
        return (value as boolean) ? 'TRUE' : 'FALSE';
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
      case 'composer':
      case 'album':
      case 'remixer':
      case 'title':
        return `"${value}"`;
      case 'bpm':
        if (typeof value === 'number') return value.toFixed(6).toString();
        else return value as string;
      case 'bitrate':
        if (typeof value === 'number') return value.toFixed(0).toString();
        else return value as string;
      case 'color':
        const colors = [
          'None',
          'Red',
          'Orange',
          'Yellow',
          'Green',
          'Blue',
          'Violet',
          'Magenta',
        ];
        if (typeof value === 'number') return value.toString();
        else return colors.indexOf(value as string).toString();
      case 'content_type':
        const content_type = ['Track', 'Stem', 'Remix', 'Sample'];
        if (typeof value === 'number') return value.toString();
        else return content_type.indexOf(value as string).toString();
      case 'file_availability':
        const file_availability = ['Available', 'Missing', 'Unknown'];
        if (typeof value === 'number') return value.toString();
        else return file_availability.indexOf(value as string).toString();
      case 'import_date':
      case 'last_played':
      case 'release_date':
        if (typeof value === 'string') return value;
        else return value.toString();
      case 'key_id':
        return value as string;
      case 'playcount':
      case 'rating':
        return value.toString();
      case 'media_source':
        switch (value) {
          case 'BPLK':
            return 'Beatport LINK';
          case 'BSLK':
            return 'Beatsource LINK';
          case 'FILE':
          default:
            return 'Local Files';
        }
      case 'duration':
        return Helpers.timestamp(value as number);
      case 'energy':
      case 'popularity':
      case 'danceability':
      case 'acousticness':
      case 'instrumentalness':
      case 'liveness':
      case 'speechiness':
        if (typeof value === 'number') return value.toFixed(6).toString();
        else return value as string;
      default:
        return '';
    }
  }
}
