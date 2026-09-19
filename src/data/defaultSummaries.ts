export interface SummaryItem {
  id: string;
  labelEn: string;
  labelAr: string;
  detailEn: string;
  detailAr: string;
  badge?: string;
  formula?: string;
  keyTakeaway?: string;
}

export interface SummarySection {
  id: string | number;
  iconName: string; // 'Scale' | 'BarChart3' | 'GitBranch' | 'AlertTriangle' | 'Sigma' | 'Network' | 'Target' | 'FileText' | 'BookOpen' | 'CheckCircle2'
  titleEn: string;
  titleAr: string;
  summaryEn?: string;
  summaryAr?: string;
  items: SummaryItem[];
  notes?: string;
}

export interface StudySummary {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  category: string;
  iconName: string;
  createdAt: string;
  updatedAt: string;
  isCustom?: boolean;
  isChapterBlock?: boolean;
  parentSummaryId?: string;
  parentSummaryTitle?: string;
  chapterNumber?: number;
  totalChapters?: number;
  tags: string[];
  sections: SummarySection[];
}

export const DEFAULT_STUDY_SUMMARIES: StudySummary[] = [
  {
    id: "statistical-rules-summary",
    titleEn: "Core Statistical Concepts & Examination Rules",
    titleAr: "ملخص القواعد والمفاهيم الإحصائية الشامل للاختبار",
    subtitleEn: "High-yield revision sheet covering measurement scales, central tendencies, hypotheses, errors, and analytical models.",
    subtitleAr: "مراجعة مكثفة ومركزة لأهم القواعد، مستويات المقاييس، النزعة المركزية، الأخطاء الإحصائية، وعلاقات الانحدار والارتباط المتكررة في الاختبارات.",
    category: "Statistics & Inference",
    iconName: "BarChart3",
    createdAt: "2026-09-19",
    updatedAt: "2026-09-19",
    tags: ["High-Yield", "Statistics", "Scales", "Hypothesis", "Exam Preparation"],
    sections: [
      {
        id: 1,
        iconName: "Scale",
        titleEn: "Measurement Scales & Appropriate Central Tendency",
        titleAr: "مستويات المقاييس والمقياس الإحصائي المناسب",
        summaryEn: "Stevens' four measurement scales and their statistically valid measures of central tendency.",
        summaryAr: "المقاييس الأربعة لستيفنز ومقاييس النزعة المركزية الإحصائية المقابلة لكل منها مع تطبيقاتها.",
        items: [
          {
            id: "scale-nominal",
            labelEn: "Nominal Scale",
            labelAr: "المقياس الاسمي",
            detailEn: "Categorical labels with no numeric value or order (e.g., gender, firm location, nationality).",
            detailAr: "يُستخدم لتصنيف البيانات إلى فئات ومسميات نوعية دون أي مفاضلة رقمية أو ترتيب (مثل: الموقع الجغرافي، الجنس، التخصص).",
            badge: "Mode / المنوال",
            keyTakeaway: "لا يقبل العمليات الحسابية سوى التكرارات والنسب المئوية."
          },
          {
            id: "scale-ordinal",
            labelEn: "Ordinal Scale",
            labelAr: "المقياس الترتيبي",
            detailEn: "Rank-ordered data where intervals are not necessarily equal (e.g., student rankings, socioeconomic class).",
            detailAr: "يُستخدم لترتيب البيانات وتصنيفها تصاعدياً أو تنازلياً مع عدم تساوي المسافات بين الرتب (مثل: رتب الطلبة، الرضا الوظيفي).",
            badge: "Median / الوسيط",
            keyTakeaway: "يحدد الأفضلية والترتيب لكنه لا يحدد مقدار الفارق الدقيق بين المستويات."
          },
          {
            id: "scale-interval",
            labelEn: "Interval Scale",
            labelAr: "المقياس الفئوي / الفتراتي",
            detailEn: "Equal numeric intervals with an arbitrary/relative zero (e.g., temperature in Celsius, Likert scale scores).",
            detailAr: "مسافات متساوية بين الدرجات مع وجود صفر اعتباطي افتراضي لا يعني انعدام الظاهرة (مثل: درجات الحرارة المئوية، درجات الذكاء IQ).",
            badge: "Mean / المتوسط الحسابي",
            keyTakeaway: "الصفر فيه ليس عدماً؛ حرارة الصفر المئوي لا تعني انعدام الحرارة."
          },
          {
            id: "scale-ratio",
            labelEn: "Ratio Scale",
            labelAr: "المقياس النسبي",
            detailEn: "Equal intervals with an absolute true zero indicating complete absence of quantity (e.g., weight, income, response time).",
            detailAr: "أعلى وأدق مستويات القياس؛ وحدات متساوية مع صفر مطلق (Absolute Zero) يدل على انعدام الظاهرة تماماً (مثل: الدخل، المسافة، الزمن).",
            badge: "Geometric Mean / المتوسط الهندسي",
            keyTakeaway: "يقبل كافة العمليات الحسابية والنسب المباشرة (الضعف، النصف)."
          }
        ]
      },
      {
        id: 2,
        iconName: "FileText",
        titleEn: "Types of Statistics: Descriptive vs. Inferential",
        titleAr: "أنواع الإحصاء: الوصفي والاستدلالي (إحصاء المعاينة)",
        summaryEn: "Systematic distinction between summarizing sample features and generalizing to the target population.",
        summaryAr: "التفريق المنهجي الدقيق بين تلخيص بيانات العينة وتعميم النتائج على مجتمع الدراسة.",
        items: [
          {
            id: "stat-descriptive",
            labelEn: "Descriptive Statistics",
            labelAr: "الإحصاء الوصفي",
            detailEn: "Summarizes, organizes, and charts characteristics of sample data (e.g., mean, standard deviation, frequency tables, charts).",
            detailAr: "يلخص ويصف الخصائص العامة للبيانات المجمعة دون تعميم يتجاوز حدود العينة المدروسة (مثل: الجداول التكرارية، المتوسطات، الرسوم البيانية).",
            badge: "Sample Description"
          },
          {
            id: "stat-inferential",
            labelEn: "Inferential Statistics (Sampling Statistics)",
            labelAr: "الإحصاء الاستدلالي (إحصاء المعاينة)",
            detailEn: "Also known as Sampling Statistics. Uses sample metrics and probability distributions to make inferences, test hypotheses, and generalize to the population.",
            detailAr: "يُعرف أيضاً بـ إحصاء المعاينة (Sampling Statistics)، ويستهدف اختبار الفرضيات واستخلاص القرارات والتعميم عن مجتمع الدراسة الشامل بناءً على بيانات العينة.",
            badge: "Hypothesis Testing & Generalization"
          }
        ]
      },
      {
        id: 3,
        iconName: "GitBranch",
        titleEn: "Statistical Hypotheses (Null vs. Alternative)",
        titleAr: "الفرضيات الإحصائية: الصفرية والبديلة",
        summaryEn: "Formulation and testing criteria for null and directional/nondirectional research hypotheses.",
        summaryAr: "قواعد صياغة واختبار فرضية العدم والفرضيات البحثية البديلة الموجهة وغير الموجهة.",
        items: [
          {
            id: "hypo-null",
            labelEn: "Null Hypothesis (H₀)",
            labelAr: "فرضية العدم / الفرضية الصفرية (H₀)",
            detailEn: "Posits no relationship or statistically significant difference between groups/variables. Tested indirectly by attempting to falsify it.",
            detailAr: "تنفي وجود فروق أو علاقة ذات دلالة إحصائية بين المتغيرات. تُعتبر الفرضية الأساسية التي تخضع للاختبار الإحصائي المباشر بهدف رفضها.",
            badge: "Default Assumption"
          },
          {
            id: "hypo-alt",
            labelEn: "Alternative / Research Hypothesis (H₁)",
            labelAr: "الفرضية البديلة / الفرضية البحثية (H₁)",
            detailEn: "Predicts the presence of a real effect or relationship. Directional specifies the sign (e.g. A > B), while Non-directional posits difference only (A ≠ B).",
            detailAr: "تثبت وجود علاقة أو فروق حقيقية. وتكون إما متجهة (Directional) تحدد اتجاه الأفضلية، أو غير متجهة (Non-directional) تؤكد الفارق دون حسم اتجاهه.",
            badge: "Directional / Non-directional"
          }
        ]
      },
      {
        id: 4,
        iconName: "AlertTriangle",
        titleEn: "Statistical Decision Errors & Significance Level",
        titleAr: "الأخطاء الإحصائية ومستوى الدلالة (α)",
        summaryEn: "Type I (False Positive) vs Type II (False Negative) errors and alpha risk management.",
        summaryAr: "المقارنة الحاسمة بين خطأ النوع الأول وخطأ النوع الثاني وحدود مستوى الدلالة المقبول.",
        items: [
          {
            id: "err-type1",
            labelEn: "Type I Error (Alpha Error - α)",
            labelAr: "خطأ النوع الأول (Type 1 Error)",
            detailEn: "Rejecting the null hypothesis (H₀) when it is actually true in reality (False Positive).",
            detailAr: "يحدث عند رفض فرضية العدم (H₀) بالرغم من أنها صحيحة وحقيقية فعلياً في الواقع (الادعاء بوجود فارق بينما هو معدوم).",
            badge: "Reject True H₀ (False Alarm)"
          },
          {
            id: "err-alpha",
            labelEn: "Significance Level (Alpha - α)",
            labelAr: "مستوى الدلالة الإحصائية (Significance Level - α)",
            detailEn: "The maximum acceptable probability of committing a Type I error. Commonly set at 0.05 or 0.01 in social science research.",
            detailAr: "يقيس أقصى احتمالية مقبولة للوقوع في خطأ رفض فرضية العدم وهي صحيحة (شائع عند 5% أو 1%).",
            badge: "α = 0.05 / 0.01"
          },
          {
            id: "err-type2",
            labelEn: "Type II Error (Beta Error - β)",
            labelAr: "خطأ النوع الثاني (Type 2 Error)",
            detailEn: "Failing to reject (accepting) the null hypothesis when it is actually false in reality (False Negative).",
            detailAr: "يحدث عند قبول أو عدم رفض فرضية العدم بينما هي خاطئة فعلياً في الواقع (الفشل في كشف أثر حقيقي موجود).",
            badge: "Accept False H₀"
          }
        ]
      },
      {
        id: 5,
        iconName: "Sigma",
        titleEn: "Measures of Central Tendency & Dispersion",
        titleAr: "مقاييس النزعة المركزية ومقاييس التشتت",
        summaryEn: "Formulas, definitions, and application contexts for averages and variance indicators.",
        summaryAr: "القوانين والتعريفات الأساسية للمتوسط الحسابي، الوسيط، المنوال، والانحراف المعياري.",
        items: [
          {
            id: "stat-mean",
            labelEn: "Arithmetic Mean",
            labelAr: "المتوسط الحسابي (Mean)",
            detailEn: "Sum of all observed values divided by the total number of items: (∑X) / N. Sensitive to extreme outliers.",
            detailAr: "مجموع القيم مقسوماً على عددها: (∑X / N). يتأثر بشدة بالقيم المتطرفة والشاذة.",
            formula: "Mean = ∑X / N"
          },
          {
            id: "stat-median",
            labelEn: "Median",
            labelAr: "الوسيط (Median)",
            detailEn: "The middle score that divides an ordered dataset into two equal halves (50% above, 50% below). Robust against outliers.",
            detailAr: "القيمة التي تقسم درجات التوزيع المرتبة تصاعدياً أو تنازلياً إلى نصفين متساويين، وهو مقياس مقاوم للقيم الشاذة.",
            badge: "Middle 50%"
          },
          {
            id: "stat-mode",
            labelEn: "Mode",
            labelAr: "المنوال (Mode)",
            detailEn: "The most frequently occurring value in a distribution. Distributions can be unimodal, bimodal, or multimodal.",
            detailAr: "القيمة الأكثر تكراراً وشيوعاً بين الاستجابات، وهو المقياس الوحيد الصالح للبيانات الاسمية.",
            badge: "Most Frequent"
          },
          {
            id: "stat-sd",
            labelEn: "Standard Deviation (SD)",
            labelAr: "الانحراف المعياري (Standard Deviation)",
            detailEn: "The most widely used measure of data dispersion; quantifies how much scores deviate from the arithmetic mean.",
            detailAr: "المقياس الإحصائي الأهم لمدى تباعد وتشتت القيم حول متوسطها الحسابي، ويساوي الجذر التربيعي للتباين.",
            formula: "SD = √(Variance)"
          },
          {
            id: "stat-variance",
            labelEn: "Variance",
            labelAr: "التباين (Variance)",
            detailEn: "The average of the squared deviations from the arithmetic mean (SD squared).",
            detailAr: "متوسط مربعات انحرافات الدرجات عن متوسطها الحسابي (مربع الانحراف المعياري).",
            formula: "Variance = SD²"
          },
          {
            id: "stat-range",
            labelEn: "Range",
            labelAr: "المدى (Range)",
            detailEn: "The difference between the maximum and minimum observed scores: X_max - X_min.",
            detailAr: "الفرق بين أعلى قيمة وأدنى قيمة مسجلة في التوزيع الإحصائي.",
            formula: "Range = X_max - X_min"
          }
        ]
      },
      {
        id: 6,
        iconName: "Network",
        titleEn: "Sample Size & Sampling Error Dynamic",
        titleAr: "حجم العينة وخطأ المعاينة (Sampling Error)",
        summaryEn: "The fundamental inverse theorem between sample size and magnitude of sampling error.",
        summaryAr: "القاعدة الذهبية للعلاقة العكسية بين حجم العينة ومقدار خطأ المعاينة الإحصائي.",
        items: [
          {
            id: "sample-inverse",
            labelEn: "Inverse Relationship Theorem",
            labelAr: "مبرهنة العلاقة العكسية",
            detailEn: "The smaller the sample size, the greater the sampling error. Conversely, increasing sample size systematically reduces sampling error.",
            detailAr: "كلما صغر حجم العينة (Smaller sample size)، كلما زاد خطأ المعاينة (Greater sampling error)، والعكس صحيح تماماً.",
            badge: "Fundamental Rule"
          },
          {
            id: "sample-min-error",
            labelEn: "Condition for Minimum Error",
            labelAr: "شرط تحقيق أقل خطأ معاينة",
            detailEn: "Minimum sampling error is achieved when a large sample size is drawn strictly through probability/random sampling techniques.",
            detailAr: "يتحقق أقل خطأ معاينة عند اختيار عينة ذات حجم كبير ومسحوبة بطريقة عشوائية احتمالية تمثيلية.",
            badge: "Large Random Sample"
          }
        ]
      },
      {
        id: 7,
        iconName: "Target",
        titleEn: "Statistical Relationships & Predictive Models",
        titleAr: "العلاقات الإحصائية والنماذج التنبؤية",
        summaryEn: "Distinction between regression, causal mechanisms, and correlation coefficients.",
        summaryAr: "التمييز بين نماذج الانحدار، والتحليل السببي، ومعاملات الارتباط الخطية.",
        items: [
          {
            id: "rel-regression",
            labelEn: "Regression Analysis",
            labelAr: "تحليل الانحدار (Regression Analysis)",
            detailEn: "Estimates the functional mathematical relationship to predict the value of a dependent variable based on one or more independent variables.",
            detailAr: "يدرس العلاقة الدالية ويُستخدم للتنبؤ بقيمة المتغير التابع استناداً إلى معرفة قيم المتغير أو المتغيرات المستقلة.",
            badge: "Prediction & Effect"
          },
          {
            id: "rel-causal",
            labelEn: "Causal Analysis",
            labelAr: "التحليل السببي (Causal Analysis)",
            detailEn: "Evaluates how controlled manipulation of an antecedent independent variable causes verifiable changes in the dependent outcome.",
            detailAr: "يدرس كيف يتسبب التغير المقنن في المتغير المستقل بإحداث تأثير مباشر في المتغير التابع (يتطلب تصميماً تجريبياً).",
            badge: "Direct Causation"
          },
          {
            id: "rel-correlation",
            labelEn: "Positive vs. Negative Correlation",
            labelAr: "الارتباط الموجب والسالب",
            detailEn: "Positive correlation means both variables move in the same direction (+1.0 max). Negative correlation means they move in opposite directions (-1.0 max).",
            detailAr: "الارتباط الموجب يعني تغير المتغيرين في نفس الاتجاه معاً (صعوداً أو هبوطاً). والارتباط السالب يعني تحركهما في اتجاهين متعاكسين.",
            badge: "r ∈ [-1.0, +1.0]"
          }
        ]
      }
    ]
  },
  {
    id: "research-designs-variables-summary",
    titleEn: "Research Methodology Paradigms, Designs & Variables",
    titleAr: "ملخص تصاميم البحوث، مناهج البحث والمتغيرات",
    subtitleEn: "Essential foundations on qualitative, quantitative, mixed methods, experimental controls, and variable classifications.",
    subtitleAr: "أهم القواعد في التفريق بين البحوث النوعية والكمية والمختلطة، وضوابط التجربة العلمية، وتصنيف المتغيرات المستقلة والتابعة.",
    category: "Methodology & Paradigms",
    iconName: "BookOpen",
    createdAt: "2026-09-19",
    updatedAt: "2026-09-19",
    tags: ["Research Design", "Variables", "Experimental", "Methodology"],
    sections: [
      {
        id: "paradigm-types",
        iconName: "GitBranch",
        titleEn: "Major Research Paradigms",
        titleAr: "المناهج البحثية الرئيسية",
        summaryEn: "Quantitative, qualitative, and pragmatic mixed-methods frameworks.",
        summaryAr: "المقارنة المنهجية بين المنهج الكمي والنوعي والمنهج المختلط.",
        items: [
          {
            id: "par-quant",
            labelEn: "Quantitative Research",
            labelAr: "البحث الكمي",
            detailEn: "Focuses on objective measurements, statistical hypotheses, standardized numerical data, and deductic reasoning.",
            detailAr: "يركز على القياسات الموضوعية، الفرضيات المحددة مسبقاً، واختبار النظريات بالاستدلال الإحصائي والأرقام."
          },
          {
            id: "par-qual",
            labelEn: "Qualitative Research",
            labelAr: "البحث النوعي",
            detailEn: "Focuses on exploring in-depth meanings, subjective human experiences, inductive reasoning, and naturalistic contexts.",
            detailAr: "يركز على استكشاف الظواهر وفهم الدلالات والتجارب الإنسانية في سياقها الطبيعي وبمنهج استقرائي."
          },
          {
            id: "par-mixed",
            labelEn: "Mixed-Methods Research",
            labelAr: "البحث المختلط (Mixed-Methods)",
            detailEn: "Combines qualitative and quantitative approaches sequentially or concurrently to provide comprehensive insight.",
            detailAr: "يجمع بين الأساليب الكمية والنوعية في مرحلتين متتاليتين أو متزامنتين لتحقيق فهم أعمق للظاهرة.",
            badge: "Sequential / Concurrent"
          }
        ]
      },
      {
        id: "variables-control",
        iconName: "Target",
        titleEn: "Variable Types & Experimental Controls",
        titleAr: "تصنيف المتغيرات وضوابط التجربة",
        summaryEn: "Independent, dependent, controlled, and extraneous variables.",
        summaryAr: "المتغير المستقل، المتغير التابع، المجموعة الضابطة والتلاعب التجريبي.",
        items: [
          {
            id: "var-iv",
            labelEn: "Independent Variable (IV)",
            labelAr: "المتغير المستقل (المتغير التفسيري)",
            detailEn: "The antecedent variable manipulated or categorized by the researcher to determine its causal impact on outcomes.",
            detailAr: "المتغير الذي يقوم الباحث بضبطه أو التلاعب بقيمه لمعرفة أثره المباشر على النتائج.",
            badge: "Manipulated / Cause"
          },
          {
            id: "var-dv",
            labelEn: "Dependent Variable (DV)",
            labelAr: "المتغير التابع (المتغير المتأثر)",
            detailEn: "The outcome variable measured to observe the effect caused by the independent variable.",
            detailAr: "المتغير الذي يُقاس لرصد وملاحظة التغيرات الناتجة عن أثر المتغير المستقل.",
            badge: "Measured Outcome"
          },
          {
            id: "var-ctrl",
            labelEn: "Control Group",
            labelAr: "المجموعة الضابطة (Controlled Group)",
            detailEn: "A foundational baseline group in experimental designs that receives no treatment, ensuring internal validity.",
            detailAr: "مصطلح خاص بالبحث التجريبي (Experimental Research) يمثل مجموعة المقارنة التي لا تتلقى المعالجة التجريبية.",
            badge: "Experimental Research"
          }
        ]
      }
    ]
  },
  {
    id: "ethics-sources-summary",
    titleEn: "Ethics, Literature Review & Academic Documentation",
    titleAr: "ملخص أخلاقيات البحث والمصادر المرجعية والتوثيق",
    subtitleEn: "Principles of participant protection, primary vs secondary literature, MARC, and intellectual property rights.",
    subtitleAr: "ضوابط حماية المفحوصين، تصنيف المصادر الأولية والثانوية، أوعية المعلومات، وحقوق الملكية الفكرية.",
    category: "Ethics & Documentation",
    iconName: "Scale",
    createdAt: "2026-09-19",
    updatedAt: "2026-09-19",
    tags: ["Ethics", "Literature Review", "Sources", "Documentation"],
    sections: [
      {
        id: "ethics-core",
        iconName: "AlertTriangle",
        titleEn: "Ethical Principles in Scientific Research",
        titleAr: "المبادئ الأخلاقية الأساسية في البحث العلمي",
        summaryEn: "Harm avoidance, informed consent, and radical vs structured positions.",
        summaryAr: "تجنب إلحاق الأذى، الموافقة المستنيرة، والمواقف الفكرية من الأخلاقيات.",
        items: [
          {
            id: "eth-no-harm",
            labelEn: "Avoidance of Harm",
            labelAr: "تجنب إلحاق الأذى بالمشاركين (Avoiding Harm)",
            detailEn: "The paramount principle of research ethics; participants must be shielded from physical, mental, or social damage.",
            detailAr: "المبدأ الجوهري الأول لأخلاقيات البحث العلمي، ويوجب صون المشاركين من أي أذى جسدي أو نفسي أو اجتماعي.",
            badge: "Primary Obligation"
          },
          {
            id: "eth-radical",
            labelEn: "Radical Ethical Perspective",
            labelAr: "المنظور الراديكالي للأخلاقيات",
            detailEn: "Argues that researchers should have complete freedom of action and that external checklists stifle scientific discovery.",
            detailAr: "يرى أن الباحثين يملكون حرية مطلقة في ممارساتهم (Researchers can do anything they want) رافضاً الرقابة المؤسسية المقيدة.",
            badge: "Radical Stance"
          }
        ]
      },
      {
        id: "doc-sources",
        iconName: "FileText",
        titleEn: "Documentary Sources & Reference Works",
        titleAr: "أوعية ومصادر المعلومات المرجعية",
        summaryEn: "Classification of conference proceedings, encyclopedias, and bibliographic databases.",
        summaryAr: "المصادر الأولية والثانوية، وقواعد الفهرسة الآلية مثل MARC.",
        items: [
          {
            id: "src-proceedings",
            labelEn: "Conference Proceedings",
            labelAr: "وقائع المؤتمرات (Conference Proceedings)",
            detailEn: "Classified as Primary Documents because they report original scientific findings presented firsthand by authors.",
            detailAr: "تُعد وثائق أولية (Primary Documents) لأنها تنشر نتائج البحوث الأصلية التي يقدمها الباحثون مباشرة لأول مرة.",
            badge: "Primary Document"
          },
          {
            id: "src-encyclopedia",
            labelEn: "Encyclopedia",
            labelAr: "الموسوعة / دائرة المعارف (Encyclopedia)",
            detailEn: "The primary reference work specifically designed to find comprehensive factual and descriptive background information.",
            detailAr: "المرجع الأنسب والأشمل للبحث عن معلومات وصفية وحقائق شاملة حول موضوع معين.",
            badge: "Descriptive Source"
          },
          {
            id: "src-marc",
            labelEn: "MARC System",
            labelAr: "نظام الفهرسة المقروءة آلياً (MARC)",
            detailEn: "Machine-Readable Cataloging formats; a structured collection of records organized as a Database.",
            detailAr: "مجموعة التسجيلات الببليوغرافية المقروءة آلياً وتُعرف وتُنظم ضمن قاعدة بيانات (Database).",
            badge: "Database"
          },
          {
            id: "src-ipr",
            labelEn: "Intellectual Property Rights (IPR)",
            labelAr: "حقوق الملكية الفكرية",
            detailEn: "Protects Patents, Copyrights, and Trademarks. A Thesaurus is a generic vocabulary reference, not a legal category of IPR.",
            detailAr: "تشمل براءات الاختراع، حقوق التأليف والنشر، والعلامات التجارية. بينما المكنز اللغوي (Thesaurus) عمل لغوي عام لا يندرج كحق ملكية فكرية.",
            badge: "Patents / Copyright / Trademarks"
          }
        ]
      }
    ]
  },
  {
    id: "practical-research-guide-summary",
    titleEn: "Practical Research Guide: Methodologies, Digital Tools & Literature",
    titleAr: "دليل التعلّم والبحث العملي: أسس المناهج، الأدوات الرقمية، والأدبيات",
    subtitleEn: "Comprehensive synthesis of Practical Research (Leedy & Ormrod), research library axes, digital search tools, and methodology foundations.",
    subtitleAr: "دليل متكامل يغطي محاور المكتبة البحثية الثلاثة، خطة دليل التعلم، فصول كتاب Practical Research، التقارير المحكمة، البحث الأساسي والتطبيقي، الفجوات المعرفية، والتصميم والمقترح والتقرير النهائي.",
    category: "Methodology & Practical Research",
    iconName: "BookOpen",
    createdAt: "2026-09-19",
    updatedAt: "2026-09-19",
    tags: ["Practical Research", "Leedy & Ormrod", "Learning Guide", "Research Axes", "Peer Review", "Basic vs Applied", "Knowledge Gaps"],
    sections: [
      {
        id: "library-axes",
        iconName: "Network",
        titleEn: "The Three Core Axes of the Research Library",
        titleAr: "المحاور الثلاثة الرئيسية لمصادر المكتبة البحثية",
        summaryEn: "Classification of library resources into foundational methodology, digital search technologies, and applied computer science.",
        summaryAr: "تتوزع المصادر المحددة في مكتبتك على ثلاثة محاور رئيسية تكاملية لبناء باحث متمكن منهجياً وتقنياً.",
        items: [
          {
            id: "axis-methodology",
            labelEn: "Foundations & Methodologies of Scientific Research",
            labelAr: "المحور الأول: أسس ومناهج البحث العلمي",
            detailEn: "Covers core chapters of 'Practical Research' by Paul D. Leedy & Jeanne Ellis Ormrod: nature of inquiry, problem identification, literature review, project planning, and final reporting.",
            detailAr: "تغطي فصولاً من كتاب Practical Research تتناول طبيعة البحث العلمي، كيفية اختيار وتحديد مشكلة البحث، مراجعة الأدبيات والدراسات السابقة، التخطيط للمشاريع البحثية، وإعداد التقارير النهائية.",
            badge: "Core Foundations"
          },
          {
            id: "axis-digital-tools",
            labelEn: "Research Tools & Digital Technologies",
            labelAr: "المحور الثاني: أدوات البحث والتقنيات الرقمية",
            detailEn: "Studies on advanced web search strategies, Boolean operators (AND, OR, NOT) to narrow/widen search scopes, and reference management software such as Zotero and Mendeley.",
            detailAr: "تتضمن دراسات حول استراتيجيات البحث في الويب، استخدام المعاملات البولينية (Boolean Operators) لتضييق ونطاق البحث، وأدوات تنظيم وإدارة المراجع مثل Zotero وMendeley.",
            badge: "Digital Tools & Boolean"
          },
          {
            id: "axis-computer-applied",
            labelEn: "Computational Research & Practical Applications",
            labelAr: "المحور الثالث: أبحاث حاسوبية وتطبيقات عملية",
            detailEn: "Applied computer science proposals and empirical studies, particularly evaluating prompt injection defenses in local RAG (Retrieval-Augmented Generation) systems, defense performance, and adaptive attacks.",
            detailAr: "تشمل دراسات ومقترحات بحثية تطبيقية في علوم الحاسوب، وخاصة أبحاث تقييم دفاعات حقن التعليمات (Prompt Injection) في أنظمة RAG المحلية وتحليل أداء الدفاعات والهجمات التكيفية.",
            badge: "Applied CS & Security"
          }
        ]
      },
      {
        id: "learning-plan-stages",
        iconName: "Target",
        titleEn: "Proposed Learning Guide Plan (4 Stages)",
        titleAr: "خطة «دليل التعلّم» المقترحة (المراحل الأربعة)",
        summaryEn: "Four structured pedagogical stages transitioning from foundational concepts to cybersecurity/RAG analysis and practical execution.",
        summaryAr: "خطة متدرجة لنقل الباحث من فهم الإطار النظري إلى إتقان الأدوات الرقمية ثم تحليل الأوراق المتقدمة والتطبيق العملي.",
        items: [
          {
            id: "stage-1",
            labelEn: "Stage 1: Core Methodology Concepts",
            labelAr: "المرحلة الأولى: دراسة المفاهيم الأساسية لمنهجية البحث",
            detailEn: "In-depth study of problem definition, formulation of hypotheses/questions, variables, and rigorous research design frameworks.",
            detailAr: "تحديد مشكلة البحث، صياغة الفرضيات، تصنيف المتغيرات، وفهم تصميم البحث وإجراءاته وضوابطه المنهجية.",
            badge: "المرحلة الأولى"
          },
          {
            id: "stage-2",
            labelEn: "Stage 2: Literature Search & Digital Reference Tools",
            labelAr: "المرحلة الثانية: مهارات البحث عن الأدبيات وإدارة المراجع",
            detailEn: "Mastering database queries, literature review synthesis, Boolean operators, and citation managers (Zotero, Mendeley).",
            detailAr: "إتقان مهارات البحث عن الأدبيات واستخدام أدوات تنظيم وإدارة المراجع والمعاملات البولينية (Boolean Operators).",
            badge: "المرحلة الثانية"
          },
          {
            id: "stage-3",
            labelEn: "Stage 3: Advanced Computing & Security Paper Analysis",
            labelAr: "المرحلة الثالثة: تحليل التطبيقات والأوراق البحثية المتخصصة",
            detailEn: "Critical analysis of specialized CS and cybersecurity literature, particularly local RAG systems, prompt injection defenses, and empirical benchmarks.",
            detailAr: "تحليل التطبيقات والأوراق البحثية المتخصصة في مجال الحاسوب والأمن السيبراني (مثل أنظمة RAG ودفاعات Prompt Injection).",
            badge: "المرحلة الثالثة"
          },
          {
            id: "stage-4",
            labelEn: "Stage 4: Practical Application & Comprehensive Revision",
            labelAr: "المرحلة الرابعة: التطبيق العملي والمراجعة الشاملة",
            detailEn: "Executing an end-to-end research proposal, pilot testing, writing final reports, and continuous methodological evaluation.",
            detailAr: "التطبيق العملي المتكامل، صياغة المقترح البحثي، إجراء التجارب الاستكشافية، ومراجعة التقرير النهائي بدقة.",
            badge: "المرحلة الرابعة"
          }
        ]
      },
      {
        id: "book-chapters-overview",
        iconName: "BookOpen",
        titleEn: "Practical Research Framework (Leedy & Ormrod)",
        titleAr: "فصول كتاب Practical Research: التخطيط والتصميم البحثي",
        summaryEn: "Core chapters covering scientific inquiry, problem definition, literature synthesis, design planning, and reporting.",
        summaryAr: "يقدم كتاب Practical Research: Planning and Design (بول ليدي وجين أورمرود) إطاراً عملياً وتطبيقياً متكاملاً لإتقان جميع مراحل البحث العلمي.",
        items: [
          {
            id: "pr-ch1",
            labelEn: "Chapter 1: Nature & Tools of Research",
            labelAr: "الفصل الأول: طبيعة البحث العلمي وأدواته",
            detailEn: "Research is a continuous, cyclic process and systematic inquiry to discover new knowledge and gain deep understanding. Contrasts juried (peer-reviewed) and nonjuried reports.",
            detailAr: "البحث عملية دورية مستمرة ونهج منظم لاكتشاف معرفة جديدة واكتساب فهم عميق للظواهر. يُميز الكتاب بين التقارير المحكمة (Juried) وغير المحكمة (Nonjuried).",
            badge: "الفصل الأول"
          },
          {
            id: "pr-ch2",
            labelEn: "Chapter 2: Problem Selection & Formulation",
            labelAr: "الفصل الثاني: اختيار مشكلة البحث وصياغتها",
            detailEn: "The problem is the beating heart of research. Divides inquiry into basic vs applied research. Warns against latching onto first ideas or duplicate topics.",
            detailAr: "المشكلة هي القلب النابض للبحث. يميز بين البحوث الأساسية والتطبيقية، ويبدأ التدرج من الفكرة العامة إلى السؤال المحدد ثم الفرضية مع تجنب الأفكار المكررة.",
            badge: "الفصل الثاني"
          },
          {
            id: "pr-ch3",
            labelEn: "Chapter 3: Review of the Literature",
            labelAr: "الفصل الثالث: مراجعة الأدبيات والدراسات السابقة",
            detailEn: "Highlights research trends, evaluates strengths/weaknesses of prior work, identifies knowledge gaps, and uses synthesis to reveal common themes.",
            detailAr: "إبراز الاتجاهات البحثية الحديثة، تقييم نقاط القوة والضعف في الدراسات السابقة، وتحديد الفجوات المعرفية (Knowledge Gaps) وصولاً إلى التوليف (Synthesis).",
            badge: "الفصل الثالث"
          },
          {
            id: "pr-ch4",
            labelEn: "Chapter 4: Planning & Research Design",
            labelAr: "الفصل الرابع: التخطيط وتصميم المشروع البحثي",
            detailEn: "Overall study structure, operational procedures, measurement of variables, setting (lab vs natural), and pilot studies for testing feasibility and validity.",
            detailAr: "الهيكل العام للدراسة والإجراءات، تحديد طبيعة المتغيرات وقياسها والتحكم بها، واختيار المنهجية والبيئة وإجراء دراسة استكشافية (Pilot Study).",
            badge: "الفصل الرابع"
          },
          {
            id: "pr-ch5-13",
            labelEn: "Chapters 5 & 13: Proposal & Final Report Preparation",
            labelAr: "الفصلان الخامس والثالث عشر: المقترح والتقرير النهائي",
            detailEn: "Comprehensive research proposal elements (problems, hypotheses, definitions, delimitations) and three-tier final report architecture (front matter, body, end matter).",
            detailAr: "إعداد المقترح البحثي (وثيقة تضم المشكلة والفرضيات والتعاريف والحدود وخطة الجمع) وهيكلة التقرير النهائي (صفحات تمهيدية، صلب التقرير، والصفحات الختامية).",
            badge: "الفصل الخامس و13"
          }
        ]
      },
      {
        id: "juried-vs-nonjuried",
        iconName: "Scale",
        titleEn: "Juried (Refereed) vs. Nonjuried Research Reports",
        titleAr: "التقارير البحثية المحكّمة (Juried) وغير المحكّمة (Nonjuried)",
        summaryEn: "Rigorous comparative breakdown of peer-reviewed scientific literature versus non-peer-reviewed online writings.",
        summaryAr: "المقارنة المنهجية بين التقارير المحكمة الخاضعة لتحكيم الأقران والتقارير غير المحكمة وضوابط الاعتماد العلمي.",
        items: [
          {
            id: "rep-juried",
            labelEn: "Juried / Refereed Research Reports",
            labelAr: "التقارير البحثية المحكّمة (Juried or Refereed)",
            detailEn: "Manuscripts evaluated and critically reviewed by a panel of expert peers prior to publication. High academic rigor and reliability (e.g., IEEE Xplore, ScienceDirect).",
            detailAr: "تقارير وأوراق علمية تخضع للتقييم والفحص الدقيق من قِبل لجنة من الخبراء والمتخصصين في نفس المجال قبل الموافقة على نشرها لضمان الجودة والأهمية العلمية.",
            badge: "Peer-Reviewed (عالية الموثوقية)"
          },
          {
            id: "rep-nonjuried",
            labelEn: "Nonjuried / Nonrefereed Reports",
            labelAr: "التقارير البحثية غير المحكّمة (Nonjuried)",
            detailEn: "Publications appearing in magazines or online without mandatory expert review. Quality varies widely; requires critical reading by researchers before citation.",
            detailAr: "منشورات تظهر في مجلات عامة أو الإنترنت دون مراجعة أو اختيار مسبق من خبراء. عدم التحكيم لا ينفي الفائدة لكنه يتطلب قراءة ناقدة للتحقق من الدقة والمنهجية.",
            badge: "Nonrefereed (متغيرة الموثوقية)"
          },
          {
            id: "rep-comparison-table",
            labelEn: "Key Comparison Matrix",
            labelAr: "جدول المقارنة بين التقارير المحكمة وغير المحكمة",
            detailEn: "Evaluation: Expert review vs no prior filter. Acceptance: Quality and relevance criteria met vs open posting. Reliability: High & stable vs variable. Sources: Verified journals vs personal blogs.",
            detailAr: "التقييم: فحص من خبراء مقابل نشر مباشر. شرط النشر: استيفاء معايير الجودة مقابل لا فحص إلزامي. الموثوقية: عالية ومستقرة مقابل متغيرة. المنصات: قواعد معتمدة مقابل مواقع عامة.",
            keyTakeaway: "التقارير المحكمة هي الأساس الموثوق لبناء الفروض ومراجعة الأدبيات، بينما غير المحكمة تستوجب فحصاً منهجياً دقيقاً."
          }
        ]
      },
      {
        id: "basic-vs-applied",
        iconName: "GitBranch",
        titleEn: "Basic Research vs. Applied Research",
        titleAr: "البحث الأساسي (Basic) والبحث التطبيقي (Applied)",
        summaryEn: "Fundamental distinction regarding research purpose, real-world immediacy, physical setting, and participant nature.",
        summaryAr: "الفروق الجوهرية بين البحوث الأساسية التي تستهدف توسيع المعرفة النظرية، والبحوث التطبيقية التي تعالج مشكلات عملية وميدانية فورية.",
        items: [
          {
            id: "res-basic",
            labelEn: "Basic Research",
            labelAr: "البحث الأساسي (Basic Research)",
            detailEn: "Aims to expand general theoretical knowledge and understanding of physical, biological, psychological, or social phenomena without requiring immediate practical utility.",
            detailAr: "يهدف إلى توسيع المعرفة النظرية العامة وفهم الظواهر وكشف القوانين والنظريات العامة دون اشتراط وجود تطبيق عملي أمامه فوراً (يُجرى غالباً في بيئات مخبرية).",
            badge: "Theoretical Knowledge"
          },
          {
            id: "res-applied",
            labelEn: "Applied Research",
            labelAr: "البحث التطبيقي (Applied Research)",
            detailEn: "Aims to address and resolve immediate real-world issues, operational practices, and policies inside workplaces or organizations (e.g., Action Research).",
            detailAr: "يستهدف معالجة قضايا ومشكلات عملية ذات صلة وتأثير مباشر بالممارسات والإجراءات والسياسات القائمة (يُنفذ غالباً في البيئة الميدانية الطبيعية ومع أفراد من الواقع).",
            badge: "Practical Problem Solving"
          },
          {
            id: "res-basic-applied-table",
            labelEn: "Comparison Matrix (Purpose, Setting & Participants)",
            labelAr: "مقارنة تفصيلية: الغرض، البيئة، والمشاركون",
            detailEn: "Basic: Theoretical knowledge, laboratory setting, controlled participants. Applied: Practical problem solving, natural workplace setting, actual field participants.",
            detailAr: "الغرض: تعزيز النظريات (أساسي) مقابل حل مشكلات قائمة (تطبيقي). الارتباط: غير فوري مقابل مباشر. البيئة: مخبرية مضبوطة مقابل ميدانية طبيعية. المشاركون: تجريبيون مضبوطون مقابل أفراد من بيئة العمل الفعلية.",
            keyTakeaway: "البحث الأساسي يركز على «لماذا وكيف تحدث الظاهرة نظرياً»، والبحث التطبيقي يركز على «كيف نحل هذه المشكلة عملياً هنا والآن»."
          }
        ]
      },
      {
        id: "knowledge-gaps-methods",
        iconName: "AlertTriangle",
        titleEn: "Detecting & Formulating Knowledge Gaps (5 Methods)",
        titleAr: "أساليب رصد وصياغة الفجوات المعرفية (Knowledge Gaps)",
        summaryEn: "Five systematic criteria for identifying research gaps through literature review and critical synthesis.",
        summaryAr: "تحديد الفجوات المعرفية هو الهدف المحوري لمراجعة الأدبيات لإثبات الحاجة المباشرة للبحث الجديد استناداً إلى خمسة أساليب منهجية.",
        items: [
          {
            id: "gap-contradictory",
            labelEn: "1. Discrepant or Contradictory Findings",
            labelAr: "1. رصد النتائج المتناقضة وغير المحسومة",
            detailEn: "Examine conflicting results or competing interpretations across prior studies; contradictions reveal an immediate gap requiring resolution.",
            detailAr: "البحث عن القضايا الجدلية التي اختلفت حولها نتائج الباحثين أو قدمت تفسيرات متعارضة لنفس الظاهرة؛ ما يستدعي بحثاً جديداً لحسم التباين وتفسيره.",
            badge: "Contradictory Results"
          },
          {
            id: "gap-methodological",
            labelEn: "2. Shortcomings & Methodological Limitations",
            labelAr: "2. فحص القصور والقيود المنهجية",
            detailEn: "Scrutinize limitations in study design, sample size/nature, or measurement instruments; addressing them with a more robust method creates a validated gap.",
            detailAr: "التركيز على نقاط الضعف والقصور في الدراسات السابقة (تصميم البحث، حجم العينة ونوعها، أو أدوات القياس) ومعالجتها بمنهجية أدق.",
            badge: "Methodological Limits"
          },
          {
            id: "gap-future-research",
            labelEn: "3. Suggestions for Further Research",
            labelAr: "3. تتبع توصيات البحوث المستقبلية",
            detailEn: "Review the concluding sections where authors recommend future research topics; an authoritative source of unmapped questions.",
            detailAr: "تتبع قسم مقترحات الأبحاث المستقبلية في ختام الأوراق العلمية؛ وهو مصدر مباشر وموثوق لأسئلة يوصي بها الخبراء لم تُدرس بعد.",
            badge: "Future Suggestions"
          },
          {
            id: "gap-synthesis",
            labelEn: "4. Critical Synthesis & Comparison of Theoretical Frameworks",
            labelAr: "4. التوليف والمقارنة بين الأطر النظرية",
            detailEn: "Synthesize findings across studies to highlight common patterns and competing models, revealing under-researched variables or areas.",
            detailAr: "عدم الاكتفاء بالتلخيص الفردي، بل إجراء التوليف (Synthesis) لإبراز الموضوعات المشتركة ومقارنة المذاهب للكشف عن المناطق غير المدروسة كفاية.",
            badge: "Synthesis & Comparison"
          },
          {
            id: "gap-new-context",
            labelEn: "5. New Context or Combined Framework Evaluation",
            labelAr: "5. الدمج والتقييم في سياق محدد وجديد",
            detailEn: "Combining multiple mechanisms and evaluating them in a new, controlled operating environment (e.g., testing RAG defenses under specific adversarial attacks).",
            detailAr: "دمج آليات وأساليب متعددة وتقييمها معاً في بيئة محددة وضابطة (مثل تقييم دفاعات حاسوبية محددة تحت ظروف تشغيل خاصة وهجمات تكيفية).",
            badge: "New Context"
          }
        ]
      },
      {
        id: "design-proposal-reporting",
        iconName: "FileText",
        titleEn: "Research Design, Proposal & Final Report Architecture",
        titleAr: "تصميم البحث، المقترح البحثي، وهيكلة التتقرير النهائي",
        summaryEn: "Systematic layout of Chapters 4, 5, and 13 from Practical Research: design pillars, pilot studies, proposal rules, and the 3 report parts.",
        summaryAr: "تفصيل أركان التصميم البحثي، التجربة الاستكشافية (Pilot Study)، عناصر المقترح البحثي، والأقسام الثلاثة للتقرير النهائي (التمهيدية، الصلب، والختامية).",
        items: [
          {
            id: "des-structure",
            labelEn: "Research Design & 3 Main Pillars",
            labelAr: "تصميم البحث (الهيكل العام والدعائم الثلاث)",
            detailEn: "The overall structure defining: (1) procedures followed, (2) nature of data collected, and (3) analytical/statistical methods applied.",
            detailAr: "الهيكل العام للدراسة (Overall structure) ويحدد: الإجراءات التي يتبعها الباحث، طبيعة البيانات التي يجمعها، وأساليب التحليل التي سيجريها على البيانات.",
            badge: "Overall Structure"
          },
          {
            id: "des-variables-pilot",
            labelEn: "Variables, Validity, Reliability & Pilot Study",
            labelAr: "المتغيرات، الصدق والثبات، والدراسة الاستكشافية",
            detailEn: "Controlling IV/DV with valid & reliable instruments. A Pilot Study is a small-scale trial run testing feasibility and instrument effectiveness before the main investigation.",
            detailAr: "تحديد المتغيرات وضبطها بأدوات تتسم بالصدق والثبات. والدراسة الاستكشافية (Pilot Study) تجربة مصغرة لاختبار الأدوات وتقييم الجدوى قبل الدراسة الرئيسية.",
            badge: "Pilot Study (Feasibility)"
          },
          {
            id: "prop-essentials",
            labelEn: "Research Proposal Essentials",
            labelAr: "المقترح البحثي (Research Proposal)",
            detailEn: "Formal document defining core problem, subproblems, hypotheses/questions, operational definitions, limitations/delimitations, and data collection plan.",
            detailAr: "وثيقة رسمية تتضمن صياغة المشكلة والمشكلات الفرعية، الفرضيات، التعاريف الإجرائية الدقيقة، الحدود والقيود (Limitations & Delimitations)، وخطة جمع البيانات وتفسيرها.",
            badge: "Formal Proposal"
          },
          {
            id: "report-front-matter",
            labelEn: "Final Report: Front Matter",
            labelAr: "التقرير النهائي: الصفحات التمهيدية (Front Matter)",
            detailEn: "Title page (author, institution, date), copyright/signature page, concise Abstract (whole study summary), acknowledgments, and table of contents.",
            detailAr: "صفحة العنوان، التوقيعات والحقوق، المستخلص (Abstract) الموجز للدراسة بأكملها، الشكر والتقدير، وفهرس المحتويات والجداول.",
            badge: "Front Matter"
          },
          {
            id: "report-body",
            labelEn: "Final Report: Body of the Report",
            labelAr: "التقرير النهائي: صلب التقرير (Body of Report)",
            detailEn: "Statement of problem & objectives, literature review, detailed methods allowing exact replication, data/statistical results with rationale, and discussions.",
            detailAr: "بيان الهدف والمشكلة، مراجعة الأدبيات، وصف المناهج والإجراءات بالتفصيل الكافي للسماح بتكرار الدراسة (Replication)، وتحليل البيانات وتفسير النتائج والاستنتاجات.",
            badge: "Body (Replication)"
          },
          {
            id: "report-end-matter",
            labelEn: "Final Report: End Matter",
            labelAr: "التقرير النهائي: الصفحات الختامية (End Matter)",
            detailEn: "Endnotes, comprehensive references list matching all in-text citations, and appendixes (instruments, extra raw tables, permissions).",
            detailAr: "تتضمن الملاحظات الختامية (Endnotes)، قائمة المراجع المكتملة (Reference list) لكافة المصادر المذكورة في المتن، والملاحق (Appendixes).",
            badge: "End Matter"
          }
        ]
      }
    ]
  }
];

