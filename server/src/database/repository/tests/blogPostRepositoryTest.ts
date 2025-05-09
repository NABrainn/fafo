import { drizzle } from "drizzle-orm/node-postgres/driver";
import { BlogPostRepository } from "../blogPostRepository.ts";
import { UserRepository } from "../userRepository.ts";
import { afterEach, beforeEach } from "./setup.ts";
import { assertEquals } from 'jsr:@std/assert/equals' 
import { comments } from "../../schema/comments.ts";
import { blogPosts } from "../../schema/blogPosts.ts";
import { users } from "../../schema/users.ts";
import pg from "pg";
import { is } from "drizzle-orm";
import schema from "../../schema/exports/schema.ts";
import { CommentRepository } from "../commentRepository.ts";
const { Pool } = pg
Deno.test("should create blog post for an existing user", async (t) => {
    const dbTest = drizzle({
        client: new Pool({
            connectionString: Deno.env.get('DATABASE_TEST_URL')
        }),
        schema: schema 
    })
    
    const blogPostRepository = new BlogPostRepository(dbTest)
    const userRepository = new UserRepository(dbTest)

    await t.step('should setup', async () => {
        await beforeEach( dbTest)
    })
    await t.step('perform database operation', async () => {
        const user = await userRepository.create({
            username: 'username',
            email: 'email',
            password: 'password'
        });
        
        const blogPost = await blogPostRepository.create({
            title: 'an interesting post',
            subtitle: 'a severily interesting post',
            imgUrl: '',
            author: user.username, // Use the created user's username
        });
        assertEquals(blogPost.author, user.username)
        assertEquals((await blogPostRepository.findAll()).length, 1)
    })

    await t.step('should teardown', async () => {
        await afterEach(dbTest)
        await dbTest.$client.end()
    })
});

Deno.test("should find blog post with author FK", async (t) => {
    const dbTest = drizzle({
        client: new Pool({
            connectionString: Deno.env.get('DATABASE_TEST_URL')
        }),
        schema: schema 
    })

    const blogPostRepository = new BlogPostRepository(dbTest)
    const userRepository = new UserRepository(dbTest)

    await t.step('should setup', async () => {
        await beforeEach(dbTest)
    })
    await t.step('should perform database operation', async () => {
        for(let i = 0; i <= 10; i++) {
            await userRepository.create({
                username: `${i}username`,
                email: `${i}email`,
                password: 'password'
            });
        }
        await blogPostRepository.create({
            title: 'an interesting post',
            subtitle: 'a severily interesting post',
            imgUrl: '',
            author: `0username`,
            });
        const blogPost = blogPostRepository.findById(1);
        assertEquals((await blogPost)?.id, 1)
    })
    await t.step('should teardown', async () => {
        await afterEach(dbTest)
        await dbTest.$client.end()
    })
});

Deno.test('should find all blog posts belonging to a user', async (t) => {
    const dbTest = drizzle({
        client: new Pool({
            connectionString: Deno.env.get('DATABASE_TEST_URL')
        }),
        schema: schema 
    })

    const blogPostRepository = new BlogPostRepository(dbTest)
    const userRepository = new UserRepository(dbTest)
    const commentRepository = new CommentRepository(dbTest)


    await t.step('should setup', async () => {
        await beforeEach(dbTest)
    })
    await t.step('should perform database operation', async () => {
        for(let i = 0; i <= 10; i++) {
            await userRepository.create({
                username: `${i}username`,
                email: `${i}email`,
                password: 'password'
            });
        }
        for(let i = 0; i <= 10; i++) {
            await blogPostRepository.create({
                title: 'an interesting post',
                subtitle: 'a severily interesting post',
                imgUrl: '',
                author: `${i}username`,
            });
        }

        const blogPosts = await blogPostRepository.findAll();
        commentRepository.create({
            content: 'nice read :D:D',
            author: 'username',
            blogPostId: 1,
        })
        const blogPostId1 = await blogPostRepository.findById(1)
        
        // assertEquals(blogPosts.every(post => post.author === 6), true)
        assertEquals(blogPosts.length, 11)
        assertEquals(blogPostId1?.comments.length, 1)
    })

    await t.step('should teardown', async () => {
        await afterEach(dbTest)
        await dbTest.$client.end()
    })
})

Deno.test('should update a post', async (t) => {
    const dbTest = drizzle({
        client: new Pool({
            connectionString: Deno.env.get('DATABASE_TEST_URL')
        }),
        schema: schema 
    })

    const blogPostRepository = new BlogPostRepository(dbTest)
    const userRepository = new UserRepository(dbTest)

    await t.step('should setup', async () => {
        await beforeEach(dbTest)
    })
    await t.step('should perform database operation', async () => {
        for(let i = 0; i <= 10; i++) {
            await userRepository.create({
                username: `${i}username`,
                email: `${i}email`,
                password: 'password'
            });
        }
        for(let i = 0; i <= 10; i++) {
            await blogPostRepository.create({
                title: 'an interesting post',
                subtitle: 'a severily interesting post',
                imgUrl: '',
                author: `${i}username`,
            });
        }

        const blogPost = await blogPostRepository.findById(4)
        try {
            const blogPosts = await blogPostRepository.updateById(4, {
                title: 'updated post title',
                subtitle: 'updated post subtitle',
                imgUrl: 'updated post url',
                author: `username`,
            });
            assertEquals(blogPost?.author, 6)
            assertEquals(blogPosts.title, 'updated post title')
            assertEquals(blogPosts.subtitle, 'updated post subtitle')
            assertEquals(blogPosts.imgUrl, 'updated post url')
        } catch(err) {
            console.log(`An error occurres: ${err}`);
        }

    })

    await t.step('should teardown', async () => {
        await afterEach(dbTest)
        await dbTest.$client.end()
    })
})

Deno.test('should delete a post', async (t) => {
    const dbTest = drizzle({
        client: new Pool({
            connectionString: Deno.env.get('DATABASE_TEST_URL')
        }),
        schema: schema 
    })

    const blogPostRepository = new BlogPostRepository(dbTest)
    const userRepository = new UserRepository(dbTest)

    await t.step('should setup', async () => {
        await beforeEach(dbTest)
    })
    await t.step('should perform database operation', async () => {
        for(let i = 0; i <= 10; i++) {
            await userRepository.create({
                username: `${i}username`,
                email: `${i}email`,
                password: 'password'
            });
        }
        for(let i = 0; i <= 10; i++) {
            await blogPostRepository.create({
                title: 'an interesting post',
                subtitle: 'a severily interesting post',
                imgUrl: '',
                author: `${i}username`,
            });
        }
        const blogPost = await blogPostRepository.findById(4);
        assertEquals(blogPost?.id, 4);

        await blogPostRepository.deleteById(4);
        const deletedPost = await blogPostRepository.findById(4);
        assertEquals(deletedPost, undefined);

    })

    await t.step('should teardown', async () => {
        await afterEach(dbTest)
        await dbTest.$client.end()
    })
})





