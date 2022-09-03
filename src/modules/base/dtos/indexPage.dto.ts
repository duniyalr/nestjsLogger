import { Type } from "class-transformer";
import { PageMetaDto } from "./pageMeta.dto";

export class IndexPageDto<T> {
  items: T[];
  readonly meta: PageMetaDto;

  constructor(items: T[], meta: PageMetaDto) {
    this.items = items;
    this.meta = meta;
  }
}