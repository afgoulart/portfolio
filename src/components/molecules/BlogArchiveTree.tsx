'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  CalendarIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  FolderIcon,
  DocumentIcon 
} from '@heroicons/react/24/outline';
import { ContentIndex } from '@/lib/content-client';

interface BlogArchiveTreeProps {
  contentIndex: ContentIndex;
  locale: string;
  currentFilters: {
    tag?: string;
    search?: string;
    year?: number;
    month?: number;
  };
}

interface TreeNode {
  year: number;
  months: {
    [month: number]: {
      monthName: string;
      count: number;
      days: {
        [day: number]: {
          count: number;
          posts: Array<{
            slug: string;
            title: string;
          }>;
        };
      };
    };
  };
  count: number;
}

export default function BlogArchiveTree({ contentIndex, locale, currentFilters }: BlogArchiveTreeProps) {
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set()); // "year-month"
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set()); // "year-month-day"

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthNamesPt = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Build tree structure from contentIndex
  const archiveTree: TreeNode[] = Object.entries(contentIndex.years)
    .map(([yearStr, yearData]) => {
      const year = parseInt(yearStr);
      const months: TreeNode['months'] = {};
      let yearCount = 0;

      Object.entries(yearData.months).forEach(([monthStr, monthData]) => {
        const month = parseInt(monthStr);
        const days: TreeNode['months'][number]['days'] = {};
        let monthCount = 0;

        Object.entries(monthData.days).forEach(([dayStr, dayData]) => {
          const day = parseInt(dayStr);
          const dayPosts = dayData.posts.filter(post => post.locale === locale);
          
          if (dayPosts.length > 0) {
            days[day] = {
              count: dayPosts.length,
              posts: dayPosts.map(post => ({
                slug: post.slug,
                title: post.title
              }))
            };
            monthCount += dayPosts.length;
          }
        });

        if (monthCount > 0) {
          months[month] = {
            monthName: locale === 'pt' ? monthNamesPt[month - 1] : monthNames[month - 1],
            count: monthCount,
            days
          };
          yearCount += monthCount;
        }
      });

      return {
        year,
        months,
        count: yearCount
      };
    })
    .filter(node => node.count > 0)
    .sort((a, b) => b.year - a.year);

  const buildUrl = (year: number, month?: number, day?: number) => {
    const params = new URLSearchParams();
    params.set('year', year.toString());
    if (month) params.set('month', month.toString());
    if (day) params.set('day', day.toString());
    return `/${locale}/blog?${params.toString()}`;
  };

  const toggleYear = (year: number) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
      // Close all months and days for this year
      const monthsToClose = Array.from(expandedMonths).filter(key => key.startsWith(`${year}-`));
      monthsToClose.forEach(key => expandedMonths.delete(key));
      const daysToClose = Array.from(expandedDays).filter(key => key.startsWith(`${year}-`));
      daysToClose.forEach(key => expandedDays.delete(key));
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const toggleMonth = (year: number, month: number) => {
    const key = `${year}-${month}`;
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
      // Close all days for this month
      const daysToClose = Array.from(expandedDays).filter(dayKey => dayKey.startsWith(`${key}-`));
      daysToClose.forEach(dayKey => expandedDays.delete(dayKey));
    } else {
      newExpanded.add(key);
    }
    setExpandedMonths(newExpanded);
  };

  const toggleDay = (year: number, month: number, day: number) => {
    const key = `${year}-${month}-${day}`;
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedDays(newExpanded);
  };

  if (archiveTree.length === 0) {
    return (
      <div className="text-center py-4 text-gray-400">
        {locale === 'pt' ? 'Nenhum arquivo encontrado' : 'No archive found'}
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="flex items-center text-lg font-semibold text-white mb-4">
        <CalendarIcon className="h-5 w-5 mr-2" />
        {locale === 'pt' ? 'Arquivo' : 'Archive'}
      </h3>
      
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {archiveTree.map((yearNode) => (
          <div key={yearNode.year}>
            {/* Year Level */}
            <div className="flex items-center">
              <button
                onClick={() => toggleYear(yearNode.year)}
                className={`flex items-center w-full text-left py-2 px-2 rounded hover:bg-slate-700 transition-colors ${
                  currentFilters.year === yearNode.year && !currentFilters.month 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300'
                }`}
              >
                {expandedYears.has(yearNode.year) ? (
                  <ChevronDownIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                )}
                <FolderIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="font-medium">{yearNode.year}</span>
                <span className="ml-auto text-xs opacity-75">({yearNode.count})</span>
              </button>
            </div>

            {/* Months Level */}
            {expandedYears.has(yearNode.year) && (
              <div className="ml-6 space-y-1">
                {Object.entries(yearNode.months)
                  .map(([monthStr, monthData]) => [parseInt(monthStr), monthData] as const)
                  .sort(([a], [b]) => b - a)
                  .map(([month, monthData]) => (
                    <div key={month}>
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleMonth(yearNode.year, month)}
                          className={`flex items-center w-full text-left py-1 px-2 rounded hover:bg-slate-700 transition-colors ${
                            currentFilters.year === yearNode.year && currentFilters.month === month
                              ? 'bg-blue-600 text-white' 
                              : 'text-gray-300'
                          }`}
                        >
                          {expandedMonths.has(`${yearNode.year}-${month}`) ? (
                            <ChevronDownIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                          ) : (
                            <ChevronRightIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                          )}
                          <FolderIcon className="h-3 w-3 mr-2 flex-shrink-0" />
                          <span className="text-sm">{monthData.monthName}</span>
                          <span className="ml-auto text-xs opacity-75">({monthData.count})</span>
                        </button>
                      </div>

                      {/* Days Level */}
                      {expandedMonths.has(`${yearNode.year}-${month}`) && (
                        <div className="ml-6 space-y-1">
                          {Object.entries(monthData.days)
                            .map(([dayStr, dayData]) => [parseInt(dayStr), dayData] as const)
                            .sort(([a], [b]) => b - a)
                            .map(([day, dayData]) => (
                              <div key={day}>
                                <div className="flex items-center">
                                  <button
                                    onClick={() => toggleDay(yearNode.year, month, day)}
                                    className="flex items-center w-full text-left py-1 px-2 rounded hover:bg-slate-700 transition-colors text-gray-300"
                                  >
                                    {expandedDays.has(`${yearNode.year}-${month}-${day}`) ? (
                                      <ChevronDownIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                                    ) : (
                                      <ChevronRightIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                                    )}
                                    <CalendarIcon className="h-3 w-3 mr-2 flex-shrink-0" />
                                    <span className="text-sm">
                                      {locale === 'pt' ? 'Dia' : 'Day'} {day}
                                    </span>
                                    <span className="ml-auto text-xs opacity-75">({dayData.count})</span>
                                  </button>
                                </div>

                                {/* Posts Level */}
                                {expandedDays.has(`${yearNode.year}-${month}-${day}`) && (
                                  <div className="ml-6 space-y-1">
                                    {dayData.posts.map((post) => (
                                      <Link
                                        key={post.slug}
                                        href={`/${locale}/blog/${post.slug}`}
                                        className="flex items-center py-1 px-2 rounded hover:bg-slate-700 transition-colors text-gray-400 hover:text-white"
                                      >
                                        <DocumentIcon className="h-3 w-3 mr-2 flex-shrink-0" />
                                        <span className="text-sm truncate" title={post.title}>
                                          {post.title.length > 40 
                                            ? `${post.title.substring(0, 40)}...` 
                                            : post.title
                                          }
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}