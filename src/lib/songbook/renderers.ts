// import PptxGenJS from 'pptxgenjs'

function addSlideNumber(currentSlide: number, totalSlides: number, slide: PptxGenJS.Slide) {
	slide.addText(`${currentSlide}/${totalSlides}`, {
		x: '90%',
		y: '90%',
		fontFace: 'Montserrat ExtraBold',
		fontSize: 24,
		bold: true,
		w: 1.0,
		h: 0.5
	});
}

export function renderSlide(
	pptx: PptxGenJS,
	slideNumber: number,
	slideTotal: number,
	stanzaTitle: string = '',
	stanzaContent: string,
	songTitle: string,
	songbookPrefix?: string,
  songNum?: number
) {
	let slide = pptx.addSlide();

	slide.background = { color: 'F2F2F2' };
	
  // Title
  
    if (songbookPrefix) {
  
      slide.addText(`${songbookPrefix}${songNum}: ${songTitle}`, {
        fontFace: 'Montserrat ExtraBold',
        fontSize: 33,
        align: 'center',
        w: '100%',
        h: 1.0
      });
    } else {
      slide.addText(`${songTitle}`, {
        fontFace: 'Montserrat ExtraBold',
        fontSize: 33,
        align: 'center',
        w: '100%',
        h: 1.0
      });
    }

	slide.addText(`${stanzaTitle}`, {
		fontFace: 'Montserrat SemiBold',
		fontSize: 24,
		align: 'center',
		w: '100%',
		h: 1.0,
		y: 0.5
	});

	// Slide Numbers
	addSlideNumber(slideNumber, slideTotal, slide);

	// Content
	slide.addText(stanzaContent, {
		align: 'center',
		fontSize: 36,
		fontFace: 'Albert Sans',
		w: '100%',
		h: '75%',
		y: 1.2,
		lineSpacingMultiple: 1.5
	});
}


import songFile from './SDAH.json' assert { type: 'json' };
import { parseSong } from './parsers';
import { type icoHymn, icoHymnSchema, icoSongbookSchema } from './types';

export function exportSongPPTX(songNum: number = 0, prefix: string = '', songData?: icoHymn) {
  if (songData) {
    const songParse = icoHymnSchema.safeParse(songData);
		if (songParse.success) {
			const songFetch = songParse.data;

			let pptx = new PptxGenJS();

			const slides = parseSong(songFetch);
			console.log(slides);

			slides.forEach((slide, i) => {
				renderSlide(
					pptx,
					i + 1,
					slides.length,
					slide.name,
					slide.text,
					songFetch.title,
          // songsData.prefix,
          // songFetch.number,
				);
			});

			// programmatically set pptx.layout?

			pptx.writeFile({
				fileName: `${prefix} ${songFetch.title}`
			});
		} else console.error(songParse.error);
  } else {

	const songsData = icoSongbookSchema.safeParse(songFile);

	if (songsData.success) {
		const songbook = songsData.data;
		const songResult = songbook.hymns.find((hymn) => hymn.number === songNum);

		const songParse = icoHymnSchema.safeParse(songResult);
		if (songParse.success) {
			const songFetch = songParse.data;

			let pptx = new PptxGenJS();

			const slides = parseSong(songFetch);
			console.log(slides);

			slides.forEach((slide, i) => {
				renderSlide(
					pptx,
					i + 1,
					slides.length,
					slide.name,
					slide.text,
					songFetch.title,
          songbook.prefix,
          songFetch.number,
				);
			});

			function nextSabbath(nowDate: Date) {
				const today = new Date(nowDate)
				console.log(today)
				const nextSabbath = new Date(today.setDate(today.getDate() + (6 - today.getDay())))
				console.log(today)
				return nextSabbath
			}

			function dateFormat(nowDate: Date) {
				console.log(nowDate)
				return nowDate.toLocaleDateString().split('/').reverse().join('-')
			}

			pptx.writeFile({
				fileName: `${dateFormat(nextSabbath(new Date()))} ${songbook.prefix}${songFetch.number?.toString().padStart(3, '0')} ${songFetch.title}`
			});
		} else console.error(songParse.error);
	} else {
		console.log(songsData.error);
	}
}
}