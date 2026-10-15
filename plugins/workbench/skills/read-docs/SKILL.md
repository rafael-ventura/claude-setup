---
name: read-docs
description: Read and extract what matters from PDFs and images for development work - specs, contracts, standards like ISO 20022, vendor API manuals, screenshots of errors, UI mockups and architecture diagrams - with page or region references. Use when the user shares or points to a PDF, image, screenshot, scanned document or diagram, or asks to compare one with the code.
---

# Read docs: PDFs and images as engineering input

Claude reads PDFs and images natively with the Read tool. This skill adds the method: read the right parts, extract precisely and always point back to the source.

## PDFs
1. **Map first.** Read the table of contents or the first pages, then only the relevant page ranges. For files over 20 pages, read in chunks and never claim to have read pages you skipped.
2. **Large or text-heavy files:** extract the text with Python (`pypdf`) to search it, then read the matching pages visually for tables and figures.
3. **Extract with references.** Every rule, field, limit or error code you take from the document gets its page number: "max 35 chars (p. 42)".
4. **Tables and schemas** become Markdown tables or code (DTOs, enums, validation rules). Mark anything ambiguous instead of guessing.
5. To create, merge, fill or convert PDFs, use Anthropic's `pdf` skill instead.

## Images
- **Error screenshots:** transcribe the exact message and stack trace, then search the code for it.
- **UI mockups and designs:** list the components, states, spacing and text, then compare with the current implementation and report the differences.
- **Architecture or flow diagrams:** describe nodes and arrows, then check them against the code with `trace` and report where reality differs.
- **Photos of whiteboards or scans:** say which parts are unreadable rather than inventing them.

## Output
A structured summary with source references, the extracted artifacts (tables, DTOs, checklists), open questions about the document, and the differences from the code when a comparison was requested.
