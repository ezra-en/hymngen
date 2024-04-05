<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { isTauriEnv } from '$lib/tauri';
	import { toast } from 'svelte-sonner';
	import { Separator } from '$lib/components/ui/separator';

	import Drawer from '$lib/workspace/Drawer.svelte';
	import Editor from '$lib/writer/Editor.svelte';
	import { toggleMode } from 'mode-watcher';
	import WorkspaceSelect from '$lib/workspace/WorkspaceSelect.svelte';
	import H1 from '$lib/writer/typo/H1.svelte';

// FloatingUI
	import { offset, flip, shift } from "svelte-floating-ui/dom";
  import { createFloatingActions } from "svelte-floating-ui";

  const [ floatingRef, floatingContent ] = createFloatingActions({
    strategy: "absolute",
    placement: "top",
    middleware: [
      offset(6),
      flip(),
      shift(),
    ]
  });

  let showTooltip: boolean = false;
</script>

<main class="flex flex-row">
	<Drawer>
		<WorkspaceSelect></WorkspaceSelect>
		<button
  on:mouseenter={() => showTooltip = true}
  on:mouseleave={() => showTooltip = false}
  use:floatingRef
>Hover me</button>

{#if showTooltip}
  <div style="position:absolute" use:floatingContent>
    Tooltip
  </div>
{/if}
	</Drawer>
	<Editor>
		<H1>h1 - Taxing Laughter: The Joke Tax Chronicles</H1>

		<h2
			class="outline- scroll-m-20 border-b pb-4 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-slate-600 [&:not(:first-child)]:mt-6"
		>
			h2- The People of the Kingdom
		</h2>

		<h3
			class="outline- scroll-m-20 text-2xl font-semibold tracking-tight [&:not(:first-child)]:mt-4"
		>
			h3 - The Joke Tax
		</h3>

		<h4
			class="outline- scroll-m-20 text-xl font-semibold tracking-tight [&:not(:first-child)]:mt-4"
		>
			h4 - People stopped telling jokes
		</h4>

		<p class="outline- leading-7 [&:not(:first-child)]:mt-6">
			p - Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging
			on his throne. One day, his advisors came to him with a problem: the kingdom was running out
			of money.
		</p>

		<blockquote class="outline- mt-6 border-l-2 pl-5 italic dark:border-slate-500">
			"After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for
			the privilege."
		</blockquote>

		<ul class="outline- my-6 ml-6 list-disc [&>li]:mt-2">
			<li>1st level of puns: 5 gold coins</li>
			<li>2nd level of jokes: 10 gold coins</li>
			<li>3rd level of one-liners : 20 gold coins</li>
		</ul>

		<p class="outline- text-xl text-muted-foreground [&:not(:first-child)]:mt-6">
			lead - A modal dialog that interrupts the user with important content and expects a response.
		</p>

		<p class="outline- leading-7 [&:not(:first-child)]:mt-6">
			p - The king, seeing how much happier his subjects were, realized the error of his ways and
			repealed the joke tax.
		</p>
		<p class="outline- ml-5 leading-7 [&:not(:first-child)]:mt-2">
			p depth 2 - The king, seeing how much happier his subjects were, realized the error of his
			ways and repealed the joke tax.
		</p>
	</Editor>
	{#if isTauriEnv()}
		<Button variant="outline" on:click={toggleMode}>Tauri</Button>
	{:else}
		<Button variant="secondary" on:click={toggleMode}>Browser</Button>
	{/if}
</main>
