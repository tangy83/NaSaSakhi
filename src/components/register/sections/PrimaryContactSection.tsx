'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { TextInput } from '@/components/form/TextInput';

interface PrimaryContactSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function PrimaryContactSection({ register, errors }: PrimaryContactSectionProps) {
  return (
    <div className="space-y-6">
      <TextInput
        label="Name"
        required
        placeholder="Enter full name"
        error={errors.primaryContact?.name?.message as string}
        helperText="Name of the primary contact person"
        {...register('primaryContact.name')}
      />

      <TextInput
        label="Phone"
        type="tel"
        required
        placeholder="9876543210"
        maxLength={10}
        error={errors.primaryContact?.phone?.message as string}
        helperText="10-digit mobile number starting with 6, 7, 8, or 9"
        {...register('primaryContact.phone')}
      />

      <TextInput
        label="Email"
        type="email"
        required
        placeholder="contact@organization.org"
        error={errors.primaryContact?.email?.message as string}
        helperText="Primary email address for communications"
        {...register('primaryContact.email')}
      />
    </div>
  );
}
