using AutoMapper;
using Spider.Data.Entities.Identity;
using Spider.Models.Seeders;

namespace Spider.Mappers;

public class UserMapper : Profile
{
    public UserMapper()
    {
        CreateMap<SeederUserModel, UserEntity>()
            .ForMember(opt => opt.UserName, opt => opt.MapFrom(x => x.Email));
    }
}
