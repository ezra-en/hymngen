<script lang="ts">
	import SongInput from '$lib/workspace/SongInput.svelte' 
	import ModeToggle from '$lib/components/modeToggle.svelte';

	import { open } from '@tauri-apps/api/dialog';
	import { desktopDir } from '@tauri-apps/api/path';

	async function getWDir() {
		const wdir = await open({
		directory: true,
		multiple: false,
		defaultPath: await desktopDir(),
	});
	}
</script>

<main class="flex flex-row justify-center h-screen">
	<div class="fixed right-4 top-4 z-50">
		<ModeToggle />
	</div>
	<div class="flex flex-col gap-3 justify-center">
		<SongInput></SongInput>
	</div>
</main>
