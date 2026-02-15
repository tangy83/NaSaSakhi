'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { TextInput } from '@/components/form/TextInput';

interface OnlinePresenceSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

// Helper function to format URL (add https:// if missing)
const formatUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

export function OnlinePresenceSection({ register, errors }: OnlinePresenceSectionProps) {
  return (
    <div className="space-y-6">
      <TextInput
        label="Website URL"
        type="url"
        placeholder="https://www.organization.org"
        error={errors.websiteUrl?.message as string}
        helperText="Enter your organization's website URL"
        {...register('websiteUrl', {
          onChange: (e) => {
            // Auto-format URL
            const formatted = formatUrl(e.target.value);
            if (formatted !== e.target.value) {
              e.target.value = formatted;
            }
          },
        })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Facebook URL"
          type="url"
          placeholder="https://facebook.com/yourpage"
          error={errors.facebookUrl?.message as string}
          helperText="Must contain facebook.com"
          {...register('facebookUrl', {
            onChange: (e) => {
              const formatted = formatUrl(e.target.value);
              if (formatted !== e.target.value) {
                e.target.value = formatted;
              }
            },
          })}
        />

        <TextInput
          label="Instagram Handle"
          placeholder="your_handle"
          maxLength={30}
          error={errors.instagramHandle?.message as string}
          helperText="Username only (without @)"
          {...register('instagramHandle', {
            pattern: {
              value: /^[a-zA-Z0-9_]*$/,
              message: 'Only letters, numbers, and underscores allowed',
            },
          })}
        />
      </div>

      <TextInput
        label="Twitter/X Handle"
        placeholder="your_handle"
        maxLength={15}
        error={errors.twitterHandle?.message as string}
        helperText="Username only (without @), max 15 characters"
        {...register('twitterHandle', {
          pattern: {
            value: /^[a-zA-Z0-9_]*$/,
            message: 'Only letters, numbers, and underscores allowed',
          },
        })}
      />
    </div>
  );
}
