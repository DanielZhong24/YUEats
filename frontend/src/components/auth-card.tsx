import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SignupForm } from './forms/signup-form'
import { LoginForm } from './forms/login-form'
import type { SignupData, LoginPayload } from '@/auth/types'

interface AuthCardProps {
  onSignup: (data: SignupData) => void
  onLogin: (data: LoginPayload) => void
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
