import { GQLExplodeEntries } from "../graphql/GQLExplodeEntries";
import { drawBox } from "../utils/DrawBox";

test('draw boxes and upload to box.', async () => {
    jest.setTimeout(60000)
    const data: GQLExplodeEntries = {
        boundingBoxes: [
            {
                "left": 296.6658718585968,
                "top": 2389.352200984955,
                "width": 1665.7340197563171,
                "height": 288.4739055633545
            },
            {
                "left": 256.20132637023926,
                "top": 2217.7098916769028,
                "width": 1722.6400151252747,
                "height": 184.4174609184265
            },
            {
                "left": 241.76919651031494,
                "top": 630.9627875089645,
                "width": 974.8583035469055,
                "height": 107.56141573190689
            },
            {
                "left": 239.75437903404236,
                "top": 2019.071426153183,
                "width": 1749.2545065879822,
                "height": 187.01507091522217
            },
            {
                "left": 264.2144569158554,
                "top": 416.2056130170822,
                "width": 1693.3313122987747,
                "height": 145.65104055404663
            },
            {
                "left": 226.7618626356125,
                "top": 1628.7724936008453,
                "width": 1753.881597161293,
                "height": 216.66308784484863
            },
            {
                "left": 246.00066661834717,
                "top": 894.3791077136993,
                "width": 1728.5359053611755,
                "height": 201.11686670780182
            }],
        boxID: "682644333162",
        boxName: "682644333162.jpg"
    }
    await drawBox(data);
});