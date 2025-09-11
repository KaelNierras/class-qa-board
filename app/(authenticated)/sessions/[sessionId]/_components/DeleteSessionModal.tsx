import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React from 'react'

interface DeleteSessionModalProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteSessionModal: React.FC<DeleteSessionModalProps> = ({ open, onConfirm, onCancel }) => {
    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Session</DialogTitle>
                </DialogHeader>
                <p className="mb-6 text-sm text-gray-600">
                    Are you sure you want to delete this session? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            type="button"
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        onClick={onConfirm}
                    >
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteSessionModal