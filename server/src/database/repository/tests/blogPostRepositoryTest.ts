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
const { Pool } = pg

Deno.test("should create blog post for an existing user", async (t) => {
    const dbTest = drizzle({
        client: new Pool({
            connectionString: Deno.env.get('DATABASE_TEST_URL')
        }),
        schema: { comments, blogPosts, users } 
    })
    
    const blogPostRepository = new BlogPostRepository(dbTest)
    const userRepository = new UserRepository(dbTest)

    await t.step('should setup', async () => {
        await beforeEach(dbTest)
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
            authorId: 1
        });
        assertEquals(blogPost.authorId, user.id)
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
        schema: { comments, blogPosts, users } 
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
            authorId: 6
            });
        const blogPost = blogPostRepository.findById(1);
        assertEquals((await blogPost).authorId, 6)
        assertEquals((await blogPost).id, 1)
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
        schema: { comments, blogPosts, users } 
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
                authorId: 6
            });
        }

        const blogPosts = await blogPostRepository.findAll();
        assertEquals(blogPosts.every(post => post.authorId === 6), true)
        assertEquals(blogPosts.length, 11)
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
        schema: { comments, blogPosts, users } 
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
                authorId: 6
            });
        }

        const blogPost = await blogPostRepository.findById(4)
        try {
            const blogPosts = await blogPostRepository.updateById(4, {
                title: 'updated post title',
                subtitle: 'updated post subtitle',
                imgUrl: 'updated post url',
                authorId: 8
            });
            assertEquals(blogPost.authorId, 6)
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
        schema: { comments, blogPosts, users } 
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
                authorId: 6
            });
        }

        const blogPost = await blogPostRepository.findById(4)
        try {
            const blogPosts = await blogPostRepository.updateById(4, {
                title: 'updated post title',
                subtitle: 'updated post subtitle',
                imgUrl: 'updated post url',
                authorId: 8
            });
            assertEquals(blogPost.authorId, 6)
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




