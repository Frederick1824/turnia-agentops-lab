import { useEffect, useRef } from 'react'

interface Props { open: boolean; title: string; message: string; confirmLabel: string; onConfirm: () => void; onClose: () => void }

export function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (open && dialog && !dialog.open) dialog.showModal()
    if (!open && dialog?.open) dialog.close()
  }, [open])
  return (
    <dialog ref={dialogRef} onCancel={onClose} onClose={onClose} className="confirm-dialog">
      <h2>{title}</h2><p>{message}</p>
      <div className="dialog-actions"><button className="button secondary" onClick={onClose}>Volver</button><button className="button danger" onClick={onConfirm}>{confirmLabel}</button></div>
    </dialog>
  )
}
