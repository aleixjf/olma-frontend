export function parse_duration(input: string): number {
  const regex = /[()]/g; //INFO: Find all '(' or ')'
  const clean = clean_spaces(input.replace(regex, ''));
  const parts = clean.split(':');
  parts.reverse();
  try {
    let seconds: number = parseInt(parts[0]);
    if (parts.length > 1) {
      seconds += parseInt(parts[1]) * 60;
    }
    if (parts.length > 2) {
      seconds += parseInt(parts[2]) * 3600;
    }
    return seconds;
  } catch (e) {
    throw new Error('');
  }
}

export function timestamp(input: number): string {
  try {
    const hours: number = Math.floor(input / 3600);
    const minutes: number = Math.floor((input - hours * 3600) / 60);
    const seconds: number = Math.floor(input - hours * 3600 - minutes * 60);

    const hr: string = hours > 9 ? hours.toString() : `0${hours}`;
    const min: string = minutes > 9 ? minutes.toString() : `0${minutes}`;
    const sec: string = seconds > 9 ? seconds.toString() : `0${seconds}`;
    return hours > 0 ? `${hr}:${min}:${sec}` : `${min}:${sec}`;
  } catch (e) {
    throw new Error('');
  }
}

export function clean_spaces(input: string): string {
  /*
  let regex: RegExp = /^[^ ][\w\W ]*[^ ]/;
  return input.replace(regex, "").replace("  ", " ");
  */
  return input.trim().replace('  ', ' ');
}

export function remove_special_characters(input: string): string {
  const regex = /[^\w\s]+/; //[.,()[\]&_"'\-\/\\^]+
  return input.replace(regex, '');
}

export function remove_initial_articles(input: string): string {
  const regex = /^((a|an|the) )/i;
  return input.replace(regex, '');
}

export function remove_feat(input: string): string {
  const regex = /f(?:eat|t)(?:\.|uring|) (.*)/i; //INFO: The first capturing group is the featurer!
  return input.replace(regex, '').trim();
}

export function remove_feat_parenthesis(input: string): string {
  const regex =
    /(?:\((?:f(?:eat|t)(?:\.|uring|)) ([^)]*)\))|(?:\[(?:f(?:eat|t)(?:\.|uring|)) ([^)]*)\])/i; //INFO: The first capturing group is the featurer!
  return input.replace(regex, '');
}

export function remove_mix_parenthesis(input: string): string {
  const regex =
    /(?:\((([^(]*)\ ((?:re|)mix|edit|bootleg))\))|(?:\[(([^(]*)\ ((?:re|)mix|edit|bootleg))\])/i; //INFO: The first capturing group is the Mix version ('Jack Back Remix'), the second is the remixer ('Jack Back') and the third is the version ('Remix')
  return input.replace(regex, '');
}

export function remove_mix_hyphens(input: string): string {
  const regex =
    /(?: \- (?<Mix>(?<Remixer>\b[^-]*)(?<Type>\b(?:re|)mix|edit|bootleg))(?:$| -))/i; //INFO: The first capturing group is the Mix version ('Jack Back Remix'), the second is the remixer ('Jack Back') and the third is the version ('Remix')
  return input.replace(regex, '');
}

export function name(title: string): string {
  return clean_spaces(
    remove_feat_parenthesis(remove_mix_parenthesis(remove_mix_hyphens(title))),
  );
}

export function featurers(input: string): string | undefined {
  if (input.includes('(')) {
    const regex =
      /(?:\((?:f(?:eat|t)(?:\.|uring|)) ([^)]*)\))|(?:\[(?:f(?:eat|t)(?:\.|uring|)) ([^)]*)\])/i; //INFO: The first capturing group is the featurer!
    return input.match(regex)?.toString();
  } else {
    const regex = /f(?:eat|t)(?:\.|uring|) (.*)/i; //INFO: The first capturing group is the featurer!
    return input.match(regex)?.toString();
  }
}

