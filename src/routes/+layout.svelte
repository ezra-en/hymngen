<script>
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.pcss';
  import { ModeWatcher } from "mode-watcher";
	// @ts-ignore
	import { inject } from '@vercel/analytics'
</script>
 
<ModeWatcher />
<Toaster />
<slot />
