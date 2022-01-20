import { RuleDTO } from './rule.dto';

export class RulesDTO {
  version: number;
  query: string;
  rules: RuleDTO[]; //TODO: Add RulesDTO[] as an OR for nested and/or behavior in the future?
  type!: 'and' | 'or';

  constructor(version: number, query: string | RuleDTO[], type?: 'and' | 'or') {
    this.version = version;
    if (type) this.type = type;
    if (typeof query === 'string') {
      this.query = query;
      this.rules = this.parseQuery(query);
    } else {
      this.rules = query;
      this.query = this.buildQuery(query);
    }
  }

  private parseQuery(query: string): RuleDTO[] {
    if (query.includes(' | $')) {
      this.type = 'or';
      return this.buildRules(query, '|');
    } else if (this.query.includes(' & $')) {
      this.type = 'and';
      return this.buildRules(query, '&');
    } else {
      return this.buildRules(query);
    }
  }

  private buildRules(query: string, separator?: string): RuleDTO[] {
    const rules: RuleDTO[] = [];
    let conditions: string[] = [];
    if (separator) conditions = query.split(` ${separator} `);
    else conditions = [query];
    for (const condition of conditions) {
      const rule: RuleDTO = new RuleDTO(condition);
      rules.push(rule);
    }
    return rules;
  }

  private buildQuery(rules: RuleDTO[]): string {
    let query = '';
    const separator: string = this.type == 'and' ? ' & ' : ' | ';
    for (const rule of rules) {
      if (rule.query != '') {
        //INFO: Those which aren't compatible with Traktor queries will return ''
        if (query != '') query = query + separator + rule.query;
        else query = rule.query;
      }
    }
    return query;
  }

  get traktor_supported() {
    return (
      this.rules.every(
        (rule) =>
          rule.field !=
          ('energy' &&
            'popularity' &&
            'danceability' &&
            'acousticnesss' &&
            'instrumentalness' &&
            'liveness' &&
            'speechiness'),
      ) && this.rules.length <= 8
    );
  }
}
