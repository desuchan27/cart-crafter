"use client"

import * as z from "zod"
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { ProductType } from '@prisma/client'
import { Trash } from 'lucide-react'
import { FC, useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter, useParams } from "next/navigation"
import AlertModal from "@/components/modals/alertModal"

const formSchema = z.object({
  name: z.string().min(1),
})

interface TypeProps {
  initialData: ProductType | null
}

type TypeFormValues = z.infer<typeof formSchema>

const TypeForm: FC<TypeProps> = ({
  initialData
}) => {
  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit Product Type' : 'New Product Type'
  const description = initialData ? 'Edit your Product Type' : 'Create a new Product Type'
  const toastMessage = initialData ? 'Product Type updated succesfully' : 'Product Type created succesfully'
  const action = initialData ? 'Save Changes' : 'Create'

  const form = useForm<TypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
    }
  })

  const onSubmit = async (data: TypeFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/productTypes/${params.productTypeId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/productTypes`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/productTypes`)
      toast.success(toastMessage)
    } catch (error) {
      toast.error("Something went wrong while saving your changes")
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/productTypes/${params.productTypeId}`)
      router.refresh()
      router.push(`/${params.storeId}/productTypes`)
      toast.success("Type deleted.")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className='flex items-center justify-between'>
        <Heading
          title={title}
          description={description}
        />
        {initialData && (
          <Button

            disabled={loading}
            variant='destructive'
            size='icon'
            onClick={() => {
              setOpen(true)
            }}
          >
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ex: T-Shirt, DVD Album, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  )
}

export default TypeForm