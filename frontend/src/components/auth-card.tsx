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
  defaultMode?: 'login' | 'signup'; 
}

export function AuthCard({
  onSignup,
  onLogin,
  isPending = false,
  onSuccess,
  defaultMode = 'login' 
}: AuthCardProps) {
  return (
    <Card className="w-full sm:max-w-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl italic font-black text-red-600">YUEats</CardTitle>
        <CardDescription>
          {defaultMode === 'signup' ? 'Create an account to get started!' : 'Welcome back!'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Change defaultValue from "signup" to defaultMode */}
        <Tabs defaultValue={defaultMode} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
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