/**
 * Splits a comprehensive summary into individual chapter document blocks,
 * each managed as an independent StudySummary object with its own metadata.
 */
export function splitSummaryIntoChapterBlocks(summary: StudySummary): StudySummary[] {
  const total = summary.sections.length;
  return summary.sections.map((section, index) => {
    const chapterNum = index + 1;
    return {
      id: `${summary.id}-ch${chapterNum}`,
      titleEn: `Chapter ${chapterNum}: ${section.titleEn}`,
      titleAr: `الفصل ${chapterNum}: ${section.titleAr}`,
      subtitleEn: section.summaryEn || `Independent document block extracted from ${summary.titleEn}.`,
      subtitleAr: section.summaryAr || `كتلة مستند دراسي مستقلة مستخرجة من ${summary.titleAr}.`,
      category: `${summary.category} - فصل ${chapterNum}`,
      iconName: section.iconName || summary.iconName || 'BookOpen',
      createdAt: summary.createdAt,
      updatedAt: new Date().toISOString().split('T')[0],
      isCustom: true,
      isChapterBlock: true,
      parentSummaryId: summary.id,
      parentSummaryTitle: summary.titleAr,
      chapterNumber: chapterNum,
      totalChapters: total,
      tags: [
        `Chapter ${chapterNum}`,
        `فصل ${chapterNum}`,
        ...(summary.tags.slice(0, 3)),
        ...(section.items.map(it => it.badge).filter(Boolean) as string[])
      ],
      sections: [
        {
          ...section,
          id: `${section.id}-doc`
        }
      ]
    };
  });
}

