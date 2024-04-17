<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label';
	import { Textarea as pre } from '$lib/components/ui/textarea';
	import { getSong, parseSong } from '$lib/songbook/parsers';
	import { icoHymnSchema, type icoHymn } from '$lib/songbook/types';
	import { exportSongPPTX } from '$lib/songbook/renderers';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import { toast } from 'svelte-sonner';

	let songStr: string;
	let valid: boolean;
	let songData: icoHymn;

	let checkSong: boolean;

	let value: number;
	function onEdit() {
		const songFetch = getSong(value);
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
		toast(`Generating AH${songData.number} PPTX`)
		exportSongPPTX(songData.number)
	}
</script>

<main class="flex flex-col gap-1.5">
	<Label for="song">Song Number</Label>
	<div class="flex flex-row gap-3">
		<Input id="song" type="number" placeholder="AH000" bind:value on:input={onEdit} class="w-28"
		></Input>
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
			<ScrollArea class="flex h-[21rem] w-[595px] gap-5 rounded-md border p-4">
				{#each parseSong(songData) as slide}
					<Label for={slide.name}>{slide.name}</Label>
					<div class="h-[265px] flex flex-col align-middle justify-start overflow-auto">
						<pre 
						style="font-family: Albert Sans" 
						class="w-full align-middle text-center text-3xl leading-relaxed whitespace-pre-wrap"
						>{slide.text}</pre>
					</div>
				
					<Separator></Separator>
				{/each}
			</ScrollArea>
		{/key}
	{/if}
</main>
