'use client';

import { useState } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { TextInput } from '@/components/form/TextInput';

interface SecondaryContactSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  hasSecondaryContact?: boolean;
  onToggle?: (show: boolean) => void;
}

export function SecondaryContactSection({
  register,
  errors,
  hasSecondaryContact = false,
  onToggle,
}: SecondaryContactSectionProps) {
  const [showSecondaryContact, setShowSecondaryContact] = useState(hasSecondaryContact);

  const handleToggle = () => {
    const newValue = !showSecondaryContact;
    setShowSecondaryContact(newValue);
    if (onToggle) {
      onToggle(newValue);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b-2 border-gray-200">
        <h3 className="text-base font-semibold text-gray-700">
          Would you like to add a secondary contact?
        </h3>
        <button
          type="button"
          onClick={handleToggle}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {showSecondaryContact ? 'Remove Secondary Contact' : 'Add Secondary Contact'}
        </button>
      </div>

      {showSecondaryContact && (
        <div className="space-y-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <TextInput
            label="Name"
            placeholder="Enter full name"
            error={errors.secondaryContact?.name?.message as string}
            {...register('secondaryContact.name')}
          />

          <TextInput
            label="Phone"
            type="tel"
            placeholder="9876543210"
            maxLength={10}
            error={errors.secondaryContact?.phone?.message as string}
            helperText="10-digit mobile number starting with 6, 7, 8, or 9"
            {...register('secondaryContact.phone')}
          />

          <TextInput
            label="Email"
            type="email"
            placeholder="contact2@organization.org"
            error={errors.secondaryContact?.email?.message as string}
            {...register('secondaryContact.email')}
          />
        </div>
      )}
    </div>
  );
}
