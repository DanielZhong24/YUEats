import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { useSignup } from '@/hooks/useSignup'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import { Link } from '@tanstack/react-router'

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required!')
      .max(50, 'First name must be at most 50 characters!')
      .refine(
        (firstName) => /^[a-zA-Z\s'-]+$/.test(firstName),
        'First name contains invalid characters!',
      ),
    lastName: z
      .string()
      .min(1, 'Last name is required!')
      .max(50, 'Last name must be at most 50 characters!')
      .refine(
        (lastName) => /^[a-zA-Z\s'-]+$/.test(lastName),
        'Last name contains invalid characters!',
      ),
    businessName: z
      .string()
      .min(3, 'Business name must be at least 3 characters!')
      .max(100, 'Business name must be at most 100 characters!')
      .refine(
        (name) => /^[a-zA-Z0-9\s&'-]+$/.test(name),
        'Business name contains invalid characters!',
      ),
    email: z.email('Please enter a valid email address!'),
    phoneNumber: z
      .string()
      .refine(
        (phoneNumber) =>
          /^[0-9]{3}[-\s]?[0-9]{3}[-\s]?[0-9]{4}$/.test(phoneNumber),
        'Please enter a valid phone number!',
      ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters!')
      .max(20, 'Password must be at most 20 characters!')
      .refine(
        (password) => /[A-Z]/.test(password),
        'Password must contain at least one uppercase letter!',
      )
      .refine(
        (password) => /[a-z]/.test(password),
        'Password must contain at least one lowercase letter!',
      )
      .refine(
        (password) => /[0-9]/.test(password),
        'Password must contain at least one number!',
      )
      .refine(
        (password) => /[!@#$%^&*]/.test(password),
        'Password must contain at least one special character!',
      ),
    passwordConfirm: z.string().min(8, 'Please confirm your password!'),
  })
  .refine((data) => data.password == data.passwordConfirm, {
    error: 'Passwords do not match!',
    path: ['passwordConfirm'],
  })

export function VendorSignupForm() {
  const { mutate: signup, isPending } = useSignup({
    userType: 'vendors',
    onSuccess: () => {
      toast.success('Account Created Successfully!', {
        description: 'You can now log in to your vendor account.',
      })
      form.reset()
    },
    onError: (error) => {
      toast.error('Signup failed!', {
        description: error.message || 'Could not connect to the server',
      })
    },
  })

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      businessName: '',
      email: '',
      phoneNumber: '',
      password: '',
      passwordConfirm: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const { passwordConfirm, ...sanitized } = value
      sanitized.phoneNumber = sanitized.phoneNumber?.replace(/[-\s]/g, '')

      signup(sanitized)
    },
  })

  const isSubmitting = form.state.isSubmitting || isPending

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create a Vendor Account</CardTitle>
        <CardDescription>
          Fill out the form below to sign up as a vendor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="vendor-signup-form"
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
                        placeholder="vendor@domain.com"
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
            <div className="flex flex-row gap-4">
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
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
                      <FieldLabel htmlFor={field.name}>
                        Confirm Password
                      </FieldLabel>
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </div>
            <FieldDescription>
              Password must be 8-20 characters long and include at least one
              uppercase letter, one lowercase letter, one number, and one
              special character.
            </FieldDescription>
            <Field orientation="horizontal">
              <Button
                type="submit"
                form="vendor-signup-form"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Vendor Account'}{' '}
              </Button>
            </Field>
            <FieldDescription className="text-center ">
              Already have an account?
              <Link
                to="/vendor/login"
                preload="render"
                className="ml-1 font-medium underline"
              >
                Login Here
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
