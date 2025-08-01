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
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';

	import Fade from 'embla-carousel-fade';
	import { Copy } from 'lucide-svelte';
	import { onMount, onDestroy } from 'svelte';

	let songStr: string;
	let valid: boolean;
	let songData: icoHymn;

	let checkSong: boolean;

	let song: number;

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

	let api: CarouselAPI;

	let current = 1;
	let totalSlides = 0;

	// Update totalSlides when songData changes
	$: if (songData) {
		totalSlides = parseSong(songData).length;
	}

	// Set up carousel API listeners when api becomes available
	$: if (api) {
		current = api.selectedScrollSnap() + 1;
		api.on('select', () => {
			current = api.selectedScrollSnap() + 1;
		});
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!api) return;
		if (e.key === 'ArrowRight' || e.key === ' ') {
			api.scrollNext();
		} else if (e.key === 'ArrowLeft') {
			api.scrollPrev();
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	onDestroy(() => {
		document.removeEventListener('keydown', handleKeydown);
	});

	let carouselContainer: HTMLElement;
</script>

<main class="flex flex-col gap-1.5">
	<Label for="song">Song Number</Label>
	<div class="flex flex-row gap-3">
		<Search bind:setSelectedSong={song} />
		<Button variant="outline" disabled={!valid} on:click={generate}>
			{#if !valid}
				Enter Song #
			{:else}
				Download {songData.title}.pptx
			{/if}
		</Button>
		<Button
			variant="outline"
			disabled={!valid}
			on:click={() => {
				if (carouselContainer) {
					if (document.fullscreenElement) {
						document.exitFullscreen();
					} else {
						carouselContainer.requestFullscreen();
					}
				}
			}}
		>
			{#if document.fullscreenElement}
				Exit Fullscreen
			{:else}
				Present
			{/if}
		</Button>
	</div>
	{#if valid}
		{#key songData}
			<div bind:this={carouselContainer} class="h-full w-full">
				<Carousel.Root
					class="mx-auto aspect-video h-full w-full transition-all duration-300"
					bind:api
					opts={{
						align: 'center',
						watchDrag: false,
						containScroll: false
					}}
					plugins={[Fade({ fade: true, crossFade: true })]}
				>
					<Carousel.Content class={`group ml-0 h-full w-full`}>
						{#each parseSong(songData) as slide}
							<Carousel.Item
								class="h-full w-full rounded-sm border border-gray-200 bg-white p-4"
								style="font-family: Albert Sans"
								id={slide.name}
							>
								<AspectRatio ratio={16 / 9}>
									<div class="presentation-content relative h-full">
										{#if !document.fullscreenElement}
											<Button
												class="absolute right-2 top-2 z-10 h-7 w-7 px-1 text-slate-400"
												size="sm"
												variant="outline"
												on:click={() => {
													navigator.clipboard.writeText(slide.text);
													toast('Copied verse text to clipboard!');
												}}
												aria-label="Copy verse text"
											>
												<Copy />
											</Button>
											<div
												class="absolute left-2 top-2 z-10 rounded-md bg-black/50 px-2 py-1 text-sm text-white"
											>
												{current} / {totalSlides}
											</div>
										{/if}
										<div class="mb-4 text-center">
											<h2 class="text-xl font-normal">{slide.name}</h2>
										</div>
										<div class="flex flex-1 items-center justify-center">
											<pre
												style="font-family: Albert Sans"
												class="w-full whitespace-pre-wrap text-center text-3xl">{slide.text}</pre>
										</div>
									</div>
								</AspectRatio>
							</Carousel.Item>
						{/each}
					</Carousel.Content>
					<Carousel.Previous />
					<Carousel.Next />
				</Carousel.Root>
			</div>
		{/key}
	{/if}
</main>
