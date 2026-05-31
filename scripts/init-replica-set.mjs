import { MongoClient } from "mongodb";

const uri = "mongodb://127.0.0.1:27017/?directConnection=true";

async function main() {
  const client = new MongoClient(uri);
  await client.connect();

  try {
    const status = await client.db("admin").command({ replSetGetStatus: 1 });
    console.log("Replica set already active:", status.set);
    return;
  } catch {
    console.log("Initializing replica set rs0...");
  }

  await client.db("admin").command({
    replSetInitiate: {
      _id: "rs0",
      members: [{ _id: 0, host: "127.0.0.1:27017" }],
    },
  });

  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const status = await client.db("admin").command({ replSetGetStatus: 1 });
      if (status.ok === 1) {
        console.log("Replica set ready:", status.set);
        break;
      }
    } catch {
      console.log("Waiting for replica set...");
    }
  }

  await client.close();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
