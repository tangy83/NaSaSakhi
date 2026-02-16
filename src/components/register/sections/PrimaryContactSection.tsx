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
        error={(errors.primaryContact as any)?.name?.message as string}
        helperText="Name of the primary contact person"
        {...register('primaryContact.name')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-1">
          <TextInput
            label="ISD Code"
            type="text"
            required
            placeholder="+91"
            maxLength={5}
            error={(errors.primaryContact as any)?.isdCode?.message as string}
            helperText="Country code"
            {...register('primaryContact.isdCode')}
          />
        </div>
        <div className="sm:col-span-3">
          <TextInput
            label="Phone Number"
            type="tel"
            required
            placeholder="9876543210"
            maxLength={15}
            error={(errors.primaryContact as any)?.phone?.message as string}
            helperText="Phone number without country code"
            {...register('primaryContact.phone')}
          />
        </div>
      </div>

      <TextInput
        label="Email"
        type="email"
        required
        placeholder="contact@organization.org"
        error={(errors.primaryContact as any)?.email?.message as string}
        helperText="Primary email address for communications"
        {...register('primaryContact.email')}
      />
    </div>
  );
}
