import { $ } from "bun";

const owner = "jianyuan";

async function updateRepos() {
  console.log("Updating repos...");

  const repos = await $`
    gh repo list \
      --no-archived \
      --limit=1000 \
      --json=nameWithOwner \
      --jq='[.[] | .nameWithOwner]
  `.json();

  console.log(`Found ${repos.length} repos`);

  await Promise.all(
    repos.map((repo: string) => {
      console.log(`Updating ${repo}`);
      return $`
        gh repo edit ${repo} \
          --allow-update-branch \
          --delete-branch-on-merge \
          --enable-merge-commit=false \
          --enable-rebase-merge=false \
          --enable-squash-merge
      `;
    }),
  );
}

async function pinRenovateDependencyDashboardIssues() {
  console.log("Pinning Renovate Dependency Dashboard issues...");

  const issueUrls = await $`
    gh search issues "Dependency Dashboard" \
      --author='renovate[bot]' \
      --owner="${owner}" \
      --match=title \
      --limit=1000 \
      --json=url \
      --jq='[.[] | .url]'
  `.json();

  await Promise.all(
    issueUrls.map((issueUrl: string) => {
      console.log(`Pinning ${issueUrl}`);
      return $`gh issue pin ${issueUrl}`.nothrow();
    }),
  );
}

await updateRepos();
await pinRenovateDependencyDashboardIssues();

console.log("Done");
