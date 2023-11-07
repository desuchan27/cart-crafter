import { ModalProvider } from "providers/modalProvider";

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