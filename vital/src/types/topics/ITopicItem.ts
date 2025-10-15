export interface ITopicItem {
    id: number;
    name: string;
    url_slug: string;
    priority: number;
    image: string | null;
    description: string | null;
    parent: number | null;
    children: ITopicItem[];
}
