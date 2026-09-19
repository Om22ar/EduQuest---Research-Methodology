import React, { useState, useMemo, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import {
  DEFAULT_STUDY_SUMMARIES,
  StudySummary,
  SummarySection,
  SummaryItem,
  splitSummaryIntoChapterBlocks,
  extractSectionAsDocumentBlock,
  mergeChapterBlocksIntoSummary
} from '../data/defaultSummaries.ts';
import {
  Scale,
  BarChart3,
  GitBranch,
  AlertTriangle,
  Sigma,
  Network,
  Target,
  FileText,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Trash2,
  Plus,
  Edit3,
  Copy,
  Check,
  Printer,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layout,
  Layers,
  ArrowRight,
  FolderOpen,
  RotateCcw,
  BookMarked,
  X,
  FileCode,
  Tag,
  Hash,
  HelpCircle,
  Clock,
  Eye,
  FolderTree,
  ExternalLink,
  Scissors,
  Split,
  Merge,
  CheckSquare,
  Square,
  FileDown,
  Download,
  ArrowUp,
  ArrowDown,
  Pencil
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Markdown Renderer Helper with clean typographic styling for RTL and LTR
function MarkdownView({
  content,
  className = '',
  dir = 'auto'
}: {
  content?: string;
  className?: string;
  dir?: 'rtl' | 'ltr' | 'auto';
}) {
  if (!content) return null;

  return (
    <div className={cn("text-xs sm:text-sm leading-relaxed", className)} dir={dir}>
      <Markdown
        components={{
          h1: ({ children }) => <h1 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mt-2 mb-1.5">{children}</h1>,
          h2: ({ children }) => <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mt-2 mb-1">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mt-1.5 mb-0.5">{children}</h3>,
          p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-1.5 pr-2 dark:text-gray-300">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-1.5 pr-2 dark:text-gray-300">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="border-r-3 border-indigo-400 dark:border-indigo-500 pr-3 py-1 my-1.5 bg-indigo-50/60 dark:bg-indigo-950/40 text-gray-700 dark:text-gray-300 rounded-sm">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

// Icon mapper for dynamic section icons
function getSectionIcon(iconName?: string, className: string = "w-5 h-5") {
  switch (iconName) {
    case 'Scale':
      return <Scale className={className} />;
    case 'BarChart3':
      return <BarChart3 className={className} />;
    case 'GitBranch':
      return <GitBranch className={className} />;
    case 'AlertTriangle':
      return <AlertTriangle className={className} />;
    case 'Sigma':
      return <Sigma className={className} />;
    case 'Network':
      return <Network className={className} />;
    case 'Target':
      return <Target className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} />;
    case 'BookMarked':
      return <BookMarked className={className} />;
    default:
      return <FileText className={className} />;
  }
}

const AVAILABLE_ICONS = [
  { name: 'Scale', label: 'Scale / مقياس', icon: Scale },
  { name: 'BarChart3', label: 'Chart / إحصاء', icon: BarChart3 },
  { name: 'GitBranch', label: 'Branch / فرضيات', icon: GitBranch },
  { name: 'AlertTriangle', label: 'Warning / أخطاء', icon: AlertTriangle },
  { name: 'Sigma', label: 'Sigma / معادلات', icon: Sigma },
  { name: 'Network', label: 'Network / عينات', icon: Network },
  { name: 'Target', label: 'Target / متغيرات', icon: Target },
  { name: 'FileText', label: 'Document / مستند', icon: FileText },
  { name: 'BookOpen', label: 'Book / كتاب', icon: BookOpen },
  { name: 'BookMarked', label: 'Bookmark / إشارة', icon: BookMarked }
];

export default function StudySummaries() {
  // Load summaries from localStorage or fallback to default with automatic merge of defaults
  const [summaries, setSummaries] = useState<StudySummary[]>(() => {
    try {
      const saved = localStorage.getItem('eduquest_study_summaries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if any default summaries are missing (e.g. newly added ones)
          const existingIds = new Set(parsed.map(s => s.id));
          const missingDefaults = DEFAULT_STUDY_SUMMARIES.filter(def => !existingIds.has(def.id));
          if (missingDefaults.length > 0) {
            return [...parsed, ...missingDefaults];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading summaries:', e);
    }
    return DEFAULT_STUDY_SUMMARIES;
  });

  // Active Selected Summary ID
  const [activeSummaryId, setActiveSummaryId] = useState<string>(() => {
    return summaries[0]?.id || 'statistical-rules-summary';
  });

  // View Mode: 'document' (Full Continuous Document) vs 'sections' (Split Parts with Icons)
  const [viewMode, setViewMode] = useState<'document' | 'sections'>('document');

  // Language Display: 'both' | 'ar' | 'en'
  const [langMode, setLangMode] = useState<'both' | 'ar' | 'en'>('both');

  // Search filter inside active summary
  const [searchQuery, setSearchQuery] = useState('');

  // Collapsed sections in sections view
  const [collapsedSections, setCollapsedSections] = useState<Record<string | number, boolean>>({});

  // Active section for table of contents
  const [activeSectionId, setActiveSectionId] = useState<string | number | null>(null);

  // Copy to clipboard notification and generic toast
  const [copiedToast, setCopiedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Shelf Filter: 'all' | 'comprehensive' | 'chapters' | 'custom'
  const [summaryFilter, setSummaryFilter] = useState<'all' | 'comprehensive' | 'chapters' | 'custom'>('all');

  // Modal State for Adding or Editing Summary (Document Level CRUD)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSummary, setEditingSummary] = useState<StudySummary | null>(null);

  // Modal State for Adding or Editing an Individual Section (Section Level CRUD)
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SummarySection | null>(null);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);

  // Split Modal State (Splitting a summary into chapter document blocks)
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [summaryToSplit, setSummaryToSplit] = useState<StudySummary | null>(null);
  const [selectedSectionsForSplit, setSelectedSectionsForSplit] = useState<Record<string | number, boolean>>({});
  const [splitKeepOriginal, setSplitKeepOriginal] = useState(true);

  // Delete confirmation modal state
  const [summaryToDelete, setSummaryToDelete] = useState<StudySummary | null>(null);

  // Print ref
  const documentContainerRef = useRef<HTMLDivElement>(null);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('eduquest_study_summaries', JSON.stringify(summaries));
    } catch (e) {
      console.error('Error saving summaries:', e);
    }
  }, [summaries]);

  // Current selected summary
  const currentSummary = useMemo(() => {
    return summaries.find(s => s.id === activeSummaryId) || summaries[0] || null;
  }, [summaries, activeSummaryId]);

  // Counts for Shelf Filters
  const comprehensiveCount = useMemo(() => summaries.filter(s => !s.isChapterBlock).length, [summaries]);
  const chaptersCount = useMemo(() => summaries.filter(s => !!s.isChapterBlock).length, [summaries]);
  const customCount = useMemo(() => summaries.filter(s => !!s.isCustom && !s.isChapterBlock).length, [summaries]);

  // Filtered summaries for the Shelf tabs
  const displayedSummaries = useMemo(() => {
    if (summaryFilter === 'comprehensive') return summaries.filter(s => !s.isChapterBlock);
    if (summaryFilter === 'chapters') return summaries.filter(s => !!s.isChapterBlock);
    if (summaryFilter === 'custom') return summaries.filter(s => !!s.isCustom && !s.isChapterBlock);
    return summaries;
  }, [summaries, summaryFilter]);

  // Filtered sections based on search query
  const filteredSections = useMemo(() => {
    if (!currentSummary) return [];
    if (!searchQuery.trim()) return currentSummary.sections;

    const q = searchQuery.toLowerCase();
    return currentSummary.sections.filter(sec => {
      const matchTitleEn = sec.titleEn.toLowerCase().includes(q);
      const matchTitleAr = sec.titleAr.includes(q);
      const matchSummaryEn = sec.summaryEn?.toLowerCase().includes(q);
      const matchSummaryAr = sec.summaryAr?.includes(q);
      const matchItems = sec.items.some(item =>
        item.labelEn.toLowerCase().includes(q) ||
        item.labelAr.includes(q) ||
        item.detailEn.toLowerCase().includes(q) ||
        item.detailAr.includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q)) ||
        (item.keyTakeaway && item.keyTakeaway.includes(q))
      );
      return matchTitleEn || matchTitleAr || matchSummaryEn || matchSummaryAr || matchItems;
    });
  }, [currentSummary, searchQuery]);

  // Toggle Collapse of a Section in Modular View
  const toggleCollapse = (secId: string | number) => {
    setCollapsedSections(prev => ({
      ...prev,
      [secId]: !prev[secId]
    }));
  };

  // Expand / Collapse all
  const handleCollapseAll = (collapse: boolean) => {
    if (!currentSummary) return;
    const newState: Record<string | number, boolean> = {};
    currentSummary.sections.forEach(s => {
      newState[s.id] = collapse;
    });
    setCollapsedSections(newState);
  };

  // Scroll to section in document
  const scrollToSection = (secId: string | number) => {
    setActiveSectionId(secId);
    const element = document.getElementById(`doc-sec-${secId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Open modal to split a summary into chapter blocks
  const openSplitModal = (summary: StudySummary) => {
    setSummaryToSplit(summary);
    const initialSel: Record<string | number, boolean> = {};
    summary.sections.forEach(s => {
      initialSel[s.id] = true;
    });
    setSelectedSectionsForSplit(initialSel);
    setIsSplitModalOpen(true);
  };

  // Toggle single section inside split modal
  const toggleSectionSelectionForSplit = (secId: string | number) => {
    setSelectedSectionsForSplit(prev => ({
      ...prev,
      [secId]: !prev[secId]
    }));
  };

  // Select all or none inside split modal
  const handleSelectAllForSplit = (select: boolean) => {
    if (!summaryToSplit) return;
    const newSel: Record<string | number, boolean> = {};
    summaryToSplit.sections.forEach(s => {
      newSel[s.id] = select;
    });
    setSelectedSectionsForSplit(newSel);
  };

  // Execute splitting of summary into independent chapter document blocks
  const executeSplitSummary = () => {
    if (!summaryToSplit) return;
    const sectionsToProcess = summaryToSplit.sections.filter(s => selectedSectionsForSplit[s.id]);
    if (sectionsToProcess.length === 0) {
      alert('يرجى اختيار قسم أو فصل واحد على الأقل للتقسيم');
      return;
    }

    const total = sectionsToProcess.length;
    const createdChapters: StudySummary[] = sectionsToProcess.map((sec, idx) => {
      const chNum = idx + 1;
      return {
        id: `${summaryToSplit.id}-ch${chNum}-${Date.now().toString().slice(-4)}`,
        titleEn: `Chapter ${chNum}: ${sec.titleEn}`,
        titleAr: `الفصل ${chNum}: ${sec.titleAr}`,
        subtitleEn: sec.summaryEn || `Independent chapter document block extracted from ${summaryToSplit.titleEn}`,
        subtitleAr: sec.summaryAr || `كتلة مستند دراسي وفصل مستقل مستخرج من ${summaryToSplit.titleAr}`,
        category: `${summaryToSplit.category} - فصل ${chNum}`,
        iconName: sec.iconName || summaryToSplit.iconName || 'BookOpen',
        createdAt: summaryToSplit.createdAt,
        updatedAt: new Date().toISOString().split('T')[0],
        isCustom: true,
        isChapterBlock: true,
        parentSummaryId: summaryToSplit.id,
        parentSummaryTitle: summaryToSplit.titleAr,
        chapterNumber: chNum,
        totalChapters: total,
        tags: [
          `Chapter ${chNum}`,
          `فصل ${chNum}`,
          ...(summaryToSplit.tags.slice(0, 3)),
          ...(sec.items.map(it => it.badge).filter(Boolean) as string[])
        ],
        sections: [
          {
            ...sec,
            id: `${sec.id}-ch`
          }
        ]
      };
    });

    setSummaries(prev => {
      let base = [...prev];
      if (!splitKeepOriginal) {
        base = base.filter(s => s.id !== summaryToSplit.id);
      }
      const newIds = new Set(createdChapters.map(c => c.id));
      const filteredBase = base.filter(s => !newIds.has(s.id));
      return [...filteredBase, ...createdChapters];
    });

    if (createdChapters[0]) {
      setActiveSummaryId(createdChapters[0].id);
    }
    setIsSplitModalOpen(false);
    setSummaryToSplit(null);
    triggerToast(`تم بنجاح تقسيم المستند إلى ${createdChapters.length} فصول ومستندات مستقلة!`);
  };

  // 1-Click extraction of a single section into an individual document block
  const handleExtractSectionAsDocument = (section: SummarySection, sectionIndex: number) => {
    if (!currentSummary) return;
    const newDoc = extractSectionAsDocumentBlock(section, currentSummary, sectionIndex);
    setSummaries(prev => [...prev, newDoc]);
    setActiveSummaryId(newDoc.id);
    triggerToast(`تم استخراج «${section.titleAr}» ككتلة مستند مستقلة بالمكتبة!`);
  };

  // Re-merge all chapters of a parent summary into a single document
  const handleMergeChapters = (parentId: string) => {
    const chapters = summaries.filter(s => s.parentSummaryId === parentId);
    if (chapters.length === 0) {
      triggerToast('لا توجد فصول مرتبطة لإعادة دمجها.');
      return;
    }
    const parentBase = summaries.find(s => s.id === parentId);
    const merged = mergeChapterBlocksIntoSummary(chapters, parentBase);
    setSummaries(prev => {
      const existingIndex = prev.findIndex(s => s.id === merged.id);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = merged;
        return copy;
      }
      return [merged, ...prev];
    });
    setActiveSummaryId(merged.id);
    triggerToast(`تم إعادة دمج ${chapters.length} فصول في مستند واحد شامل بنجاح!`);
  };

  // Copy Full Summary Text
  const handleCopySummary = () => {
    if (!currentSummary) return;

    let text = `${currentSummary.titleAr} | ${currentSummary.titleEn}\n`;
    text += `${currentSummary.subtitleAr || ''}\n\n`;

    currentSummary.sections.forEach((sec, idx) => {
      text += `\n═══════════════════════════════════════\n`;
      text += `[${idx + 1}] ${sec.titleAr} - ${sec.titleEn}\n`;
      if (sec.summaryAr) text += `${sec.summaryAr}\n`;
      text += `───────────────────────────────────────\n`;
      sec.items.forEach(item => {
        text += `• ${item.labelAr} (${item.labelEn})${item.badge ? ` [${item.badge}]` : ''}:\n`;
        text += `  - ${item.detailAr}\n`;
        text += `  - ${item.detailEn}\n`;
        if (item.formula) text += `  - معادلة: ${item.formula}\n`;
        if (item.keyTakeaway) text += `  - قاعدة أساسية: ${item.keyTakeaway}\n`;
      });
    });

    navigator.clipboard.writeText(text).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    });
  };

  // Print document
  const handlePrint = () => {
    window.print();
  };

  // Export current summary or segmented notes as a single formatted Markdown file (.md)
  const handleExportMarkdown = (summaryToExport?: StudySummary) => {
    const summary = summaryToExport || currentSummary;
    if (!summary) return;

    let md = '';
    // Header & Metadata
    md += `# ${summary.titleAr || summary.titleEn}\n\n`;
    if (summary.titleEn && summary.titleAr) {
      md += `**Title (EN):** ${summary.titleEn}\n\n`;
    }
    if (summary.subtitleAr) {
      md += `> ${summary.subtitleAr}\n\n`;
    }
    if (summary.subtitleEn) {
      md += `> *${summary.subtitleEn}*\n\n`;
    }

    md += `- **التصنيف / Category:** ${summary.category || 'General'}\n`;
    md += `- **تاريخ التحديث / Updated:** ${summary.updatedAt || new Date().toISOString().split('T')[0]}\n`;
    if (summary.tags && summary.tags.length > 0) {
      md += `- **الوسوم / Tags:** ${summary.tags.map(t => `\`#${t}\``).join(' ')}\n`;
    }
    if (summary.isChapterBlock && summary.parentSummaryTitle) {
      md += `- **مستخرج من:** ${summary.parentSummaryTitle} (فصل ${summary.chapterNumber || 1})\n`;
    }
    md += `\n---\n\n`;

    // Table of Contents
    md += `## جدول المحتويات (Table of Contents)\n\n`;
    summary.sections.forEach((sec, idx) => {
      const title = sec.titleAr || sec.titleEn;
      md += `${idx + 1}. [${title}](#part-${idx + 1}) - *(${sec.items.length} مفاهيم/قواعد)*\n`;
    });
    md += `\n---\n\n`;

    // Sections
    summary.sections.forEach((sec, idx) => {
      md += `## ${idx + 1}. ${sec.titleAr} ${sec.titleEn ? `(${sec.titleEn})` : ''} <a id="part-${idx + 1}"></a>\n\n`;
      if (sec.summaryAr) {
        md += `> ${sec.summaryAr}\n\n`;
      }
      if (sec.summaryEn) {
        md += `> *${sec.summaryEn}*\n\n`;
      }

      sec.items.forEach((item, itemIdx) => {
        const badgeText = item.badge ? ` \`[${item.badge}]\`` : '';
        md += `### ${idx + 1}.${itemIdx + 1} ${item.labelAr}${item.labelEn ? ` / ${item.labelEn}` : ''}${badgeText}\n\n`;

        if (item.detailAr) {
          md += `${item.detailAr}\n\n`;
        }
        if (item.detailEn) {
          md += `*English:* ${item.detailEn}\n\n`;
        }
        if (item.formula) {
          md += `\`\`\`text\nمعادلة: ${item.formula}\n\`\`\`\n\n`;
        }
        if (item.keyTakeaway) {
          md += `> 💡 **قاعدة ذهبية / Key Takeaway:** ${item.keyTakeaway}\n\n`;
        }
        md += `---\n\n`;
      });

      md += `\n`;
    });

    md += `\n_تم إنشاء هذا الملخص وتصديره بصيغة Markdown عبر منصة EduQuest Research Methodology._\n`;

    // Create download blob
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = (summary.titleEn || summary.titleAr || 'study-summary')
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/(^-|-$)/g, '');
    link.href = url;
    link.download = `${safeTitle || 'research-notes'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast('تم تصدير وحفظ الملخص كملف Markdown (.md) بنجاح!');
  };

  // Reorder section up or down in current summary (persisted to localStorage)
  const moveSection = (secIdx: number, direction: 'up' | 'down') => {
    if (!currentSummary) return;
    const targetIdx = direction === 'up' ? secIdx - 1 : secIdx + 1;
    if (targetIdx < 0 || targetIdx >= currentSummary.sections.length) return;

    const newSections = [...currentSummary.sections];
    const [moved] = newSections.splice(secIdx, 1);
    newSections.splice(targetIdx, 0, moved);

    const updatedSummary: StudySummary = {
      ...currentSummary,
      sections: newSections,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setSummaries(prev => prev.map(s => s.id === updatedSummary.id ? updatedSummary : s));
    triggerToast(direction === 'up' ? 'تم تحريك القسم للأعلى وحفظ الترتيب' : 'تم تحريك القسم للأسفل وحفظ الترتيب');
  };

  // Delete section independently from current summary (persisted to localStorage)
  const deleteSection = (secId: string | number, secTitle?: string) => {
    if (!currentSummary) return;
    if (currentSummary.sections.length <= 1) {
      alert('يجب أن يحتوي الملخص على قسم واحد على الأقل. لحذف الملخص بأكمله، يرجى استخدام زر حذف الملخص من شريط الأدوات.');
      return;
    }
    if (window.confirm(`هل أنت متأكد من حذف قسم «${secTitle || 'هذا القسم'}»؟ سيتم حفظ التغييرات فوراً في التخزين المحلي.`)) {
      const updatedSummary: StudySummary = {
        ...currentSummary,
        sections: currentSummary.sections.filter(s => s.id !== secId),
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setSummaries(prev => prev.map(s => s.id === updatedSummary.id ? updatedSummary : s));
      triggerToast('تم حذف القسم بنجاح وتحديث المستند في التخزين المحلي');
    }
  };

  // Open Section Modal for a new section
  const openNewSectionModal = () => {
    if (!currentSummary) return;
    const newSec: SummarySection = {
      id: `sec-${Date.now()}`,
      iconName: 'Bookmark',
      titleEn: '',
      titleAr: 'قسم دراسي جديد',
      summaryEn: '',
      summaryAr: '',
      items: [
        {
          id: `item-${Date.now()}-1`,
          labelEn: 'Primary Concept',
          labelAr: 'المفهوم أو القاعدة الأولى',
          detailEn: '',
          detailAr: '',
          badge: 'High-Yield'
        }
      ]
    };
    setEditingSection(newSec);
    setEditingSectionIndex(null);
    setIsSectionModalOpen(true);
  };

  // Open Section Modal for editing an existing section
  const openEditSectionModal = (sec: SummarySection, idx: number) => {
    setEditingSection(JSON.parse(JSON.stringify(sec)));
    setEditingSectionIndex(idx);
    setIsSectionModalOpen(true);
  };

  // Save Section from modal (persisted to localStorage)
  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection || !currentSummary) return;

    if (!editingSection.titleAr.trim() && !editingSection.titleEn.trim()) {
      alert('يرجى إدخال عنوان القسم');
      return;
    }

    if (!editingSection.items || editingSection.items.length === 0) {
      alert('يرجى إضافة مفهوم أو قاعدة واحدة على الأقل داخل هذا القسم');
      return;
    }

    const updatedSections = [...currentSummary.sections];
    if (editingSectionIndex !== null && editingSectionIndex >= 0 && editingSectionIndex < updatedSections.length) {
      updatedSections[editingSectionIndex] = editingSection;
    } else {
      updatedSections.push(editingSection);
    }

    const updatedSummary: StudySummary = {
      ...currentSummary,
      sections: updatedSections,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setSummaries(prev => prev.map(s => s.id === updatedSummary.id ? updatedSummary : s));
    setIsSectionModalOpen(false);
    setEditingSection(null);
    setEditingSectionIndex(null);
    triggerToast('تم حفظ القسم بنجاح وتحديث المستند في التخزين المحلي!');
  };

  // Reset to default summaries
  const handleResetDefaults = () => {
    if (window.confirm('هل تريد استعادة الملخصات الافتراضية الأصلية؟ ستظل أي ملخصات مخصصة أضفتها محفوظة.')) {
      setSummaries(DEFAULT_STUDY_SUMMARIES);
      setActiveSummaryId(DEFAULT_STUDY_SUMMARIES[0].id);
    }
  };

  // Delete summary handler
  const confirmDeleteSummary = () => {
    if (!summaryToDelete) return;
    setSummaries(prev => {
      const filtered = prev.filter(s => s.id !== summaryToDelete.id);
      if (filtered.length === 0) return DEFAULT_STUDY_SUMMARIES;
      return filtered;
    });
    if (activeSummaryId === summaryToDelete.id) {
      const remaining = summaries.filter(s => s.id !== summaryToDelete.id);
      setActiveSummaryId(remaining[0]?.id || DEFAULT_STUDY_SUMMARIES[0].id);
    }
    setSummaryToDelete(null);
  };

  // Open modal for new summary
  const openNewSummaryModal = () => {
    setEditingSummary({
      id: `custom-summary-${Date.now()}`,
      titleEn: '',
      titleAr: '',
      subtitleEn: '',
      subtitleAr: '',
      category: 'Custom Notes',
      iconName: 'FileText',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      isCustom: true,
      tags: ['Custom', 'Study Notes'],
      sections: [
        {
          id: `sec-${Date.now()}-1`,
          iconName: 'Bookmark',
          titleEn: 'Main Concepts & Principles',
          titleAr: 'المفاهيم والمبادئ الأساسية',
          summaryEn: 'Key points to remember for exams',
          summaryAr: 'أهم النقاط للمراجعة والامتحان',
          items: [
            {
              id: `item-${Date.now()}-1`,
              labelEn: 'Primary Definition',
              labelAr: 'التعريف الأساسي',
              detailEn: 'Detailed explanation in English',
              detailAr: 'الشرح والتوضيح باللغة العربية',
              badge: 'High-Yield'
            }
          ]
        }
      ]
    });
    setIsModalOpen(true);
  };

  // Open modal for editing current summary
  const openEditSummaryModal = () => {
    if (!currentSummary) return;
    setEditingSummary(JSON.parse(JSON.stringify(currentSummary)));
    setIsModalOpen(true);
  };

  // Save Modal Summary
  const handleSaveModalSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSummary) return;

    if (!editingSummary.titleAr.trim() && !editingSummary.titleEn.trim()) {
      alert('يرجى إدخال عنوان الملخص');
      return;
    }

    setSummaries(prev => {
      const index = prev.findIndex(s => s.id === editingSummary.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = {
          ...editingSummary,
          updatedAt: new Date().toISOString().split('T')[0]
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            ...editingSummary,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        ];
      }
    });

    setActiveSummaryId(editingSummary.id);
    setIsModalOpen(false);
    setEditingSummary(null);
  };

  return (
    <div id="study-summaries-workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
      {/* Toast Notification (Copy & Split/Extract operations) */}
      {(copiedToast || toastMessage) && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-bold border border-gray-700 dark:border-gray-200 animate-in fade-in slide-in-from-bottom-3 duration-200" dir="rtl">
          <CheckCircle2 size={16} className="text-emerald-400 dark:text-emerald-600 shrink-0 ml-2" />
          <span>{toastMessage || 'تم نسخ محتوى الملخص كاملاً إلى الحافظة بنجاح!'}</span>
        </div>
      )}

      {/* Header & Main Controls Bar */}
      <div className="mb-6 space-y-4">
        {/* Top Badges & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 flex items-center">
                <BookMarked size={13} className="mr-1.5 text-amber-600 dark:text-amber-400" />
                قسم ملخصات المذاكرة (Study Summaries)
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {summaries.length} كتل ومستندات متاحة
              </span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1.5 tracking-tight flex items-center">
              <span>ملخصات المذاكرة وقواعد الاختبار المنهجية</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1" dir="rtl">
              بيئة مذاكرة متقدمة تتيح استعراض الملخصات كاملة كمستند موحد أو تقسيمها إلى فصول وأجزاء مستقلة بأيقونات مخصصة، مع إمكانية إدارة وتقسيم وحذف وتعديل الكتل الدراسية.
            </p>
          </div>

          {/* Action Buttons: Add Summary, Restore Defaults */}
          <div className="flex items-center space-x-2 self-start md:self-auto">
            <button
              onClick={openNewSummaryModal}
              id="btn-add-summary"
              className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-sm transition"
              title="إضافة ملخص مذاكرة جديد"
            >
              <Plus size={15} className="mr-1.5" />
              <span>إضافة ملخص جديد</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition"
              title="استعادة الملخصات الافتراضية الأصلية"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Summaries Selection Shelf / Tabs */}
        <div className="space-y-2.5">
          {/* Shelf Filters: All, Comprehensive, Chapters + Quick Split Action */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border border-gray-200/80 dark:border-gray-750">
              <button
                onClick={() => setSummaryFilter('all')}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1",
                  summaryFilter === 'all'
                    ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <span>الكل</span>
                <span className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] ml-1 font-mono",
                  summaryFilter === 'all' ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300" : "bg-gray-200 dark:bg-gray-800 text-gray-600"
                )}>
                  {summaries.length}
                </span>
              </button>

              <button
                onClick={() => setSummaryFilter('comprehensive')}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1",
                  summaryFilter === 'comprehensive'
                    ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <span>المستندات الشاملة</span>
                <span className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] ml-1 font-mono",
                  summaryFilter === 'comprehensive' ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300" : "bg-gray-200 dark:bg-gray-800 text-gray-600"
                )}>
                  {comprehensiveCount}
                </span>
              </button>

              <button
                onClick={() => setSummaryFilter('chapters')}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1",
                  summaryFilter === 'chapters'
                    ? "bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 shadow-2xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <span>فصول ومستندات مقسمة</span>
                <span className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] ml-1 font-mono",
                  summaryFilter === 'chapters' ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300" : "bg-gray-200 dark:bg-gray-800 text-gray-600"
                )}>
                  {chaptersCount}
                </span>
              </button>

              <button
                onClick={() => setSummaryFilter('custom')}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1",
                  summaryFilter === 'custom'
                    ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-2xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <span>ملخصاتي المخصصة</span>
                <span className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] ml-1 font-mono",
                  summaryFilter === 'custom' ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" : "bg-gray-200 dark:bg-gray-800 text-gray-600"
                )}>
                  {customCount}
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Quick Export Markdown button */}
              {currentSummary && (
                <button
                  onClick={() => handleExportMarkdown(currentSummary)}
                  id="btn-export-markdown-shelf"
                  className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition active:scale-95"
                  title="تصدير هذا الملخص كاملاً كملف Markdown (.md)"
                >
                  <FileDown size={14} className="mr-1.5" />
                  <span>تصدير كملف Markdown</span>
                </button>
              )}

              {/* Split Button in Shelf Header if active summary is comprehensive */}
              {currentSummary && !currentSummary.isChapterBlock && currentSummary.sections.length > 1 && (
                <button
                  onClick={() => openSplitModal(currentSummary)}
                  id="btn-split-summary-shelf"
                  className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-2xs transition active:scale-95"
                  title="تقسيم هذا الملخص الشامل إلى فصول ومستندات مستقلة"
                >
                  <FolderTree size={14} className="mr-1.5" />
                  <span>تقسيم «{currentSummary.titleAr.length > 25 ? currentSummary.titleAr.slice(0, 25) + '...' : currentSummary.titleAr}» إلى فصول</span>
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Carousel of Summaries in Shelf */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-thin">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 shrink-0 flex items-center mr-1">
              <FolderOpen size={14} className="mr-1" /> المستندات:
            </span>
            {displayedSummaries.map(s => {
              const isSelected = s.id === activeSummaryId;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSummaryId(s.id);
                    setSearchQuery('');
                    setActiveSectionId(null);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition flex items-center space-x-1.5 border",
                    isSelected
                      ? s.isChapterBlock
                        ? "bg-amber-600 text-white border-amber-600 shadow-xs font-bold"
                        : "bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold"
                      : s.isChapterBlock
                        ? "bg-amber-50/70 dark:bg-amber-950/20 text-gray-700 dark:text-amber-200 border-amber-200 dark:border-amber-900/80 hover:bg-amber-100/60"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                  )}
                >
                  {getSectionIcon(s.iconName, "w-3.5 h-3.5 mr-1 text-inherit")}
                  <span className="truncate max-w-[210px]" title={s.titleAr || s.titleEn}>
                    {s.titleAr || s.titleEn}
                  </span>
                  {s.isChapterBlock && (
                    <span className={cn(
                      "ml-1 text-[9px] px-1.5 py-0.2 rounded font-black",
                      isSelected ? "bg-amber-900 text-amber-100" : "bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200"
                    )}>
                      فصل {s.chapterNumber || 'مستقل'}
                    </span>
                  )}
                  {s.isCustom && !s.isChapterBlock && (
                    <span className="ml-1 text-[9px] px-1 py-0.2 bg-indigo-200 text-indigo-950 font-bold rounded">
                      مخصص
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Workspace Toolbar */}
      {currentSummary && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-6 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* View Mode Switch: Document vs Split Sections */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1 hidden sm:inline">
                طريقة العرض:
              </span>
              <div className="inline-flex rounded-xl p-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewMode('document')}
                  id="tab-view-document"
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5",
                    viewMode === 'document'
                      ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                  title="عرض الملخص كصفحة مستند أكاديمي متصل"
                >
                  <FileText size={14} className="mr-1 text-indigo-500" />
                  <span>مستند متصل (Full Document)</span>
                </button>

                <button
                  onClick={() => setViewMode('sections')}
                  id="tab-view-sections"
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5",
                    viewMode === 'sections'
                      ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                  title="تقسيم الملخص إلى أجزاء وبطاقات تفاعلية بأيقونات مخصصة"
                >
                  <Layers size={14} className="mr-1 text-amber-500" />
                  <span>أجزاء مقسمة بأيقونات (Sections)</span>
                </button>
              </div>
            </div>

            {/* Language & Search Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Inside Active Summary */}
              <div className="relative min-w-[200px] sm:min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في هذا الملخص..."
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Language Switcher */}
              <div className="inline-flex rounded-lg p-0.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs">
                <button
                  onClick={() => setLangMode('both')}
                  className={cn(
                    "px-2.5 py-1 rounded-md font-semibold transition",
                    langMode === 'both' ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-xs" : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  كلاهما
                </button>
                <button
                  onClick={() => setLangMode('ar')}
                  className={cn(
                    "px-2 py-1 rounded-md font-semibold transition",
                    langMode === 'ar' ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-xs" : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  العربية
                </button>
                <button
                  onClick={() => setLangMode('en')}
                  className={cn(
                    "px-2 py-1 rounded-md font-semibold transition",
                    langMode === 'en' ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-xs" : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  English
                </button>
              </div>

              {/* Manage Current Summary: Edit, Copy, Print, Export Markdown, Add Section, Split, Delete */}
              <div className="flex items-center space-x-1 pl-1 border-l border-gray-200 dark:border-gray-700">
                {/* Export as Markdown */}
                <button
                  onClick={() => handleExportMarkdown(currentSummary)}
                  className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition"
                  title="تصدير كملف Markdown (.md)"
                >
                  <FileDown size={15} />
                </button>

                {/* Add new section to current document */}
                <button
                  onClick={openNewSectionModal}
                  className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition"
                  title="إضافة قسم دراسي جديد لهذا المستند"
                >
                  <Plus size={15} />
                </button>

                {/* Split to chapters button if not already a chapter block */}
                {!currentSummary.isChapterBlock && currentSummary.sections.length > 1 && (
                  <button
                    onClick={() => openSplitModal(currentSummary)}
                    className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition"
                    title="تقسيم هذا الملخص إلى فصول ومستندات مستقلة"
                  >
                    <Scissors size={15} />
                  </button>
                )}
                <button
                  onClick={openEditSummaryModal}
                  className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  title="تعديل هذا الملخص"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={handleCopySummary}
                  className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  title="نسخ محتوى الملخص"
                >
                  <Copy size={15} />
                </button>
                <button
                  onClick={handlePrint}
                  className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  title="طباعة كوثيقة PDF"
                >
                  <Printer size={15} />
                </button>
                <button
                  onClick={() => setSummaryToDelete(currentSummary)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                  title="حذف هذا الملخص"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Chapter Block Context Banner if current summary is a chapter */}
          {currentSummary.isChapterBlock && (
            <div className="mt-3 pt-3 border-t border-amber-100 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/60" dir="rtl">
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="px-2 py-0.5 rounded-md font-black bg-amber-500 text-white text-[10px] tracking-wide">
                  كتلة فصل مستقل
                </span>
                <span className="font-bold text-amber-900 dark:text-amber-200">
                  {currentSummary.chapterNumber ? `الفصل ${currentSummary.chapterNumber} من أصل ${currentSummary.totalChapters || 'عدة فصول'}` : 'مستند فرعي مستقل'}
                </span>
                {currentSummary.parentSummaryTitle && (
                  <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                    (مستخرج من: {currentSummary.parentSummaryTitle})
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                {currentSummary.parentSummaryId && summaries.some(s => s.id === currentSummary.parentSummaryId) && (
                  <button
                    onClick={() => setActiveSummaryId(currentSummary.parentSummaryId!)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                  >
                    <ArrowRight size={13} className="ml-1" />
                    <span>العودة للمستند الشامل</span>
                  </button>
                )}
                {currentSummary.parentSummaryId && summaries.filter(s => s.parentSummaryId === currentSummary.parentSummaryId).length > 1 && (
                  <button
                    onClick={() => handleMergeChapters(currentSummary.parentSummaryId!)}
                    className="px-2.5 py-1 text-[11px] font-bold bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-300 dark:border-amber-800 shadow-2xs hover:bg-amber-100/60 transition flex items-center space-x-1 space-x-reverse"
                    title="إعادة دمج جميع فصول هذا المستند في ملخص واحد متكامل"
                  >
                    <Merge size={12} className="ml-1 text-amber-600" />
                    <span>إعادة دمج الفصول في ملخص موحد</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Study Workspace Area */}
      {currentSummary && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Table of Contents / Outline Rail (Sticky Navigation) */}
          <div className="lg:col-span-3 order-2 lg:order-1 lg:sticky lg:top-20 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white">
                <span className="flex items-center">
                  <FileText size={14} className="mr-1.5 text-indigo-500" />
                  فهرس أجزاء المستند
                </span>
                <span className="text-[11px] text-gray-400 font-normal">
                  {filteredSections.length} جزء
                </span>
              </div>

              <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
                {filteredSections.map((sec, idx) => {
                  const isActive = activeSectionId === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={cn(
                        "w-full text-right p-2 rounded-xl text-xs transition flex items-center justify-between group",
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/60 dark:border-indigo-800/60"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 hover:text-gray-900 dark:hover:text-white"
                      )}
                      dir="rtl"
                    >
                      <div className="flex items-center space-x-2 space-x-reverse truncate">
                        <div className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold",
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 group-hover:text-indigo-600"
                        )}>
                          {getSectionIcon(sec.iconName, "w-3 h-3")}
                        </div>
                        <span className="truncate text-[11px]">
                          {idx + 1}. {sec.titleAr || sec.titleEn}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {sec.items.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sections Quick Action in Modular Mode */}
              {viewMode === 'sections' && (
                <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => handleCollapseAll(false)}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    فتح الكل
                  </button>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <button
                    onClick={() => handleCollapseAll(true)}
                    className="text-gray-500 dark:text-gray-400 hover:underline"
                  >
                    طي الكل
                  </button>
                </div>
              )}
            </div>

            {/* Quick Summary Metadata Card */}
            <div className="bg-gradient-to-br from-amber-50 to-indigo-50 dark:from-amber-950/20 dark:to-indigo-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-4 text-xs space-y-2">
              <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center">
                <Sparkles size={14} className="mr-1.5 text-amber-600 dark:text-amber-400" />
                <span>إرشادات المذاكرة النشطة:</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-[11px] leading-relaxed" dir="rtl">
                استخدم أسلوب القراءة المتصلة لفهم ترابط المفاهيم، ثم حوّل العرض إلى «أجزاء مقسمة بأيقونات» لاختبار الاسترجاع السريع لكل قاعدة إحصائية على حدة.
              </p>
            </div>
          </div>

          {/* Right Main Document / Sections Canvas */}
          <div ref={documentContainerRef} className="lg:col-span-9 order-1 lg:order-2 space-y-6">
            {/* ============================================================= */}
            {/* VIEW MODE A: FULL CONTINUOUS DOCUMENT (مستند متصل)            */}
            {/* ============================================================= */}
            {viewMode === 'document' && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10 shadow-sm transition-all print:p-0 print:border-none print:shadow-none">
                {/* Document Header Page Block */}
                <div className="border-b-2 border-gray-100 dark:border-gray-700/80 pb-6 mb-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                      {currentSummary.category || 'High-Yield Document'}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center">
                      <Clock size={11} className="mr-1" /> محدث: {currentSummary.updatedAt}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                    {currentSummary.titleAr}
                  </h1>
                  {currentSummary.titleEn && (
                    <h2 className="text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                      {currentSummary.titleEn}
                    </h2>
                  )}

                  {currentSummary.subtitleAr && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed" dir="rtl">
                      {currentSummary.subtitleAr}
                    </p>
                  )}

                  {/* Document Tags */}
                  {currentSummary.tags && currentSummary.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-50 dark:border-gray-750">
                      {currentSummary.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Continuous Sections */}
                <div className="space-y-10">
                  {filteredSections.map((sec, secIdx) => (
                    <div
                      key={sec.id}
                      id={`doc-sec-${sec.id}`}
                      className="scroll-mt-24 space-y-4 border-b border-gray-100 dark:border-gray-700/60 pb-8 last:border-b-0"
                    >
                      {/* Section Heading inside Document */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                            {getSectionIcon(sec.iconName, "w-5 h-5")}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                الجزء {secIdx + 1}
                              </span>
                              <span className="text-gray-300 dark:text-gray-600">•</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {sec.items.length} مفاهيم وقواعد
                              </span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-0.5" dir="rtl">
                              {sec.titleAr}
                            </h3>
                            {sec.titleEn && (
                              <h4 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mt-0.5">
                                {sec.titleEn}
                              </h4>
                            )}
                          </div>
                        </div>

                        {/* Section Actions: Reorder Up, Reorder Down, Edit, Delete, Extract */}
                        <div className="flex items-center space-x-1 shrink-0">
                          {/* Move up */}
                          <button
                            type="button"
                            disabled={secIdx === 0}
                            onClick={() => moveSection(secIdx, 'up')}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 disabled:opacity-30 disabled:hover:text-gray-500 rounded-lg transition"
                            title="تحريك هذا القسم للأعلى"
                          >
                            <ArrowUp size={14} />
                          </button>

                          {/* Move down */}
                          <button
                            type="button"
                            disabled={secIdx === currentSummary.sections.length - 1}
                            onClick={() => moveSection(secIdx, 'down')}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 disabled:opacity-30 disabled:hover:text-gray-500 rounded-lg transition"
                            title="تحريك هذا القسم للأسفل"
                          >
                            <ArrowDown size={14} />
                          </button>

                          {/* Edit section */}
                          <button
                            type="button"
                            onClick={() => openEditSectionModal(sec, secIdx)}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 rounded-lg transition"
                            title="تعديل هذا القسم ومفاهيمه"
                          >
                            <Pencil size={14} />
                          </button>

                          {/* Delete section */}
                          <button
                            type="button"
                            onClick={() => deleteSection(sec.id, sec.titleAr)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition"
                            title="حذف هذا القسم من المستند"
                          >
                            <Trash2 size={14} />
                          </button>

                          {/* Extract section as standalone document block */}
                          {!currentSummary.isChapterBlock && (
                            <button
                              type="button"
                              onClick={() => handleExtractSectionAsDocument(sec, secIdx + 1)}
                              className="inline-flex items-center text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 px-2 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 shrink-0 transition ml-1"
                              title="استخراج هذا الجزء ككتلة مستند مستقلة بالمكتبة"
                            >
                              <ExternalLink size={12} className="mr-1" />
                              <span className="hidden sm:inline">استخراج</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Section Summary Lead with Markdown rendering */}
                      {(sec.summaryAr || sec.summaryEn) && (
                        <div className="p-3.5 bg-gray-50 dark:bg-gray-900/60 rounded-xl border-r-3 border-indigo-500 leading-relaxed" dir="rtl">
                          <MarkdownView content={langMode === 'en' ? (sec.summaryEn || sec.summaryAr) : sec.summaryAr} dir={langMode === 'en' ? 'ltr' : 'rtl'} />
                          {langMode === 'both' && sec.summaryEn && sec.summaryAr && (
                            <div className="mt-2 pt-2 border-t border-gray-200/60 dark:border-gray-800" dir="ltr">
                              <MarkdownView content={sec.summaryEn} dir="ltr" className="text-gray-600 dark:text-gray-400 italic" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Items Grid / Table inside Document */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                        {sec.items.map((item) => (
                          <div
                            key={item.id}
                            className="bg-gray-50/70 dark:bg-gray-900/40 border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-4 space-y-2 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white" dir="rtl">
                                {item.labelAr}
                              </h5>
                              {item.badge && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>

                            {item.labelEn && (
                              <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                                {item.labelEn}
                              </div>
                            )}

                            {/* Detail Content with Markdown rendering */}
                            {(langMode === 'ar' || langMode === 'both') && item.detailAr && (
                              <MarkdownView content={item.detailAr} dir="rtl" className="text-gray-700 dark:text-gray-300 font-sans" />
                            )}

                            {(langMode === 'en' || langMode === 'both') && item.detailEn && (
                              <MarkdownView content={item.detailEn} dir="ltr" className="text-gray-600 dark:text-gray-400" />
                            )}

                            {/* Formula Block if applicable */}
                            {item.formula && (
                              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 rounded-lg text-xs font-mono text-indigo-800 dark:text-indigo-300 flex items-center">
                                <Sigma size={13} className="mr-1.5 shrink-0 text-indigo-500" />
                                <span>{item.formula}</span>
                              </div>
                            )}

                            {/* Key Takeaway / Golden rule with Markdown rendering */}
                            {item.keyTakeaway && (
                              <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-900/40 font-medium" dir="rtl">
                                💡 <strong>قاعدة هامة:</strong>
                                <MarkdownView content={item.keyTakeaway} dir="rtl" className="inline mr-1 text-[11px]" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Add new section button at end of document */}
                  <div className="pt-4 border-t border-dashed border-gray-200 dark:border-gray-700 text-center">
                    <button
                      type="button"
                      onClick={openNewSectionModal}
                      className="inline-flex items-center px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 rounded-xl transition shadow-2xs"
                    >
                      <Plus size={14} className="mr-1.5" />
                      <span>إضافة قسم دراسي جديد لهذا المستند</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* VIEW MODE B: SPLIT SECTIONS WITH ICONS (أجزاء مقسمة بأيقونات)   */}
            {/* ============================================================= */}
            {viewMode === 'sections' && (
              <div className="space-y-5">
                {filteredSections.map((sec, secIdx) => {
                  const isCollapsed = !!collapsedSections[sec.id];
                  return (
                    <div
                      key={sec.id}
                      id={`doc-sec-${sec.id}`}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all hover:border-indigo-300 dark:hover:border-indigo-700"
                    >
                      {/* Section Card Top Header with Prominent Icon */}
                      <div
                        onClick={() => toggleCollapse(sec.id)}
                        className="p-5 flex items-center justify-between cursor-pointer select-none bg-gradient-to-r from-gray-50 to-white dark:from-gray-850 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700/80"
                      >
                        <div className="flex items-center space-x-3.5">
                          {/* Distinctive Section Icon Badge */}
                          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
                            {getSectionIcon(sec.iconName, "w-6 h-6")}
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                                الجزء {secIdx + 1}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {sec.items.length} مفاهيم وقواعد
                              </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mt-1" dir="rtl">
                              {sec.titleAr}
                            </h3>
                            {sec.titleEn && (
                              <h4 className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                                {sec.titleEn}
                              </h4>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          {/* Move Up */}
                          <button
                            type="button"
                            disabled={secIdx === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(secIdx, 'up');
                            }}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 disabled:opacity-30 rounded-lg transition"
                            title="تحريك هذا القسم للأعلى"
                          >
                            <ArrowUp size={14} />
                          </button>

                          {/* Move Down */}
                          <button
                            type="button"
                            disabled={secIdx === currentSummary.sections.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(secIdx, 'down');
                            }}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 disabled:opacity-30 rounded-lg transition"
                            title="تحريك هذا القسم للأسفل"
                          >
                            <ArrowDown size={14} />
                          </button>

                          {/* Edit Section */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditSectionModal(sec, secIdx);
                            }}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 rounded-lg transition"
                            title="تعديل هذا القسم ومفاهيمه"
                          >
                            <Pencil size={14} />
                          </button>

                          {/* Delete Section */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSection(sec.id, sec.titleAr);
                            }}
                            className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition"
                            title="حذف هذا القسم"
                          >
                            <Trash2 size={14} />
                          </button>

                          {!currentSummary.isChapterBlock && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExtractSectionAsDocument(sec, secIdx + 1);
                              }}
                              className="inline-flex items-center text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 px-2 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 transition"
                              title="استخراج هذا الجزء ككتلة مستند مستقلة بالمكتبة"
                            >
                              <ExternalLink size={12} className="mr-1" />
                              <span className="hidden sm:inline">استخراج</span>
                            </button>
                          )}
                          <button
                            type="button"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            aria-label="Toggle section"
                          >
                            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* Collapsible Content */}
                      {!isCollapsed && (
                        <div className="p-5 space-y-4">
                          {/* Overview lead with Markdown rendering */}
                          {(sec.summaryAr || sec.summaryEn) && (
                            <div className="p-3.5 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-800 leading-relaxed" dir="rtl">
                              <MarkdownView content={langMode === 'en' ? (sec.summaryEn || sec.summaryAr) : sec.summaryAr} dir={langMode === 'en' ? 'ltr' : 'rtl'} />
                              {langMode === 'both' && sec.summaryEn && sec.summaryAr && (
                                <div className="mt-2 pt-2 border-t border-gray-200/60 dark:border-gray-800" dir="ltr">
                                  <MarkdownView content={sec.summaryEn} dir="ltr" className="text-gray-600 dark:text-gray-400 italic" />
                                </div>
                              )}
                            </div>
                          )}

                          {/* Items Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {sec.items.map((item) => (
                              <div
                                key={item.id}
                                className="p-4 rounded-xl bg-gray-50/80 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-700/80 space-y-2 hover:bg-white dark:hover:bg-gray-850 transition"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <h5 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white" dir="rtl">
                                    {item.labelAr}
                                  </h5>
                                  {item.badge && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>

                                {item.labelEn && (
                                  <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                                    {item.labelEn}
                                  </div>
                                )}

                                {/* Detail Content with Markdown rendering */}
                                {(langMode === 'ar' || langMode === 'both') && item.detailAr && (
                                  <MarkdownView content={item.detailAr} dir="rtl" className="text-gray-700 dark:text-gray-300 font-sans" />
                                )}

                                {(langMode === 'en' || langMode === 'both') && item.detailEn && (
                                  <MarkdownView content={item.detailEn} dir="ltr" className="text-gray-600 dark:text-gray-400" />
                                )}

                                {item.formula && (
                                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 rounded-lg text-xs font-mono text-indigo-800 dark:text-indigo-300 flex items-center">
                                    <Sigma size={13} className="mr-1.5 shrink-0 text-indigo-500" />
                                    <span>{item.formula}</span>
                                  </div>
                                )}

                                {/* Key Takeaway with Markdown rendering */}
                                {item.keyTakeaway && (
                                  <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-900/40 font-medium" dir="rtl">
                                    💡 <strong>قاعدة هامة:</strong>
                                    <MarkdownView content={item.keyTakeaway} dir="rtl" className="inline mr-1 text-[11px]" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add new section button at end of sections view */}
                <div className="pt-3 text-center">
                  <button
                    type="button"
                    onClick={openNewSectionModal}
                    className="inline-flex items-center px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 rounded-xl transition shadow-2xs"
                  >
                    <Plus size={14} className="mr-1.5" />
                    <span>إضافة قسم دراسي جديد لهذا المستند</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT STUDY SUMMARY                                           */}
      {/* ========================================================================= */}
      {isModalOpen && editingSummary && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-700 my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Edit3 size={16} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {editingSummary.isCustom ? 'إضافة ملخص مذاكرة جديد' : 'تعديل الملخص'}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    أدخل بيانات الملخص والأجزاء المكونة له
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveModalSummary} className="space-y-4">
              {/* Title Ar & En */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1" dir="rtl">
                    عنوان الملخص (بالعربية) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSummary.titleAr}
                    onChange={(e) => setEditingSummary({ ...editingSummary, titleAr: e.target.value })}
                    placeholder="مثال: ملخص أدوات جمع البيانات"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Summary Title (English)
                  </label>
                  <input
                    type="text"
                    value={editingSummary.titleEn}
                    onChange={(e) => setEditingSummary({ ...editingSummary, titleEn: e.target.value })}
                    placeholder="e.g. Data Collection Instruments"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Subtitle / Overview */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1" dir="rtl">
                  نبذة موجزة أو وصف الملخص
                </label>
                <textarea
                  rows={2}
                  value={editingSummary.subtitleAr || ''}
                  onChange={(e) => setEditingSummary({ ...editingSummary, subtitleAr: e.target.value })}
                  placeholder="وصف عام للملخص وأهم ما يحتويه..."
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  dir="rtl"
                />
              </div>

              {/* Category & Icon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Category / التصنيف
                  </label>
                  <input
                    type="text"
                    value={editingSummary.category}
                    onChange={(e) => setEditingSummary({ ...editingSummary, category: e.target.value })}
                    placeholder="مثال: Methodology, Statistics"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    أيقونة الملخص الرئيسية
                  </label>
                  <select
                    value={editingSummary.iconName}
                    onChange={(e) => setEditingSummary({ ...editingSummary, iconName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {AVAILABLE_ICONS.map(ic => (
                      <option key={ic.name} value={ic.name}>
                        {ic.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sections Editor */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center">
                    <Layers size={14} className="mr-1 text-indigo-500" />
                    أجزاء الملخص ({editingSummary.sections.length} أجزاء)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newSec: SummarySection = {
                        id: `sec-${Date.now()}`,
                        iconName: 'Bookmark',
                        titleEn: 'New Section Part',
                        titleAr: 'جزء إضافي جديد',
                        summaryAr: 'شرح هذا الجزء',
                        items: [
                          {
                            id: `item-${Date.now()}-1`,
                            labelEn: 'Term or Rule',
                            labelAr: 'المصطلح أو القاعدة',
                            detailEn: 'English detail description',
                            detailAr: 'الشرح العلمي باللغة العربية'
                          }
                        ]
                      };
                      setEditingSummary({
                        ...editingSummary,
                        sections: [...editingSummary.sections, newSec]
                      });
                    }}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center"
                  >
                    <Plus size={13} className="mr-1" /> إضافة جزء جديد
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                  {editingSummary.sections.map((sec, sIdx) => (
                    <div
                      key={sec.id}
                      className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          جزء {sIdx + 1}
                        </span>
                        {editingSummary.sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSummary({
                                ...editingSummary,
                                sections: editingSummary.sections.filter(s => s.id !== sec.id)
                              });
                            }}
                            className="text-rose-500 hover:text-rose-700 text-[11px]"
                          >
                            حذف الجزء
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={sec.titleAr}
                          onChange={(e) => {
                            const updated = [...editingSummary.sections];
                            updated[sIdx].titleAr = e.target.value;
                            setEditingSummary({ ...editingSummary, sections: updated });
                          }}
                          placeholder="عنوان الجزء (بالعربية)"
                          className="px-2.5 py-1.5 bg-white dark:bg-gray-800 border rounded-lg text-xs"
                          dir="rtl"
                        />
                        <input
                          type="text"
                          value={sec.titleEn}
                          onChange={(e) => {
                            const updated = [...editingSummary.sections];
                            updated[sIdx].titleEn = e.target.value;
                            setEditingSummary({ ...editingSummary, sections: updated });
                          }}
                          placeholder="Section Title (English)"
                          className="px-2.5 py-1.5 bg-white dark:bg-gray-800 border rounded-lg text-xs"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-gray-500 shrink-0">أيقونة الجزء:</span>
                        <select
                          value={sec.iconName}
                          onChange={(e) => {
                            const updated = [...editingSummary.sections];
                            updated[sIdx].iconName = e.target.value;
                            setEditingSummary({ ...editingSummary, sections: updated });
                          }}
                          className="px-2 py-1 bg-white dark:bg-gray-800 border rounded-md text-[11px]"
                        >
                          {AVAILABLE_ICONS.map(ic => (
                            <option key={ic.name} value={ic.name}>
                              {ic.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm"
                >
                  حفظ الملخص
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CONFIRMATION                                                */}
      {/* ========================================================================= */}
      {summaryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                تأكيد حذف الملخص
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1" dir="rtl">
                هل أنت متأكد من رغبتك في حذف «{summaryToDelete.titleAr || summaryToDelete.titleEn}»؟ لن تتمكن من التراجع عن هذه الخطوة إلا عبر استعادة الافتراضيات.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                onClick={() => setSummaryToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDeleteSummary}
                className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-700 transition shadow-sm"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SPLIT SUMMARY INTO INDIVIDUAL CHAPTER DOCUMENT BLOCKS             */}
      {/* ========================================================================= */}
      {isSplitModalOpen && summaryToSplit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-750 flex flex-col">
            {/* Modal Top Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/80 flex items-start justify-between bg-gradient-to-r from-amber-50/80 via-white to-indigo-50/80 dark:from-amber-950/20 dark:via-gray-800 dark:to-indigo-950/20">
              <div className="flex items-start space-x-3 space-x-reverse" dir="rtl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
                  <Scissors size={22} />
                </div>
                <div>
                  <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 mb-1">
                    إدارة وتقسيم المستندات (Document Blocks)
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    تقسيم الملخص إلى فصول ومستندات مستقلة
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-lg leading-relaxed">
                    سيتم تفكيك «{summaryToSplit.titleAr || summaryToSplit.titleEn}» إلى كتل وفصول دراسية منفصلة، بحيث يُدار كل فصل كمستند مستقل داخل المكتبة.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSplitModalOpen(false);
                  setSummaryToSplit(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Sections to Split */}
            <div className="p-6 overflow-y-auto space-y-4 max-h-[55vh] scrollbar-thin" dir="rtl">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  حدد الأقسام والفصول المراد استخراجها ({Object.values(selectedSectionsForSplit).filter(Boolean).length} من {summaryToSplit.sections.length}):
                </span>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    type="button"
                    onClick={() => handleSelectAllForSplit(true)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    تحديد الكل
                  </button>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <button
                    type="button"
                    onClick={() => handleSelectAllForSplit(false)}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                  >
                    إلغاء التحديد
                  </button>
                </div>
              </div>

              {/* Sections list cards */}
              <div className="space-y-2.5">
                {summaryToSplit.sections.map((sec, idx) => {
                  const isChecked = !!selectedSectionsForSplit[sec.id];
                  return (
                    <div
                      key={sec.id}
                      onClick={() => toggleSectionSelectionForSplit(sec.id)}
                      className={cn(
                        "p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 select-none",
                        isChecked
                          ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 shadow-2xs"
                          : "bg-gray-50/60 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100"
                      )}
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition",
                          isChecked
                            ? "bg-amber-500 border-amber-500 text-white"
                            : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                        )}>
                          {isChecked ? <Check size={13} strokeWidth={3} /> : null}
                        </div>

                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400 shadow-2xs">
                          {getSectionIcon(sec.iconName, "w-4 h-4")}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.2 rounded">
                              فصل {idx + 1}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                              {sec.titleAr}
                            </h4>
                          </div>
                          {sec.titleEn && (
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                              {sec.titleEn}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-left shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {sec.items.length} قواعد
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Split Options */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                <label className="flex items-center space-x-2 space-x-reverse cursor-pointer text-xs text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={splitKeepOriginal}
                    onChange={(e) => setSplitKeepOriginal(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>الاحتفاظ بالمستند الشامل الأصلي بجانب الفصول المستقلة (موصى به لسهولة الرجوع)</span>
                </label>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/60 dark:bg-gray-900/40" dir="rtl">
              <button
                type="button"
                onClick={() => {
                  setIsSplitModalOpen(false);
                  setSummaryToSplit(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700 transition"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={executeSplitSummary}
                className="px-5 py-2.5 text-xs font-bold rounded-xl text-white bg-amber-600 hover:bg-amber-700 active:scale-95 transition shadow-sm flex items-center space-x-1.5 space-x-reverse"
              >
                <Scissors size={14} className="ml-1.5" />
                <span>تنفيذ التقسيم إلى فصول ({Object.values(selectedSectionsForSplit).filter(Boolean).length})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
