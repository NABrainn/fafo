import { db, dbTest } from "../../db.ts";

export const beforeAll = async () => {    
    // await db.$client.connect()

}

export const afterAll = async () => {
    // await db.$client.end()
}

export const beforeEach = async (pool: typeof db) => {
    await pool.execute(`
        DROP SCHEMA IF EXISTS public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO postgres;
        GRANT ALL ON SCHEMA public TO public;

        CREATE TABLE "blog_posts" (
            "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
            "title" varchar(30) NOT NULL,
            "subtitle" varchar(200) NOT NULL,
            "created_at" timestamp DEFAULT now() NOT NULL,
            "img_url" varchar NOT NULL,
            "author_id" integer NOT NULL
        );
        CREATE TABLE "comments" (
            "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "comments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
            "content" varchar(50) NOT NULL,
            "createdBy" integer NOT NULL,
            "author_id" integer NOT NULL,
            "blog_post_id" integer NOT NULL,
            "parent_comment_id" integer
        );
        CREATE TABLE "users" (
            "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
            "username" varchar(30) NOT NULL,
            "email" varchar(50) NOT NULL,
            "password" varchar NOT NULL,
            "verified" boolean DEFAULT false NOT NULL,
            CONSTRAINT "users_username_unique" UNIQUE("username"),
            CONSTRAINT "users_email_unique" UNIQUE("email")
        );

        ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
        ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
        ALTER TABLE "comments" ADD CONSTRAINT "comments_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE no action ON UPDATE no action;
    `)
}
export const afterEach = async (pool: typeof db) => {
    await pool.execute(`DROP SCHEMA public CASCADE;`) 
}