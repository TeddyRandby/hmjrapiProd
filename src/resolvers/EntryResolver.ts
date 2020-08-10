import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Entry } from "../models/Entry";
import { getRepository } from "typeorm";
import { ExplodeEntriesInput } from "../inputs/ExplodeEntriesInput";
import { explodeEntries } from "../utils/ExplodeEntries";

@Resolver()
export class EntryResolver {
    /* ------ Queries ------ */
    @Query(() => [Entry])
    entries() {
        return getRepository(Entry).find();
    }

    /* ------ Mutations ------ */
    @Mutation(() => Entry)
    async explodeEntries(@Arg('data') data: ExplodeEntriesInput) {
        const rawEntries = await explodeEntries(data);
        console.log(rawEntries);
        const entries = getRepository(Entry).create(rawEntries);
        entries.forEach(async entry => {
            await entry.save()
        });
        return entries;
    }
}