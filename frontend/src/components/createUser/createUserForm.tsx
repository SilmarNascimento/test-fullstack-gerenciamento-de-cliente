import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FormProvider, useForm } from 'react-hook-form'
import { z } from "zod"
import { Button } from "../ui/button"
import { Select } from "../ui/selectForm"
import { Check, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { createUserSchema } from "./createUserSchema"



type CreateUserSchema = z.infer<typeof createUserSchema>

export function CreateUserForm() {
  const queryClient = useQueryClient()
  const navigate = useNavigate();

  const formMethods = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
  })
  const { register, handleSubmit, formState } = formMethods;

  const createUser = useMutation({
    mutationFn: async ({
      name,
      email,
      cpf,
      telephone,
      status
    }: CreateUserSchema) => {
      try {
        console.log(status);
        
        const response = await fetch('http://localhost:8080/api/users',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            name,
            email,
            cpf,
            telephone,
            status
          }),
      })

      if (response.status === 201) {
        queryClient.invalidateQueries({
          queryKey: ['get-users'],
        });
        navigate("/");
      }

      if (response.status === 400) {
        const errorMessage = await response.text();
        console.log("Error: ", errorMessage);
      }
      
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }
  })

  async function handleCreateUser(data: CreateUserSchema) {
    console.log(data);
    console.log(formState?.errors);
    await createUser.mutateAsync(data);
  }

  function handleGoBack() {
    navigate("/")
  }

  if (formState.errors) {
    console.log(formState.errors);
    
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(handleCreateUser)} className="w-full space-y-3">
        <div className="space-y-1">
          <input 
            {...register('name')}
            id="name" 
            placeholder="Nome"
            type="text" 
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-50/50 w-72 text-sm"
          />
          <p className={`text-sm ${formState.errors?.name ? 'text-red-400' : 'text-transparent'}`}>
            {formState.errors?.name ? formState.errors.name.message : '\u00A0'}
          </p>
        </div>

        <div className="space-y-1">
          <input 
            {...register('email')}
            id="email" 
            placeholder="E-mail"
            type="text" 
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-50/50 w-72 text-sm"
          />
          <p className={`text-sm ${formState.errors?.email ? 'text-red-400' : 'text-transparent'}`}>
            {formState.errors?.email ? formState.errors.email.message : '\u00A0'}
          </p>
        </div>

        <div className="space-y-1">
          <input 
            {...register('cpf')}
            id="cpf" 
            placeholder="CPF"
            type="text" 
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-50/50 w-72 text-sm"
          />
          <p className={`text-sm ${formState.errors?.cpf ? 'text-red-400' : 'text-transparent'}`}>
            {formState.errors?.cpf ? formState.errors.cpf.message : '\u00A0'}
          </p>
        </div>

        <div className="space-y-1">
          <input 
            {...register('telephone')}
            id="name" 
            placeholder="Telefone"
            type="text" 
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-50/50 w-72 text-sm"
          />
          <p className={`text-sm ${formState.errors?.telephone ? 'text-red-400' : 'text-transparent'}`}>
            {formState.errors?.telephone ? formState.errors.telephone.message : '\u00A0'}
          </p>
        </div>

        <div className="space-y-1">
        <Select />
        <p className={`text-sm ${formState.errors?.status ? 'text-red-400' : 'text-transparent'}`}>
          {formState.errors?.status ? formState.errors.status.message : '\u00A0'}
        </p>
        </div>

        <div className="flex items-center justify-start gap-8">
          <Button
            disabled={formState.isSubmitting}
            variant="primary"
            type="submit"
            className="w-32 flex flex-row justify-center gap-2 text-sm"
          >
            {formState.isSubmitting ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-4" />}
            <span>Criar</span>
          </Button>
          <Button
            onClick={handleGoBack}
            className="w-32 flex flex-row justify-center gap-3 text-sm"
          >
            <span>Voltar</span>
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}