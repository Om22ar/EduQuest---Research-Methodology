import { ARABIC_EXPLANATIONS, STATISTICAL_REVISION_SUMMARY, type StatisticalSummarySection } from './arabicExplanations.ts';

export interface QuestionBankItem {
  id: number;
  originalNumber: number | string;
  prompt: string;
  options: { text: string; isCorrect: boolean }[];
  objective: string;
  difficulty: number; // 1, 2, 3
  hint: string;
  explanation?: string;
  explanationAr?: string;
  lessonModule: string;
}

export const QUESTION_BANK: QuestionBankItem[] = [
  {
    id: 1,
    originalNumber: 1,
    prompt: "Research is",
    options: [
      { text: "Searching again and again", isCorrect: false },
      { text: "Finding solution to any problem", isCorrect: false },
      { text: "Working in a scientific way to search for truth of any problem", isCorrect: true },
      { text: "None of the above", isCorrect: false }
    ],
    objective: "Research Foundations",
    difficulty: 1,
    hint: "Research requires a systematic, scientific pursuit of verifiable truth.",
    explanation: "Research is defined as systematic, scientific investigation and study of materials and sources in order to establish facts and reach verifiable conclusions.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 2,
    originalNumber: 2,
    prompt: "A review of the literature prior to formulating research questions allows the researcher to:",
    options: [
      { text: "Provide an up-to-date understanding of the subject, its significance, and structure", isCorrect: false },
      { text: "Guide the development of research questions", isCorrect: false },
      { text: "Present the kinds of research methodologies used in previous studies", isCorrect: false },
      { text: "All of the above", isCorrect: true }
    ],
    objective: "Literature Review",
    difficulty: 1,
    hint: "Think about all the ways surveying past work informs current research design.",
    explanation: "A literature review clarifies existing knowledge, guides question formulation, and illustrates proven methodologies.",
    lessonModule: "Literature Review & Academic Ethics"
  },
  {
    id: 3,
    originalNumber: 3,
    prompt: "The feasibility of a research study should be considered in light of:",
    options: [
      { text: "Cost and time required to conduct the study", isCorrect: false },
      { text: "Access to gatekeepers and respondents", isCorrect: false },
      { text: "Potential ethical concerns", isCorrect: false },
      { text: "All of the above", isCorrect: true }
    ],
    objective: "Research Planning & Feasibility",
    difficulty: 1,
    hint: "Feasibility encompasses resources, logistics, access, and ethics.",
    explanation: "Research feasibility requires assessing whether time, finances, participant access, and ethical clearance permit successful completion.",
    lessonModule: "Problem Identification & Research Proposal"
  },
  {
    id: 4,
    originalNumber: 4,
    prompt: "Research that uses qualitative methods for one phase and quantitative methods for the next phase is known as:",
    options: [
      { text: "Action research", isCorrect: false },
      { text: "Mixed-method research", isCorrect: true },
      { text: "Quantitative research", isCorrect: false },
      { text: "Pragmatic research", isCorrect: false }
    ],
    objective: "Research Paradigms & Designs",
    difficulty: 1,
    hint: "This approach combines qualitative and quantitative methodologies across phases.",
    explanation: "Mixed-method research explicitly integrates qualitative and quantitative techniques within a single investigation.",
    lessonModule: "Research Paradigms & Designs"
  },
  {
    id: 5,
    originalNumber: 5,
    prompt: "Research hypotheses are:",
    options: [
      { text: "Formulated prior to a review of the literature", isCorrect: false },
      { text: "Statements of predicted relationships between variables", isCorrect: false },
      { text: "B but not A", isCorrect: true },
      { text: "Both A and B", isCorrect: false }
    ],
    objective: "Variables & Hypotheses",
    difficulty: 2,
    hint: "Hypotheses predict relationships between variables, and are formed AFTER reviewing the literature.",
    explanation: "Hypotheses are grounded predictions about relationships between variables developed after examining existing literature, not before.",
    lessonModule: "Variables & Hypothesis Testing"
  },
  {
    id: 6,
    originalNumber: 6,
    prompt: "Which of the following is the first step in starting the research process?",
    options: [
      { text: "Searching sources of information to locate problem.", isCorrect: false },
      { text: "Survey of related literature", isCorrect: false },
      { text: "Identification of problem", isCorrect: true },
      { text: "Searching for solutions to the problem", isCorrect: false }
    ],
    objective: "Problem Identification",
    difficulty: 1,
    hint: "Before doing anything else, you must define what puzzle or issue you are addressing.",
    explanation: "Identifying and defining the research problem is universally the initial step of the scientific inquiry cycle.",
    lessonModule: "Problem Identification & Research Proposal"
  },
  {
    id: 7,
    originalNumber: 7,
    prompt: "Adopting ethical principles in research means:",
    options: [
      { text: "Avoiding harm to participants", isCorrect: true },
      { text: "The researcher is anonymous", isCorrect: false },
      { text: "Deception is only used when necessary", isCorrect: false },
      { text: "Selected informants give their consent", isCorrect: false }
    ],
    objective: "Research Ethics",
    difficulty: 1,
    hint: "The fundamental dictum of research ethics is 'do no harm'.",
    explanation: "Protection from physical, psychological, social, or legal harm is the primary ethical obligation in human subjects research.",
    lessonModule: "Literature Review & Academic Ethics"
  },
  {
    id: 8,
    originalNumber: 8,
    prompt: "A radical perspective on ethics suggests that:",
    options: [
      { text: "Researchers can do anything they want", isCorrect: true },
      { text: "The use of checklists of ethical actions is essential", isCorrect: false },
      { text: "The powers of Institutional Review Boards should be strengthened", isCorrect: false },
      { text: "Ethics should be based on self-reflexivity", isCorrect: false }
    ],
    objective: "Research Ethics",
    difficulty: 3,
    hint: "In ethical philosophy, radical libertarian/anarchist views reject external constraints.",
    explanation: "The radical or anti-regulation position on research ethics argues that external universal codes unnecessarily stifle inquiry and that researchers should be unfettered.",
    lessonModule: "Literature Review & Academic Ethics"
  },
  {
    id: 9,
    originalNumber: 9,
    prompt: "A common test in research demands much priority on:",
    options: [
      { text: "Reliability", isCorrect: false },
      { text: "Useability", isCorrect: false },
      { text: "Objectivity", isCorrect: false },
      { text: "All of the above", isCorrect: true }
    ],
    objective: "Measurement & Test Criteria",
    difficulty: 1,
    hint: "Good measurement instruments must be consistent, practical, and unbiased.",
    explanation: "Standard test evaluation criteria require high reliability (consistency), objectivity (freedom from bias), and usability/practicability.",
    lessonModule: "Sampling & Measurement Scales"
  },
  {
    id: 10,
    originalNumber: 10,
    prompt: "Which research paradigm is most concerned about generalizing its findings?",
    options: [
      { text: "Quantitative research", isCorrect: true },
      { text: "Qualitative research", isCorrect: false },
      { text: "Mixed-methods research", isCorrect: false },
      { text: "All of the above", isCorrect: false }
    ],
    objective: "Research Paradigms & Designs",
    difficulty: 1,
    hint: "This paradigm relies on representative random samples to infer population parameters.",
    explanation: "Quantitative research prioritizes external validity and statistical generalizability to broad populations.",
    lessonModule: "Research Paradigms & Designs"
  },
  {
    id: 11,
    originalNumber: 11,
    prompt: "A variable that is presumed to cause a change in another variable is called:",
    options: [
      { text: "An intervening variable", isCorrect: false },
      { text: "A dependent variable", isCorrect: false },
      { text: "An independent variable", isCorrect: true },
      { text: "A numerical variable", isCorrect: false }
    ],
    objective: "Variables & Hypotheses",
    difficulty: 1,
    hint: "This is the antecedent or predictor that the researcher manipulates or observes as the cause.",
    explanation: "The independent variable is the presumed cause or predictor that influences the dependent (outcome) variable.",
    lessonModule: "Variables & Hypothesis Testing"
  },
  {
    id: 12,
    originalNumber: 12,
    prompt: "Researchers posit that performance-related pay increases employee motivation which in turn leads to an increase in job satisfaction. What kind of variable is 'motivation' in this study?",
    options: [
      { text: "Extraneous", isCorrect: false },
      { text: "Confounding", isCorrect: false },
      { text: "Intervening", isCorrect: true },
      { text: "Manipulated", isCorrect: false }
    ],
    objective: "Variables & Hypotheses",
    difficulty: 2,
    hint: "It lies in the causal chain between the independent cause and dependent outcome (mediator).",
    explanation: "An intervening (or mediating) variable surfaces between the independent variable and the dependent variable, explaining the mechanism.",
    lessonModule: "Variables & Hypothesis Testing"
  },
  {
    id: 13,
    originalNumber: 13,
    prompt: "Action research means:",
    options: [
      { text: "Longitudinal research", isCorrect: false },
      { text: "Applied research", isCorrect: false },
      { text: "Research initiated to solve an immediate problem", isCorrect: true },
      { text: "A research with socioeconomic objective", isCorrect: false }
    ],
    objective: "Types of Research",
    difficulty: 1,
    hint: "Practitioners conduct this specifically to address practical, urgent workplace or classroom issues.",
    explanation: "Action research is applied, participatory inquiry aimed at solving concrete, immediate problems in localized settings.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 14,
    originalNumber: 14,
    prompt: "A positive correlation occurs when:",
    options: [
      { text: "Two variables remain constant", isCorrect: false },
      { text: "Two variables move in the same direction", isCorrect: true },
      { text: "One variable goes up and the other goes down", isCorrect: false },
      { text: "Two variables move in opposite directions", isCorrect: false }
    ],
    objective: "Statistical Analysis & Inference",
    difficulty: 1,
    hint: "As one variable increases, the other also tends to increase.",
    explanation: "In a positive correlation, both variables change in the same direction (both increase or both decrease together).",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 15,
    originalNumber: 15,
    prompt: "The key defining characteristic of experimental research is that:",
    options: [
      { text: "The independent variable is manipulated", isCorrect: true },
      { text: "Hypotheses are proved", isCorrect: false },
      { text: "A positive correlation exists", isCorrect: false },
      { text: "Samples are large", isCorrect: false }
    ],
    objective: "Research Paradigms & Designs",
    difficulty: 2,
    hint: "True experiments require deliberate researcher intervention on the explanatory factor.",
    explanation: "Experimental research uniquely requires researcher manipulation of the independent variable and control over extraneous conditions.",
    lessonModule: "Research Paradigms & Designs"
  },
  {
    id: 16,
    originalNumber: 16,
    prompt: "Qualitative research is used in all the following circumstances, EXCEPT:",
    options: [
      { text: "It is based on a collection of non-numerical data such as words and pictures", isCorrect: false },
      { text: "It often uses small samples", isCorrect: false },
      { text: "It uses the inductive method", isCorrect: false },
      { text: "It is typically used when a great deal is already known about the topic of interest", isCorrect: true }
    ],
    objective: "Research Paradigms & Designs",
    difficulty: 2,
    hint: "When abundant quantitative models and validated instruments exist, qualitative inquiry is not the typical primary choice.",
    explanation: "Qualitative methods excel at exploratory discovery when little is known; when extensive knowledge exists, confirmatory quantitative designs are typically favored.",
    lessonModule: "Research Paradigms & Designs"
  },
  {
    id: 17,
    originalNumber: 17,
    prompt: "In the process of conducting research, 'Formulation of Hypothesis' is followed by:",
    options: [
      { text: "Statement of Objectives", isCorrect: false },
      { text: "Analysis of Data", isCorrect: false },
      { text: "Selection of Research Tools", isCorrect: true },
      { text: "Collection of Data", isCorrect: false }
    ],
    objective: "Research Process",
    difficulty: 2,
    hint: "Once hypotheses are formulated, you select or design the instruments to measure the variables.",
    explanation: "After establishing hypotheses, the researcher designs the study plan and selects/develops measurement tools and instruments.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 18,
    originalNumber: 18,
    prompt: "What do we call data that are used for a new study but which were collected by an earlier researcher for a different set of research questions?",
    options: [
      { text: "Secondary data", isCorrect: true },
      { text: "Field notes", isCorrect: false },
      { text: "Qualitative data", isCorrect: false },
      { text: "Primary data", isCorrect: false }
    ],
    objective: "Data Collection Tools",
    difficulty: 1,
    hint: "Data not collected firsthand by the current investigator.",
    explanation: "Secondary data refers to information originally gathered by someone else for an alternative purpose, now repurposed.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 19,
    originalNumber: 19,
    prompt: "Which of the following statements are true?",
    options: [
      { text: "The larger the sample size, the larger the confidence interval", isCorrect: false },
      { text: "The smaller the sample size, the greater the sampling error", isCorrect: true },
      { text: "The more categories being measured, the smaller the sample size", isCorrect: false },
      { text: "A confidence level of 95 percent is always sufficient", isCorrect: false }
    ],
    objective: "Sampling & Error",
    difficulty: 2,
    hint: "Smaller samples exhibit higher variability and less precision regarding the population mean.",
    explanation: "Sampling error is inversely proportional to sample size: smaller samples produce higher sampling error and wider confidence intervals.",
    lessonModule: "Sampling & Measurement Scales"
  },
  {
    id: 20,
    originalNumber: 20,
    prompt: "A research paper is a brief report of research work based on:",
    options: [
      { text: "Primary Data only", isCorrect: false },
      { text: "Secondary Data only", isCorrect: false },
      { text: "Both Primary and Secondary Data", isCorrect: true },
      { text: "None of the above", isCorrect: false }
    ],
    objective: "Research Reporting",
    difficulty: 1,
    hint: "Scholarly research papers can be grounded in original field collections or existing datasets and literature.",
    explanation: "Academic research papers can report findings derived from firsthand primary data, repurposed secondary datasets, or mixed syntheses.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 21,
    originalNumber: 21,
    prompt: "A test accurately indicates an employee’s scores on a future criterion (e.g., conscientiousness). What kind of validity is this?",
    options: [
      { text: "Predictive", isCorrect: true },
      { text: "Face", isCorrect: false },
      { text: "Content", isCorrect: false },
      { text: "Concurrent", isCorrect: false }
    ],
    objective: "Validity & Reliability",
    difficulty: 2,
    hint: "The assessment predicts a performance metric measured at a future time.",
    explanation: "Predictive validity refers to the extent to which a score on an assessment accurately forecasts future performance or behavior.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 22,
    originalNumber: 22,
    prompt: "One advantage of using a questionnaire is that:",
    options: [
      { text: "Probe questions can be asked", isCorrect: false },
      { text: "Respondents can be put at ease", isCorrect: false },
      { text: "Interview bias can be avoided", isCorrect: true },
      { text: "Response rates are always high", isCorrect: false }
    ],
    objective: "Data Collection Tools",
    difficulty: 1,
    hint: "Standard self-administered forms remove tone-of-voice and interviewer influence.",
    explanation: "Because self-administered questionnaires do not involve an in-person interrogator, they eliminate interviewer bias.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 23,
    originalNumber: 23,
    prompt: "Secondary data can include which of the following?",
    options: [
      { text: "Government statistics", isCorrect: false },
      { text: "Personal diaries", isCorrect: false },
      { text: "Organizational records", isCorrect: false },
      { text: "All of the above", isCorrect: true }
    ],
    objective: "Data Collection Tools",
    difficulty: 1,
    hint: "Any pre-existing documentary record can serve as secondary data.",
    explanation: "Government censuses, historical diaries, institutional archives, and business records are all established sources of secondary data.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 24,
    originalNumber: 24,
    prompt: "Questionnaire is a:",
    options: [
      { text: "Research method", isCorrect: false },
      { text: "Measurement technique", isCorrect: false },
      { text: "Tool for data collection", isCorrect: true },
      { text: "Data analysis technique", isCorrect: false }
    ],
    objective: "Data Collection Tools",
    difficulty: 1,
    hint: "Survey is the method; questionnaire is the physical/digital instrument.",
    explanation: "A questionnaire is an instrument/tool utilized to collect data, whereas survey or experimentation is the overarching method.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 25,
    originalNumber: 25,
    prompt: "The 'reliability' of a measure refers to the researcher asking:",
    options: [
      { text: "Does it give consistent results?", isCorrect: true },
      { text: "Does it measure what it is supposed to measure?", isCorrect: false },
      { text: "Can the results be generalized?", isCorrect: false },
      { text: "Does it have face reliability?", isCorrect: false }
    ],
    objective: "Validity & Reliability",
    difficulty: 1,
    hint: "Reliability is consistency; validity is accuracy.",
    explanation: "Reliability assesses whether repeated administrations under equivalent conditions produce consistent, stable results.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 26,
    originalNumber: 26,
    prompt: "Interviewing is the favoured approach EXCEPT when:",
    options: [
      { text: "There is a need for highly personalized data", isCorrect: false },
      { text: "It is important to ask supplementary questions", isCorrect: false },
      { text: "High numbers of respondents are needed", isCorrect: true },
      { text: "Respondents have difficulty with written language", isCorrect: false }
    ],
    objective: "Data Collection Tools",
    difficulty: 2,
    hint: "Conducting 1-on-1 interviews is labor-intensive and impractical for massive samples.",
    explanation: "Interviews require substantial time and resources per participant, making them unsuited for large-scale survey samples.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 27,
    originalNumber: 27,
    prompt: "Which of the following is not an essential element of report writing?",
    options: [
      { text: "Research Methodology", isCorrect: false },
      { text: "Reference", isCorrect: false },
      { text: "Conclusion", isCorrect: false },
      { text: "None of these", isCorrect: true }
    ],
    objective: "Research Reporting",
    difficulty: 1,
    hint: "Methodology, references, and conclusions are ALL essential elements of a formal research report.",
    explanation: "Since Research Methodology, References, and Conclusion are all indispensable parts of a report, 'None of these' is the correct answer.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 28,
    originalNumber: 28,
    prompt: "Interview questions should:",
    options: [
      { text: "Lead the respondent", isCorrect: false },
      { text: "Probe sensitive issues", isCorrect: false },
      { text: "Be delivered in a neutral tone", isCorrect: true },
      { text: "Test the respondents’ powers of memory", isCorrect: false }
    ],
    objective: "Data Collection Tools",
    difficulty: 1,
    hint: "The interviewer should avoid signaling approval or disapproval.",
    explanation: "Delivering questions in a neutral, non-judgmental tone prevents interviewer bias and social desirability distortion.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 29,
    originalNumber: 29,
    prompt: "Which of the following is not always true about focus groups?",
    options: [
      { text: "The ideal size is normally between 6 and 12 participants", isCorrect: false },
      { text: "Moderators should introduce themselves to the group", isCorrect: false },
      { text: "Participants should come from diverse backgrounds", isCorrect: true },
      { text: "The moderator poses preplanned questions", isCorrect: false }
    ],
    objective: "Data Collection Tools",
    difficulty: 2,
    hint: "Focus groups frequently require relative homogeneity regarding the topic so participants feel comfortable sharing.",
    explanation: "Focus groups often require homogeneous participant composition regarding specific experiences to foster open dialogue.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 30,
    originalNumber: 30,
    prompt: "A disadvantage of using secondary data is that:",
    options: [
      { text: "The data may have been collected with reference to research questions that are not those of the researcher", isCorrect: true },
      { text: "The researcher may bring more detachment in viewing the data than original researchers could muster", isCorrect: false },
      { text: "Data have often been collected by teams of experienced researchers", isCorrect: false },
      { text: "Secondary data sets are often available and accessible", isCorrect: false }
    ],
    objective: "Data Collection Tools",
    difficulty: 2,
    hint: "The data were gathered for someone else's objectives, which may not align cleanly with yours.",
    explanation: "A primary limitation of secondary data is lack of perfect alignment with the secondary researcher's exact operational definitions and hypotheses.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 31,
    originalNumber: 31,
    prompt: "Testing hypothesis is a ________",
    options: [
      { text: "Inferential statistics", isCorrect: true },
      { text: "Descriptive statistics", isCorrect: false },
      { text: "Data preparation", isCorrect: false },
      { text: "Data analysis", isCorrect: false }
    ],
    objective: "Statistical Analysis & Inference",
    difficulty: 1,
    hint: "It infers properties of a population based on sample probability distributions.",
    explanation: "Hypothesis testing (t-tests, ANOVA, Chi-Square) is a core component of inferential statistics used to draw conclusions beyond immediate sample data.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 32,
    originalNumber: 32,
    prompt: "The measure of the extent to which responses vary from the mean is called:",
    options: [
      { text: "The mode", isCorrect: false },
      { text: "The normal distribution", isCorrect: false },
      { text: "The standard deviation", isCorrect: true },
      { text: "The variance", isCorrect: false }
    ],
    objective: "Statistical Analysis & Inference",
    difficulty: 1,
    hint: "The square root of variance, expressing spread in original units.",
    explanation: "Standard deviation measures the average distance or dispersion of scores from the arithmetic mean in the same units as the data.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 33,
    originalNumber: 33,
    prompt: "A Type 1 error occurs in a situation where:",
    options: [
      { text: "The null hypothesis is accepted when it is in fact true", isCorrect: false },
      { text: "The null hypothesis is rejected when it is in fact false", isCorrect: false },
      { text: "The null hypothesis is rejected when it is in fact true", isCorrect: true },
      { text: "The null hypothesis is accepted when it is in fact false", isCorrect: false }
    ],
    objective: "Variables & Hypothesis Testing",
    difficulty: 2,
    hint: "False positive: concluding an effect exists when it actually does not.",
    explanation: "A Type I error (alpha error) occurs when the researcher mistakenly rejects a true null hypothesis.",
    lessonModule: "Variables & Hypothesis Testing"
  },
  {
    id: 34,
    originalNumber: 34,
    prompt: "The significance level:",
    options: [
      { text: "Is set after a statistical test is conducted", isCorrect: false },
      { text: "Is always set at 0.05", isCorrect: false },
      { text: "Results in a p-value", isCorrect: false },
      { text: "Measures the probability of rejecting a true null hypothesis", isCorrect: true }
    ],
    objective: "Statistical Analysis & Inference",
    difficulty: 3,
    hint: "Alpha represents the threshold of committing a Type I error.",
    explanation: "The significance level (alpha) is the predetermined maximum probability of rejecting the null hypothesis when it is actually true.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 35,
    originalNumber: 35,
    prompt: "What is the purpose of doing research?",
    options: [
      { text: "To identify problem", isCorrect: false },
      { text: "To find the solution", isCorrect: false },
      { text: "Both a and b", isCorrect: true },
      { text: "None of these", isCorrect: false }
    ],
    objective: "Research Foundations",
    difficulty: 1,
    hint: "Research both diagnoses questions and resolves them.",
    explanation: "Research systematically identifies unexplained problems and explores empirical solutions and answers.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 36,
    originalNumber: 36,
    prompt: "Which of the following is a form of research typically conducted by managers and other professionals to address issues in their organizations and/or professional practice?",
    options: [
      { text: "Action research", isCorrect: true },
      { text: "Basic research", isCorrect: false },
      { text: "Professional research", isCorrect: false },
      { text: "Predictive research", isCorrect: false }
    ],
    objective: "Types of Research",
    difficulty: 1,
    hint: "Conducted directly inside the organization to improve ongoing operations.",
    explanation: "Action research is conducted by practitioners inside their own professional practice to implement and assess immediate changes.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 37,
    originalNumber: 37,
    prompt: "Plagiarism can be avoided by:",
    options: [
      { text: "Copying the work of others accurately", isCorrect: false },
      { text: "Paraphrasing the author’s text in your own words", isCorrect: true },
      { text: "Cut and pasting from the Internet", isCorrect: false },
      { text: "Quoting directly without revealing the source", isCorrect: false }
    ],
    objective: "Academic Integrity & Ethics",
    difficulty: 1,
    hint: "Restating ideas in your own original phrasing while citing the author.",
    explanation: "Properly paraphrasing in original voice and providing standard attribution prevents academic plagiarism.",
    lessonModule: "Literature Review & Academic Ethics"
  },
  {
    id: 38,
    originalNumber: 38,
    prompt: "In preparing for a viva or similar oral examination, it is best if you have:",
    options: [
      { text: "Avoided citing the examiner in your thesis", isCorrect: false },
      { text: "Made exaggerated claims on the basis of your data", isCorrect: false },
      { text: "Published and referenced your own article(s)", isCorrect: true },
      { text: "Tried to memorize your work", isCorrect: false }
    ],
    objective: "Viva & Defense Preparation",
    difficulty: 2,
    hint: "Peer-reviewed publications originating from your study validate the rigor of your thesis.",
    explanation: "Having peer-reviewed publications from your research provides strong external validation and credibility during thesis defense.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 39,
    originalNumber: 39,
    prompt: "A qualitative research problem statement:",
    options: [
      { text: "Specifies the research methods to be utilized", isCorrect: false },
      { text: "Specifies a research hypothesis", isCorrect: false },
      { text: "Expresses a relationship between variables", isCorrect: false },
      { text: "Conveys a sense of emerging design", isCorrect: true }
    ],
    objective: "Qualitative Research",
    difficulty: 2,
    hint: "Qualitative inquiry is open-ended and evolves as data is collected.",
    explanation: "Qualitative research questions are open-ended and adaptable, conveying an emerging and flexible design rather than rigid hypotheses.",
    lessonModule: "Research Paradigms & Designs"
  },
  {
    id: 40,
    originalNumber: 40,
    prompt: "Which method can be applicable for collecting qualitative data?",
    options: [
      { text: "Artifacts (Visual)", isCorrect: false },
      { text: "People", isCorrect: false },
      { text: "Media products ( Textual, Visual and sensory)", isCorrect: false },
      { text: "All of these", isCorrect: true }
    ],
    objective: "Qualitative Research",
    difficulty: 1,
    hint: "Qualitative evidence comes from interviews, physical cultural artifacts, and media texts.",
    explanation: "Qualitative data collection encompasses personal narratives, historical artifacts, and multifaceted multimedia records.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 41,
    originalNumber: 41,
    prompt: "In group interview their are _______",
    options: [
      { text: "One interviewer and one interviewee", isCorrect: false },
      { text: "More than one interviewer and one interviewee", isCorrect: false },
      { text: "One interviewer and more than one interviewee", isCorrect: true },
      { text: "More than One interviewer and more than one interviewee", isCorrect: false }
    ],
    objective: "Data Collection Tools",
    difficulty: 1,
    hint: "A single moderator dialogues simultaneously with multiple respondents.",
    explanation: "A group interview typically features one interviewer facilitating questions to a panel of multiple interviewees.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 42,
    originalNumber: 42,
    prompt: "Which research approach is based on the epistemological viewpoint of pragmatism?",
    options: [
      { text: "Quantitative research", isCorrect: false },
      { text: "Qualitative research", isCorrect: false },
      { text: "Mixed-methods research", isCorrect: true },
      { text: "All of the above", isCorrect: false }
    ],
    objective: "Research Paradigms & Designs",
    difficulty: 2,
    hint: "Pragmatism focuses on 'what works' practically, synthesizing qualitative and quantitative tools.",
    explanation: "Pragmatism serves as the philosophical and epistemological foundation of mixed-methods research.",
    lessonModule: "Research Paradigms & Designs"
  },
  {
    id: 43,
    originalNumber: "42b",
    prompt: "Which of the following are associated with behavioral observation?",
    options: [
      { text: "Non-verbal analysis", isCorrect: false },
      { text: "Linguistic analysis", isCorrect: false },
      { text: "Spatial analysis", isCorrect: false },
      { text: "All of these", isCorrect: true }
    ],
    objective: "Observational Research",
    difficulty: 2,
    hint: "Observers record gestures, verbal expressions, and interpersonal physical distance.",
    explanation: "Comprehensive behavioral observation analyzes kinesics (non-verbal), paralanguage (linguistic), and proxemics (spatial movement).",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 44,
    originalNumber: 43,
    prompt: "Uniting various qualitative methods with quantitative methods can be called as……",
    options: [
      { text: "Coalesce", isCorrect: false },
      { text: "Triangulation", isCorrect: true },
      { text: "Bipartite", isCorrect: false },
      { text: "Impassive", isCorrect: false }
    ],
    objective: "Research Paradigms & Designs",
    difficulty: 1,
    hint: "Viewing an empirical phenomenon from multiple angles to enhance credibility.",
    explanation: "Triangulation refers to using multiple data sources or qualitative and quantitative methods to cross-validate findings.",
    lessonModule: "Research Paradigms & Designs"
  },
  {
    id: 45,
    originalNumber: 44,
    prompt: "The research that is especially carried out to test and validate the study hypotheses is termed:",
    options: [
      { text: "Fundamental research", isCorrect: false },
      { text: "Applied research", isCorrect: false },
      { text: "Conclusive research", isCorrect: true },
      { text: "Exploratory research", isCorrect: false }
    ],
    objective: "Types of Research",
    difficulty: 2,
    hint: "Unlike exploratory research which develops questions, this research tests hypotheses to conclude answers.",
    explanation: "Conclusive research provides structured information to reach definitive conclusions and test specific formal hypotheses.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 46,
    originalNumber: 45,
    prompt: "Ethical problems can arise when researching the Internet because:",
    options: [
      { text: "Everyone has access to digital media", isCorrect: false },
      { text: "Respondents may fake their identities", isCorrect: false },
      { text: "Researchers may fake their identities", isCorrect: true },
      { text: "Internet research has to be covert", isCorrect: false }
    ],
    objective: "Research Ethics",
    difficulty: 2,
    hint: "Online spaces allow researchers to covertly infiltrate forums under false personas.",
    explanation: "A notable ethical breach in digital ethnography is researchers misrepresenting their identity without informed consent.",
    lessonModule: "Literature Review & Academic Ethics"
  },
  {
    id: 47,
    originalNumber: 46,
    prompt: "The research studies that explore the effect of one thing on another and more specifically, the effect of one variable on another are known as:",
    options: [
      { text: "Causal research", isCorrect: true },
      { text: "Applied research", isCorrect: false },
      { text: "Conclusive research", isCorrect: false },
      { text: "Exploratory research", isCorrect: false }
    ],
    objective: "Variables & Research Design",
    difficulty: 1,
    hint: "Studies that demonstrate cause-and-effect relationships.",
    explanation: "Causal research seeks to establish definitive cause-and-effect linkages between independent and dependent variables.",
    lessonModule: "Variables & Hypothesis Testing"
  },
  {
    id: 48,
    originalNumber: 47,
    prompt: "Which of these is not a step in the problem identification process?",
    options: [
      { text: "Discussion with subject experts", isCorrect: false },
      { text: "Review of existing literature", isCorrect: false },
      { text: "Theoretical foundation and model building", isCorrect: false },
      { text: "Management decision making", isCorrect: true }
    ],
    objective: "Problem Identification",
    difficulty: 2,
    hint: "One of these is an executive/managerial action, not an academic research formulation step.",
    explanation: "Management decision-making is an organizational leadership function, whereas expert discussion, literature review, and conceptual modeling define the research problem.",
    lessonModule: "Problem Identification & Research Proposal"
  },
  {
    id: 49,
    originalNumber: 48,
    prompt: "A formal document that presents the research objectives, design of achieving these objectives, and the expected outcomes/deliverables of the study is called:",
    options: [
      { text: "Research design", isCorrect: false },
      { text: "Research proposal", isCorrect: true },
      { text: "Research hypothesis", isCorrect: false },
      { text: "Research report", isCorrect: false }
    ],
    objective: "Research Proposal",
    difficulty: 1,
    hint: "Submitted in advance to gain approval or funding.",
    explanation: "A research proposal details the purpose, literature background, proposed methodology, and planned timeline before conducting the study.",
    lessonModule: "Problem Identification & Research Proposal"
  },
  {
    id: 50,
    originalNumber: 49,
    prompt: "Which of the following can be described as a nominal variable?",
    options: [
      { text: "Annual income", isCorrect: false },
      { text: "Age", isCorrect: false },
      { text: "Annual sales", isCorrect: false },
      { text: "Geographical location of a firm", isCorrect: true }
    ],
    objective: "Measurement Scales",
    difficulty: 1,
    hint: "Categories with no intrinsic numeric order or magnitude.",
    explanation: "Geographical location (e.g. North, South, city names) consists of qualitative names/labels without mathematical order, defining a nominal scale.",
    lessonModule: "Sampling & Measurement Scales"
  },
  {
    id: 51,
    originalNumber: 50,
    prompt: "Observation is a direct method of collecting:",
    options: [
      { text: "Primary data", isCorrect: true },
      { text: "Secondary data", isCorrect: false },
      { text: "Both", isCorrect: false },
      { text: "Published data", isCorrect: false }
    ],
    objective: "Data Collection Tools",
    difficulty: 1,
    hint: "The researcher records empirical behaviors directly in real time.",
    explanation: "Direct observation of live behavior generates original firsthand information, known as primary data.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 52,
    originalNumber: 51,
    prompt: "Attitude or opinion research is an example of:",
    options: [
      { text: "Quantitative", isCorrect: false },
      { text: "Qualitative", isCorrect: true },
      { text: "Analytical", isCorrect: false },
      { text: "Applied", isCorrect: false }
    ],
    objective: "Research Paradigms & Designs",
    difficulty: 2,
    hint: "Focuses on human perceptions, beliefs, meanings, and subjective viewpoints.",
    explanation: "Exploring subjective attitudes, sentiments, and opinions is primarily grounded in qualitative methodologies.",
    lessonModule: "Research Paradigms & Designs"
  },
  {
    id: 53,
    originalNumber: 52,
    prompt: "What is the process of examining the truth of the statistical hypothesis related to some research problem called?",
    options: [
      { text: "Research Hypothesis", isCorrect: false },
      { text: "Treatment", isCorrect: false },
      { text: "Experiment", isCorrect: true },
      { text: "Experimental Units", isCorrect: false }
    ],
    objective: "Experimental Research",
    difficulty: 2,
    hint: "A controlled test or trial carried out to test a hypothesis.",
    explanation: "An experiment is a scientific procedure undertaken to test, verify, or examine the validity of a hypothesis under controlled conditions.",
    lessonModule: "Variables & Hypothesis Testing"
  },
  {
    id: 54,
    originalNumber: 53,
    prompt: "In an experiment, the group that does not receive the intervention is called:",
    options: [
      { text: "The experimental group", isCorrect: false },
      { text: "The participant group", isCorrect: false },
      { text: "The control group", isCorrect: true },
      { text: "The treatment group", isCorrect: false }
    ],
    objective: "Experimental Research",
    difficulty: 1,
    hint: "Used as a baseline of comparison against the experimental treatment.",
    explanation: "The control group receives no treatment (or a placebo) and serves as the baseline to evaluate the treatment's true effect.",
    lessonModule: "Research Paradigms & Designs"
  },
  {
    id: 55,
    originalNumber: 54,
    prompt: "Which type of central tendency measure is used in interval scale?",
    options: [
      { text: "Mean", isCorrect: true },
      { text: "Median", isCorrect: false },
      { text: "Mode", isCorrect: false },
      { text: "Geometric Progression", isCorrect: false }
    ],
    objective: "Measurement Scales & Statistics",
    difficulty: 2,
    hint: "Equal intervals between values allow arithmetic addition and division.",
    explanation: "Because interval scales have equal distances between numerical values, the arithmetic mean is the appropriate measure of central tendency.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 56,
    originalNumber: 55,
    prompt: "Which of the following is not a type of qualitative interview?",
    options: [
      { text: "Unstructured interview", isCorrect: false },
      { text: "Oral history interview", isCorrect: false },
      { text: "Structured interview", isCorrect: true },
      { text: "Focus group interview", isCorrect: false }
    ],
    objective: "Data Collection Tools",
    difficulty: 2,
    hint: "This type uses rigid, standardized questionnaires that produce quantitative data.",
    explanation: "Structured interviews adhere strictly to standardized closed questionnaires and are primarily quantitative tools.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 57,
    originalNumber: 56,
    prompt: "Research is classified on the basis of …… .. and methods",
    options: [
      { text: "Purpose", isCorrect: true },
      { text: "Intent", isCorrect: false },
      { text: "Methodology", isCorrect: false },
      { text: "Techniques", isCorrect: false }
    ],
    objective: "Types of Research",
    difficulty: 1,
    hint: "Classified into fundamental, applied, and action research according to its goal or aim.",
    explanation: "Research classifications typically divide into categories based on purpose (basic vs applied) and methods (qualitative vs quantitative).",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 58,
    originalNumber: 57,
    prompt: "Which of the following will produce the least sampling error?",
    options: [
      { text: "A large sample based on convenience sampling", isCorrect: false },
      { text: "A small sample based on random sampling", isCorrect: false },
      { text: "A large snowball sample", isCorrect: false },
      { text: "A large sample based on random sampling", isCorrect: true }
    ],
    objective: "Sampling & Error",
    difficulty: 1,
    hint: "Combine probabilistic selection with substantial sample size.",
    explanation: "Sampling error decreases with larger sample size and is minimized when probability/random sampling eliminates selection bias.",
    lessonModule: "Sampling & Measurement Scales"
  },
  {
    id: 59,
    originalNumber: 58,
    prompt: "Which type of central tendency measure is used in nominal scale?",
    options: [
      { text: "Mean", isCorrect: false },
      { text: "Median", isCorrect: false },
      { text: "Mode", isCorrect: true },
      { text: "Geometric Progression", isCorrect: false }
    ],
    objective: "Measurement Scales & Statistics",
    difficulty: 1,
    hint: "With purely categorical names, you can only identify the most frequent category.",
    explanation: "Nominal data lacks numeric order or quantity, so the mode (most frequent category) is the only valid central tendency statistic.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 60,
    originalNumber: 59,
    prompt: "Which of the following is not a data-collection method?",
    options: [
      { text: "Research questions", isCorrect: true },
      { text: "Unstructured interviewing", isCorrect: false },
      { text: "Postal survey questionnaires", isCorrect: false },
      { text: "Participant observation", isCorrect: false }
    ],
    objective: "Data Collection Tools",
    difficulty: 1,
    hint: "Questions formulate what you want to answer, not how you collect the responses.",
    explanation: "Research questions establish the objectives of the inquiry, whereas interviews, surveys, and observations are data collection methods.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 61,
    originalNumber: 60,
    prompt: "How to judge the depth of any research?",
    options: [
      { text: "By research title", isCorrect: false },
      { text: "By research duration", isCorrect: false },
      { text: "By research objectives", isCorrect: true },
      { text: "By total expenditure on research", isCorrect: false }
    ],
    objective: "Research Planning",
    difficulty: 2,
    hint: "The depth and scope of inquiry are defined by what the study sets out to uncover.",
    explanation: "The intellectual depth and scientific rigor of a study are judged by the clarity, specificity, and ambition of its research objectives.",
    lessonModule: "Problem Identification & Research Proposal"
  },
  {
    id: 62,
    originalNumber: 61,
    prompt: "An ordinal scale is:",
    options: [
      { text: "The simplest form of measurement", isCorrect: false },
      { text: "A scale with an absolute zero point", isCorrect: false },
      { text: "A rank-order scale of measurement", isCorrect: true },
      { text: "A scale with equal intervals between ranks", isCorrect: false }
    ],
    objective: "Measurement Scales",
    difficulty: 1,
    hint: "Values can be ranked in order (e.g. 1st, 2nd, 3rd) but distances between them are unequal.",
    explanation: "An ordinal scale provides a rank ordering of items (greater or less) without guaranteeing equal distances between intervals.",
    lessonModule: "Sampling & Measurement Scales"
  },
  {
    id: 63,
    originalNumber: 62,
    prompt: "Which type of central tendency measure is used in ordinal scale?",
    options: [
      { text: "Mean", isCorrect: false },
      { text: "Median", isCorrect: true },
      { text: "Mode", isCorrect: false },
      { text: "Geometric Progression", isCorrect: false }
    ],
    objective: "Measurement Scales & Statistics",
    difficulty: 2,
    hint: "Since values can be ranked in order from lowest to highest, find the middle score.",
    explanation: "For ranked/ordinal data, the median represents the middle score and is the most appropriate central tendency measure.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 64,
    originalNumber: 63,
    prompt: "Which of the following is not a method of Research?",
    options: [
      { text: "Survey", isCorrect: false },
      { text: "Historical", isCorrect: false },
      { text: "Observation", isCorrect: true },
      { text: "Philosophical", isCorrect: false }
    ],
    objective: "Research Methodology vs Tools",
    difficulty: 2,
    hint: "Observation is a data collection technique/tool rather than an overarching research methodology.",
    explanation: "Survey, historical inquiry, and philosophical analysis are research methods; observation is a data-collection technique.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 65,
    originalNumber: 64,
    prompt: "Evaluation Research is concerned with__________",
    options: [
      { text: "How well are we doing?", isCorrect: true },
      { text: "Why are we doing?", isCorrect: false },
      { text: "What are we doing?", isCorrect: false },
      { text: "None of the above", isCorrect: false }
    ],
    objective: "Types of Research",
    difficulty: 2,
    hint: "Assesses program effectiveness and outcome achievement.",
    explanation: "Evaluation research systematically assesses the operation, outcomes, and effectiveness of social interventions or programs ('How well are we doing?').",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 66,
    originalNumber: 65,
    prompt: "Validity in interviews is strengthened by the following EXCEPT:",
    options: [
      { text: "Building rapport with interviewees", isCorrect: false },
      { text: "Multiple questions cover the same theme", isCorrect: false },
      { text: "Constructing interview schedules that contain themes drawn from the literature", isCorrect: false },
      { text: "Prompting respondents to expand on initial responses", isCorrect: true }
    ],
    objective: "Interview Technique & Validity",
    difficulty: 3,
    hint: "Leading prompts or excessive steering by the interviewer can introduce bias.",
    explanation: "Uncontrolled prompting risks steering participants into giving socially desirable or researcher-directed answers, threatening validity.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 67,
    originalNumber: 66,
    prompt: "Which type of central tendency measure is used in ratio scale?",
    options: [
      { text: "Mean", isCorrect: false },
      { text: "Median", isCorrect: false },
      { text: "Mode", isCorrect: false },
      { text: "Geometric Progression", isCorrect: true }
    ],
    objective: "Measurement Scales & Statistics",
    difficulty: 2,
    hint: "Ratio scales possess a true absolute zero, enabling geometric means and proportional ratios.",
    explanation: "A ratio scale permits all mathematical operations including geometric mean and geometric progression calculations because of a true absolute zero.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 68,
    originalNumber: 67,
    prompt: "Which type of analysis studies the functional relationship between two or more existing variables?",
    options: [
      { text: "Correlation analysis", isCorrect: false },
      { text: "Regression analysis", isCorrect: true },
      { text: "Causal analysis", isCorrect: false },
      { text: "Inferential analysis", isCorrect: false }
    ],
    objective: "Statistical Analysis & Inference",
    difficulty: 2,
    hint: "Expresses Y as a mathematical function of X (e.g., Y = a + bX).",
    explanation: "Regression analysis models the functional mathematical relationship between a dependent variable and one or more independent predictor variables.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 69,
    originalNumber: 68,
    prompt: "What is inferential statistics otherwise called?",
    options: [
      { text: "Testing statistics", isCorrect: false },
      { text: "Descriptive statistics", isCorrect: false },
      { text: "Stratified statistics", isCorrect: false },
      { text: "Sampling statistics", isCorrect: true }
    ],
    objective: "Statistical Analysis & Inference",
    difficulty: 2,
    hint: "It uses sample properties to estimate population parameters.",
    explanation: "Inferential statistics is frequently termed sampling statistics because it derives population generalizations from sample measurements.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 70,
    originalNumber: 69,
    prompt: "Which of the following is incorrect when naming a variable in SPSS?",
    options: [
      { text: "Must begin with a letter and not a number", isCorrect: false },
      { text: "Must end in a full stop", isCorrect: true },
      { text: "Cannot exceed 64 characters", isCorrect: false },
      { text: "Cannot include symbols such as ?, & and %", isCorrect: false }
    ],
    objective: "Statistical Software (SPSS)",
    difficulty: 2,
    hint: "SPSS uses full stops (periods) to denote command terminators, so variable names cannot end in one.",
    explanation: "In SPSS, variable names cannot end with a period/full stop because the period is reserved as a command-syntax terminator.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 71,
    originalNumber: 70,
    prompt: "Student ranking from high to low is an example of which scale?",
    options: [
      { text: "Nominal Scale", isCorrect: false },
      { text: "Ordinal Scale", isCorrect: true },
      { text: "Interval Scale", isCorrect: false },
      { text: "Ratio Scale", isCorrect: false }
    ],
    objective: "Measurement Scales",
    difficulty: 1,
    hint: "Rank-ordered data (1st place, 2nd place, etc.).",
    explanation: "Class standings and rank orders (1st, 2nd, 3rd) represent an ordinal measurement scale.",
    lessonModule: "Sampling & Measurement Scales"
  },
  {
    id: 72,
    originalNumber: 71,
    prompt: "Which among the following is true with respect to Surveys?",
    options: [
      { text: "Surveys don’t manipulate the variables", isCorrect: true },
      { text: "Needs only small samples", isCorrect: false },
      { text: "Is an essential feature of physical and natural sciences", isCorrect: false },
      { text: "Causal analysis is more important than correlational analysis", isCorrect: false }
    ],
    objective: "Survey Research",
    difficulty: 2,
    hint: "Surveys are non-experimental and observe variables as they naturally occur.",
    explanation: "Surveys collect observational/self-reported data in natural settings without active researcher manipulation of independent variables.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 73,
    originalNumber: 72,
    prompt: "Which type of analysis concerns with the various tests for hypotheses testing?",
    options: [
      { text: "Correlation analysis", isCorrect: false },
      { text: "Regression analysis", isCorrect: false },
      { text: "Causal analysis", isCorrect: false },
      { text: "Inferential analysis", isCorrect: true }
    ],
    objective: "Statistical Analysis & Inference",
    difficulty: 1,
    hint: "Tests statistical significance to infer population parameters from samples.",
    explanation: "Inferential analysis uses parametric and non-parametric tests to examine whether sample hypotheses hold true for the population.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 74,
    originalNumber: 73,
    prompt: "Which part of a research report contains details of how the research was planned and conducted?",
    options: [
      { text: "Results", isCorrect: false },
      { text: "Design", isCorrect: true },
      { text: "Introduction", isCorrect: false },
      { text: "Background", isCorrect: false }
    ],
    objective: "Research Reporting",
    difficulty: 1,
    hint: "The section that details sample selection, instruments, and procedural blueprints.",
    explanation: "The Design (or Methodology) section details the systematic blueprint, participants, instrumentation, and procedures executed.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 75,
    originalNumber: 74,
    prompt: "Which scale represents the actual number of variables?",
    options: [
      { text: "Nominal Scale", isCorrect: false },
      { text: "Ordinal Scale", isCorrect: false },
      { text: "Interval Scale", isCorrect: false },
      { text: "Ratio Scale", isCorrect: true }
    ],
    objective: "Measurement Scales",
    difficulty: 2,
    hint: "Features meaningful absolute zero and direct ratio comparison of quantities.",
    explanation: "A ratio scale represents true physical amounts/quantities with an absolute zero (e.g. weight, length, counts).",
    lessonModule: "Sampling & Measurement Scales"
  },
  {
    id: 76,
    originalNumber: 75,
    prompt: "Which among the following is secondary data?",
    options: [
      { text: "Trade journals", isCorrect: false },
      { text: "Public records", isCorrect: false },
      { text: "Websites", isCorrect: false },
      { text: "All of the above", isCorrect: true }
    ],
    objective: "Data Collection Tools",
    difficulty: 1,
    hint: "All three are pre-existing sources created prior to the researcher's current study.",
    explanation: "Trade journals, public archives, and websites are established secondary resources available for analysis.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 77,
    originalNumber: 76,
    prompt: "Which among the following analysis deals with how one or more variables affect changes in another variable?",
    options: [
      { text: "Correlation analysis", isCorrect: false },
      { text: "Regression analysis", isCorrect: false },
      { text: "Causal analysis", isCorrect: true },
      { text: "Inferential analysis", isCorrect: false }
    ],
    objective: "Variables & Research Design",
    difficulty: 2,
    hint: "Focuses specifically on establishing cause-and-effect influence.",
    explanation: "Causal analysis examines how direct manipulation or changes in an independent variable cause shifts in the outcome variable.",
    lessonModule: "Variables & Hypothesis Testing"
  },
  {
    id: 78,
    originalNumber: 77,
    prompt: "Which among the following is true with respect to group interviews?",
    options: [
      { text: "One interviewer and one interviewee", isCorrect: false },
      { text: "More than one interviewer and one interviewee", isCorrect: false },
      { text: "One interviewer and more than one interviewee", isCorrect: true },
      { text: "More than One interviewer and more than one interviewee", isCorrect: false }
    ],
    objective: "Data Collection Tools",
    difficulty: 1,
    hint: "Single facilitator interacting with multiple participants.",
    explanation: "A group interview is composed of one interviewer questioning multiple interviewees at the same time.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 79,
    originalNumber: 78,
    prompt: "Which of the following is not a type of research question?",
    options: [
      { text: "A hypothesis", isCorrect: true },
      { text: "Predicting an outcome", isCorrect: false },
      { text: "Evaluating a phenomenon", isCorrect: false },
      { text: "Developing good practice", isCorrect: false }
    ],
    objective: "Research Questions vs Hypotheses",
    difficulty: 2,
    hint: "A hypothesis is an affirmative testable statement, not a question.",
    explanation: "A hypothesis is a declarative propositional statement, whereas predicting, evaluating, and developing practice can be framed as research questions.",
    lessonModule: "Problem Identification & Research Proposal"
  },
  {
    id: 80,
    originalNumber: 79,
    prompt: "The research that is especially carried out to test and validate the study hypotheses is termed___________",
    options: [
      { text: "Fundamental research", isCorrect: false },
      { text: "Applied research", isCorrect: false },
      { text: "Conclusive research", isCorrect: true },
      { text: "Exploratory research", isCorrect: false }
    ],
    objective: "Types of Research",
    difficulty: 2,
    hint: "A structured study aimed at reaching final validation of hypotheses.",
    explanation: "Conclusive research tests specific hypotheses and examines relationships to produce definitive findings.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 81,
    originalNumber: 80,
    prompt: "The research studies that explore the effect of one thing on another and more specifically, the effect of one variable on another are known as__________",
    options: [
      { text: "Causal research", isCorrect: true },
      { text: "Applied research", isCorrect: false },
      { text: "Conclusive research", isCorrect: false },
      { text: "Exploratory research", isCorrect: false }
    ],
    objective: "Variables & Research Design",
    difficulty: 1,
    hint: "Directly determines the cause-and-effect relationship.",
    explanation: "Causal research studies establish whether changes in one variable produce predictable changes in another.",
    lessonModule: "Variables & Hypothesis Testing"
  },
  {
    id: 82,
    originalNumber: 81,
    prompt: "The good quality of a research is its--------",
    options: [
      { text: "Objectivity", isCorrect: true },
      { text: "Replicability", isCorrect: false },
      { text: "Reliability", isCorrect: false },
      { text: "Usability", isCorrect: false }
    ],
    objective: "Research Foundations",
    difficulty: 1,
    hint: "Freedom from personal bias and subjective distortion.",
    explanation: "Objectivity—ensuring that research procedures and findings remain free from personal bias—is a foundational quality of scientific inquiry.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 83,
    originalNumber: 82,
    prompt: "----------- thinking enables us to write statements and develop arguments in a step-by-step coherent manner.",
    options: [
      { text: "Logical", isCorrect: true },
      { text: "Accurate", isCorrect: false },
      { text: "Scientific", isCorrect: false },
      { text: "Clear", isCorrect: false }
    ],
    objective: "Scientific Thinking",
    difficulty: 1,
    hint: "Sequential, deductive and inductive reasoning connecting premises to conclusions.",
    explanation: "Logical thinking governs structured reasoning, permitting sequential development of arguments and conclusions.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 84,
    originalNumber: 83,
    prompt: "A research problem is primarily chosen depending upon ------",
    options: [
      { text: "Availability", isCorrect: false },
      { text: "Its relevance", isCorrect: true },
      { text: "Interest of the researcher", isCorrect: false },
      { text: "Availability of literature", isCorrect: false }
    ],
    objective: "Problem Identification",
    difficulty: 2,
    hint: "Academic and social importance to the field.",
    explanation: "While researcher interest is helpful, academic significance and practical relevance are the primary criteria for selecting a viable problem.",
    lessonModule: "Problem Identification & Research Proposal"
  },
  {
    id: 85,
    originalNumber: 84,
    prompt: "The extent to which the findings of a research study are generalizable is called as-------",
    options: [
      { text: "Convergent validity", isCorrect: false },
      { text: "Predictive validity", isCorrect: false },
      { text: "Internal validity", isCorrect: false },
      { text: "External validity", isCorrect: true }
    ],
    objective: "Validity & Reliability",
    difficulty: 1,
    hint: "Generalizability beyond the specific sample and experimental setting.",
    explanation: "External validity refers to the extent to which research conclusions can be generalized to outside populations, settings, and times.",
    lessonModule: "Statistical Analysis, Inference & Reporting"
  },
  {
    id: 86,
    originalNumber: 85,
    prompt: "Which of the following is a measure of consistency?",
    options: [
      { text: "Validity", isCorrect: false },
      { text: "Objectivity", isCorrect: false },
      { text: "Reliability", isCorrect: true },
      { text: "Credibility", isCorrect: false }
    ],
    objective: "Validity & Reliability",
    difficulty: 1,
    hint: "Delivering the same result when repeated under similar conditions.",
    explanation: "Reliability is the technical psychometric property that measures repeatability, stability, and consistency over time.",
    lessonModule: "Sampling & Measurement Scales"
  },
  {
    id: 87,
    originalNumber: 86,
    prompt: "The step-by-step process by which the research project is conducted and completed is known as ---------.",
    options: [
      { text: "The research process.", isCorrect: true },
      { text: "The process of describing research.", isCorrect: false },
      { text: "The process of developing research ideas.", isCorrect: false },
      { text: "The process of gathering data for a research project.", isCorrect: false }
    ],
    objective: "Research Process",
    difficulty: 1,
    hint: "The overarching systematic pathway of academic investigation.",
    explanation: "The research process is the structured, sequential framework connecting problem identification, literature review, design, collection, analysis, and reporting.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 88,
    originalNumber: 87,
    prompt: "Research is",
    options: [
      { text: "Searching again and again", isCorrect: false },
      { text: "Finding solution to any problem", isCorrect: false },
      { text: "Working in a scientific way to search for truth of any problem", isCorrect: true },
      { text: "None of the above", isCorrect: false }
    ],
    objective: "Research Foundations",
    difficulty: 1,
    hint: "A disciplined scientific pursuit to uncover objective truth.",
    explanation: "Scientific research entails methodical, disciplined exploration to arrive at verified truths regarding a problem.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 89,
    originalNumber: 88,
    prompt: "Which of the following is the first step in starting the research process?",
    options: [
      { text: "Searching sources of information to locate problem.", isCorrect: false },
      { text: "Survey of related literature", isCorrect: false },
      { text: "Identification of problem", isCorrect: true },
      { text: "Searching for solutions to the problem", isCorrect: false }
    ],
    objective: "Problem Identification",
    difficulty: 1,
    hint: "Determining the subject and focus before gathering literature.",
    explanation: "Identification and formulation of the problem is universally recognized as the essential starting point of inquiry.",
    lessonModule: "Problem Identification & Research Proposal"
  },
  {
    id: 90,
    originalNumber: 89,
    prompt: "A common test in research demands much priority on",
    options: [
      { text: "Reliability", isCorrect: false },
      { text: "Useability", isCorrect: false },
      { text: "Objectivity", isCorrect: false },
      { text: "All of the above", isCorrect: true }
    ],
    objective: "Measurement & Test Criteria",
    difficulty: 1,
    hint: "A sound measurement tool must be reliable, objective, and practical to administer.",
    explanation: "All three qualities—reliability (consistency), usability (feasibility), and objectivity (impartiality)—are mandatory for research tests.",
    lessonModule: "Sampling & Measurement Scales"
  },
  {
    id: 91,
    originalNumber: 90,
    prompt: "Action research means",
    options: [
      { text: "A longitudinal research", isCorrect: false },
      { text: "An applied research", isCorrect: false },
      { text: "A research initiated to solve an immediate problem", isCorrect: true },
      { text: "A research with socioeconomic objective", isCorrect: false }
    ],
    objective: "Types of Research",
    difficulty: 1,
    hint: "Carried out directly to resolve an immediate situational dilemma.",
    explanation: "Action research is pragmatic inquiry undertaken to solve immediate, practical problems in local professional environments.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 92,
    originalNumber: 91,
    prompt: "In the process of conducting research 'Formulation of Hypothesis' is followed by:",
    options: [
      { text: "Statement of Objectives", isCorrect: false },
      { text: "Analysis of Data", isCorrect: false },
      { text: "Selection of Research Tools", isCorrect: true },
      { text: "Collection of Data", isCorrect: false }
    ],
    objective: "Research Process",
    difficulty: 2,
    hint: "Next comes determining the instruments and techniques needed to capture the data.",
    explanation: "Once hypotheses are formulated, researchers select or build appropriate data collection tools and design procedures.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 93,
    originalNumber: 92,
    prompt: "A research paper is a brief report of research work based on:",
    options: [
      { text: "Primary Data only", isCorrect: false },
      { text: "Secondary Data only", isCorrect: false },
      { text: "Both Primary and Secondary Data", isCorrect: true },
      { text: "None of the above", isCorrect: false }
    ],
    objective: "Research Reporting",
    difficulty: 1,
    hint: "Can draw upon field studies, existing records, or a combination.",
    explanation: "Scholarly papers can report investigations based on primary field findings, secondary documentation, or both.",
    lessonModule: "Foundations of Scientific Research"
  },
  {
    id: 94,
    originalNumber: 93,
    prompt: "What is the collection of terms or records in MARC called?",
    options: [
      { text: "System", isCorrect: false },
      { text: "Network", isCorrect: false },
      { text: "Website", isCorrect: false },
      { text: "Database", isCorrect: true }
    ],
    objective: "Library Science & Documentation",
    difficulty: 2,
    hint: "MARC (Machine-Readable Cataloging) organizes bibliographic records in a structured repository.",
    explanation: "MARC (Machine-Readable Cataloging) standards store and index bibliographic records within a database structure.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 95,
    originalNumber: 94,
    prompt: "Information is…..",
    options: [
      { text: "Raw Data", isCorrect: false },
      { text: "Processed Data", isCorrect: true },
      { text: "Input data", isCorrect: false },
      { text: "Organized data", isCorrect: false }
    ],
    objective: "Data vs Information",
    difficulty: 1,
    hint: "Data is raw facts; when processed and given context, it becomes...",
    explanation: "In information science, data consists of raw unorganized facts, which upon processing and interpretation become meaningful information.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 96,
    originalNumber: 95,
    prompt: "Conference proceedings are considered as..................documents.",
    options: [
      { text: "Conventional", isCorrect: false },
      { text: "Primary", isCorrect: true },
      { text: "Secondary", isCorrect: false },
      { text: "Tertiary", isCorrect: false }
    ],
    objective: "Documentary Sources",
    difficulty: 2,
    hint: "Original presentation of research directly by the investigating authors.",
    explanation: "Conference proceedings publish direct, original accounts of new scientific discoveries presented firsthand by the authors, constituting primary literature.",
    lessonModule: "Literature Review & Academic Ethics"
  },
  {
    id: 97,
    originalNumber: 96,
    prompt: "An appropriate source to find out descriptive information is................ .",
    options: [
      { text: "Bibliography", isCorrect: false },
      { text: "Directory", isCorrect: false },
      { text: "Encyclopedia", isCorrect: true },
      { text: "Dictionary", isCorrect: false }
    ],
    objective: "Documentary Sources",
    difficulty: 1,
    hint: "Comprehensive reference work providing detailed background overviews on subjects.",
    explanation: "An encyclopedia is designed specifically to provide comprehensive, factual, and descriptive background articles across subjects.",
    lessonModule: "Literature Review & Academic Ethics"
  },
  {
    id: 98,
    originalNumber: 97,
    prompt: "Questionnaire is a :",
    options: [
      { text: "Research method", isCorrect: false },
      { text: "Measurement technique", isCorrect: false },
      { text: "Tool for data collection", isCorrect: true },
      { text: "Data analysis technique", isCorrect: false }
    ],
    objective: "Data Collection Tools",
    difficulty: 1,
    hint: "It is the instrument handed out to respondents to record their answers.",
    explanation: "A questionnaire is a specialized data collection tool/instrument used in survey research designs.",
    lessonModule: "Data Collection Tools & Fieldwork"
  },
  {
    id: 99,
    originalNumber: 98,
    prompt: "“Controlled Group” is a term used in.............. .",
    options: [
      { text: "Survey research", isCorrect: false },
      { text: "Historical research", isCorrect: false },
      { text: "Experimental research", isCorrect: true },
      { text: "Descriptive research", isCorrect: false }
    ],
    objective: "Experimental Research",
    difficulty: 1,
    hint: "Used in clinical and laboratory trials to compare against the treatment condition.",
    explanation: "A control group is an indispensable element of experimental designs, serving as the untreated comparison baseline.",
    lessonModule: "Research Paradigms & Designs"
  },
  {
    id: 100,
    originalNumber: 99,
    prompt: "Which of the following is not covered under Intellectual Property Rights ?",
    options: [
      { text: "Copyrights", isCorrect: false },
      { text: "Patents", isCorrect: false },
      { text: "Trade Marks", isCorrect: false },
      { text: "Thesaurus", isCorrect: true }
    ],
    objective: "Intellectual Property Rights",
    difficulty: 1,
    hint: "A reference book of synonyms is a generic linguistic work, not a legal category of IP.",
    explanation: "Intellectual Property Rights legally protect Copyrights, Patents, Trademarks, and Industrial Designs. A thesaurus is an informational book of synonyms.",
    lessonModule: "Literature Review & Academic Ethics"
  }
];

// Enrich each question with its exact Arabic methodological explanation
QUESTION_BANK.forEach((q) => {
  const num = typeof q.originalNumber === 'number' ? q.originalNumber : parseInt(String(q.originalNumber), 10);
  q.explanationAr = ARABIC_EXPLANATIONS[num] || ARABIC_EXPLANATIONS[q.id];
});

export { ARABIC_EXPLANATIONS, STATISTICAL_REVISION_SUMMARY, type StatisticalSummarySection };
