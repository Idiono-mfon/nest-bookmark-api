import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { JwtGuard } from './../guard/jwt.guard';
import { GetUser } from '../decorator';

@UseGuards(JwtGuard)

@Controller('bookmarks')
export class BookmarkController {
  constructor(
    private readonly bookmarkService: BookmarkService,
  ) {}

  @Post()
  create(
    @GetUser('id') userId: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.create(
      userId,
      createBookmarkDto,
    );
  }

  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.bookmarkService.findAll(userId);
  }

  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.findOne(userId, bookmarkId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @GetUser('id') userId: number,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.update(
      userId,
      bookmarkId,
      updateBookmarkDto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @GetUser('id') userId: number,
  ) {
    return this.bookmarkService.remove(userId, bookmarkId);
  }
}
