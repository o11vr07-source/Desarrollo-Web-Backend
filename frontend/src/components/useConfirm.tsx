import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

export function useConfirm() {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState<null | (() => void | Promise<void>)>(null);
    const [title, setTitle] = useState("Confirmación");
    const [message, setMessage] = useState("¿Estás seguro?");

    const confirm = (
        fn: () => void | Promise<void>,
        options?: { title?: string; message?: string }
    ) => {
        setAction(() => fn);
        setTitle(options?.title || "Confirmación");
        setMessage(options?.message || "¿Estás seguro?");
        setOpen(true);
    };

    const ConfirmDialog = () => (
        <ConfirmModal
            open={open}
            title={title}
            message={message}
            onCancel={() => setOpen(false)}
            onConfirm={async () => {
                setOpen(false);
                await action?.();
            }}
        />
    );

    return { confirm, ConfirmDialog };
}