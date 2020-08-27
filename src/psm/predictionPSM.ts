import psm from "./psm";

export class PSMDatum {
  label: string;
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
  ocr_text: string;
  pointer: number;
}

export class PSMDate {
  stringified: string;
  content: string;
  pointer: number;
}

export class PSMPpt {
  name: string;
}

export class PSMIndex {
  stringified: string;
  content: string;
  pointer: number;
}

export class PSMEntry {
  constructor() {
    this.content = [];
    this.header = [];
    this.dates = [];
    this.indexes = [];
    this.entities = [];
  }
  content: string[];
  header: string[];
  dates: PSMDate[];
  indexes: PSMIndex[];
  entities: PSMPpt[];
}

export class PSMAccumulator {
  constructor() {
    this.entries = [];
    this.entries.push(new PSMEntry());
    this.pointer = 0;
    return this;
  }
  entries: PSMEntry[];
  pointer: number;
}

export class PSMArgs {
  from: PSMDatum;
  to: PSMDatum;
  acc: PSMAccumulator;
}

const rules = {
  "Start > Header": (args: PSMArgs) => {
    args.acc.entries[args.acc.pointer].header.push(args.to.ocr_text);
    args.to.pointer = 0;
    return args.to;
  },
  "Start > *": (args: PSMArgs) => {
    return args.from;
  },
  "Header > Date": (args: PSMArgs) => {
    var obj: PSMDate = {
      content: "",
      stringified: args.to.ocr_text,
      pointer: args.from.pointer,
    };
    args.acc.entries[args.acc.pointer].dates.push(obj);
    return args.from;
  },
  "Header > Page": (args: PSMArgs) => {
    var obj: PSMIndex = {
      content: "",
      stringified: args.to.ocr_text,
      pointer: args.from.pointer,
    };
    args.acc.entries[args.acc.pointer].indexes.push(obj);
    return args.from;
  },
  "Header > Header": (args: PSMArgs) => {
    args.acc.entries[args.acc.pointer].header[args.from.pointer] +=
      args.to.ocr_text + " ";
    args.to.pointer = args.from.pointer;
    return args.to;
  },
  "Header > Content": (args: PSMArgs) => {
    args.acc.entries[args.acc.pointer].content.push(args.to.ocr_text);
    args.to.pointer = args.from.pointer + 1;
    return args.to;
  },
  "Content > Date": (args: PSMArgs) => {
    var obj: PSMDate = {
      content: "",
      stringified: args.to.ocr_text,
      pointer: args.from.pointer,
    };
    args.acc.entries[args.acc.pointer].dates.push(obj);
    return args.from;
  },
  "Content > Page": (args: PSMArgs) => {
    var obj: PSMIndex = {
      content: "",
      stringified: args.to.ocr_text,
      pointer: args.from.pointer,
    };

    args.acc.entries[args.acc.pointer].indexes.push(obj);

    args.from.pointer += 1;
    return args.from;
  },
  "Content > Header": (args: PSMArgs) => {
    //Start new parser
    args.acc.pointer += 1;
    args.acc.entries[args.acc.pointer] = new PSMEntry();
    args.acc.entries[args.acc.pointer].header.push(args.to.ocr_text);
    args.to.pointer = 0;
    return args.to;
  },
  "Content > Content": (args: PSMArgs) => {
    const ptr =
      args.from.pointer - args.acc.entries[args.acc.pointer].header.length;
    if (args.acc.entries[args.acc.pointer].content[ptr] == undefined)
      args.acc.entries[args.acc.pointer].content[ptr] = "";
    args.acc.entries[args.acc.pointer].content[ptr] += args.to.ocr_text += " ";
    return args.from;
  },
};

const sorter = (a: PSMDatum, b: PSMDatum) => {
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

const cleanup = (acc: PSMAccumulator) => {
  acc.entries.forEach((data: PSMEntry) => {
    data.dates.forEach((dateData: PSMDate) => {
      dateData.content = data.content[dateData.pointer];
    });
    data.indexes.forEach((indexData: PSMIndex) => {
      indexData.content = data.content[indexData.pointer];
    });
  });
  return acc;
};

export function predictionPSM() {
  return psm(
    rules,
    (datum: PSMDatum) => datum.label,
    { label: "Start" },
    new PSMAccumulator(),
    sorter,
    cleanup
  );
}
