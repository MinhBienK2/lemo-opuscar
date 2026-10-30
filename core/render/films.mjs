// The one place that knows where the films are: core/render/films.mjs
//
// The layout is the contract in docs/layout.md; this module is its implementation, and the rules below are
// the ones that contract states. Every tool that needs a film asks this module: no other tool may glob
// films/ or channels/ itself.
//
// Two roots, one rule:
//
//   films/<film>/               a one-shot: a film that belongs to no channel
//   channels/<channel>/         a channel: a series of films that share an identity
//   channels/<channel>/<ep>/    an episode: one film of the channel
//
// The marker decides the kind; the depth never does:
//
//   a channel is a folder that holds CHANNEL.md and no build.sh: it shares an identity, it does not build a film
//   a film    is a folder that can build a film: it holds build.sh and src/
//   TREATMENT.md is accepted as an alternative film marker for a film that has a treatment but no build yet;
//   it is never required (films/host-toon-test/ has no TREATMENT.md, and it is a film)
//
// A folder that is a channel is never also a film: the channel's shared code is not an episode.
//
// The command line:
//
//   node core/render/films.mjs --films        # one film folder per line, repo-relative
//   node core/render/films.mjs --channels     # one channel folder per line, repo-relative
//   node core/render/films.mjs --json         # the same, as JSON (the Python tools parse this)
//
// A Python tool calls the same command and parses the JSON: there is one implementation, in node,
// because the layout is a rendering concern.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const FILMS_ROOT = path.join(REPO_ROOT, 'films');
export const CHANNELS_ROOT = path.join(REPO_ROOT, 'channels');

export const CHANNEL_MARKER = 'CHANNEL.md';   // a folder that holds it is a channel (when it does not build a film)
export const BUILD_MARKER = 'build.sh';       // a folder that holds it and a src/ is a film
export const FILM_MARKER = 'TREATMENT.md';    // the alternative film marker: a film that has a treatment but no build yet
export const MANIFEST_NAME = 'film.json';     // the film's own facts

// the folders the walk does not enter: build outputs, dependencies and hidden folders
const SKIP = new Set(['node_modules', 'out', 'dist', 'build']);

const isDir = p => { try { return fs.lstatSync(p).isDirectory(); } catch { return false; } };
const isFile = p => { try { return fs.statSync(p).isFile(); } catch { return false; } };

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

