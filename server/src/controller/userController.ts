import { Hono } from "hono";
import { userRepository } from "../database/repository/userRepository.ts";
import { User } from "../database/schema/users.ts";

export const userController = new Hono()

userController.get('/:id', async (c) => {
    const id = c.req.param('id');
    const user = await userRepository.findById(parseFloat(id))
    if(!user) {
        return c.json({error: 'Nie znaleziono użytkownika'}, 404)
    } 
    return c.json(user);
})
userController.get('/', async (c) => {
    const users = await userRepository.findAll()
    if(!users) 
        return c.json({error: 'Nie znaleziono użytkownika'}, 404)
    return c.json(users, 200);
})
userController.post('/', async (c) => {
    const body = await c.req.json<User>()
    const user = await userRepository.create(body)
    if(!user) 
        return c.json({error: 'Nie znaleziono użytkownika'}, 404)
    
    return c.json(user, 200);
})
userController.put('/:id', async (c) => {
    const body = await c.req.json<User>()
    const user = await userRepository.updateById(body.id, body)
    if(!user) 
        return c.json({error: 'Nie znaleziono użytkownika'}, 404)
    return c.json(user, 200);
})
userController.delete('/:id', async (c) => {
    const body = await c.req.json<User>()
    const user = await userRepository.deleteById(body.id)
    if(user.rowCount === 0) 
        return c.json({error: 'Nie znaleziono użytkownika'}, 404)
    
    return c.json(user, 200);
})