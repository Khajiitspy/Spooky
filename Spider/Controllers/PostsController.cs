using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Spider.Data;
using Spider.Data.Entities;
using Spider.Interfaces;
using Spider.Models.Posts;

namespace Spider.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PostsController(AppDbContext context, IMapper mapper, IMediaService mediaService) 
    : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetPostsAsync()
    {
        var posts = await context.Posts
            .ProjectTo<PostItemModel>(mapper.ConfigurationProvider)
            .ToListAsync();
        return Ok(posts);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePostAsync([FromForm] PostCreateModel model)
    {
        try
        {
            var postEntity = mapper.Map<PostEntity>(model);
            if (model.Image != null)
            {
                postEntity.Image = await mediaService.SaveImageAsync(model.Image);
            }
            if (model.Video != null)
            {
                postEntity.Video = await mediaService.SaveVideoAsync(model.Video);
            }
            var defaultUser = await context.Users.FirstOrDefaultAsync();
            if (defaultUser == null)
                return BadRequest("No users in the system. Create one first.");

            postEntity.UserId = defaultUser.Id;

            context.Posts.Add(postEntity);
            await context.SaveChangesAsync();
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }

    // [Authorize]
    // [HttpPost]
    // public async Task<IActionResult> CreatePostAsync([FromForm] PostCreateModel model)
    // {
    //     try
    //     {
    //         var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    //         if (string.IsNullOrEmpty(userId))
    //             return Unauthorized("User not found.");

    //         var postEntity = _mapper.Map<PostEntity>(model);
    //         postEntity.UserId = userId; // set from auth claims, not client

    //         if (model.Image != null)
    //             postEntity.Image = await _mediaService.SaveImageAsync(model.Image);

    //         if (model.Video != null)
    //             postEntity.Video = await _mediaService.SaveVideoAsync(model.Video);

    //         _context.Posts.Add(postEntity);
    //         await _context.SaveChangesAsync();

    //         return Ok(new { message = "Post created successfully", post = postEntity });
    //     }
    //     catch (Exception ex)
    //     {
    //         return BadRequest(new { error = ex.Message, stack = ex.StackTrace });
    //     }
    // }
}
