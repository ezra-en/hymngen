import songFile from './SDAH.json' assert { type: 'json' };
import { z } from 'zod';
import pptxgen from 'pptxgenjs';

const icoInfoSchema = z.object({
	type: z.string(),
	value: z.string()
});

const icoVerseSchema = z.object({
	type: z.literal('Verse'),
	verseNo: z.string(), // string of number
	lines: z.string().array()
});
type icoVerse = z.infer<typeof icoVerseSchema>

const icoRefrainSchema = z.object({
	type: z.literal('Refrain'),
	lines: z.string().array()
});
type icoRefrain = z.infer<typeof icoRefrainSchema>

const icoHymnSchema = z.object({
	number: z.number(),
	title: z.string(),
	verses: z.union([icoVerseSchema, icoRefrainSchema]).array(),
	info: icoInfoSchema.array()
});
type icoHymn = z.infer<typeof icoHymnSchema>;

const icoSongbookSchema = z.object({
	name: z.string(),
	copyright: z.string(),
	prefix: z.string(),
	hymns: icoHymnSchema.array()
});
type icoSongbook = z.infer<typeof icoSongbookSchema>;

function convertICOSongbook(icoSongbook: icoSongbook) {}

function addSlideNumber(currentSlide: number, totalSlides: number, slide: pptxgen.Slide) {
	slide.addText(`${currentSlide}/${totalSlides}`, {
		x: '90%',
		y: '90%',
		fontFace: 'Montserrat ExtraBold',
		fontSize: 24,
		bold: true
	});
}

function renderSlide(
	currentSlide: number,
	totalSlides: number,
	lines: string,
	songNum: number,
	songTitle: string,
	pptx: pptxgen
) {
	let slide = pptx.addSlide();

	slide.background = { color: 'F2F2F2' };

	// Title
	slide.addText(`AH${songNum}: ${songTitle}`, {
		fontFace: 'Montserrat ExtraBold',
		fontSize: 33,
		align: 'center',
		w: '100%',
		h: 1.0
	});

	// Slide Numbers
	addSlideNumber(currentSlide, totalSlides, slide);

	slide.addText(lines, {
		align: 'center',
		fontSize: 36,
		fontFace: 'Albert Sans',
		w: '100%',
		h: '80%',
		y: 1.0,
		lineSpacingMultiple: 1.5
	});
}

function exportSongPPTX(songNum: number, prefix: string = '') {
	const songsData = icoSongbookSchema.safeParse(songFile);

	if (songsData.success) {
		const songs = songsData.data;
		const songResult = songs.hymns.find((hymn) => hymn.number === songNum);

		const songParse = icoHymnSchema.safeParse(songResult);
		if (songParse.success) {

			const songFetch = songParse.data;
      let verses = songFetch.verses

			let pptx = new pptxgen();

			const songVersesL = verses.length;

      // Refrain support
      const refrain = verses.find((verse) => verse.type === "Refrain")
      if (refrain !== undefined) {
        verses = verses.filter((verse) => verse.type !== "Refrain")
        verses
      }

      const verseTextSlides: string[] = []
			verses.forEach((v, verseI) => {
				// Verses
        function parseVerses(v: icoVerse, verseIndex: number) {
          const verseLinesL = v.lines.length;
  
          let verseText = '';
          const optimalLines = 4
  
          // console.log(lines % 4);
          // const vSlides = Math.floor(lines / 4);
  
          if (verseLinesL < 5) {
            v.lines.forEach((line, lineI) => {
              verseText =
                verseText +
                `${line}${
                  verseI + 1 == songVersesL && lineI + 1 == verseLinesL ? ' Ø' : '' // if EOV & EOH, place ' Ø' signaling EOS
                }${lineI + 1 !== verseLinesL ? '\n' : ''}`;
            });
  
            verseTextSlides.push(verseText)
            // renderSlide(verseI + 1, verses, verseText, songFetch.number, songFetch.title, pptx);
            verseText = ''
          } else 
  
          if (Math.floor(verseLinesL / optimalLines) > 1) {
  
            const vSlidesNum = Math.floor(verseLinesL / optimalLines);
            // vSlides;
            for (let i = 0; i < vSlidesNum; i++) {
              const begin = i * optimalLines;
              const end = (i + 1) * optimalLines;
              // console.log(i, begin, end);
              const chop = v.lines.slice(begin, end);
              // chop
              chop.forEach((line, lineI) => {
  
  
                
                verseText =
                  verseText +
                  `${line}${lineI + 1 !== verseLinesL ? '\n' : ''}`;
              });
              // console.log(i,[begin, end], chop)
  
              verseTextSlides.push(verseText)
              // renderSlide(i + 1, vSlides, verseText, songFetch.number, songFetch.title, pptx);
              verseText = ''
            }
          }
        }

        if (refrain !== undefined) {
          verseTextSlides.push()
        }
			});
      const slidesL = verseTextSlides.length

      verseTextSlides.forEach((slide, i) => {
        renderSlide(i+1, slidesL, slide, songFetch.number, songFetch.title, pptx);
      });

			pptx.writeFile({
				fileName: `${prefix}${songs.prefix}${songFetch.number} ${songFetch.title}`
			});
		} else console.error(songParse.error);
	} else {
		console.log(songsData.error);
	}
}


exportSongPPTX(260, '1 SS 1 - ') //hover oer me
// exportSongPPTX(483, '2 SS 2 - ') // I need thee
// exportSongPPTX(100, '3 Extra - ') // GReat is thy faithfulness
// exportSongPPTX(492, '4 SS Opening - '),
// exportSongPPTX(318, '5 Divine 1 - ') // Whiter than snow
// exportSongPPTX(258, '6 Divine Opening - ') // Baptize us anew
// exportSongPPTX(403, 'Communion - ')
// exportSongPPTX(336, 'Communion - ');


//  TODO: Refrain support!!!
