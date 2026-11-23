import { db } from "@/server/db";
import BlockStepperAdmin from "../components/BlockStepperAdmin";
import { blocks } from "@/server/db/schema";

export default async function Admin(){
    const items = await db.select().from(blocks);
    
      return (
        <main className="min-h-screen flex flex-col items-center pt-10 bg-[#270531]">
          <BlockStepperAdmin blocks={items} />
        </main>
      )
}