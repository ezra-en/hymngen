<script lang="ts">
	import SongInput from '$lib/workspace/SongInput.svelte' 

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
	<div class="flex flex-col gap-3 justify-center">
		<SongInput></SongInput>
	</div>
</main>
