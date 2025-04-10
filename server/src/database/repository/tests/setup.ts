import { Connection } from "../../db.ts";

export const beforeEach = async () => {
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        'task',
        'push-test',
      ],
    }).output()
    console.log('an error occurres', new TextDecoder().decode((await command).stderr));
  };
  
export const afterEach = async (pool: Connection) => {
    await pool.execute(`        
        DROP SCHEMA IF EXISTS public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO postgres;
        GRANT ALL ON SCHEMA public TO public;
    `) 
}