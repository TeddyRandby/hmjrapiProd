import { predictionPSM } from '../psm/predictionPSM'

test('Parse a prediction.', async () => {
    const testData =
    [
        {
            "label": "Header",
            "ocr_text": "Roosevelt, Franklin D.",
            "score": 1,
            "xmin": 416,
            "xmax": 919,
            "ymin": 40,
            "ymax": 85
        },
        {
            "label": "Content",
            "ocr_text": "Note in longhend to HJr when Dern reada Eacles report",
            "score": 1,
            "xmin": 484,
            "xmax": 1735,
            "ymin": 81,
            "ymax": 126
        },
        {
            "label": "Content",
            "ocr_text": "on beet sugar and HJr thinks it time for soft susic-",
            "score": 1,
            "xmin": 532,
            "xmax": 1785,
            "ymin": 127,
            "ymax": 173
        },
        {
            "label": "Date",
            "ocr_text": "2/9/34.....",
            "score": 1,
            "xmin": 531,
            "xmax": 799,
            "ymin": 166,
            "ymax": 229
        }
    ]
    const psm = predictionPSM();
    const processed = psm(testData);
    if (processed !== null) {
        return true;
    }
    // processed.entries.forEach((entry:any)=>{
    //     console.log({
    //       header: entry.header,
    //       content: entry.content,
    //       pages: entry.pages,
    //       dates: entry.dates,
    //     });
    //     console.log("------------------------------");
    //   })
});