// 中身はそのまま
type articleListDataT = Pick<
  articleT,
  "title" | "slug" | "createdAt" | "updatedAt" | "tags"
>[];

export interface articleListT {
  data: articleListDataT;
  meta: {
    total: number;
  };
}

export interface articleT {
  title: string;
  slug: string;
  description: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  body: string;
}
