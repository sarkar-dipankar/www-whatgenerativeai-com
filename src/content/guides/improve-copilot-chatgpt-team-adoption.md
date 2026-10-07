---
title: "How to improve Copilot or ChatGPT adoption across a team"
description: "Licences are not adoption. How to turn Copilot, ChatGPT or Claude seats into agreed working practices for three workflows, with safe-use rules and measures."
slug: "improve-copilot-chatgpt-team-adoption"
kind: "workflow"
cluster: "activate-tools"
question: "We've rolled out Copilot or ChatGPT licences but usage is patchy. How do we get a team using them properly?"
answer: "Stop promoting the tool and start agreeing how it is used in three specific workflows: the inputs, the prompt or template, the review step and where the output goes. Tie safe-use rules to your information classes, appoint a champion per team, and measure effort, quality and active use on those workflows rather than raw logins."
appliesWhen:
  - "Licences have been bought but usage is low, uneven or limited to a few enthusiasts"
  - "Staff are unsure what they are allowed to put into the assistant"
  - "Leadership wants evidence the licences are earning their cost before renewal"
alternatives:
  - "If nobody can name a recurring task the tool would help with, reduce seats rather than push adoption"
  - "If the real need is a single structured process, ordinary automation may serve it better than a general assistant"
  - "If information rules are undecided, settle those first — see Can staff use AI with internal documents?"
offer: "team-workflow-activation"
tool: "workflow-scorecard"
relatedChapters:
  - "harnessing-power-existing-genai-tools-practical-guide-businesses"
  - "supercharging-developer-productivity-generative-ai"
relatedPosts:
  - "ai-coding-assistants-comparison-2026"
weight: 10
date: 2026-10-08
reviewed: 2026-10-08
tags: ["AI adoption", "Microsoft 365 Copilot", "ChatGPT Enterprise", "change management", "team workflows"]
---

## The workflow, and why licences don't change it

A general-purpose assistant such as Microsoft 365 Copilot, ChatGPT Enterprise or Team, Claude or Gemini arrives with no workflow attached. Staff are given a blank box and a training video, and they're expected to work out for themselves where it fits. Some do. Most try it a few times, get a mediocre answer to a vague request, and go back to the way they worked before.

The real cost has two parts:

- **The licence spend** that isn't producing anything, renewed every year on the strength of login counts.
- **The unmanaged use** that does happen: people pasting information into tools without knowing whether they should, and outputs going to clients without a consistent check.

Adoption is not "people logged in this month". It is a team doing a recurring piece of work differently, in an agreed way, with a known quality check. That needs a working practice, not more enthusiasm.

## Options

| Option | When it fits | Watch out for |
|---|---|---|
| **Leave it to individuals** | Small teams of confident users with low-risk work | Uneven quality, invisible risk, no evidence for renewal |
| **Generic training and prompt tips** | A first awareness step | Rarely changes day-to-day work on its own |
| **Workflow-based activation** (this guide) | Licences exist and there are recurring tasks involving drafting, summarising or searching | Needs a named owner and a few hours of the team's time per workflow |
| **Deterministic automation instead** | The task is identical each time with structured inputs | Don't force an assistant into work a rule or script does better |
| **Reduce seats** | No recurring task benefits after an honest look | Politically awkward, but cheaper than paying for shelfware |

## The redesigned workflow, step by step

### 1. Pick three workflows, not thirty

Ask each team lead for the recurring tasks that involve reading, drafting or summarising. Score them with the [Workflow Opportunity Scorecard](/tools/workflow-scorecard/) and choose three. Good candidates run weekly or more often, the output is easy for a person to check, and the information involved is cleared for the tool. Meeting follow-ups, first drafts of routine correspondence and summarising long internal documents are common starting points.

### 2. Write a working practice for each

One page per workflow, covering:

- **Inputs:** which documents, notes or data go in, and where they come from.
- **Template or prompt:** a tested starting prompt, saved somewhere the team can find it, with the parts to fill in marked.
- **Review step:** who checks the output, what they check for, and roughly how long it should take.
- **Destination:** where the finished output goes — a client email, a shared folder, a ticket — and in what format.

Test the practice with two or three people on real work before publishing it. Revise the prompt until most first drafts need only light edits.

### 3. Tie safe-use guidance to information classes

"Be careful with confidential data" is not guidance. Map your existing information classes (public, internal, confidential, restricted, personal data) to what may go into which tool, under which account, and put the relevant line in each working practice. Staff should never have to guess. If you haven't settled the rules yet, start with [Can staff use AI with internal documents?](/guides/staff-ai-internal-documents/)

### 4. Appoint champions

One person per team who uses the working practices, collects problems and improved prompts, and has an hour or two a fortnight set aside for it. Champions are the feedback loop. Without them, practices go stale within a quarter.

### 5. Review points

- **Before publishing a practice:** the team lead signs off the prompt, review step and information rules.
- **Every output that leaves the team:** a named person has checked it against the review step.
- **After four to six weeks:** the follow-up measurement below, and a decision to keep, revise or drop each practice.

## What to check and measure

Take a baseline before the practices go live, then measure again after four to six weeks.

- [ ] **Effort per run:** time taken for the task, before and after, self-reported or sampled.
- [ ] **Review time:** how long the check takes. If review eats the saving, the practice needs work.
- [ ] **Quality:** a small sample of outputs scored by the team lead against the previous standard.
- [ ] **Active use on the agreed workflows:** how many of the people who do the task now use the practice, rather than total logins.
- [ ] **Incidents:** information put in the wrong place, or errors that reached a client.
- [ ] **Practice health:** whether the prompt and template are still current and the champion is still active.

Treat released hours carefully. They only become value if they turn into extra output or avoided cost — see [why hours are not cash](/guides/ai-roi-hours-are-not-cash/).

## Doing this across several teams or businesses

If you run more than one team, office or portfolio company, don't reinvent the method each time. Build a repeatable programme:

- A **standard practice template** and scoring sheet that every team uses.
- A **shared library** of working practices, tagged by function, so a finance team in one business can reuse what another finance team proved.
- **Common information rules,** with local exceptions written down rather than assumed.
- **The same baseline and follow-up measures,** so results can be compared and seats reallocated to where they're used.
- **A champions' network** that meets monthly to retire practices that didn't work and promote ones that did.

## Worked example (illustrative)

*This is a hypothetical example, not a client result.*

A 60-person operations team has had assistant licences for six months. Logins are steady but few people can describe a task they do differently. The team lead picks three workflows: weekly supplier-issue summaries, first drafts of customer complaint responses, and notes from the monthly service review.

For each, a champion writes a one-page practice. The complaint-response practice says: paste the complaint and the case history from the ticketing system (internal information, permitted under the company account); use the saved prompt; the case handler checks facts, commitments and tone; the response is sent from the ticketing system, not from the assistant. Customer payment details are excluded by rule.

After six weeks, the team finds the supplier summaries and review notes work well, but complaint drafts need heavy rewriting for complex cases. They restrict that practice to straightforward complaints and revise the prompt. Active use on the three workflows, rather than logins, becomes the figure reported at renewal.

## Next step

Score the workflows your team is considering with the [Workflow Opportunity Scorecard](/tools/workflow-scorecard/) to find the three worth activating first. If you want the working practices, safe-use rules, champions and measurement set up with your teams, that's what [Team Workflow Activation](/work-with-us/team-workflow-activation/) is for.
