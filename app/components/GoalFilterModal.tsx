import type { Dispatch, SetStateAction } from 'react';
import { Form, useSubmit } from '@remix-run/react';

interface ModalProps {
    goalData: Array<any>;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const Modal: ReactFC<ModalProps> = ({
    setModalOpen,
    goalData
  }) => {

    // create goal options
    const goalOptions = goalData?.map((goal) => {
        return <option key={goal.id} value={goal.id}>{goal.goal}</option>
    }) || null;

    return (
        <div className="w-full h-full pt-2">
            <Form method="get" className="grid" onSubmit={() => setModalOpen(false)}>
                <label htmlFor="goal" className="my-2 block text-lg font-medium text-gray-800">Filter by a specific goal.</label>
                <select id="goal_id" name="goal_id" className="w-full border-gray-400 rounded-lg shadow-sm mb-4">
                {goalOptions}
                </select>
                <div>
                <button type="submit" className="w-full p-2 bg-gray-800 text-white text-center rounded-md">
                    Filter
                </button>
                </div>
            </Form>  
        </div>
    )}