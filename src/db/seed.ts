import { db } from './index.ts';
import { lessons, quizzes, questions, options, srsReviews, userProgress, quizAttempts, responses } from './schema.ts';
import { QUESTION_BANK } from '../data/questionBankData.ts';

const LESSON_MODULES = [
  {
    key: "Foundations of Scientific Research",
    title: "Foundations of Scientific Research",
    objectives: "Master the definition of research, logical reasoning, objectivity, research phases, and action research.",
    contentHtml: `
      <h3>1. Concept of Science & Scientific Research</h3>
      <p>Research is working in a scientific way to search for truth of any problem. It is a systematic process governed by <strong>logical thinking</strong>, allowing scholars to develop arguments in a coherent, step-by-step manner.</p>
      
      <h4>Core Qualities of Sound Research</h4>
      <ul>
        <li><strong>Objectivity:</strong> Freedom from subjective bias and personal partiality.</li>
        <li><strong>Systematic Process:</strong> Following sequential phases from problem identification to reporting.</li>
        <li><strong>Replicability:</strong> Allowing independent verification under equivalent conditions.</li>
      </ul>

      <h4>Key Research Typologies</h4>
      <ul>
        <li><strong>Fundamental / Basic Research:</strong> Expands foundational scientific knowledge without immediate commercial application.</li>
        <li><strong>Applied Research:</strong> Resolves practical, operational challenges in industry and society.</li>
        <li><strong>Action Research:</strong> Pragmatic inquiry initiated by practitioners and managers to solve an immediate organizational problem.</li>
        <li><strong>Conclusive Research:</strong> Structured studies carried out specifically to test and validate formal study hypotheses.</li>
        <li><strong>Evaluation Research:</strong> Systematically answers the fundamental question: <em>"How well are we doing?"</em></li>
      </ul>
    `,
    orderIndex: 1
  },
  {
    key: "Problem Identification & Research Proposal",
    title: "Problem Identification & Research Proposal",
    objectives: "Formulate research problems, evaluate feasibility, distinguish questions from hypotheses, and construct research proposals.",
    contentHtml: `
      <h3>2. Defining the Research Problem & Crafting Proposals</h3>
      <p>The <strong>first step in starting the research process</strong> is always the <strong>Identification of the problem</strong>. The intellectual depth of any research is primarily judged by its <strong>research objectives</strong>.</p>

      <h4>Choosing a Research Problem</h4>
      <ul>
        <li>A research problem is primarily chosen depending upon <strong>its relevance</strong> and academic significance.</li>
        <li>Steps in problem identification include discussion with subject experts, review of existing literature, and conceptual model building.</li>
      </ul>

      <h4>Research Feasibility</h4>
      <p>A study's feasibility must be assessed across three critical dimensions:</p>
      <ul>
        <li><strong>Cost & Time:</strong> Budgetary constraints and realistic timelines.</li>
        <li><strong>Access:</strong> Reaching gatekeepers, organizations, and responsive target groups.</li>
        <li><strong>Ethical Clearance:</strong> Identifying potential ethical risks and securing consent.</li>
      </ul>

      <h4>The Research Proposal</h4>
      <p>A <strong>research proposal</strong> is a formal document presenting the research objectives, procedural blueprint for achieving them, timeline, and expected deliverables prior to conducting fieldwork.</p>
    `,
    orderIndex: 2
  },
  {
    key: "Literature Review & Academic Ethics",
    title: "Literature Review & Academic Ethics",
    objectives: "Conduct rigorous literature syntheses, maintain ethical integrity, avoid plagiarism, and prepare for oral defense.",
    contentHtml: `
      <h3>3. Literature Review, Academic Integrity & Ethics</h3>
      <p>Conducting a review of the literature prior to formulating questions allows researchers to provide an up-to-date understanding of the subject, guide question development, and identify tested methodologies.</p>

      <h4>Documentary Sources</h4>
      <ul>
        <li><strong>Primary Sources:</strong> Conference proceedings presenting original findings directly from investigators.</li>
        <li><strong>Secondary Sources:</strong> Literature reviews, textbooks, and trade journal syntheses.</li>
        <li><strong>Reference Tools:</strong> Encyclopedias provide authoritative descriptive overviews; MARC (Machine-Readable Cataloging) stores bibliographic records in a structured database.</li>
      </ul>

      <h4>Ethical Principles in Research</h4>
      <ul>
        <li><strong>Harm Prevention:</strong> The primary ethical mandate is avoiding harm to participants.</li>
        <li><strong>Internet Research Ethics:</strong> Researchers must never impersonate identities or conduct covert infiltration without institutional approval.</li>
        <li><strong>Avoiding Plagiarism:</strong> Express ideas in your own original phrasing via careful paraphrasing while providing accurate citations.</li>
        <li><strong>Intellectual Property Rights:</strong> Legal protections encompass Copyrights, Patents, and Trademarks (a thesaurus is an informational linguistic reference, not an IP category).</li>
      </ul>
    `,
    orderIndex: 3
  },
  {
    key: "Variables & Hypothesis Testing",
    title: "Variables & Hypothesis Testing",
    objectives: "Distinguish independent, dependent, and intervening variables, formulate hypotheses, and understand statistical errors.",
    contentHtml: `
      <h3>4. Variables, Correlations & Hypothesis Testing</h3>
      <p>Variables represent observable characteristics or quantities capable of taking on varying values within a study.</p>

      <h4>Types of Variables</h4>
      <ul>
        <li><strong>Independent Variable:</strong> The presumed cause or antecedent manipulated/observed by the researcher.</li>
        <li><strong>Dependent Variable:</strong> The criterion or outcome expected to change as a result of the independent variable.</li>
        <li><strong>Intervening (Mediating) Variable:</strong> A conceptual link between the cause and outcome (e.g., performance-pay increases <em>motivation</em>, which in turn elevates job satisfaction).</li>
      </ul>

      <h4>Hypothesis Formulation & Testing</h4>
      <ul>
        <li>Hypotheses are testable statements predicting relationships between variables, formulated <em>after</em> reviewing existing literature.</li>
        <li><strong>Null Hypothesis (H₀):</strong> Posits no significant difference or relationship.</li>
        <li><strong>Type I Error (Alpha Error):</strong> Rejecting the null hypothesis when it is in fact true (false positive).</li>
        <li><strong>Significance Level (α):</strong> The probability threshold of rejecting a true null hypothesis, conventionally set at 0.05.</li>
        <li><strong>Positive Correlation:</strong> Occurs when both variables move in the same direction.</li>
      </ul>
    `,
    orderIndex: 4
  },
  {
    key: "Research Paradigms & Designs",
    title: "Research Paradigms & Designs",
    objectives: "Compare quantitative, qualitative, mixed-methods, triangulation, and experimental designs with control groups.",
    contentHtml: `
      <h3>5. Paradigms, Designs & Triangulation</h3>
      <p>Research paradigms provide the philosophical frameworks that determine how inquiry is conceptualized and executed.</p>

      <h4>Paradigms & Methodologies</h4>
      <ul>
        <li><strong>Quantitative Research:</strong> Emphasizes deductive logic, standardized measurement, statistical generalizability, and testing causal models.</li>
        <li><strong>Qualitative Research:</strong> Focuses on inductive reasoning, rich contextual exploration, subjective meanings, attitudes, and emerging designs.</li>
        <li><strong>Mixed-Methods Research:</strong> Synthesizes qualitative and quantitative phases within a pragmatic epistemological framework.</li>
        <li><strong>Triangulation:</strong> Combining multiple methods or data sources to cross-validate empirical findings.</li>
      </ul>

      <h4>Experimental Design</h4>
      <ul>
        <li>The hallmark of experimental research is <strong>manipulation of the independent variable</strong> under controlled conditions.</li>
        <li><strong>Control Group:</strong> The comparison cohort that does not receive the experimental treatment or intervention.</li>
      </ul>
    `,
    orderIndex: 5
  },
  {
    key: "Sampling & Measurement Scales",
    title: "Sampling & Measurement Scales",
    objectives: "Master random vs non-random sampling, minimize sampling errors, and classify nominal, ordinal, interval, and ratio scales.",
    contentHtml: `
      <h3>6. Sampling Principles & The Four Measurement Scales</h3>
      <p>Sampling determines how well findings can be generalized to a broader target population.</p>

      <h4>Sampling Error & Sample Sizes</h4>
      <ul>
        <li><strong>Least Sampling Error:</strong> Produced by large samples selected using probability (random) sampling.</li>
        <li>The smaller the sample size, the greater the sampling error.</li>
      </ul>

      <h4>Stevens' Four Measurement Scales</h4>
      <ul>
        <li><strong>Nominal Scale:</strong> Qualitative categories without rank order (e.g., gender, geographic location). Mode is the valid central tendency.</li>
        <li><strong>Ordinal Scale:</strong> Rank-ordered categories (e.g., student rankings from high to low). Median is the appropriate central tendency.</li>
        <li><strong>Interval Scale:</strong> Equal numerical intervals with no true zero (e.g., Celsius temperature). Mean is the valid central tendency.</li>
        <li><strong>Ratio Scale:</strong> Equal intervals with an absolute true zero (e.g., income, weight, volume). Geometric mean and ratios are valid.</li>
      </ul>
    `,
    orderIndex: 6
  },
  {
    key: "Data Collection Tools & Fieldwork",
    title: "Data Collection Tools & Fieldwork",
    objectives: "Utilize questionnaires, structured/unstructured interviews, focus groups, behavioral observations, and documentary records.",
    contentHtml: `
      <h3>7. Data Collection Instruments & Fieldwork</h3>
      <p>Data collection instruments gather empirical evidence to address research questions and hypotheses.</p>

      <h4>Primary vs. Secondary Data</h4>
      <ul>
        <li><strong>Primary Data:</strong> Original firsthand data collected via surveys, interviews, or direct behavioral observations.</li>
        <li><strong>Secondary Data:</strong> Pre-existing records, government archives, trade journals, and databases collected by earlier researchers.</li>
        <li><strong>Information:</strong> Raw data that has been processed, organized, and contextualized into meaningful form.</li>
      </ul>

      <h4>Instruments & Techniques</h4>
      <ul>
        <li><strong>Questionnaires:</strong> Standardized data collection tools that eliminate interviewer bias.</li>
        <li><strong>Interviews:</strong> Unstructured and oral history interviews capture qualitative narratives, while structured interviews produce quantitative responses. Group interviews typically involve one interviewer with multiple interviewees.</li>
        <li><strong>Focus Groups:</strong> Typically assemble 6 to 12 participants around a focused topic.</li>
        <li><strong>Behavioral Observation:</strong> Direct non-verbal, linguistic, and spatial analysis of participants in naturalistic settings.</li>
      </ul>
    `,
    orderIndex: 7
  },
  {
    key: "Statistical Analysis, Inference & Reporting",
    title: "Statistical Analysis, Inference & Reporting",
    objectives: "Calculate central tendency and dispersion, apply regression, verify reliability and validity, and write research reports.",
    contentHtml: `
      <h3>8. Statistical Analysis, Validity & Report Writing</h3>
      <p>Statistical analysis transforms collected measurements into defensible scientific conclusions.</p>

      <h4>Descriptive vs. Inferential Statistics</h4>
      <ul>
        <li><strong>Standard Deviation:</strong> Measures the extent to which individual scores deviate from the arithmetic mean.</li>
        <li><strong>Regression Analysis:</strong> Models the functional mathematical relationship where an independent variable predicts a dependent outcome.</li>
        <li><strong>Inferential / Sampling Statistics:</strong> Employs probability distributions and hypothesis tests to draw generalizations from samples to populations.</li>
      </ul>

      <h4>Psychometric Standards</h4>
      <ul>
        <li><strong>Reliability:</strong> Consistency and repeatability of measurement results.</li>
        <li><strong>Internal Validity:</strong> The certainty that the observed effect is caused solely by the manipulated variable.</li>
        <li><strong>External Validity:</strong> The generalizability of findings to other settings and populations.</li>
        <li><strong>Predictive Validity:</strong> The precision with which an assessment forecasts future criterion performance.</li>
      </ul>

      <h4>Research Report Design</h4>
      <p>The <strong>Design / Methodology</strong> section details how the study was planned and executed. Essential elements of any report include methodology, conclusions, and comprehensive references.</p>
    `,
    orderIndex: 8
  }
];

