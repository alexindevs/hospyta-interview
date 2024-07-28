import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';
import { CreatePostDto } from './posts.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  private standardResponse<T>(code: number, message: string, data: T) {
    return { code, message, data };
  }

  async post(postWhereUniqueInput: Prisma.PostWhereUniqueInput) {
    const post = await this.prisma.post.findUnique({
      where: postWhereUniqueInput,
    });
    return this.standardResponse(200, 'Post retrieved successfully', post);
  }

  async getPostsByCategory(category: string) {
    const posts = await this.prisma.post.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' },
    });
    return this.standardResponse(200, 'Posts retrieved successfully', posts);
  }

  async getPosts() {
    const posts = await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return this.standardResponse(200, 'Posts retrieved successfully', posts);
  }

  async createPost(data: CreatePostDto): Promise<any> {
    const readingTime = this.calculateReadingTime(data.content);
    const post = await this.prisma.post.create({
      data: {
        content: data.content,
        category: data.category,
        pictures: data.pictures,
        readingTime,
        user: { connect: { id: data.userId } },
      },
    });
    return this.standardResponse(201, 'Post created successfully', post);
  }

  async updatePost(
    user_id: number,
    data: Prisma.PostUpdateInput,
    post_id: number,
  ) {
    if (data.content) {
      data.readingTime = this.calculateReadingTime(data.content as string);
    }
    const post = await this.prisma.post.update({
      where: { id: post_id, userId: user_id },
      data,
    });
    return this.standardResponse(200, 'Post updated successfully', post);
  }

  async deletePost(user_id: number, post_id: number) {
    const post = await this.prisma.post.delete({
      where: { id: post_id, userId: user_id },
    });
    return this.standardResponse(200, 'Post deleted successfully', post);
  }

  async upvotePost(userId: number, postId: number) {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.upvote.upsert({
        where: { userId_postId: { userId, postId } },
        create: { userId, postId },
        update: {},
      });
      await prisma.downvote
        .delete({
          where: { userId_postId: { userId, postId } },
        })
        .catch(() => {});
    });

    return this.standardResponse(200, 'Post upvoted successfully', null);
  }

  async downvotePost(userId: number, postId: number) {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.downvote.upsert({
        where: { userId_postId: { userId, postId } },
        create: { userId, postId },
        update: {},
      });
      await prisma.upvote
        .delete({
          where: { userId_postId: { userId, postId } },
        })
        .catch(() => {});
    });
    return this.standardResponse(200, 'Post downvoted successfully', null);
  }

  async getPostLikes(postId: number, userId?: number) {
    const [upvotes, downvotes, userVote] = await Promise.all([
      this.prisma.upvote.count({ where: { postId } }),
      this.prisma.downvote.count({ where: { postId } }),
      userId
        ? this.prisma.post.findUnique({
            where: { id: postId },
            select: {
              upvotes: { where: { userId } },
              downvotes: { where: { userId } },
            },
          })
        : null,
    ]);

    const data = {
      upvotes,
      downvotes,
      ...(userId && {
        userUpvoted: userVote?.upvotes.length > 0,
        userDownvoted: userVote?.downvotes.length > 0,
      }),
    };

    return this.standardResponse(
      200,
      'Post likes retrieved successfully',
      data,
    );
  }

  async createComment(
    userId: number,
    postId: number,
    content: string,
    parentId?: number,
  ) {
    const comment = await this.prisma.comment.create({
      data: { content, userId, postId, parentId },
    });
    return this.standardResponse(201, 'Comment created successfully', comment);
  }

  async getComments(postId: number) {
    const comments = await this.prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        _count: {
          select: {
            upvotes: true,
            downvotes: true,
          },
        },
      },
    });
    return this.standardResponse(
      200,
      'Comments retrieved successfully',
      comments,
    );
  }

  async upvoteComment(userId: number, commentId: number) {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.commentUpvote.upsert({
        where: { userId_commentId: { userId, commentId } },
        create: { userId, commentId },
        update: {},
      });
      await prisma.commentDownvote
        .delete({
          where: { userId_commentId: { userId, commentId } },
        })
        .catch((error) => {
          Logger.error(error);
        });
    });

    return this.standardResponse(200, 'Comment upvoted successfully', null);
  }

  async downvoteComment(userId: number, commentId: number) {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.commentDownvote.upsert({
        where: { userId_commentId: { userId, commentId } },
        create: { userId, commentId },
        update: {},
      });
      await prisma.commentUpvote
        .delete({
          where: { userId_commentId: { userId, commentId } },
        })
        .catch((error) => {
          Logger.error(error);
        });
    });

    return this.standardResponse(200, 'Comment downvoted successfully', null);
  }
  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}
