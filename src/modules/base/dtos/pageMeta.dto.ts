import { PageMetaParametersDto } from "./pageMetaParameters.dto";

export class PageMetaDto {
  readonly page: number;
  readonly take: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPrevious: boolean;
  readonly hasNext: boolean;
  constructor({indexDto, itemCount}: PageMetaParametersDto) {
    this.page = indexDto.page;
    this.take = indexDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasNext = this.page < this.pageCount;
    this.hasPrevious = this.page > 1;
  }
}