export async function seed() {
  console.log('Clearing existing data and seeding database...');
  
  // Clear existing data cleanly
  await db.delete(responses);
  await db.delete(srsReviews);
  await db.delete(quizAttempts);
  await db.delete(userProgress);
  await db.delete(options);
  await db.delete(questions);
  await db.delete(quizzes);
  await db.delete(lessons);

  // Bulk insert lessons
  const insertedLessons = await db.insert(lessons).values(
    LESSON_MODULES.map(m => ({
      title: m.title,
      objectives: m.objectives,
      contentHtml: m.contentHtml.trim(),
      orderIndex: m.orderIndex
    }))
  ).returning();

  // Bulk insert quizzes
  const insertedQuizzes = await db.insert(quizzes).values(
    insertedLessons.map(lesson => ({
      lessonId: lesson.id,
      title: `${lesson.title} Mastery Quiz`,
      allowedAttempts: 5
    }))
  ).returning();

  const lessonMap = new Map<string, number>();
  for (let i = 0; i < LESSON_MODULES.length; i++) {
    lessonMap.set(LESSON_MODULES[i].key, insertedQuizzes[i].id);
  }

  // Bulk insert questions in chunks of 25 for maximum performance
  const questionsToInsert = QUESTION_BANK.map((qItem) => {
    const quizId = lessonMap.get(qItem.lessonModule) || insertedQuizzes[0].id;
    return {
      quizId,
      type: 'mcq',
      prompt: qItem.prompt,
      difficulty: qItem.difficulty,
      objective: qItem.objective,
      hint: qItem.hint
    };
  });

  const insertedQuestionRows = await db.insert(questions).values(questionsToInsert).returning();

  // Prepare all options with the newly generated question IDs
  const allOptions: { questionId: number; text: string; isCorrect: boolean }[] = [];
  for (let i = 0; i < QUESTION_BANK.length; i++) {
    const qRow = insertedQuestionRows[i];
    const sourceQ = QUESTION_BANK[i];
    for (const opt of sourceQ.options) {
      allOptions.push({
        questionId: qRow.id,
        text: opt.text,
        isCorrect: opt.isCorrect
      });
    }
  }

  // Insert options in batches of 100
  const batchSize = 100;
  for (let i = 0; i < allOptions.length; i += batchSize) {
    const batch = allOptions.slice(i, i + batchSize);
    await db.insert(options).values(batch);
  }

  console.log(`Database seeded successfully with ${insertedLessons.length} lessons, ${insertedQuestionRows.length} questions, and ${allOptions.length} options.`);
}

seed()
  .then(() => {
    console.log("Seeding complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
