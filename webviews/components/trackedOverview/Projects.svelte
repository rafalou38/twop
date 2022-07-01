<script lang="ts">
  import { showDHMS } from "../utils/time";
  import { currentProjectID, projects } from "./stores";

  function sort(criteria: "name" | "creation" | "last edit" | "spent") {
    console.log("sort");

    switch (criteria) {
      case "name":
        projects.update((old) => old.sort().reverse());
        break;
      case "creation":
        projects.update((old) =>
          old.sort((a, b) =>
            b.project.timestamp > a.project.timestamp ? 1 : -1
          )
        );
        break;
      case "last edit":
        projects.update((old) =>
          old.sort((a, b) =>
            (a.sessions.at(-1)?.timestamp || 0) >
            (b.sessions.at(-1)?.timestamp || 0)
              ? 1
              : -1
          )
        );
        break;
      case "spent":
        projects.update((old) =>
          old.sort((a, b) =>
            b.sessions.reduce((c, cu) => c + cu.duration, 0) >
            a.sessions.reduce((c, cu) => c + cu.duration, 0)
              ? 1
              : -1
          )
        );
        break;

      default:
        break;
    }
  }
</script>

<vscode-data-grid aria-label="Basic">
  <vscode-data-grid-row row-type="header">
    <vscode-data-grid-cell
      cell-type="columnheader"
      grid-column="1"
      on:click={() => sort("name")}>Project name</vscode-data-grid-cell
    >
    <vscode-data-grid-cell
      cell-type="columnheader"
      grid-column="2"
      on:click={() => sort("creation")}>Creation date</vscode-data-grid-cell
    >
    <vscode-data-grid-cell
      cell-type="columnheader"
      grid-column="3"
      on:click={() => sort("last edit")}>Last edit</vscode-data-grid-cell
    >
    <vscode-data-grid-cell
      cell-type="columnheader"
      grid-column="4"
      on:click={() => sort("spent")}>Time spent</vscode-data-grid-cell
    >
    <vscode-data-grid-cell cell-type="columnheader" grid-column="5"
      >Actions</vscode-data-grid-cell
    >
  </vscode-data-grid-row>
  {#each $projects as project}
    <vscode-data-grid-row>
      <vscode-data-grid-cell grid-column="1">
        <!-- Project name -->
        {project.project.name}
      </vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="2">
        <!-- Creation date -->
        {new Date(project.project.timestamp).toLocaleDateString()}
      </vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="3">
        <!-- Last edit -->
        {new Date(project.sessions.at(-1)?.timestamp || 0).toLocaleDateString()}
      </vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="4">
        <!-- Time spent -->
        {showDHMS(project.sessions.reduce((acc, cur) => acc + cur.duration, 0))}
      </vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="5">
        <!-- Actions -->
        <vscode-button>open</vscode-button>
        <vscode-button
          appearance="secondary"
          on:click={() => currentProjectID.set(project.project._id)}
          >view stats</vscode-button
        >
        <!-- <vscode-button appearance="icon" aria-label="Confirm">
          <span class="codicon codicon-folder-opened" />
        </vscode-button> -->
        <!-- <vscode-button appearance="icon" aria-label="Confirm">
          <span class="codicon codicon-trash" />
        </vscode-button> -->
      </vscode-data-grid-cell>
    </vscode-data-grid-row>
  {/each}
</vscode-data-grid>
