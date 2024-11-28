import { SectionEntry } from "@/types/home";
import { http, HttpResponse } from "msw";

// Helper function to generate random section names
function generateRandomSectionName(index: number): string {
  return `Section ${index + 1}`;
}

// Recursive function to generate random sections with random sentences
function generateRandomSections(
  duration: number,
  currentTime: number = 0,
  sectionIndex: number = 0,
  sentenceIndex: number = 0,
  currentSection: SectionEntry = {
    title: generateRandomSectionName(0),
    sentences: [],
  }
): Array<SectionEntry> {
  if (currentTime >= duration) {
    return currentSection.sentences.length > 0 ? [currentSection] : [];
  }

  const sentence = {
    time: currentTime,
    sentence: `This is sentence number ${sentenceIndex}.`,
    sentenceIndex: sentenceIndex,
  };

  currentSection.sentences.push(sentence);

  // Randomly decide to create a new section after 2 to 4 sentences
  const sentencesInCurrentSection = currentSection.sentences.length;
  const maxSentencesInSection = Math.floor(Math.random() * 3) + 2; // Random number between 2 and 4

  if (sentencesInCurrentSection >= maxSentencesInSection) {
    const nextSection = {
      title: generateRandomSectionName(sectionIndex + 1),
      sentences: [],
    };
    return [
      currentSection,
      ...generateRandomSections(
        duration,
        currentTime + 5,
        sectionIndex + 1,
        sentenceIndex + 1,
        nextSection
      ),
    ];
  }

  return generateRandomSections(
    duration,
    currentTime + 5,
    sectionIndex,
    sentenceIndex + 1,
    currentSection
  );
}

export const handlers = [
  http.post("/api/ai-processing", async ({ request }) => {
    const body = (await request.json()) as { duration?: number };
    const duration = body.duration || 0; // Default to 0 if duration is not provided

    // Generate random sections and transcripts
    const sections = generateRandomSections(Math.floor(duration));

    // Add random delay between 1-3 seconds
    // await new Promise((resolve) => {
    //   setTimeout(resolve, Math.floor(Math.random() * 1000) + 2000);
    // });

    return HttpResponse.json({
      data: sections,
    });
  }),
];
