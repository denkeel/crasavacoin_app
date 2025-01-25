// src/routes/tasks/[slug]/+page.svelte

<script>
  import { tasks } from '$lib/tasks';

  export let params;

  const task = tasks.find(t => t.slug === params.slug);

  if (!task) {
    // Handle task not found
    // For example, set a default task or show an error message
  }
</script>

{#if task}
  <h1>{task.title}</h1>
  <img src={task.image} alt={task.title} />
  <p>Coins: {task.coins}</p>
{:else}
  <p>Task not found.</p>
{/if}
