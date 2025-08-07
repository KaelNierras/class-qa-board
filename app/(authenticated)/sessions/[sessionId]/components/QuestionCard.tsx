import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Question } from '@/types';
import React from 'react'

interface QuestionCardProps {
    question: Question;
    setPreviewQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
    index: number;
    total: number;
}
const QuestionCard: React.FC<QuestionCardProps> = ({ question, setPreviewQuestion, index, total }) => {
    return (
        <Card
            onClick={() => setPreviewQuestion(question)}
            key={question.id}
            className="mb-6 rounded-2xl shadow-none border-0 bg-gradient-to-b from-secondary/10 to-primary/10 p-0"
        >
            <CardHeader className="pb-0">
                <div className="text-xs text-primary font-medium mb-2">
                    Question {index + 1} of {total}
                </div>
                <div className="text-xs text-primary/70 mb-2">
                    Asked by: {question.created_by || 'Unknown'}
                </div>
            </CardHeader>
            <CardContent className="pt-0 pb-6">
                <div className="text-xl font-semibold text-primary leading-snug mb-2">
                    {question.text}
                </div>
            </CardContent>
        </Card>
    )
}

export default QuestionCard