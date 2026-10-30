---
sidebar_position: 10
title: Code quality
description: "AI source review, project-integrated test proposals and recorded code changes."
---

# Code quality

Sign in, open **Code quality · AI Review** from the desktop sidebar and select a project directory. Choose an entry file to prioritize its local imports, then select **Start AI review**. All included files are reviewed; dependency hints currently resolve relative JavaScript/TypeScript imports. Other supported source languages use file contents, test files and manifest context rather than a complete dependency graph.

## Evidence and priority

Findings include the exact relative path, original line number, category, confidence, evidence and a repair task. Select a location to highlight the source line. Filter by P0–P3: immediate catastrophic impact, high impact, normal defects and minor improvements respectively. Reviews examine input-to-sink security, authorization boundaries, error propagation, cancellation, cleanup, concurrency, unbounded work and test assertions. Assumptions about missing context must remain explicit.

Copy a repair task to another code agent, or select **Discuss in AI Chat** to use the shared review context. The quality reviewer does not modify business source. Generated advice still requires engineering review; it is not a security certification.

## Tests that belong to the project

The test view reports assessments and missing cases using detected manifests, existing fixtures, imports and test conventions. Generate proposed tests, inspect their complete source, and confirm the list of new files in the desktop dialog. Canceling leaves the drafts available. Existing files cannot be overwritten, paths cannot escape the project, and tests are never run automatically. Run the project's own test command yourself or explicitly ask an appropriate code agent to validate the proposal.

## Iteration history

**Update changes** compares the current project with its last captured snapshot. Added, modified and deleted files retain before/after source and can be opened in the read-only diff view. Reopening a previously selected project also records changes since its saved snapshot. The latest 20 captured revisions are stored locally. This is snapshot history: changes between two captures are combined, and it does not claim to record every intermediate keystroke or commit.

## AI Chat tools

`quality.choose_project`, `quality.review`, `quality.results`, `quality.propose_tests`, `quality.create_tests`, `quality.refresh` and `quality.changes` operate on the same project and results as the workspace. Model requests use the account's shared credits. File creation requires the native approval dialog even when requested from Chat.

## Scope and privacy

The reader excludes dependency/build folders, hidden files, symbolic links and common credential filenames. It limits snapshots to 1,000 files, 4 MB total and 200 KB per file. Oversized/excluded files are shown in the workspace; incomplete scans display their completed-file count. Source excerpts are sent to the platform's configured AI providers. Do not select a project whose contents you cannot share with those providers. No project commands or dependencies execute during scanning.
