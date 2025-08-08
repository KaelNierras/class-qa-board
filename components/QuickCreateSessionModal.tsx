import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import useUserData from '@/lib/user-data'
import { useRouter } from 'next/navigation'

const QuickCreateSessionModal = () => {
    const [sessionTitle, setSessionTitle] = useState('')
    const router = useRouter()
    const supabase = createClient();
    const [open, setOpen] = useState(false);
    const user = useUserData();

    const handleCreate = async () => {
        const { data, error } = await supabase
            .from('sessions')
            .insert([{ title: sessionTitle,
                created_by: user?.id,
             }])
            .select()
            .single();
        if (error) {
            alert(error.message);
            return;
        }

        if (data) {
            // Redirect to the newly created session page
            router.push(`/sessions/${data.id}`);
        }
        setSessionTitle('');
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                            onClick={handleCreate}
                            disabled={!sessionTitle.trim()}
                        >
                            Create
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default QuickCreateSessionModal
