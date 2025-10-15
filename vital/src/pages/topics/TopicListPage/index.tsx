import {useGetRootTopicsQuery} from "../../../services/topicService";
import TopicListItem from "./TopicListItem";

const TopicsListPage = () => {
    const {data: topics, isLoading} = useGetRootTopicsQuery();

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Topics</h1>
            <div className="space-y-4">
                {topics?.map(topic => (
                    <TopicListItem key={topic.id} topic={topic} />
                ))}
            </div>
        </div>
    );
};

export default TopicsListPage;
