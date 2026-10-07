---
title: "Why does our internal knowledge assistant give bad answers?"
description: "Diagnose a poor internal knowledge assistant: classify failures, build an evaluation set from real questions, and apply the cheapest fixes before rebuilding."
slug: "internal-knowledge-assistant-bad-answers"
kind: "workflow"
cluster: "knowledge-tools"
question: "Staff say our internal AI knowledge assistant gives wrong or unhelpful answers. What's going wrong, and how do we fix it?"
answer: "\"Bad answers\" usually has several different causes — the right document wasn't found, the documents disagree or are out of date, the user can't see the source, or the question is outside what the assistant should answer. Classify real failures, build an evaluation set from real questions with expected answers and sources, and fix the cheapest causes first before considering a rebuild."
appliesWhen:
  - "An internal assistant over policies, procedures or product documentation is live but trusted by few people"
  - "Complaints are anecdotal and nobody knows how often answers are actually wrong"
  - "Someone has proposed switching model, vendor or architecture to fix quality"
alternatives:
  - "If most questions are about a small, stable set of documents, a well-maintained FAQ or search page may serve better"
  - "If the source content is badly out of date, fix the content first — no assistant can answer well from wrong documents"
  - "If people mainly need to find documents rather than get answers, improve search and skip generation"
offer: "pilot-readiness-review"
relatedChapters:
  - "agents-memory-rag"
  - "agents-evals-observability"
  - "structuring-data-for-genai-foundation-ai-driven-innovation"
relatedPosts:
  - "generative-ai-limitations-where-it-fails"
weight: 13
date: 2026-10-08
reviewed: 2026-10-08
tags: ["knowledge management", "RAG", "AI evaluation", "enterprise search", "AI quality"]
---

## "Bad answers" is several problems

Most internal knowledge assistants work the same way. When someone asks a question, the system searches a set of documents, picks the passages that look most relevant, and asks a language model to write an answer from them. This is often called retrieval-augmented generation, or RAG.

That chain has several places to fail, and each needs a different fix. Changing the model fixes generation problems but does nothing if the right document was never found. Rebuilding the search does nothing if the documents themselves contradict each other. So the first job is not to fix the assistant. It is to find out **which kind of failure you have, and how often**.

## Classify the failures

| Failure type | What it looks like | Usual cause |
|---|---|---|
| **Retrieval miss** | Answer is vague or says it doesn't know, but the answer exists in the documents | Search didn't find the right passage — different wording, poor indexing, document not included |
| **Stale or conflicting sources** | Confident answer that was true once, or that contradicts another policy | Old versions still indexed; several documents cover the same topic differently |
| **Chunking** | Answer is partly right but misses a condition, exception or table | Documents split in a way that separates the rule from its exceptions |
| **Permissions** | Answer refers to something the user can't open, or the user can't get an answer they should be able to | Access rules not mirrored, or too restrictive |
| **Out of scope** | Answer to a question the assistant shouldn't handle, such as legal advice or individual HR cases | No clear scope, so it tries to answer everything |
| **Generation error** | Correct passages retrieved, but the answer adds, drops or invents details | Model filled gaps or summarised loosely; no requirement to stick to sources |
| **Ambiguous question** | Plausible answer to a different question from the one meant | The question could mean several things and the assistant didn't ask |

When you review a bad answer, look at what was retrieved as well as what was written. That tells you which row it belongs in.

## Build an evaluation set from real questions

Anecdotes tell you there's a problem. An evaluation set tells you its size and whether a fix worked.

1. **Collect real questions.** Pull them from the assistant's logs, from helpdesk tickets and from the people who answer these questions today. Include the awkward ones.
2. **Write the expected answer** for each, with the owner of that content. Keep it short.
3. **Record the source** — the document and section that holds the answer. If no source exists, note that; the right behaviour is to say so.
4. **Mark the questions that should be refused or redirected**, such as personal HR matters.
5. **Tag each question** by topic and by who is allowed to see the answer.

A few dozen well-chosen questions is a useful start. Grow it as new failures appear.

## How to test

- Run every question in the set and record, for each: was the right source retrieved, is the answer correct, is it supported by the cited source, and was refusal handled properly.
- Classify each failure using the table above. Count them by type.
- Re-run the full set after every change, so a fix in one area doesn't quietly break another.
- Test with accounts at different permission levels, not only an administrator's.
- Keep the results per version, so you can show progress.

## Fix the cheapest causes first

Work down this list. Each step is cheaper than the next, and the early ones often fix more than people expect.

1. **Content hygiene.** Remove or archive superseded documents. Merge duplicates. Give each topic a single owner and a review date. This often fixes stale and conflicting answers outright.
2. **Scoping.** Decide what the assistant is for, limit the document set to that, and state the scope to users. Smaller, cleaner collections are easier to search.
3. **Retrieval tuning.** Adjust how documents are split so rules stay with their exceptions, add titles and section headings to passages, and include common synonyms or internal jargon. Check that the right documents are indexed at all.
4. **Require citations.** Make the assistant cite the source passage for every answer, and show it to the user. That lets people check answers, and it exposes generation errors quickly.
5. **Refusal behaviour.** Instruct the assistant to say it doesn't know when the sources don't support an answer, and to redirect out-of-scope questions to the right person or team.
6. **Only then, consider bigger changes** — a different model, a different retrieval approach, or a rebuild — and test them against the same evaluation set.

## Checklist

- Failures have been classified by type, with counts, not just anecdotes.
- An evaluation set exists with real questions, expected answers and sources.
- Each document collection has an owner and superseded content is removed.
- The assistant's scope is written down and shown to users.
- Answers cite their sources and users can open them.
- Permissions are tested with ordinary user accounts.
- Results are re-run and recorded after every change.

## Worked example (illustrative)

*This is a hypothetical example, not a client result.*

A 600-person housing association has an assistant over its policies and procedures. Frontline staff say it is "often wrong", and IT has proposed changing vendor.

The team builds an evaluation set from questions logged over the previous month and checks each answer. Most failures turn out to be stale or conflicting sources: three versions of the repairs policy are indexed, and two regional procedures contradict the central one. A smaller group are retrieval misses, where staff use internal abbreviations the documents don't. Few failures are true generation errors.

The fixes are content clean-up with named policy owners, a glossary of abbreviations added to the index, and mandatory citations. On re-test, most previous failures pass. The vendor change is dropped.

## Next step

If the assistant is a pilot that hasn't been formally approved, see [why AI pilots stall](/guides/why-ai-pilots-stall/) for what production needs, and check the data flow with [Can staff use AI with internal documents?](/guides/staff-ai-internal-documents/). For an independent diagnosis — failure classification, an evaluation set and a prioritised fix list — book a [Pilot Readiness Review](/work-with-us/pilot-readiness-review/).
