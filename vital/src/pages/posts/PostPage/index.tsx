import React from "react";
import ReactPlayer from "react-player";
import { useGetPostsQuery } from "../../../services/postService";

const PostsPage: React.FC = () => {
    const { data: posts, isLoading, isError } = useGetPostsQuery();

    if (isLoading) return <p>Loading posts...</p>;
    if (isError) return <p>Failed to load posts.</p>;

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
            <h1>Posts</h1>
            {posts && posts.length > 0 ? (
                posts.map((post) => (
                    <div
                        key={post.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "1rem",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <h2>{post.title}</h2>
                        <p>{post.body}</p>

                        {/* Image */}
                        {post.image && (
                            <img
                                src={post.image}
                                alt={post.title}
                                style={{ maxWidth: "100%", borderRadius: "8px" }}
                            />
                        )}

                        {/* Video from file */}
                        {post.video && (
                            <div style={{ marginTop: "1rem" }}>
                                <ReactPlayer
                                    src={post.video ?? post.video_url}
                                    controls={true}
                                    width="100%"
                                    height="360px"
                                />
                            </div>
                        )}

                        {/* External video link */}
                        {post.video_url && !post.video && (
                            <div style={{ marginTop: "1rem" }}>
                                <ReactPlayer
                                  src={post.video ?? post.video_url}
                                  controls={true}
                                  width="100%"
                                  height="360px"
                                />
                            </div>
                        )}

                        <small style={{ color: "#888" }}>
                            Posted on {new Date(post.created_at).toLocaleString()}
                        </small>
                    </div>
                ))
            ) : (
                <p>No posts found.</p>
            )}
        </div>
    );
};

export default PostsPage;