// every folder under root, at any depth; symlinked folders are not followed (a link into the tree would loop).
// A film is a leaf: nothing inside a film is a film of the library (a style's demo folder, kept inside a one-shot,
// holds a build.sh and a src/ of its own, and it is not an episode).
function* walk(root) {
  if (!isDir(root)) return;
  let entries;
  try { entries = fs.readdirSync(root, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const name = entry.name;
    if (name.startsWith('.') || SKIP.has(name)) continue;
    if (!entry.isDirectory()) continue;
    const dir = path.join(root, name);
    yield dir;
    if (isFilm(dir)) continue;
    yield* walk(dir);
  }
}

// the roots that hold films: films/ for the one-shots, channels/ for the episodes
function* roots() {
  for (const root of [FILMS_ROOT, CHANNELS_ROOT]) {
    if (isDir(root)) yield root;
    for (const dir of walk(root)) yield dir;
  }
}

/** A channel is a folder that holds CHANNEL.md and does not build a film of its own. */
export function isChannel(dir) {
  return isFile(path.join(dir, CHANNEL_MARKER)) && !isFile(path.join(dir, BUILD_MARKER));
}

/**
 * A film is a folder that can build a film: it holds build.sh and src/. A folder that holds TREATMENT.md is a
 * film too — a film that has a treatment but no build yet. TREATMENT.md is never required: the one-shots that
 * predate the treatment rule have none. A channel is never a film.
 */
export function isFilm(dir) {
  if (isChannel(dir)) return false;
  if (isFile(path.join(dir, FILM_MARKER))) return true;
  return isFile(path.join(dir, BUILD_MARKER)) && isDir(path.join(dir, 'src'));
}

// the channel a film belongs to: the nearest folder up the tree that holds CHANNEL.md
function channelOf(dir) {
  let cur = path.dirname(dir);
  while (cur.length > REPO_ROOT.length && cur.startsWith(REPO_ROOT)) {
    if (isChannel(cur)) return cur;
    cur = path.dirname(cur);
  }
  return null;
}

// the channel's name: the identity table of CHANNEL.md, then its first heading, then its folder name
function channelName(dir) {
  const text = (() => { try { return fs.readFileSync(path.join(dir, CHANNEL_MARKER), 'utf8'); } catch { return ''; } })();
  const row = /^\|\s*(?:Tên|Ten|Name)\s*\|\s*\**\s*(.+?)\s*\**\s*\|/m.exec(text);
  if (row) return row[1].trim();
  const head = /^#\s+(.+)$/m.exec(text);
  if (head) return head[1].trim();
  return path.basename(dir);
}

// one film, described
function filmInfo(dir) {
  const channelDir = channelOf(dir);
  const manifestPath = path.join(dir, MANIFEST_NAME);
  const manifest = isFile(manifestPath) ? readJson(manifestPath) : null;
  const title = manifest && typeof manifest.title === 'string' ? manifest.title : null;
  const movie = manifest && typeof manifest.movie === 'string' ? manifest.movie : null;
  return {
    dir,                                        // the film's folder, absolute
    rel: path.relative(REPO_ROOT, dir),        // the same folder, repo-relative
    name: path.basename(dir),                  // the film's own name (its folder name)
    kind: channelDir ? 'episode' : 'oneshot',  // an episode belongs to a channel; a one-shot belongs to none
    channel: channelDir ? path.basename(channelDir) : null,
    channelDir: channelDir,                   // the channel the film belongs to, absolute
    episode: channelDir ? path.basename(dir) : null,
    manifest,                                  // the parsed film.json, or null when there is none
    manifestPath: isFile(manifestPath) ? manifestPath : null,
    title,
    movie,
  };
}

/** Every film of the library: the one-shots under films/ and the episodes under channels/, at any depth. */
export function listFilms() {
  const films = [];
  for (const dir of roots()) {
    if (isFilm(dir)) films.push(filmInfo(dir));
  }
  films.sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));
  return films;
}

/** Every channel of the library, with its episodes. */
export function listChannels() {
  const films = listFilms();
  const channels = [];
  for (const dir of roots()) {
    if (!isChannel(dir)) continue;
    // the episodes of the channel: the films that belong to it, at any depth under it
    const episodes = films.filter(f => f.channelDir === dir);
    channels.push({
      dir,
      rel: path.relative(REPO_ROOT, dir),
      slug: path.basename(dir),
      name: channelName(dir),
      episodes,
    });
  }
  channels.sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));
  return channels;
}

/** The film with that name: by folder name, by the name of its movie, or by its repo-relative path. */
export function findFilm(name) {
  if (!name) return null;
  const wanted = String(name);
  for (const film of listFilms()) {
    if (film.name === wanted || film.rel === wanted) return film;
    if (film.movie && (film.movie === wanted || path.basename(film.movie) === wanted)) return film;
    if (film.title && film.title === wanted) return film;
  }
  return null;
}

/** The whole library, as the JSON the CLI prints and the Python tools parse. */
export function library() {
  return {
    repoRoot: REPO_ROOT,
    filmsRoot: FILMS_ROOT,
    channelsRoot: CHANNELS_ROOT,
    channels: listChannels(),
    films: listFilms(),
  };
}

function main(argv) {
  const args = argv.slice(2);
  if (args.includes('--json')) {
    process.stdout.write(JSON.stringify(library(), null, 2) + '\n');
    return 0;
  }
  if (args.includes('--films')) {
    for (const film of listFilms()) process.stdout.write(film.rel + '\n');
    return 0;
  }
  if (args.includes('--channels')) {
    for (const channel of listChannels()) process.stdout.write(channel.rel + '\n');
    return 0;
  }
  process.stderr.write('usage: node core/render/films.mjs [--films|--channels|--json]\n');
  return 2;
}

// only run the command line when the file is run, not when it is imported
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv));
}
