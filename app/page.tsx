import { db } from "@/server/db"
import { blocks } from "@/server/db/schema"
import BlockStepper from "./components/BlockStepper";

export default async function Home() {
  const items = await db.select().from(blocks);

  return (
    <main className="min-h-screen flex flex-col items-center pt-10 bg-[#270531]">
      <BlockStepper blocks={items} />
    </main>
  )
}