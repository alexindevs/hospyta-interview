import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, CreateCommentDto } from './posts.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: number;
    // Add other user properties as needed
  };
}

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Return all posts.' })
  async getAllPosts() {
    return this.postsService.getPosts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiResponse({ status: 200, description: 'Return a post.' })
  async getPost(@Param('id') id: string) {
    return this.postsService.post({ id: Number(id) });
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get posts by category' })
  @ApiResponse({
    status: 200,
    description: 'Return posts of a specific category.',
  })
  async getPostsByCategory(@Param('category') category: string) {
    return this.postsService.getPostsByCategory(category);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  async createPost(
    @Req() req: RequestWithUser,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.createPost({
      ...createPostDto,
      userId: req.user.id,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
  })
  async updatePost(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(req.user.id, updatePostDto, Number(id));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.',
  })
  async deletePost(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.postsService.deletePost(req.user.id, Number(id));
  }

  @Post(':id/upvote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upvote a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully upvoted.',
  })
  async upvotePost(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.postsService.upvotePost(req.user.id, Number(id));
  }

  @Post(':id/downvote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Downvote a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully downvoted.',
  })
  async downvotePost(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.postsService.downvotePost(req.user.id, Number(id));
  }

  @Get(':id/likes')
  @ApiOperation({ summary: 'Get likes for a post' })
  @ApiResponse({
    status: 200,
    description: 'Return likes information for a post.',
  })
  async getPostLikes(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    console.log(req.user);
    const userIdToUse = req.user?.id ? Number(req.user.id) : undefined;
    console.log(userIdToUse);
    return this.postsService.getPostLikes(Number(id), userIdToUse);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
  })
  async createComment(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postsService.createComment(
      req.user.id,
      Number(id),
      createCommentDto.content,
      createCommentDto.parentId,
    );
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiResponse({ status: 200, description: 'Return comments for a post.' })
  async getComments(@Param('id') id: string) {
    return this.postsService.getComments(Number(id));
  }

  @Post('comments/:id/upvote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upvote a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully upvoted.',
  })
  async upvoteComment(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.postsService.upvoteComment(req.user.id, Number(id));
  }

  @Post('comments/:id/downvote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Downvote a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully downvoted.',
  })
  async downvoteComment(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.postsService.downvoteComment(req.user.id, Number(id));
  }
}
