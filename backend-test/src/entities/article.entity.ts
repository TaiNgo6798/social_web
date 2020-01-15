import { Entity, Column, ObjectIdColumn } from 'typeorm'

@Entity({
  name: 'article'
})
export class ArticleEntity {
  @ObjectIdColumn()
  _id: string

  @Column()
  content: string
  @Column()
  time: string

  constructor(args: Partial<ArticleEntity>) {
    Object.assign(this, args)
  }
}
