import { $ } from "bun";

const repos =
  await $`gh repo list --no-archived --limit 1000 --json nameWithOwner --jq '[.[] | .nameWithOwner]`.json();

console.log(`Found ${repos.length} repos`);

for (const repo of repos) {
  console.log(`Updating ${repo}`);
  await $`gh repo edit ${repo} --allow-update-branch --delete-branch-on-merge --enable-merge-commit=false --enable-rebase-merge=false --enable-squash-merge`;
}

console.log("Done");
