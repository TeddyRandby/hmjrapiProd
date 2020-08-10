import psm from "./psm";

class Datum {
  label: string
  xmin: number
  xmax: number
  ymin: number
  ymax: number
  ocr_text: string
  pointer: number
}

class Args {
  from: Datum
  to: Datum
  acc: any
}

const rules = {
  "Start > Header": (args:Args) => {
    args.acc.entries[args.acc.pointer].header.push(args.to.ocr_text);
    args.to.pointer = 0;
    return args.to;
  },
  "Start > *": (args:Args) => {
    return args.from;
  },
  "Header > Date": (args:Args) => {
    var obj: any = {};
    obj[args.to.ocr_text] = args.from.pointer;
    args.acc.entries[args.acc.pointer].dates.push(obj);
    return args.from;
  },
  "Header > Page": (args:Args) => {
    var obj: any = {};
    obj[args.to.ocr_text] = args.from.pointer;
    args.acc.entries[args.acc.pointer].pages.push(obj);
    return args.from;
  },
  "Header > Header": (args:Args) => {
    args.acc.entries[args.acc.pointer].header[args.from.pointer] += args.to.ocr_text + " ";
    args.to.pointer = args.from.pointer;
    return args.to;
  },
  "Header > Content": (args:Args) => {
    args.acc.entries[args.acc.pointer].content.push(args.to.ocr_text);
    args.to.pointer = args.from.pointer + 1;
    return args.to;
  },
  "Content > Date": (args:Args) => {
    var obj: any = {};
    obj[args.to.ocr_text] = args.from.pointer;
    args.acc.entries[args.acc.pointer].dates.push(obj);
    return args.from;
  },
  "Content > Page": (args:Args) => {
    var obj: any = {};
    obj[args.to.ocr_text] = args.from.pointer;

    args. acc.entries[args.acc.pointer].pages.push(obj);

    args.from.pointer += 1;
    return args.from;
  },
  "Content > Header": (args:Args) => {
    //Start new parser
    args.acc.pointer += 1;
    args.acc.entries[args.acc.pointer] = {
      header: [],
      content: [],
      pages: [],
      dates: [],
    };
    args.acc.entries[args.acc.pointer].header.push(args.to.ocr_text);
    args.to.pointer = 0;
    return args.to;
  },
  "Content > Content": (args:Args) => {
    const ptr = args.from.pointer - args.acc.entries[args.acc.pointer].header.length;
    if (args.acc.entries[args.acc.pointer].content[ptr] == undefined)
    args.acc.entries[args.acc.pointer].content[ptr] = "";
    args.acc.entries[args.acc.pointer].content[ptr] += args.to.ocr_text += " ";
    return args.from;
  },
};

const sorter = (a: Datum, b: Datum) => {
  if (a.ymin - b.ymin < -10) {
    return -1;
  } else if (a.ymin - b.ymin > 10) {
    return 1;
  } else if (a.xmin < b.xmin) {
    return -1;
  } else if (a.xmin > b.xmin) {
    return 1;
  } else {
    return 0;
  }
};

export function predictionPSM() {
  return psm(
    rules,
    (datum: Datum) => datum.label,
    { label: "Start" },
    {
      entries: [{ header: [], content: [], pages: [], dates: [] }],
      pointer: 0,
    },
    sorter
  );
}
