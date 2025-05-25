<script lang="ts">
	import Check from 'svelte-radix/Check.svelte';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import { tick, onMount } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';	import { hymns } from '$lib/songbook/parsers';
	import type { icoHymn } from '$lib/songbook/types';
	import { addRecentHymn, getRecentHymns } from '$lib/cache/hymnCache';

	let open = false;
	export let setSelectedSong = 0;
	let recentHymns: icoHymn[] = [];

	let selectedValue = 'Find a song...';	$: {
		const song = hymns.find((hymn) => hymn.number === setSelectedSong);
		if (song) {
			selectedValue = `${song.number}: ${song.title}`;
			addRecentHymn(song).then(() => {
				getRecentHymns().then(hymns => {
					recentHymns = hymns;
				});
			});
		}
	}

	// Load recent hymns on mount
	onMount(async () => {
		recentHymns = await getRecentHymns();
	});

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
	// Create an optimized index for different search types
	let index = new FlexSearch.Document({
		document: {
			id: 'number',
			index: [
				{
					field: 'number',
					tokenize: 'strict',
					optimize: true,
					resolution: 9
				},
				{
					field: 'title',
					tokenize: 'forward',
					optimize: true,
					resolution: 9
				},
				{
					field: 'verseContent',
					tokenize: 'full',
					optimize: true,
					resolution: 9,
					minlength: 3,
					context: {
						depth: 2,
						resolution: 9
					}
				}
			]
		},
		tokenize: 'reverse',
		suggest: true
	});

	// Process hymns and add to index
	for (const hymn of hymns) {
		// Combine all verse content for full-text search with verse numbers
		const verseContent = hymn.verses
			.map((verse, idx) => `Verse ${idx + 1}: ${verse.lines.join(' ')}`)
			.join('\n');

		index.add({
			...hymn,
			verseContent
		});
	}

	let filteredResults: any[] = [];
	let searchString = '';
	interface GroupedResults {
		byNumber: icoHymn[];
		byTitle: icoHymn[];
		byContent: icoHymn[];
	}

	// Process search results
	$: {
		if (searchString === '') {
			filteredResults = [];
		} else {
			// Search across all fields
			const results = index.search(searchString, {
				enrich: true,
				suggest: true,
				limit: 15
			}); // Group results by field type
			const grouped: GroupedResults = {
				byNumber: [],
				byTitle: [],
				byContent: []
			};

			const seenHymns = new Set<number>();
			const contentScores = new Map<number, number>();

			results.forEach((result) => {
				result.result.forEach((hit) => {
					const hymn = hymns[hit - 1]; // Adjust for 0-based array

					if (result.field === 'verseContent') {
						// Calculate relevance score based on exact phrase matches
						const score = hymn.verses.reduce((total, verse) => {
							const content = verse.lines.join(' ').toLowerCase();
							const searchTerms = searchString.toLowerCase().split(' ');

							// Exact phrase match gets highest score
							if (content.includes(searchString.toLowerCase())) {
								return total + 10;
							}

							// All words in order but not consecutive still good
							if (searchTerms.every((term) => content.includes(term))) {
								return total + 5;
							}

							// Individual word matches get lower score
							return total + searchTerms.filter((term) => content.includes(term)).length;
						}, 0);

						contentScores.set(hymn.number, score);
					}

					if (!seenHymns.has(hymn.number)) {
						if (result.field === 'number') {
							grouped.byNumber.push(hymn);
						} else if (result.field === 'title') {
							grouped.byTitle.push(hymn);
						} else if (result.field === 'verseContent') {
							grouped.byContent.push(hymn);
						}
						seenHymns.add(hymn.number);
					}
				});
			});

			// Sort content results by relevance score
			grouped.byContent.sort((a, b) => {
				return (contentScores.get(b.number) || 0) - (contentScores.get(a.number) || 0);
			});

			filteredResults = grouped;
		}
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
	<Popover.Content class="min-w-[200px] p-0" side="bottom" avoidCollisions={false} align="start">
		<Command.Root shouldFilter={false}>			<Command.Input placeholder="Search songs..." class="h-9" bind:value={searchString} />
			<Command.Empty>No song found.</Command.Empty>
			<Command.List>
				{#if searchString === '' && recentHymns.length > 0}
					<Command.Group heading="Recent">
						{#each recentHymns as hymn}
							<Command.Item
								value={`${hymn.number}: ${hymn.title}`}
								onSelect={() => {
									setSelectedSong = hymn.number;
									closeAndFocusTrigger(ids.trigger);
								}}
							>
								<div class="flex flex-col">
									<div>{hymn.number}: {hymn.title}</div>
								</div>
							</Command.Item>
						{/each}
					</Command.Group>
				{:else if !filteredResults?.byNumber && searchString !== ''}
					<Command.Empty>No song found.</Command.Empty>
				{:else}
					{#if filteredResults.byNumber?.length > 0}
						<Command.Group heading="By Number">
							{#each filteredResults.byNumber as hymn}
								<Command.Item
									value={`${hymn.number}: ${hymn.title}`}
									onSelect={() => {
										setSelectedSong = hymn.number;
										closeAndFocusTrigger(ids.trigger);
									}}
								>
									<div class="flex flex-col">
										<div>{hymn.number}: {hymn.title}</div>
									</div>
								</Command.Item>
							{/each}
						</Command.Group>
					{/if}

					{#if filteredResults.byTitle?.length > 0}
						<Command.Group heading="By Title">
							{#each filteredResults.byTitle as hymn}
								<Command.Item
									value={`${hymn.number}: ${hymn.title}`}
									onSelect={() => {
										setSelectedSong = hymn.number;
										closeAndFocusTrigger(ids.trigger);
									}}
								>
									<Check
										class={cn(
											'mr-2 h-4 w-4',
											setSelectedSong !== hymn.number && 'text-transparent'
										)}
									/>
									<div class="flex flex-col">
										<div>{hymn.number}: {hymn.title}</div>
									</div>
								</Command.Item>
							{/each}
						</Command.Group>
					{/if}

					{#if filteredResults.byContent?.length > 0}
						<Command.Group heading="In Lyrics">
							{#each filteredResults.byContent as hymn}
								<Command.Item
									value={`${hymn.number}: ${hymn.title}`}
									onSelect={() => {
										setSelectedSong = hymn.number;
										closeAndFocusTrigger(ids.trigger);
									}}
								>
									<Check
										class={cn(
											'mr-2 h-4 w-4',
											setSelectedSong !== hymn.number && 'text-transparent'
										)}
									/>
									<div class="flex flex-col">
										<div>{hymn.number}: {hymn.title}</div>
										{#if hymn.verses?.[0]?.lines?.[0]}
											<div class="truncate text-sm text-muted-foreground">
												{hymn.verses[0].lines[0]}
											</div>
										{/if}
									</div>
								</Command.Item>
							{/each}
						</Command.Group>
					{/if}
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
