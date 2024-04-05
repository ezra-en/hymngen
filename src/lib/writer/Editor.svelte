<script>
	import { ScrollArea } from '$lib/components/ui/scroll-area';
</script>

<!-- TODO: figure out how to achieve same padding effect, but without losing scroll control in the padding. possible solution with flex and centering, we'll see. -->
<ScrollArea
	orientation="both"
	class="font-display h-screen w-4/5 px-10 shadow-md
  dark:bg-slate-900 text-slate-900 dark:text-slate-300 md:px-20 lg:px-28 xl:px-40"
  
>
	<div class="pt-20"></div>
	<slot />
	<div class="pt-20"></div>
</ScrollArea>
