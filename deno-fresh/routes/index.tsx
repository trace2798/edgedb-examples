/** @jsx h */
import {h} from 'preact';
import {PageProps, HandlerContext} from '$fresh/server.ts';
import {createClient} from 'edgedb';
import e from '../dbschema/edgeql-js/index.ts';

import Counter from '../islands/Counter.tsx';

const client = createClient();

e;
export const handler = async (req: Request, ctx: HandlerContext) => {
  const url = new URL(req.url);
  const data = url.searchParams;

  // const random = await client.querySingle<number>(`select random()`);
  const random = await e.random().run(client);

  // either delete or insert a Count object
  if (data.get('formName') === 'decrement') {
    // await client.execute(`delete Count limit 1;`);
    await e.delete(e.Count, () => ({limit: 1})).run(client);
  } else if (data.get('formName') === 'increment') {
    // await client.execute(`insert Count;`);
    await e.insert(e.Count, {}).run(client);
  }

  // const counter = await client.queryRequiredSingle<number>(`select count(Count);`);
  const counter = await e.count(e.Count).run(client);

  return ctx.render({random, counter});
};

type InferHandler = {random: number; counter: number};

export default function Home({data}: PageProps<InferHandler>) {
  return (
    <div>
      <img
        src="/logo.svg"
        height="100px"
        alt="the fresh logo: a sliced lemon dripping with juice"
      />
      <p>Fresh + EdgeDB</p>
      <p>Random number generated by EdgeDB: {data.random}</p>
      <Counter value={data.counter} />
    </div>
  );
}
