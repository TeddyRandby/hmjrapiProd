import { launch } from './utils/Promises'

async function main() {
    const status = await launch();
    console.log(status);
}

main();
