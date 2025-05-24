import FlexSearch from "flexsearch";
import songFile from "../songbook/SDAH.json";
import type { icoHymn } from "../songbook/types";

interface HymnSearchDoc {
  id: number;
  number: number;
  title: string;
  content: string; // Combined verse content for full-text search
}

// Create optimized index
const index = new FlexSearch.Document<HymnSearchDoc>({
  document: {
    id: "id",
    index: [
      {
        field: "title",
        tokenize: "forward",
        optimize: true,
      },
      {
        field: "content",
        tokenize: "full",
        optimize: true,
        resolution: 9,
      },
      {
        field: "number",
        tokenize: "strict",
      },
    ],
  },
});

// Build search index from hymnal data
function buildSearchIndex() {
  songFile.hymns.forEach((hymn: icoHymn, idx: number) => {
    // Combine all verse content for full-text search
    const content = hymn.verses
      .map((verse) => verse.lines.join(" "))
      .join(" ");

    index.add({
      id: idx,
      number: hymn.number,
      title: hymn.title,
      content: content,
    });
  });
}

// Initialize index
buildSearchIndex();

// Search function
export function searchHymnal(query: string) {
  const results = index.search(query, {
    enrich: true,
    suggest: true,
  });

  // Merge and deduplicate results from different fields
  const hymns = new Map<number, icoHymn>();

  results.forEach((result) => {
    result.result.forEach((doc) => {
      const hymn = songFile.hymns[doc.id];
      if (!hymns.has(hymn.number)) {
        hymns.set(hymn.number, hymn);
      }
    });
  });

  return Array.from(hymns.values());
}
