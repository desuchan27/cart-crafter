"use client"

import * as z from "zod"
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Store } from '@prisma/client'
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
import ApiAlert from "@/components/ui/apiAlert"

interface SettingsFormProps {
  initialData: Store
}

const formSchema = z.object({
  name: z.string().min(1),
})

type SettingsFormValues = z.infer<typeof formSchema>

const SettingsForm: FC<SettingsFormProps> = ({
  initialData
}) => {
  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true)
      await axios.patch(`/api/stores/${params.storeId}`, data)
      router.refresh()
      toast.success("Store updated succesfully")
    } catch (error) {
      toast.error("Something went wrong while saving your changes")
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (data: SettingsFormValues) => {
    try {
      setLoading(true)
      await axios.delete(`/api/stores/${params.storeId}`)
      router.refresh()
      router.push('/')
      toast.success("Store deleted.")
    } catch (error) {
      toast.error("Make sure to remove all of your categories and products first.")
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
          title='Settings'
          description='Manage Store Preferences'
        />
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
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant={"public"}
      />
    </>
  )
}

export default SettingsForm