/**
 * Extracts a single section into an individual document block
 */
export function extractSectionAsDocumentBlock(
  section: SummarySection,
  parentSummary: StudySummary,
  customChapterNumber?: number
): StudySummary {
  const chapterNum = customChapterNumber || 1;
  return {
    id: `extracted-${parentSummary.id}-${section.id}-${Date.now()}`,
    titleEn: section.titleEn,
    titleAr: section.titleAr,
    subtitleEn: section.summaryEn || `Extracted independent document block from ${parentSummary.titleEn}`,
    subtitleAr: section.summaryAr || `مستند دراسي مستقل مستخرج من ${parentSummary.titleAr}`,
    category: `${parentSummary.category} - قسم مستقل`,
    iconName: section.iconName || 'FileText',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    isCustom: true,
    isChapterBlock: true,
    parentSummaryId: parentSummary.id,
    parentSummaryTitle: parentSummary.titleAr,
    chapterNumber: chapterNum,
    totalChapters: parentSummary.sections.length,
    tags: [
      'مستند مستقل',
      'Chapter Block',
      ...(parentSummary.tags.slice(0, 2)),
      ...(section.items.map(it => it.badge).filter(Boolean) as string[])
    ],
    sections: [
      {
        ...section,
        id: `${section.id}-standalone`
      }
    ]
  };
}

