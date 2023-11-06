import { ModalProvider } from "providers/modalProviders";

export default function AuthLayout({
    children,
} : {
    children: React.ReactNode,
}) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <ModalProvider />
            {children}
        </div>
    )
}