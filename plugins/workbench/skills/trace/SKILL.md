---
name: trace
description: Understand how a flow works end to end - from the entry point (endpoint, UI action, job, message) through every layer, message and database call - and explain it with a diagram. Use when the user asks how something works, where something happens, what calls what, or before changing or debugging unfamiliar code.
---

# Trace: understand the flow before touching it

## Steps
1. **Find the entry point.** An HTTP route, a UI event, a scheduled job, a message consumer or a CLI command. Ask if the user's description matches several.
2. **Follow the calls,** using Serena or Roslyn for C# (find symbol, find references, go to implementation) instead of text search, so interfaces and DI registrations resolve to the real class.
3. **At each hop, note:**
   - the file and method;
   - what it decides: validations, branches, business rules;
   - what it reads and writes: tables, caches, files;
   - what crosses a boundary: HTTP calls, published messages, queues, external APIs.
4. **Follow asynchronous hops too.** When a message is published, find every consumer of that message type and continue from there. Note retries, error queues and sagas on the way.
5. **Mark what you could not confirm,** such as reflection, configuration-driven routing or code outside the repo, instead of guessing.

## Output
1. A one-paragraph summary of the flow in plain words.
2. A Mermaid sequence diagram of the main path.
3. A table of hops: step, `file:line`, responsibility, side effects.
4. Where it can fail and what happens then.
5. Open questions.

Save it to `docs/flows/<name>.md` only if the user wants to keep it.
