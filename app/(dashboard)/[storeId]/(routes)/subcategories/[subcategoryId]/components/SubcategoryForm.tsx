"use client"

import * as z from "zod"
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Billboard, Category, Subcategory } from '@prisma/client'
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
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { SelectValue } from "@radix-ui/react-select"

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
  categoryId: z.string().min(1),
})

interface SubcategoryFormProps {
  initialData: Subcategory | null
  categories: Category[]
  billboards: Billboard[]
}

type SubcategoryFormValues = z.infer<typeof formSchema>

const SubcategoryForm: FC<SubcategoryFormProps> = ({
  initialData,
  billboards,
  categories

}) => {
  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit Subcategory' : 'New Subcategory'
  const description = initialData ? 'Edit your Subcategory' : 'Create a new Subcategory'
  const toastMessage = initialData ? 'Subcategory updated succesfully' : 'Subcategory created succesfully'
  const action = initialData ? 'Save Changes' : 'Create'

  const form = useForm<SubcategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      categoryId: '',
      billboardId: '',
    }
  })

  const onSubmit = async (data: SubcategoryFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/subcategories/${params.subcategoryId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/subcategories`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/subcategories`)
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
      await axios.delete(`/api/${params.storeId}/subcategories/${params.subcategoryId}`)
      router.refresh()
      router.push(`/${params.storeId}/subcategories`)
      toast.success("Subcategory deleted.")
    } catch (error) {
      toast.error("Make sure to removed all products using this subcategory first.")
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
                      placeholder="Subcategory name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category ID</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>      
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </ SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </ Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='billboardId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>      
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </ SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem
                          key={billboard.id}
                          value={billboard.id}
                        >
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </ Select>
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

export default SubcategoryForm