import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Question } from '@/types';
import React from 'react'

interface PreviewModalProps {
    previewQuestion: Question | null;
    setPreviewQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ previewQuestion, setPreviewQuestion }) => {
    return (
        <Dialog open={!!previewQuestion} onOpenChange={() => setPreviewQuestion(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='text-primary'>Question Preview</DialogTitle>
                    <DialogDescription>
                        {previewQuestion?.created_by && (
                            <div className="mb-2 text-xs">
                                Asked by: {previewQuestion.created_by}
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <div className="text-lg font-semibold mb-4">{previewQuestion?.text}</div>
                <DialogClose asChild>
                    <Button variant="default">Close</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}

export default PreviewModal