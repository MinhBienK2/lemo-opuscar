"""Read a session transcript, whichever tool wrote it.

  python3 -c "import transcript; [print(e) for e in transcript.events(path)]"

A session transcript is a sequence of JSON lines, one event per line. Two tools write them:

  omp        {"type": "custom", "customType": "tool_execution_start",
              "data": {"toolName": "bash", "args": {...}, "startedAt": "2026-11-08T18:07:36.778Z"}}
  Claude     {"type": "assistant", "timestamp": "2026-11-08T18:07:36.778Z",
              "message": {"content": [{"type": "tool_use", "name": "Bash", "input": {...}}]}}

The two are the same thing said two ways: a tool call, a time and a bag of arguments. A supervisor that
reads only one of them watches nothing at all — the worse failure, because an empty rule report reads as
"nothing was broken" rather than "nobody was looking". So the reading lives here, once, and every caller
gets the same events:

    (at, tool, args)   at   'HH:MM:SS' local time
                       tool lowercase: bash, write, edit, read, agent, taskstop, listagents, ...
                       args the caller's keys: 'path' (the file), 'command' (the shell line), 'name'

A call that names no file and no command still counts: a tool that runs nothing is still a tool.
"""
import json

# omp's tool names and Claude's, folded onto one set of names
TOOL = {'bash': 'bash', 'read': 'read', 'write': 'write', 'edit': 'edit', 'agent': 'agent',
        'taskstop': 'taskstop', 'listagents': 'listagents', 'sendmessage': 'sendmessage'}


def _norm(tool):
    t = str(tool or '').lower()
    return TOOL.get(t, t)


def _args(tool, args):
    """the caller's keys, whichever tool wrote them: 'path' for a file, 'command' for a shell line"""
    if not isinstance(args, dict):
        args = {}
    a = {}
    for k in ('path', 'file_path', 'notebook_path'):
        if isinstance(args.get(k), str):
            a['path'] = args[k]
            break
    for k in ('command', 'cmd'):
        if isinstance(args.get(k), str):
            a['command'] = args[k]
            break
    if isinstance(args.get('description'), str):
        a['intent'] = args['description']
    if isinstance(args.get('name'), str):
        a['name'] = args['name']
    return a


def _clock(stamp):
    """the timestamp as written, whole: '2026-11-08T18:07:36.778Z' stays as it is, so two sessions can be ordered
    by when they last wrote (a bare '18:07:36' cannot be compared across days)"""
    return str(stamp or '')


def events(path):
    """every tool call of the transcript, in order"""
    try:
        fh = open(path, encoding='utf8', errors='replace')
    except OSError:
        return
    with fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            try:
                d = json.loads(line)
            except Exception:
                continue
            if not isinstance(d, dict):
                continue
            # omp
            if d.get('type') == 'custom' and d.get('customType') == 'tool_execution_start':
                da = d.get('data') or {}
                yield _clock(da.get('startedAt')), _norm(da.get('toolName')), _args(da.get('toolName'), da.get('args'))
                continue
            # Claude Code
            if d.get('type') == 'assistant':
                msg = d.get('message') or {}
                content = msg.get('content')
                if not isinstance(content, list):
                    continue
                at = _clock(d.get('timestamp'))
                for b in content:
                    if not isinstance(b, dict) or b.get('type') != 'tool_use':
                        continue
                    yield at, _norm(b.get('name')), _args(b.get('name'), b.get('input'))
