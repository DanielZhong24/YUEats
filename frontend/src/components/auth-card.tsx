import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SignupForm } from './forms/signup-form'
import { LoginForm } from './forms/login-form'

interface AuthCardProps {
  onSignup: (data: {
    firstName: string
    lastName: string
    businessName: string
    email: string
    phoneNumber: string
    password: string
  }) => void
  onLogin: (data: { email: string; password: string }) => void
  isPending?: boolean
  onSuccess?: () => void
}

export function AuthCard({
  onSignup,
  onLogin,
  isPending = false,
  onSuccess,
}: AuthCardProps) {
  return (
    <Card className="w-full sm:max-w-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Signup / Login</CardTitle>
        <CardDescription>
          Create an account to get started with YUEats!
        </CardDescription>
        <div className="flex justify-center mt-2">
          <ToggleGroup
            type="single"
            variant="outline"
            defaultValue="customer"
            size="sm"
          >
            <ToggleGroupItem
              value="customer"
              aria-label="Toggle Customer"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500"
            >
              Customer
            </ToggleGroupItem>
            <ToggleGroupItem
              value="vendor"
              aria-label="Toggle Vendor"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
            >
              Vendor
            </ToggleGroupItem>
            <ToggleGroupItem
              value="driver"
              aria-label="Toggle Driver"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
            >
              Driver
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signup">
          <TabsList className="self-center">
            <TabsTrigger value="signup">Signup</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>
          <TabsContent value="signup">
            <SignupForm
              onSubmit={onSignup}
              isPending={isPending}
              onSuccess={onSuccess}
            />
          </TabsContent>
          <TabsContent value="login">
            <LoginForm
              onSubmit={onLogin}
              isPending={isPending}
              onSuccess={onSuccess}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
