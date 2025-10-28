using AutoMapper;
using Spider.Data.Entities;
using Spider.Models.Topics;

namespace Spider.Mappers;

public class TopicMapper : Profile
{
    public TopicMapper()
    {
        CreateMap<TopicEntity, TopicItemModel>();
    }
}