/**
 * Merges a list of chapter document blocks back into a single comprehensive summary.
 */
export function mergeChapterBlocksIntoSummary(
  chapters: StudySummary[],
  baseParent?: StudySummary
): StudySummary {
  const sorted = [...chapters].sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
  const primary = baseParent || sorted[0];

  const allSections: SummarySection[] = [];
  sorted.forEach(ch => {
    ch.sections.forEach(s => {
      allSections.push({
        ...s,
        id: `${ch.id}-${s.id}`
      });
    });
  });

  return {
    id: baseParent?.id || `merged-summary-${Date.now()}`,
    titleEn: baseParent?.titleEn || `Comprehensive Synthesis: ${primary.titleEn}`,
    titleAr: baseParent?.titleAr || `المستند الشامل المدمج: ${primary.titleAr}`,
    subtitleEn: baseParent?.subtitleEn || `Combined comprehensive document containing ${sorted.length} chapters.`,
    subtitleAr: baseParent?.subtitleAr || `مستند دراسي مدمج وشامل يضم ${sorted.length} فصول وأقسام معرفية.`,
    category: baseParent?.category || primary.category.split(' - ')[0] || 'Comprehensive Synthesis',
    iconName: baseParent?.iconName || 'BookOpen',
    createdAt: baseParent?.createdAt || new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    isCustom: true,
    isChapterBlock: false,
    tags: Array.from(new Set([
      ...(baseParent?.tags || []),
      'Comprehensive',
      'مستند مدمج',
      ...sorted.flatMap(c => c.tags)
    ])).slice(0, 10),
    sections: allSections
  };
}
