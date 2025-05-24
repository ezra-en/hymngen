import { z } from 'zod';

export const icoInfoSchema = z.object({
	type: z.string(),
	value: z.string()
});

export const icoStanzaSchema = z.object({
	type: z.string(), //z.literal('Verse'),
	verseNo: z.string(), // string of number
	lines: z.string().array()
});
export type icoStanza = z.infer<typeof icoStanzaSchema> 	

export const icoRefrainSchema = z.object({
	type: z.string(), //z.literal('Refrain').or(z.literal('Chorus')),
	lines: z.string().array(),
	verseNo: z.undefined().optional() // string of number
});
export type icoRefrain = z.infer<typeof icoRefrainSchema>;
export const icoVerseSchema = z.union([icoStanzaSchema, icoRefrainSchema]);
export type icoVerse = z.infer<typeof icoVerseSchema>;

export const icoHymnSchema = z.object({
	number: z.number(),
	title: z.string(),
	verses: z.union([icoStanzaSchema, icoRefrainSchema]).array(),
	info: icoInfoSchema.array()
});
export type icoHymn = z.infer<typeof icoHymnSchema>;

export const icoSongbookSchema = z.object({
	name: z.string(),
	copyright: z.string(),
	prefix: z.string(),
	hymns: icoHymnSchema.array()
});
export type icoSongbook = z.infer<typeof icoSongbookSchema>;
