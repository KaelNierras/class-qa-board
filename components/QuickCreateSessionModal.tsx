import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import QRCode from "react-qr-code";

const QuickCreateSessionModal = () => {
    const [sessionTitle, setSessionTitle] = useState('')
    const [created, setCreated] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)

    const handleCreate = () => {
        // Simulate session creation and generate a session ID
        const id = `session-${Date.now()}`
        setSessionId(id)
        setCreated(true)
    }

    return (
        <Dialog onOpenChange={(open) => {
            if (!open) {
                setSessionTitle('')
                setCreated(false)
                setSessionId(null)
            }
        }}>
            <DialogTrigger className='flex items-center gap-2 p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90 w-full'>
                <PlusCircleIcon />
                <span>Quick Create</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md flex flex-row gap-6">
                <div className="flex-1">
                    <DialogHeader>
                        <DialogTitle>New Session</DialogTitle>
                        <DialogDescription>
                            Enter a title for your new session.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2 mt-5">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="session-title">
                                Session Title
                            </Label>
                            <Input
                                id="session-title"
                                placeholder="Enter session title"
                                value={sessionTitle}
                                onChange={e => setSessionTitle(e.target.value)}
                                disabled={created}
                            />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-start mt-5">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            disabled={!sessionTitle.trim() || created}
                            onClick={handleCreate}
                        >
                            Create
                        </Button>
                    </DialogFooter>
                </div>
                {created && sessionId && (
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
                        <span className="mb-2 text-sm text-gray-600">Scan to join session</span>
                        <QRCode value={sessionId} size={128} />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default QuickCreateSessionModal