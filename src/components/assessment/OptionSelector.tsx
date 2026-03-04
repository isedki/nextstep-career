'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { QuestionOption } from '@/lib/types';
import { cn } from '@/lib/utils';

interface OptionSelectorProps {
  options: QuestionOption[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  type: 'single' | 'multi' | 'scale' | 'ranking';
  maxSelections?: number;
}

export function OptionSelector({
  options,
  selectedIds,
  onSelect,
  type,
  maxSelections
}: OptionSelectorProps) {
  const isSingleSelect = type === 'single' || type === 'scale';
  
  const handleSelect = (id: string) => {
    if (isSingleSelect) {
      onSelect(id);
    } else {
      // Multi-select logic
      if (selectedIds.includes(id)) {
        onSelect(id); // Will remove
      } else if (!maxSelections || selectedIds.length < maxSelections) {
        onSelect(id); // Will add
      }
    }
  };

  const isDisabled = (id: string) => {
    if (isSingleSelect) return false;
    if (selectedIds.includes(id)) return false;
    return maxSelections ? selectedIds.length >= maxSelections : false;
  };

  return (
    <div className="grid gap-3 max-w-2xl mx-auto">
      {options.map((option, index) => {
        const isSelected = selectedIds.includes(option.id);
        const disabled = isDisabled(option.id);

        return (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleSelect(option.id)}
            disabled={disabled}
            className={cn(
              "relative w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200",
              "hover:border-primary/30 hover:bg-primary/5",
              "focus:outline-none focus:ring-2 focus:ring-primary/20",
              isSelected && "border-primary bg-primary/10",
              disabled && !isSelected && "opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent"
            )}
          >
            <div className="flex items-center gap-4">
              {/* Selection indicator */}
              <div className={cn(
                "w-6 h-6 border-2 flex items-center justify-center transition-all",
                isSingleSelect ? 'rounded-full' : 'rounded-md',
                isSelected 
                  ? "border-primary bg-primary text-primary-foreground" 
                  : "border-muted-foreground/30"
              )}>
                {isSelected && <Check className="w-4 h-4" />}
              </div>

              {/* Option text */}
              <span className={cn(
                "text-lg",
                isSelected && "font-medium"
              )}>
                {option.text}
              </span>
            </div>

            {/* Selection ring effect */}
            {isSelected && (
              <motion.div
                layoutId="selection-ring"
                className="absolute inset-0 rounded-xl ring-2 ring-primary/20 pointer-events-none"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}

      {/* Selection count for multi-select */}
      {type === 'multi' && maxSelections && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          {selectedIds.length} of {maxSelections} selected
        </p>
      )}
    </div>
  );
}

