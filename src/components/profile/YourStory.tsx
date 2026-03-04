'use client';

import { motion } from 'framer-motion';
import { UserNarrative } from '@/lib/profile/narrative';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface YourStoryProps {
  narrative: UserNarrative;
}

export function YourStory({ narrative }: YourStoryProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0, 1]));

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Greeting and Headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-lg text-muted-foreground mb-2">{narrative.greeting}</p>
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">
          {narrative.headline}
        </h2>
      </motion.div>

      {/* Story Sections */}
      <div className="space-y-4">
        {narrative.story.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div
              className="bg-card rounded-xl border overflow-hidden"
            >
              <button
                onClick={() => toggleSection(index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                </div>
                {expandedSections.has(index) ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              
              {expandedSections.has(index) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6"
                >
                  <div className="pl-11 space-y-4">
                    {section.content.split('\n\n').map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center pt-6 border-t"
      >
        <p className="text-lg font-medium text-primary">
          {narrative.callToAction}
        </p>
      </motion.div>
    </div>
  );
}

