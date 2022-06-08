import core from "https://esm.sh/@actions/core@1.8.2";
import github from "https://esm.sh/@actions/github@5.0.3";
import { Octokit } from "https://esm.sh/v85/@octokit/core@3.6.0/dist-types/index.d.ts";
import { parse } from "https://deno.land/x/commit@0.1.5/mod.ts";

function getVersionType(commitType: string) {
  const labels: Record<string, string[]> = {
    major: JSON.parse(core.getInput("major")),
    minor: JSON.parse(core.getInput("minor")),
    patch: JSON.parse(core.getInput("patch")),
  };

  for (const label in labels) {
    if (labels[label].includes(commitType)) {
      return label;
    }
  }

  return "patch";
}

try {
  const token = core.getInput("token");
  if (!token) {
    throw new Error("Please provide token");
  }
  const octokit = github.getOctokit(token) as Octokit;
  const commits = await octokit.request("GET /repos/{owner}/{repo}/commits", {
    ...github.context.repo,
    per_page: 1,
    page: 1,
  });

  if (!commits || !commits.data) {
    throw new Error("Cannot get latest commits. Skipping...");
  }

  const commitMessage = commits.data[0].commit.message;
  if (!commitMessage) {
    throw new Error("The commit message is not exists. Skipping...");
  }

  const commit = parse(commitMessage);
  if (!commit.type) {
    throw new Error(
      "The commit message was not created according to conventional commits. Skipping..."
    );
  }

  const commitType = commit.type;
  console.info(`Detected commit type: ${commitType}`);

  const versionType = getVersionType(commit.type.toLowerCase());
  console.info(`Detected next version type: ${versionType}`);

  core.setOutput("label", commitType);
  core.setOutput("type", versionType);
} catch (error) {
  core.setFailed(error.message);
}
