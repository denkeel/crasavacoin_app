// src/routes/tasks/+page.svelte

<script>
  import { tasks } from '$lib/tasks';
</script>

<h1>Task List</h1>
<ul>
  {#each tasks as task}
    <li>
      <a href={`/tasks/${task.slug}`}>{task.title}</a>
    </li>
  {/each}
</ul>
