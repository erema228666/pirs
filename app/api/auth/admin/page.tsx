"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { authClient } from "../../../../lib/client/auth-client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/card"

export default function SignIn() {
  const router = useRouter();
  
  const formSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {} as z.infer<typeof formSchema>,
  });

  const onFormSubmit = async (data: z.infer<typeof formSchema>) => {
    const result = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result.data) {
      router.push("/admin");
      router.refresh();
    } else if (result.error) {
      console.error("Login error:", result.error);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
            <Card className="flex flex-col justify-center items-center w-1/3 h-1/2">
                <CardHeader>
                    <CardTitle>Admin sign-in</CardTitle>
                </CardHeader>
                <CardContent >
                    <form onSubmit={form.handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
          <input
            {...form.register("email")}
            placeholder="Email"
            className="h-12 bg-neutral-200 border-neutral-500 rounded-md placeholder:text-zinc-500 px-4 text-black"
          />
          <input
            type="password"
            {...form.register("password")}
            placeholder="Password"
            className="h-12 bg-neutral-200 border-neutral-500 rounded-md placeholder:text-zinc-500 px-4 text-black"
          />

                        <button type="submit" className="cursor-pointer bg-red-600 hover:bg-red-500  py-2 px-20 rounded-[3] text-white">Sign In</button>
                    </form>     
                </CardContent>
                <CardFooter>
                    
                </CardFooter>
            </Card>
        </div>
  );
}