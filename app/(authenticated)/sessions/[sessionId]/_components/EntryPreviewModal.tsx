import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Entry } from '@/types';
import React from 'react'

interface PreviewModalProps {
    previewEntry: Entry | null;
    entryType: string;
    setPreviewEntry: React.Dispatch<React.SetStateAction<Entry | null>>;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ previewEntry, setPreviewEntry, entryType }) => {
    return (
        <Dialog open={!!previewEntry} onOpenChange={() => setPreviewEntry(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='text-primary'>{entryType === 'question' ? 'Question Preview' : 'Answer Preview'}</DialogTitle>
                    <DialogDescription>
                        {previewEntry?.created_by && (
                            <div className="mb-2 text-xs">
                                Asked by: {previewEntry.created_by}
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <div className="text-lg font-semibold mb-4">{previewEntry?.text}</div>
                <DialogClose asChild>
                    <Button variant="default">Close</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}

export default PreviewModal