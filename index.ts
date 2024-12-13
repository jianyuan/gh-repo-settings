import { $ } from "bun";

const owner = "jianyuan";

async function updateRepos() {
  console.log("Updating repos...");

  const repos =
    await $`gh repo list --no-archived --limit=1000 --json=nameWithOwner --jq='[.[] | .nameWithOwner]`.json();

  console.log(`Found ${repos.length} repos`);

  for (const repo of repos) {
    console.log(`Updating ${repo}`);

    await $`gh repo edit ${repo} --allow-update-branch --delete-branch-on-merge --enable-merge-commit=false --enable-rebase-merge=false --enable-squash-merge`;
  }
}

async function pinRenovateDependencyDashboardIssues() {
  console.log("Pinning Renovate Dependency Dashboard issues...");

  const issueUrls =
    await $`gh search issues --author='renovate[bot]' --owner=${owner} --limit=1000 --match=title --json=url --jq='[.[] | .url]' "Dependency Dashboard"`.json();
  for (const issueUrl of issueUrls) {
    await $`gh issue pin ${issueUrl}`.nothrow();
  }
}

await updateRepos();
await pinRenovateDependencyDashboardIssues();

console.log("Done");