export function mix(title: string): string | undefined {
  //let regex: RegExp = /(?:(?:(?<Parenthesis>[(])|(?<Claudator>[[])|(?<Hyphen>- ))(?<Mix>(?<Remixer>(?(Parenthesis)[^(]|(?(Claudator)[^[]|[^-]))*)\ (?<Type>(?:re|)mix|edit|bootleg)(?(Parenthesis)[^(]|(?(Claudator)[^[]|[^-]))*)(?(Parenthesis)[)]|(?(Claudator)[\]]|)))/; //INFO: Group capturing conditionals not available in JavaScript regex.
  let regex =
    /(?:[([](?<Mix>(?<Remixer>\b[^([]*)(?<Type>\b(?:re|)mix|edit|bootleg))[)\]])/gi;
  let matches = title.matchAll(regex);
  //TODO: Code below is a workaround only... It's not a desired approach
  let i = 0;
  for (const match of matches) {
    i++;
  }
  if (i === 0) {
    regex =
      /(?: \- (?<Mix>(?<Remixer>\b[^-]*)(?<Type>\b(?:re|)mix|edit|bootleg))(?:$| -))/gi;
    matches = title.matchAll(regex);
  }
  if (matches) {
    const result: string[] = [];
    for (const match of matches) {
      const mix = match.groups?.Mix;
      if (mix) result.push(mix);
    }
    return result.join(' - ');
  } else return undefined;
}

export function title(name: string, mix?: string, version?: string): string {
  let title = name;
  if (mix) title = `${title} (${version})`;
  if (version) title = `${title} [${version.trim}]`;
  return title;
}

export function remixer(title: string, isMix = false): string | undefined {
  let m: string | undefined;
  if (!isMix) {
    m = mix(title);
  } else m = title;

  if (m) {
    const regex =
      /(\ [Rr]emix|\ [Mm]ix|\ [Ee]dit|\ [Bb]ootleg)|(Radio|Original|Extended|Short|Clean)/;
    const remixer: string | undefined = m.replace(regex, '');
    if (remixer) return clean_spaces(remixer);
  }
  return undefined;
}

export function parse_artist(artist: string): string[] {
  if (artist.includes(',')) return artist.split(',');
  else if (artist.includes(';')) return artist.split(';');
  else if (artist.includes('/')) return artist.split('/');
  else return [artist];
}

export function join_artists(artists: string[], separator = ','): string {
  return artists.join(`${separator.trim()} `);
}

export function clean_artists(artists: string[]): string[] {
  const clean: string[] = artists.map((a) =>
    remove_special_characters(a.toLowerCase()).trim(),
  );
  return clean.sort();
}

/*
featuring_artists(title: str, artists: ): string[]:
    let mut featuring_artists: string[] = vec![];
    let mut regex: RegExp = /\ (?:[Ff]eat(?:\.|\ |uring)| [Ff]eat(\.|\ |uring)|[Ff]t(?:\.|\ ))(.*)/;
    if regex.is_match(artists) {
        for feat_artists in regex.captures_iter(arists) {
            // Remove parenthesis
            feat_artists = feat_artists[1:-1];
            // Remove feat string
            regex: RegExp = /(?:(?:[Ff]eat(?:\.|\ |uring)| [Ff]eat(?:\.|\ |uring)|[Ff]t(?:\.|\ )))\ /;
            feat_artists = regex.replace_all(feat_artists, "");
            // Convert string into list
            feat_artists = feat_artists.split(',');

            // Add artists to featurers list
            for artist in feat_artist {
                if !featuring_artists.includes(artist) {
                    featuring_artists.append(artist);
                }
            }
        }

        // Check that the last item added to the list doesn't contain more than 1 artist (because of a possible and/&)
        let last_artist = featuring_artists[-1]
        regex: RegExp = / (?:[Aa]nd|&) /;
        if regex.find_iter(title).count() > 1 {
            featuring_artists.remove(-1);
            last_artist = re.sub(
                ' (?:[Aa]nd|&) (?!.*(?:[Aa]nd|&))', ',', last_artist)
            last_artist = last_artist.split(',')
            for artist in last_artist:
                featuring_artists.append(artist)

    // Get featuring artists from title field
    title_field = re.findall(
        r'(\(([Ff]eat(\.|\ |uring)| [Ff]eat(\.|\ |uring)|[Ff]t(\.|\ ))[^)]*\))|(\[([Ff]eat(\.|\ |uring)| [Ff]eat(\.|\ |uring)|[Ff]t(\.|\ ))[^]]*\])', title)
    if len(title_field) != 0:
        while(isinstance(title_field, str) == False):
            title_field = title_field[0]
        // Remove parenthesis
        title_field = title_field[1:-1]
        // Remove feat string
        title_field = re.sub(
            r'(([Ff]eat(\.|\ |uring)| [Ff]eat(\.|\ |uring)|[Ff]t(\.|\ )))\ ', "", title_field)
        // Convert string into list
        title_field = title_field.split(',')

        // Add artists to featurers list
        for artist in titleField:
            featuring_artists.append(artist)

        // Check that the last item added to the list doesn't contain more than 1 artist (because of a possible and/&)
        last_artist = featuring_artists[-1]
        if len(re.findall(' (?:[Aa]nd|&) ', last_artist)) > 1:
            del featuring_artists[-1]
            last_artist = re.sub(
                ' (?:[Aa]nd|&) (?!.*(?:[Aa]nd|&))', ',', last_artist)
            last_artist = last_artist.split(',')
            for artist in last_artist:
                if artist not in featuring_artists:
                    featuring_artists.append(artist)

    // Results
    for artist in featuring_artists:
        // Remove possible white spaces at the beginning or at the end
        while artist[0] in ' ([,-':
            artist = artist[1:]
        while artist[-1] in ' )],-':
            artist = artist[:-1]
    if (len(featuring_artists) != 0):
        return featuring_artists
    else:
        return "";
}

main_artists(title: str, artists): string[] {
    feat_artists = featuring_artists(title, artists)
    main_artists = []

    // Get featuring artists from artists field
    if (isinstance(artists, list) == False):
        // Remove featuring artists from artists string
        artist_field = remove_feat(artists)

        // Convert string into list
        artist_field = artist_field.split(',')

        // Add artists (only artists, no featurers) to the list
        for artist in artist_field:
            if artist not in feat_artists:
                main_artists.append(artist)

        // Check that the last item added to the list doesn't contain more than 1 artist (because of a possible and/&)
        last_artist = main_artists[-1]
        if len(re.findall(' (?:[Aa]nd|&) ', last_artist)) > 1:
            del main_artists[-1]
            last_artist = re.sub(
                ' (?:[Aa]nd|&) (?!.*(?:[Aa]nd|&))', ',', last_artist)
            last_artist = last_artist.split(',')
            for artist in last_artist:
                main_artists.append(artist)
    else:
        // Add artists (only artists, no featurers) to the list
        for artist in artists:
            if artist not in feat_artists:
                main_artists.append(artist)

    // Results
    for artist in main_artists:
        // Remove possible white spaces at the beginning or at the end
        while artist[0] == ' ':
            artist = artist[1:]
        if artist[-1] == ' ':
            artist = artist[:-1]
    if (len(main_artists) != 0):
        return main_artists
    else:
        return ""
}
*/

export function parse_genre(genre: string): string[] {
  if (genre.includes(',')) return genre.split(',').map((g) => g.trim());
  else if (genre.includes(';')) return genre.split(';').map((g) => g.trim());
  else if (genre.includes('/')) return genre.split('/').map((g) => g.trim());
  else return [genre];
}

export function join_genres(genres: string[]): string {
  return genres.join(', ');
}
