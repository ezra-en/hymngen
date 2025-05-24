<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label';
	import { Textarea as pre } from '$lib/components/ui/textarea';
	import { getSongNum, getSongTitle, parseSong } from '$lib/songbook/parsers';
	import { icoHymnSchema, type icoHymn } from '$lib/songbook/types';
	import { exportSongPPTX } from '$lib/songbook/renderers';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import { toast } from 'svelte-sonner';
	import Search from '$lib/components/custom/Search.svelte';

	let songStr: string;
	let valid: boolean;
	let songData: icoHymn;

	let checkSong: boolean;

	// let songNum: number;
	let song: number

	// export function onEdit() {
	$: {
		const songFetch = getSongNum(song);
		// const songFetch = getSongTitle(songTitle);
		const songCheck = icoHymnSchema.safeParse(songFetch);
		console.log(songCheck);
		checkSong = false;
		if (songCheck.success) {
			songStr = ` ${songFetch.title}`;
			valid = true;
			console.log(`got:  ${songStr}`);
			songData = songCheck.data;
		} else {
			valid = false;
			console.error(`err: ${songCheck.error}`);
		}
	}

	function generate() {
		toast(`Generating AH${songData.number} PPTX`);
		exportSongPPTX(songData.number);
	}
</script>

<main class="flex flex-col gap-1.5">
	<Label for="song">Song Number</Label>
	<div class="flex flex-row gap-3">
		<!-- <Input id="song" type="number" placeholder="AH000" bind:value on:input={onEdit} class="w-28"
		></Input> -->
		<Search bind:setSelectedSong={song} />
		<Button variant="outline" disabled={!valid} on:click={generate}>
			{#if !valid}
				Enter Song #
			{:else}
				Get {songData.title}
			{/if}
		</Button>
	</div>
	{#if valid}
		{#key songData}
			<ScrollArea class="flex h-[21rem] w-[37.3rem] gap-5 rounded-md border p-4">
				{#each parseSong(songData) as slide}
					<Label for={slide.name}>{slide.name}</Label>
					<div class="flex h-[265px] flex-col justify-start overflow-auto align-middle">
						<pre
							style="font-family: Albert Sans"
							class="w-full whitespace-pre-wrap text-center align-middle text-3xl leading-relaxed">{slide.text}</pre>
					</div>

					<Separator></Separator>
				{/each}
			</ScrollArea>
		{/key}
	{/if}
</main>
