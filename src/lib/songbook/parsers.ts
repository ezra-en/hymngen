import { renderSlide } from './renderers';
import {
	icoRefrainSchema,
	type icoHymn,
	type icoRefrain,
	type icoVerse,
	icoStanzaSchema
} from './types';

export function lineWidthEstimator(line: string) {
	const thinChar = new RegExp(/[fijlt,';]/g);
	const midChar = new RegExp(/[abcdeghknopqrsuvxyzIJL ]/g);
	const wideChar = new RegExp(/[mwABCDEFGHKNOPQRSTUVXYZMW—]/g);

	// Line Estimation
	const thinLW = line.match(thinChar) !== null ? line.match(thinChar)!.length : 0;
	const midLW = line.match(midChar) !== null ? line.match(midChar)!.length : 0;
	const wideLW = line.match(wideChar) !== null ? line.match(wideChar)!.length : 0;

	return thinLW * 0.5 + midLW + wideLW * 1.8;
	// console.log(thinLW, midLW, wideLW, lineW, line);
}

export function adjustVerseWidth(verse: icoVerse): string[] {
	const lines = verse.lines;

	const adjustedLines: string[] = [];

	lines.forEach((line) => {
		const lineW = lineWidthEstimator(line);

		if (lineW > 40.1) {
			console.log(line, lineW);
			const words = line.trim().split(/(?=[—])|[ ]/g);
			const chars = line.trim().split('');

			const pIndexes: number[] = [];
			chars.slice(0, -1).reduce((last, char, wordI) => {
				if (char.match(/[,—;]/g) !== null) {
					pIndexes.push(wordI);
					return char;
				} else return '';
			});

			const halfwayChars = chars.length / 2;
			const halfwayWords = words.length / 2;
			console.log(pIndexes, halfwayChars, line);
			let nIndex;

			pIndexes.forEach((pIndex) => {
				console.log(pIndex, line.slice(0, pIndex + 1));
				if (Math.abs(pIndex - halfwayChars) <= 8) {
					nIndex = pIndex + 1;
					console.log(nIndex, halfwayChars, line.slice(0, nIndex));
				}
			});
			if (nIndex == undefined) {
				nIndex = words.slice(0, halfwayWords).join(' ').length;
				console.log(nIndex, line.slice(0, nIndex));
			}

			console.log(nIndex, words.length / 2);
			const a = chars.slice(0, nIndex);
			const b = chars.slice(a.length);
			console.log(a.join(''), b.join(''));
			adjustedLines.push(a.join(''));
			adjustedLines.push(b.join(''));
			// adjustedLines.push(line)
		} else adjustedLines.push(line);
		// Word Estimation
		// const words = line.trim().split(' ');

		// const wordLen: { word: string; length: number; width: number }[] = [];

		// words.forEach((word) => {
		// 	const thinWW = word.match(thinChar) != null ? word.match(thinChar)!.length : 0;
		// 	const midWW = word.match(midChar) != null ? word.match(midChar)!.length : 0;
		// 	const wideWW = word.match(wideChar)! != null ? word.match(wideChar)!.length : 0;
		// 	const wordW = thinWW * 0.5 + midWW + wideWW * 1.8;

		// 	wordLen.push({ word: word, length: word.length, width: wordW });
		// });
		// wordLen;
	});

	return adjustedLines;
}

export function parseVerse(v: icoVerse, isLastSlide: boolean) {
	const isStanza = icoStanzaSchema.safeParse(v);
	const verseTitle = isStanza.success ? `${v.type} ${isStanza.data.verseNo}` : v.type;

	const slides: { text: string; name?: string }[] = [];

	const lines = adjustVerseWidth(v);
	// const lines = v.lines
	lines;
	const linesNum = lines.length;

	let verseText = '';
	linesNum;
	let optimalLineNum = 5;

	if (linesNum % 3 == 0) {
		// 3, 6, 9
		verseTitle;
		optimalLineNum = 3;
	} else if (
		(linesNum % 2 == 0 && linesNum > optimalLineNum && linesNum % 5 !== 0) || // currently stuff like 6 (split by 3 first), 8
		linesNum % 7 == 0
	) {
		verseTitle;
		optimalLineNum = 4;
	}
	console.log(Math.floor(linesNum / optimalLineNum));
	verseTitle;
	linesNum;
	lines;
	optimalLineNum;
	if (linesNum <= optimalLineNum) {
		verseTitle;
		// Optimal Line length
		lines.forEach((line, lineI) => {
			verseText =
				verseText +
				`${line}${
					isLastSlide && lineI + 1 == linesNum ? ' Ø' : '' // if EOV & EOH, place ' Ø' signaling EOS
				}${lineI + 1 !== linesNum ? '\n' : ''}`;
		});
		verseText;

		slides.push({ text: verseText, name: verseTitle });
		verseText = '';
	} else if (Math.ceil(linesNum / optimalLineNum) > 1) {
		verseTitle;
		const vSlidesNum = Math.ceil(linesNum / optimalLineNum);
		vSlidesNum;

		for (let i = 0; i < vSlidesNum; i++) {
			i;
			const isLastSlidePostReflow = i + 1 == vSlidesNum && isLastSlide;

			const begin = i * optimalLineNum;
			const end = (i + 1) * optimalLineNum;
			const chop = lines.slice(begin, end);
			console.log(vSlidesNum, linesNum, begin, end, chop);
			// chop;
			chop.forEach((line, lineIndex) => {
				const isLastLinePostChop = lineIndex + 1 == chop.length;
				verseText =
					verseText +
					`${line}${
						isLastSlidePostReflow && isLastLinePostChop ? ' Ø' : '' // if EOV & EOH, place ' Ø' signaling EOS
					}${lineIndex + 1 !== linesNum ? '\n' : ''}`;
			});

			slides.push({ text: verseText, name: verseTitle });
			verseText = '';
		}
	}
	// slides;
	return slides;
}

export function parseSong(song: icoHymn): {
	text: string;
	name?: string | undefined;
}[] {
	// Parse all verses, check for est. line length -> find how many real lines needed, then give back slides
	let verses = song.verses;

	// Refrain support
	const refrain = verses.find((verse) =>
		icoRefrainSchema.safeParse(verse).success ? true : false
	);

	const hasRefrain = refrain !== undefined;
	refrain;
	if (hasRefrain) {
		verses = verses.filter((verse) => verse.type !== 'Refrain');
		verses;
	}

	const verseSlides: { text: string; name?: string }[] = [];

	verses.forEach((v, verseIndex) => {
		if (hasRefrain) {
			verseSlides.push(...parseVerse(v, false));
			verseSlides.push(...parseVerse(refrain, (verseIndex + 1) * 2 === verses.length * 2));
		} else verseSlides.push(...parseVerse(v, verseIndex + 1 === verses.length));
	});
	return verseSlides;
}

import songFile from './SDAH.json' assert { type: 'json' };

export function getSong(number: number) {
	return songFile.hymns.find((hymn) => hymn.number == number)!;
}

// Refrain test
// const refrainTest = parseSong(getSong(260));
// refrainTest;

// Long line test
// const longTest = parseSong(getSong(336));
// longTest;

// adjustVerseWidth({
// 	type: 'Verse',
// 	verseNo: '6',
// 	lines: [
// 		// 'There in a nobler, sweeter song,',
// 		// "I'll sing Thy power to save,",
// 		'When this poor lisping, stammering tongue',
// 		'Is ransomed from the grave,',
// 		'Is ransomed from the grave,',
// 		'Is ransomed from the grave;',
// 		'When this poor lisping, stammering tongue',
// 		'Is ransomed from the grave.'
// 	]
// });

// adjustVerseWidth({
// 	type: 'Verse',
// 	verseNo: '1',
// 	lines: [
//     'Great is Thy faithfulness, O God my Father,',
//     'O bless me now, my Savior — I come to Thee.',
//   'Cleanse and comfort, bless and save me;',
// 		'There is a fountain filled with blood,',
// 		"Drawn from Emmanuel's veins;",
// 		'And sinners plunged beneath that flood,',
// 		'Lose all their guilty stains,',
// 		'Lose all their guilty stains,',
// 		'Lose all their guilty stains;',
// 		'And sinners plunged beneath that flood,',
// 		'Lose all their guilty stains.'
// 	]
// });

// const gitf = parseSong(getSong(100));
// gitf;

// const refrainMissing = parseSong(getSong(483))
// refrainMissing

// const nIndexTest = parseSong(getSong(258));
// nIndexTest;
