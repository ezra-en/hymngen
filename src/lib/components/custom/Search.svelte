<script lang="ts">
	import Check from 'svelte-radix/Check.svelte';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { hymns } from '$lib/songbook/parsers';
	import type { icoHymn } from '$lib/songbook/types';

	let open = false;
	export let setSelectedSong = 0;

	let selectedValue = 'Find a song...';
	$: {
		const song = hymns.find((hymn) => hymn.number === setSelectedSong);
		if (song) selectedValue = `${song.number}: ${song.title}`;
	}

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	import FlexSearch from 'flexsearch';

	let index = new FlexSearch.Document({
		document: {
			id: 'number',
			index: ['title', 'verses:lines']
		},
		tokenize: 'forward'
		// store: true
	});
	// console.log(...hymns);
	for (const hymn of hymns) {
		index.add(hymn);
	}
	console.log(index);

	let filteredResults: any[] = [];
	let searchString = '';
	$: {
		if (searchString === '') {
			filteredResults = [];
		} else {
			filteredResults = index.search(searchString, 15);
		}
		console.log('"', searchString, '"', 'fi: ', filteredResults);
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-auto justify-between"
		>
			{selectedValue}
			<CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0" side="bottom" avoidCollisions={false}>
		<Command.Root shouldFilter={false}>
			<Command.Input placeholder="Search songs..." class="h-9" bind:value={searchString} />
			<!-- <Command.Empty>No song found.</Command.Empty> -->
			<Command.List>
				{#key filteredResults}
					{#each filteredResults as res}
						<!-- <p>{JSON.stringify(res)}</p> -->
						{#if res.field == 'title'}
							{#each res.result as hymnNum}
								{@const hymn = hymns[hymnNum - 1]}
								<!-- <Command.Item> -->
								<p>
									{hymn.number}: {hymn.title}
								</p>
								<!-- </Command.Item>  -->
								<!-- <Command.Item
									value={`${hymn.number}: ${hymn.title}`}
									onSelect={(selectedValue) => {
										setSelectedSong = Number(selectedValue.split(':')[0]);
										closeAndFocusTrigger(ids.trigger);
									}}
								>
									<Check
										class={cn(
											'mr-2 max-h-4 max-w-4',
											setSelectedSong !== hymn.number && 'text-transparent'
										)}
									/>
									<p>
										{hymn.number}: {hymn.title}
									</p>
								</Command.Item>  -->
							{/each}
						{/if}
					{/each}
					<!-- <VirtualList bind:this={virtList} width="100%" height={600} itemCount={hymns.length} itemSize={50}>
          <Command.Item slot="item" let:index let:style {style}
					value={`${hymns[index].number}: ${hymns[index].title}`}
					onSelect={(selectedValue) => {
						setSelectedSong = Number(selectedValue.split(':')[0]);
						closeAndFocusTrigger(ids.trigger);
						}}
						>
						<Check
						class={cn(
							'mr-2 max-h-4 max-w-4',
							setSelectedSong !== hymns[index].number && 'text-transparent'
							)}
							/>
						{hymns[index].number}: {hymns[index].title}
						</Command.Item>
						</VirtualList> -->
				{/key}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
