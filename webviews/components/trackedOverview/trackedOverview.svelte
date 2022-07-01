<script lang="ts">
    import { currentProject, projects } from "./stores";
    import { showDHMS } from "../utils/time";

    import "../base.css"
</script>

<h1 class="m-4 text-4xl font-bold text-center">{$currentProject?.project.name}</h1>

<div class="max-w-5xl mx-auto mt-16">
    <h2 class="w-full p-2 text-xl border-b-2 border-current">Project stats</h2>
    <ul class="flex flex-wrap justify-around gap-4 py-8 text-lg">
        <li>
            <span class="text-gray-400">Creation:</span> {new Date($currentProject?.project.timestamp || 0).toLocaleDateString()}
        </li>
        <li>
            <span class="text-gray-400">Total time spent:</span> {showDHMS($currentProject?.sessions.reduce((acc, cur)=>acc + cur.duration, 0) || 0)}
        </li>
        <li>
            <span class="text-gray-400">Days of work:</span> {$currentProject?.sessions.length}
        </li>
    </ul>
</div>