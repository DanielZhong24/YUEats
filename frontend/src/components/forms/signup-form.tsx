import { useState, useMemo } from 'react'
import { useForm } from '@tanstack/react-form'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import { customerCourierSchema, vendorSchema } from '@/schemas/signup-login'
import type { SignupData, UserRole } from '@/auth/types'

interface SignupFormProps {
  onSubmit: (data: SignupData) => void
  isPending?: boolean
  onSuccess?: () => void
}

export function SignupForm({
  onSubmit,
  isPending = false,
  onSuccess,
}: SignupFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER')

  // Dynamically select schema based on user role
  const validationSchema = useMemo(() => {
    return selectedRole === 'VENDOR' ? vendorSchema : customerCourierSchema
  }, [selectedRole])

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      businessName: '' as string | undefined,
      email: '',
      phoneNumber: '',
      password: '',
      passwordConfirm: '',
    },
    validators: {
      onSubmit: validationSchema as any,
    },
    onSubmit: async ({ value }) => {
      const { passwordConfirm, ...sanitized } = value
      sanitized.phoneNumber = sanitized.phoneNumber?.replace(/[-\s]/g, '')

      // Remove businessName if not a vendor
      if (selectedRole !== 'VENDOR') {
        const { businessName, ...withoutBusinessName } = sanitized
        onSubmit({ ...withoutBusinessName, userRole: selectedRole })
      } else {
        onSubmit({ ...sanitized, userRole: selectedRole })
      }

      if (onSuccess) {
        onSuccess()
      }
    },
  })

  const isSubmitting = form.state.isSubmitting || isPending

  return (
    <Card className="w-full sm:max-w-md p-5">
      <div className="flex justify-center mb-4">
        <ToggleGroup
          type="single"
          variant="outline"
          value={selectedRole}
          onValueChange={(value) => {
            if (value) setSelectedRole(value as UserRole)
          }}
          size="sm"
        >
          <ToggleGroupItem
            value="CUSTOMER"
            aria-label="Toggle Customer"
            className="transition-all data-[state=on]:bg-red-500/10 data-[state=on]:text-red-600 data-[state=on]:font-semibold data-[state=off]:opacity-50"
          >
            Customer
          </ToggleGroupItem>
          <ToggleGroupItem
            value="VENDOR"
            aria-label="Toggle Vendor"
            className="transition-all data-[state=on]:bg-red-500/10 data-[state=on]:text-red-600 data-[state=on]:font-semibold data-[state=off]:opacity-50"
          >
            Vendor
          </ToggleGroupItem>
          <ToggleGroupItem
            value="COURIER"
            aria-label="Toggle Courier"
            className="transition-all data-[state=on]:bg-red-500/10 data-[state=on]:text-red-600 data-[state=on]:font-semibold data-[state=off]:opacity-50"
          >
            Courier
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <form
        id="signup-form"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup className="flex gap-4">
          <div className="flex flex-row gap-4">
            <form.Field
              name="firstName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="John"
                      autoComplete="off"
                      type="text"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="lastName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Doe"
                      autoComplete="off"
                      type="text"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </div>
          {selectedRole === 'VENDOR' && (
            <form.Field
              name="businessName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Business Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="YUEats"
                      autoComplete="off"
                      type="text"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          )}
          <div className="flex flex-row gap-4">
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="name@domain.com"
                      autoComplete="off"
                      type="email"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="phoneNumber"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                const handlePhoneChange = (raw: string) => {
                  const sanitized = raw.replace(/[-\s]/g, '')
                  field.handleChange(sanitized)
                }

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="1234567890"
                      autoComplete="off"
                      type="tel"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </div>
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    type="password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
          <form.Field
            name="passwordConfirm"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    type="password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
          <Field orientation="horizontal">
            <Button
              type="submit"
              form="signup-form"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Signup'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </Card>
  )
}
