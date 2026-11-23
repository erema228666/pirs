// 'use client'

// import { authClient } from "@/lib/client/auth-client"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod/v4"
// import { useState } from "react"

// export default function Sign_up() {
//     const [serverError, setServerError] = useState<string | null>(null)

//     const formSchema = z.object({
//         email: z.email("Некорректный email"),
//         name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
//         password: z.string().min(8, "Пароль должен содержать минимум 8 символов")
//     })

//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             email: "",
//             name: "",
//             password: ""
//         }
//     })

//     const onFormSubmit = async (data: z.infer<typeof formSchema>) => {
//         setServerError(null)
        
//         const res = await authClient.signUp.email({
//             email: data.email,
//             name: data.name,
//             password: data.password,
//         })

//         if (res.error) {
//             setServerError(res.error.message || "Ошибка при регистрации")
//         } else {
//             // Здесь можно сделать redirect, например:
//             // window.location.href = "/admin"
//             console.log("Успешная регистрация", res.data)
//         }
//     }

//     return(
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//             <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
//                 <div className="bg-blue-600 p-6 text-center">
//                     <h1 className="text-2xl font-bold text-white">Создать аккаунт</h1>
//                     <p className="text-blue-100 text-sm mt-1">Присоединяйтесь к нам</p>
//                 </div>

//                 <form onSubmit={form.handleSubmit(onFormSubmit)} className="p-6 flex flex-col gap-5">
//                     {/* Вывод серверной ошибки */}
//                     {serverError && (
//                         <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
//                             {serverError}
//                         </div>
//                     )}

//                     {/* Поле: Email */}
//                     <div className="flex flex-col gap-1.5">
//                         <label className="text-sm font-medium text-gray-700">Email</label>
//                         <input 
//                             {...form.register("email")} 
//                             type="email"
//                             placeholder="you@example.com"
//                             className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                         />
//                         {form.formState.errors.email && (
//                             <span className="text-xs text-red-500">{form.formState.errors.email.message}</span>
//                         )}
//                     </div>

//                     {/* Поле: Имя */}
//                     <div className="flex flex-col gap-1.5">
//                         <label className="text-sm font-medium text-gray-700">Имя</label>
//                         <input 
//                             {...form.register("name")} 
//                             type="text"
//                             placeholder="Ваше имя"
//                             className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                         />
//                         {form.formState.errors.name && (
//                             <span className="text-xs text-red-500">{form.formState.errors.name.message}</span>
//                         )}
//                     </div>

//                     {/* Поле: Пароль */}
//                     <div className="flex flex-col gap-1.5">
//                         <label className="text-sm font-medium text-gray-700">Пароль</label>
//                         <input 
//                             {...form.register("password")} 
//                             type="password"
//                             placeholder="Минимум 8 символов"
//                             className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                         />
//                         {form.formState.errors.password && (
//                             <span className="text-xs text-red-500">{form.formState.errors.password.message}</span>
//                         )}
//                     </div>

//                     {/* Кнопка */}
//                     <button 
//                         type="submit"
//                         disabled={form.formState.isSubmitting}
//                         className="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors flex justify-center items-center"
//                     >
//                         {form.formState.isSubmitting ? "Загрузка..." : "Зарегистрироваться"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     )
// }