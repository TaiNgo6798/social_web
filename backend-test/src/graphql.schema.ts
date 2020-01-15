
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export interface ArticleInput {
    content: string;
    time: string;
}

export interface DishInput {
    name: string;
}

export interface UserLoginInput {
    username?: string;
    password?: string;
}

export interface Article {
    _id?: string;
    content?: string;
    time?: string;
}

export interface Dish {
    _id?: string;
    name?: string;
}

export interface IMutation {
    addArticle(article?: ArticleInput): Article | Promise<Article>;
    addDish(dish?: DishInput): Dish | Promise<Dish>;
}

export interface IQuery {
    articles(): Article[] | Promise<Article[]>;
    dishes(): Dish[] | Promise<Dish[]>;
    login(loginInput?: UserLoginInput): string | Promise<string>;
}

export interface User {
    username?: string;
    password?: string;
}
