import { useState } from "react";
import type { ITopicItem } from "../../../types/topics/ITopicItem";

const TopicListItem = ({ topic }: { topic: ITopicItem }) => {
    const hasChildren = topic.children && topic.children.length > 0;
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        if (hasChildren) {
            setIsOpen(prev => !prev);
        }
    };

    return (
        <div className="ml-0">
            <div
                className="cursor-pointer group p-3 rounded-md hover:bg-pink-200 transition"
                onClick={toggleDropdown}
            >
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {topic.image && (
                            <img
                                src={topic.image}
                                alt={topic.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        )}
                        <div>
                            <h2 className="text-base font-semibold">{topic.name}</h2>
                            {topic.description && (
                                <p className="text-sm text-gray-600">{topic.description}</p>
                            )}
                        </div>
                    </div>
                    {hasChildren && (
                        <span className="text-gray-500 text-sm">
                            {isOpen ? '▲' : '▼'}
                        </span>
                    )}
                </div>
            </div>

            {hasChildren && isOpen && (
                <div className="pl-6 mt-1 space-y-1">
                    {topic.children.map(child => (
                        <TopicListItem key={child.id} topic={child} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopicListItem;
