import { PrismaService } from '../prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  CreateBookmarkDto,
  UpdateBookmarkDto,
} from './dto';
// import {  } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    userId: number,
    createBookmarkDto: CreateBookmarkDto,
  ) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...createBookmarkDto,
      },
    });

    return bookmark;
  }

  async findAll(userId: number) {
    // return `This action returns all bookmark`;
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
    });

    return bookmarks;
  }

  async findOne(userId: number, bookmarId: number) {
    // return `This action returns a #${id} bookmark`;
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { userId, id: bookmarId },
    });

    return bookmark;
  }

  async update(
    userId: number,
    bookmarkId: number,
    updateBookmarkDto: UpdateBookmarkDto,
  ) {
    // return `This action updates a #${id} bookmark`;

    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException(
        'Access to resource denied',
      );

    return this.prisma.bookmark.update({
      where: { id: bookmarkId },
      data: { ...updateBookmarkDto },
    });
  }

  async remove(userId: number, bookmarkId: number) {
    // return `This action removes a #${id} bookmark`;
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException(
        'Access to resource denied',
      );
    await this.prisma.bookmark.delete({
      where: { id: bookmarkId },
    });
  }
}
