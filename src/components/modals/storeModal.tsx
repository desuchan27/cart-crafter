"use client"

import Modal from "@/components/ui/modal"
import { useStoreModal } from "hooks/useStoreModal"



export const StoreModal = () => {
    const storeModal = useStoreModal()

    return(    
    <Modal 
        title='Create Store'
        description='Add a new Store'
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}
    >
        Work in Progress....
    </ Modal>
    )

}