import core from "https://esm.sh/@actions/core@1.8.2";
import github from "https://esm.sh/@actions/github@5.0.3";
import { parse } from "https://deno.land/x/commit@0.1.5/mod.ts";

try {
  console.log(
    `The event payload: ${JSON.stringify(github.context.payload, null, 2)}`
  );

  const commitMessage = core.getInput("commit");
  if (!commitMessage) {
    throw new Error("Commit message is not exists. Skipping...");
  }

  const labels = {
    major: core.getInput("major"),
    minor: core.getInput("minor"),
    patch: core.getInput("patch"),
  };
  console.log(`Labels: ${JSON.stringify(labels, null, 2)}`);

  const commit = parse(commitMessage);
  console.log(commit);

  core.setOutput("label", "feat");
  core.setOutput("type", "major");
} catch (error) {
  core.setFailed(error.message);
}
